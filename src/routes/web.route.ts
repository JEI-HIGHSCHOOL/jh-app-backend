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
    this.router.get(`${this.path}/students/borading`, authTeacherMiddleware, this.webController.getBoardingList)
    this.router.get(`${this.path}/students/borading/xlsx`, authTeacherMiddleware, this.webController.getStudentBoradingXlsx)
    this.router.get(`${this.path}/students/borading/xlsx/:id`, authTeacherMiddleware, this.webController.getStudentsBoradingXlsx)
    this.router.post(`${this.path}/students/approve/:id`, authTeacherMiddleware, this.webController.getStudentsApproveById)
    this.router.delete(`${this.path}/students/:id`, authTeacherMiddleware, this.webController.deleteStudent)
    this.router.put(`${this.path}/students/:id`, authTeacherMiddleware, this.webController.editStudent)
  }
}

export default WebRoute;
