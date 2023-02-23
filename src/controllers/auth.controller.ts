import { NextFunction, Request, Response } from "express";
import {
  CreateStudentUserDto,
  CreateUserDto,
  StudentTokenRefreshDto,
  StudentUserDto,
  TokenRefreshDto,
} from "@dtos/users.dto";
import {
  RequestWithStudentUser,
  RequestWithUser,
} from "@interfaces/auth.interface";
import { StudentUser, User } from "@interfaces/users.interface";
import AuthService from "@services/auth.service";
import ResponseWrapper from "@/utils/ResponseWarppar";

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.authService.signup(userData);

      ResponseWrapper(req, res, { data: signUpUserData, message: "signup" });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const { cookie, findUser, refresh_token, access_token } =
        await this.authService.login(userData);

      res.setHeader("Set-Cookie", [cookie]);
      ResponseWrapper(req, res, {
        data: {
          user: findUser,
          refresh_token,
          access_token,
          ...findUser,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public studentSignUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData: CreateStudentUserDto = req.body;
      const signUpUserData: StudentUser = await this.authService.studentSignup(
        userData
      );
      ResponseWrapper(req, res, {
        message:
          "학생 회원가입이 요청이 완료되었습니다. 선생님이 확인후 승인됩니다",
      });
    } catch (error) {
      next(error);
    }
  };

  public studentLogIn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData: StudentUserDto = req.body;
      const { user, refresh_token, access_token, cookie } =
        await this.authService.studentLogin(userData);

      res.setHeader("Set-Cookie", cookie);
      ResponseWrapper(req, res, {
        data: {
          user,
          refresh_token,
          access_token,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public studentRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData = req.cookies;
      const { refresh_token, access_token, cookie, user } =
        await this.authService.studentRefrshToken(userData);

      res.setHeader("Set-Cookie", cookie);
      ResponseWrapper(req, res, {
        data: {
          refresh_token,
          access_token,
          user
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getStudentMe = async (
    req: RequestWithStudentUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      ResponseWrapper(req, res, {
        data: {
          name: req.user.name,
          verify: req.user.isVerified,
          phone: req.user.phone,
          _id: req.user._id,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getMe = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      ResponseWrapper(req, res, {
        data: {
          name: req.user.name,
          flags: req.user.flags,
          id: req.user.id,
          _id: req.user._id,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData: TokenRefreshDto = req.body;
      const { refresh_token, access_token, user } =
        await this.authService.refreshToken(userData);
      ResponseWrapper(req, res, {
        data: {
          refresh_token,
          access_token,
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.setHeader("Set-Cookie", ["Authorization=; Max-age=0"]);
      ResponseWrapper(req, res, { message: "성공적으로 로그아웃 되었습니다" });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
