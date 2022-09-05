import { Router } from 'express';
import IndexController from '@controllers/index.controller';
import { Routes } from '@interfaces/routes.interface';
import BannerController from '@/controllers/banner.controller';
import { authTeacherMiddleware } from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { CreateBannerDto } from '@/dtos/banner.dto';

class BannersRoute implements Routes {
  public path = '/banners';
  public router = Router();
  public bannerController = new BannerController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.bannerController.getBanners);
    this.router.get(`${this.path}/admin`, authTeacherMiddleware, this.bannerController.getAdminBanners);
    this.router.post(`${this.path}`, authTeacherMiddleware, validationMiddleware(CreateBannerDto, "body"), this.bannerController.addBanners);
    this.router.post(`${this.path}/:bannerId/enable`, authTeacherMiddleware, this.bannerController.enableBanner);
    this.router.post(`${this.path}/:bannerId/disable`, authTeacherMiddleware, this.bannerController.disableBanner);
  }
}

export default BannersRoute;
