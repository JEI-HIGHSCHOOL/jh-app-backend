import { RequestWithUser } from "@/interfaces/auth.interface";
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
}

export default BusController;
