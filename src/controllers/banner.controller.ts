import { RequestWithUser } from '@/interfaces/auth.interface';
import BannerService from '@/services/banner.service';
import ResponseWrapper from '@/utils/ResponseWarppar';
import { NextFunction, Request, Response } from 'express';

class BannerController {
  public bannerService = new BannerService();
  public getBanners = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const getBanner = await this.bannerService.getBanners(req)
      ResponseWrapper(req, res, {data: getBanner})
    } catch (error) {
      next(error);
    }
  };

  public addBanners = async(req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const addBanner = await this.bannerService.addBanner(req)
      ResponseWrapper(req, res, {data: addBanner})
    } catch (error) {
      next(error);
    }
  };

  public getAdminBanners = async(req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const getBannersAdmin = await this.bannerService.getBannersAdmin(req)
      ResponseWrapper(req, res, {data: getBannersAdmin})
    } catch (error) {
      next(error);
    }
  };

  public disableBanner = async(req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const disableBanner = await this.bannerService.disableBanner(req)
      ResponseWrapper(req, res, {data: disableBanner})
    } catch (error) {
      next(error);
    }
  };

  public enableBanner = async(req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const enableBanner = await this.bannerService.enableBanner(req)
      ResponseWrapper(req, res, {data: enableBanner})
    } catch (error) {
      next(error);
    }
  };
}

export default BannerController;
