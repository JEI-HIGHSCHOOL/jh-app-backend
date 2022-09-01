import { Router } from 'express';
import PushController from '@controllers/push.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { NoticeAddDto, NoticeDto, PushDto } from '@/dtos/push.dto';

class PushRoute implements Routes {
  public path = '/push';
  public router = Router();
  public pushController = new PushController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/device`, validationMiddleware(PushDto, 'body'), this.pushController.device)
    this.router.post(`${this.path}/notice`, validationMiddleware(NoticeDto, 'body'), this.pushController.addNotice)
    this.router.post(`${this.path}/noticeadd`, validationMiddleware(NoticeAddDto, 'body'), this.pushController.publishNotice)
    this.router.get(`${this.path}/notice`, this.pushController.getNotice)
  }
}

export default PushRoute;
