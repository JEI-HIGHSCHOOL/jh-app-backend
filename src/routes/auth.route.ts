import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateStudentUserDto, CreateUserDto, StudentTokenRefreshDto, StudentUserDto, TokenRefreshDto, UserLoginDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware, { studentAuthMiddleware } from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);
    this.router.post(`${this.path}/login`, validationMiddleware(UserLoginDto, 'body'), this.authController.logIn);
    this.router.post(`${this.path}/student/signup`, validationMiddleware(CreateStudentUserDto, 'body'), this.authController.studentSignUp);
    this.router.post(`${this.path}/student/login`, validationMiddleware(StudentUserDto, 'body'), this.authController.studentLogIn);
    this.router.post(`${this.path}/student/token/refresh`, this.authController.studentRefreshToken);
    this.router.post(`${this.path}/token/refresh`, validationMiddleware(TokenRefreshDto, 'body'), this.authController.refreshToken);
    this.router.post(`${this.path}/logout`, authMiddleware, this.authController.logOut);
    this.router.get(`${this.path}/me`, authMiddleware, this.authController.getMe);
    this.router.get(`${this.path}/student/me`, studentAuthMiddleware, this.authController.getStudentMe);
  }
}

export default AuthRoute;
