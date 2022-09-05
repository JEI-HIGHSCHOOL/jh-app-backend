import { Router } from 'express';
import PushController from '@controllers/push.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { NoticeAddDto, NoticeDto, PushDto } from '@/dtos/push.dto';
import authMiddleware, { authTeacherMiddleware } from '@/middlewares/auth.middleware';

class PushRoute implements Routes {
  public path = '/push';
  public router = Router();
  public pushController = new PushController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/device`, validationMiddleware(PushDto, 'body'), this.pushController.device)
    this.router.post(`${this.path}/alert`, authTeacherMiddleware, validationMiddleware(NoticeDto, 'body'), this.pushController.addNotice)
    this.router.post(`${this.path}/noticeadd`, authTeacherMiddleware, validationMiddleware(NoticeAddDto, 'body'), this.pushController.publishNotice)
    this.router.get(`${this.path}/notice`, this.pushController.getNotice)
    this.router.get(`${this.path}/notice/:noticeId`, this.pushController.getNoticeById)
    this.router.patch(`${this.path}/notice/:noticeId`, authTeacherMiddleware, validationMiddleware(NoticeAddDto, 'body'), this.pushController.updateNoticeById)
    this.router.delete(`${this.path}/notice/:noticeId`, authTeacherMiddleware, this.pushController.deleteNoticeById)
  }
}

export default PushRoute;
