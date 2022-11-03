import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import LocationController from '@/controllers/bus.controller';
import { authAdminMiddleware } from '@/middlewares/auth.middleware';

class BusRoute implements Routes {
  public path = '/bus';
  public router = Router();
  public locationController = new LocationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/location`, authAdminMiddleware, this.locationController.updateLocation);
  }
}

export default BusRoute;
