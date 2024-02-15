import SchoolService from "@/services/school.service";
import ResponseWrapper from "@/utils/ResponseWarppar";
import { NextFunction, Request, Response } from "express";

class SchoolController {
  private schoolService = new SchoolService();

  public getMeal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mealData = await this.schoolService.getMeal(
        req.query.date as string
      );
      ResponseWrapper(req, res, {
        data: mealData,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default SchoolController;
