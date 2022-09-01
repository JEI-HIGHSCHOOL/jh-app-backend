import { NextFunction, Request, Response } from "express";
import pushService from "@services/push.service";
import ResponseWrapper from "@/utils/ResponseWarppar";

class UsersController {
  public pushService = new pushService();

  public device = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deviceData = await this.pushService.checkDevice(req);
      ResponseWrapper(req, res, { data: deviceData });
    } catch (error) {
      next(error);
    }
  };

  public addNotice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const noticeData = await this.pushService.addNotice(req);
      ResponseWrapper(req, res, { data: noticeData });
    } catch (error) {
      next(error);
    }
  };

  public publishNotice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const noticeData = await this.pushService.publishNotice(req);
      ResponseWrapper(req, res, { message: "성공적으로 공지를 추가했습니다", data: noticeData });
    } catch (error) {
      next(error);
    }
  };

  public getNotice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const noticeData = await this.pushService.getNotice();
      ResponseWrapper(req, res, { data: noticeData });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
