import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import LocationController from '@/controllers/bus.controller';

class BusRoute implements Routes {
  public path = '/bus';
  public router = Router();
  public locationController = new LocationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/location`, this.locationController.updateLocation);
  }
}

export default BusRoute;
