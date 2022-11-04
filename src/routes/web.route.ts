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
  }
}

export default WebRoute;
