import { hash, compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { SECRET_KEY, DOMAIN } from "@config";
import { CreateUserDto, TokenRefreshDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/HttpException";
import {
  DataStoredInToken,
  TokenData,
  TokenType,
} from "@interfaces/auth.interface";
import { User } from "@interfaces/users.interface";
import userModel from "@models/users.model";
import { isEmpty } from "@utils/util";

class AuthService {
  public users = userModel;

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

  public async login(
    userData: CreateUserDto
  ): Promise<{ cookie: string; findUser: User, refresh_token: string, access_token: string }> {
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

    const tokenData = this.createToken(findUser, "access", "3d");
    const refreshTokenData = this.createToken(findUser, "refresh", "30d");
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser, refresh_token: refreshTokenData.token, access_token: tokenData.token };
  }

  public async refreshToken(
    userData: TokenRefreshDto
  ): Promise<{ refresh_token: string; access_token: string }> {
    if (isEmpty(userData))
      throw new HttpException(400, "찾을 수 없는 유저입니다");
    const secretKey: string = SECRET_KEY;
    const verificationResponse = verify(userData.token, secretKey) as DataStoredInToken;
    if(verificationResponse.tokenType !== "refresh") throw new HttpException(400, "잘못된 토큰입니다");
    const findUser: User = await this.users.findById(verificationResponse._id);
    if (!findUser) throw new HttpException(409, "유저를 찾을 수 없습니다");

    const access_token = this.createToken(findUser, "access");
    const refresh_token = this.createToken(findUser, "refresh", "30d");

    return { access_token: access_token.token, refresh_token: refresh_token.token };
  }

  public createToken(user: User, tokenType: TokenType, expiresIn: string | number = "2d"): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id, tokenType };
    const secretKey: string = SECRET_KEY;

    return {
      expiresIn,
      token: sign(dataStoredInToken, secretKey, { expiresIn }),
    };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Domain=${DOMAIN}; Path=/; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
