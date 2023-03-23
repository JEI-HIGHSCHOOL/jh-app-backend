import { hash, compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { SECRET_KEY, DOMAIN } from "@config";
import {
  CreateStudentUserDto,
  CreateUserDto,
  StudentTokenRefreshDto,
  StudentUserDto,
  TokenRefreshDto,
} from "@dtos/users.dto";
import { HttpException } from "@exceptions/HttpException";
import {
  DataStoredInToken,
  TokenData,
  TokenType,
} from "@interfaces/auth.interface";
import { StudentUser, User } from "@interfaces/users.interface";
import userModel from "@models/users.model";
import { isEmpty } from "@utils/util";
import studentUserModel from "@/models/studentUsers.model";

class AuthService {
  public users = userModel;
  public studentUsers = studentUserModel;

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "유저 정보가 없습니다");

    const findUser: User = await this.users.findOne({ id: userData.id });
    if (findUser) throw new HttpException(409, `이미 사용중인 아이디입니다`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({
      ...userData,
      password: hashedPassword,
      flags: 0,
    });

    return createUserData;
  }

  public async studentSignup(
    userData: CreateStudentUserDto
  ): Promise<StudentUser> {
    if (isEmpty(userData)) throw new HttpException(400, "유저 정보가 없습니다");

    const findUser: StudentUser = await this.studentUsers.findOne({
      phone: userData.phone,
    });
    if (findUser) throw new HttpException(409, `이미 가입된 번호입니다`);

    const password = await hash(userData.password, 15);
    const createUserData: StudentUser = await this.studentUsers.create({
      ...userData,
      password,
      isVerified: false,
    });

    return createUserData;
  }

  public async studentLogin(userData: StudentUserDto): Promise<{
    user: StudentUser;
    access_token: string;
    refresh_token: string;
    cookie: string[];
  }> {
    if (isEmpty(userData)) throw new HttpException(400, "유저 정보가 없습니다");

    const findUser: StudentUser = await this.studentUsers.findOne({
      phone: userData.phone,
    });
    if (!findUser) throw new HttpException(409, `가입되지 않은 번호입니다`);

    if (!findUser.isVerified)
      throw new HttpException(409, "승인 대기중 입니다");

    const isPasswordMatching: boolean = await compare(
      userData.password,
      findUser.password
    );

    if (!isPasswordMatching)
      throw new HttpException(409, "비밀번호가 올바르지 않습니다");
    const tokenData = this.createToken(findUser, "access", 345600000);
    const refreshTokenData = this.createToken(findUser, "refresh", 2592000000);
    const cookie = this.createCookie(tokenData);
    const refreshTokenCookie = this.createCookie(
      refreshTokenData,
      "refresh_token"
    );

    return {
      user: {
        _id: findUser._id,
        phone: findUser.phone,
        name: findUser.name,
        department: findUser.department,
        grade: findUser.grade,
        class: findUser.class,
        number: findUser.number,
        isVerified: findUser.isVerified,
        route: findUser.route,
      },
      cookie: [cookie, refreshTokenCookie],
      access_token: tokenData.token,
      refresh_token: refreshTokenData.token,
    };
  }

  public async login(userData: CreateUserDto): Promise<{
    cookie: string;
    findUser: User;
    refresh_token: string;
    access_token: string;
  }> {
    if (isEmpty(userData))
      throw new HttpException(400, "찾을 수 없는 유저입니다");

    const findUser: User = await this.users.findOne({ id: userData.id });
    if (!findUser)
      throw new HttpException(409, `아이디 또는 비밀번호가 올바르지 않습니다`);

    const isPasswordMatching: boolean = await compare(
      userData.password,
      findUser.password
    );
    if (!isPasswordMatching)
      throw new HttpException(409, "아이디 또는 비밀번호가 올바르지 않습니다");

    const tokenData = this.createToken(findUser, "access", 259200000);
    const refreshTokenData = this.createToken(findUser, "refresh", 2592000000);
    const cookie = this.createCookie(tokenData);

    return {
      cookie,
      findUser: {
        _id: findUser._id,
        id: findUser.id,
        name: findUser.name,
        flags: findUser.flags,
      },
      refresh_token: refreshTokenData.token,
      access_token: tokenData.token,
    };
  }

  public async studentRefrshToken(userData: StudentTokenRefreshDto): Promise<{
    refresh_token: string;
    access_token: string;
    cookie: string[];
    user: StudentUser;
  }> {
    if (isEmpty(userData))
      throw new HttpException(400, "찾을 수 없는 유저입니다");
    const verificationResponse = verify(
      userData.refresh_token,
      SECRET_KEY
    ) as DataStoredInToken;
    if (verificationResponse.tokenType !== "refresh")
      throw new HttpException(400, "잘못된 토큰입니다");
    const findUser: StudentUser = await this.studentUsers.findById(verificationResponse._id, {
      password: 0,
    });
    if (!findUser) throw new HttpException(409, "유저를 찾을 수 없습니다");
    const access_token = this.createToken(findUser, "access", 345600000);
    const refresh_token = this.createToken(findUser, "refresh", 2592000000);

    return {
      access_token: access_token.token,
      refresh_token: refresh_token.token,
      cookie: [
        this.createCookie(access_token),
        this.createCookie(refresh_token, "refresh_token"),
      ],
      user: {
        _id: findUser._id,
        phone: findUser.phone,
        name: findUser.name,
        department: findUser.department,
        grade: findUser.grade,
        class: findUser.class,
        number: findUser.number,
        isVerified: findUser.isVerified,
        route: findUser.route,
      },
    };
  }

  public async refreshToken(
    userData: TokenRefreshDto
  ): Promise<{ refresh_token: string; access_token: string; user: User }> {
    if (isEmpty(userData))
      throw new HttpException(400, "찾을 수 없는 유저입니다");
    const secretKey: string = SECRET_KEY;
    const verificationResponse = verify(
      userData.token,
      secretKey
    ) as DataStoredInToken;
    if (verificationResponse.tokenType !== "refresh")
      throw new HttpException(400, "잘못된 토큰입니다");
    const findUser: User = await this.users.findById(verificationResponse._id);
    if (!findUser) throw new HttpException(409, "유저를 찾을 수 없습니다");

    const access_token = this.createToken(findUser, "access", 172800000);
    const refresh_token = this.createToken(findUser, "refresh", 2592000000);

    return {
      access_token: access_token.token,
      refresh_token: refresh_token.token,
      user: {
        _id: findUser._id,
        id: findUser.id,
        name: findUser.name,
        flags: findUser.flags,
      },
    };
  }

  public createToken(
    user: User | StudentUser,
    tokenType: TokenType,
    expiresIn: number
  ): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id, tokenType };
    const secretKey: string = SECRET_KEY;

    return {
      expiresIn,
      token: sign(dataStoredInToken, secretKey, { expiresIn }),
    };
  }

  public createCookie(tokenData: TokenData, name = "Authorization"): string {
    const msToSec = tokenData.expiresIn / 1000;
    return `${name}=${tokenData.token}; Domain=${DOMAIN}; Path=/; Max-Age=${msToSec};`;
  }
}

export default AuthService;
