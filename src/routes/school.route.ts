import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import SchoolController from "@/controllers/school.controller";
import validationMiddleware from "@/middlewares/validation.middleware";
import { SearchMealDto } from "@/dtos/school.dto";

class SchoolRoute implements Routes {
  public path = "/school";
  public router = Router();
  public schoolController = new SchoolController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/meal`,
      validationMiddleware(SearchMealDto, "query"),
      this.schoolController.getMeal
    );
  }
}

export default SchoolRoute;
