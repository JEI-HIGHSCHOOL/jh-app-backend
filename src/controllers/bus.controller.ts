import {
  RequestWithStudentUser,
  RequestWithUser,
} from "@/interfaces/auth.interface";
import BusService from "@/services/bus.service";
import ResponseWrapper from "@/utils/ResponseWarppar";
import { NextFunction, Response } from "express";

class BusController {
  public busService = new BusService();

  public updateLocation = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const updateLocationData = await this.busService.locationUpdate(req);
      ResponseWrapper(req, res, { data: updateLocationData });
    } catch (error) {
      next(error);
    }
  };

  public runBus = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const startRunBusData = await this.busService.startRunBus(req);
      ResponseWrapper(req, res, { data: startRunBusData });
    } catch (error) {
      next(error);
    }
  };

  public stopBus = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const updateLocationData = await this.busService.stopRunBus(req);
      ResponseWrapper(req, res, { data: updateLocationData });
    } catch (error) {
      next(error);
    }
  };

  public addBoradingRecord = async (
    req: RequestWithStudentUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const addBoradingRecordData = await this.busService.addBoradingRecord(
        req
      );
      ResponseWrapper(req, res, { data: addBoradingRecordData, message: "탑승이 확인되었습니다" });
    } catch (error) {
      next(error);
    }
  };
}

export default BusController;
