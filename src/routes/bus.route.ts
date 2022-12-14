import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import LocationController from '@/controllers/bus.controller';
import { authBusMiddleware } from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { StartBusDto, StopBusDto } from '@/dtos/bus.dto';

class BusRoute implements Routes {
  public path = '/bus';
  public router = Router();
  public locationController = new LocationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/location`, authBusMiddleware, this.locationController.updateLocation);
    this.router.post(`${this.path}/start`, authBusMiddleware, validationMiddleware(StartBusDto, "body"),this.locationController.runBus);
    this.router.post(`${this.path}/stop`, authBusMiddleware, validationMiddleware(StopBusDto, "body"),this.locationController.stopBus);
  }
}

export default BusRoute;
