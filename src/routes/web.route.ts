import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { authTeacherMiddleware } from '@/middlewares/auth.middleware';
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
    this.router.get(`${this.path}/students`, authTeacherMiddleware, this.webController.getStudents)
    this.router.get(`${this.path}/students/approve`, authTeacherMiddleware, this.webController.getStudentsApprove)
    this.router.post(`${this.path}/students/approve/:id`, authTeacherMiddleware, this.webController.getStudentsApproveById)
    this.router.get(`${this.path}/students/borading/xlsx/:id`, authTeacherMiddleware, this.webController.getStudentsBoradingXlsx)
  }
}

export default WebRoute;
