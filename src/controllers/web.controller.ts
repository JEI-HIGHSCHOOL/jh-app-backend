import WebService from '@/services/web.service';
import ResponseWrapper from '@/utils/ResponseWarppar';
import { NextFunction, Request, Response } from 'express';

class WebController {
  public webService = new WebService();

  public getAnalytics = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const analyticsData = await this.webService.getAnalytics(req)
      ResponseWrapper(req, res, {data: analyticsData})
    } catch (error) {
      next(error);
    }
  };
}

export default WebController;
