import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CangePasswordDto, CreateUserDto, UpdateRoleDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware, { authAdminMiddleware, authTeacherMiddleware } from '@/middlewares/auth.middleware';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authAdminMiddleware, this.usersController.getUsers);
    this.router.post(`${this.path}/changepassword`, authMiddleware, validationMiddleware(CangePasswordDto, 'body'), this.usersController.changePassword);
    this.router.post(`${this.path}/:userId/role`, authAdminMiddleware, validationMiddleware(UpdateRoleDto, 'body'), this.usersController.updateRole);
  }
}

export default UsersRoute;
