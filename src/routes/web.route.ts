import { Router } from 'express';
import PushController from '@controllers/push.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { NoticeAddDto, NoticeDto, PushDto } from '@/dtos/push.dto';
import authMiddleware, { authTeacherMiddleware } from '@/middlewares/auth.middleware';
import WebController from '@/controllers/web.controller';

class WebRoute implements Routes {
  public path = '/web';
  public router = Router();
  public webController = new WebController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/analytics`, authTeacherMiddleware, this.webController.getAnalytics)
  }
}

export default WebRoute;
