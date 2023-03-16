import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import BusController from '@/controllers/bus.controller';
import { authBusMiddleware, studentAuthMiddleware } from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { StartBusDto, StopBusDto } from '@/dtos/bus.dto';

class BusRoute implements Routes {
  public path = '/bus';
  public router = Router();
  public busController = new BusController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/location`, authBusMiddleware, this.busController.updateLocation);
    this.router.post(`${this.path}/start`, authBusMiddleware, validationMiddleware(StartBusDto, "body"), this.busController.runBus);
    this.router.post(`${this.path}/stop`, authBusMiddleware, validationMiddleware(StopBusDto, "body"), this.busController.stopBus);
    this.router.post(`${this.path}/qr`, studentAuthMiddleware, this.busController.addBoradingRecord)
    this.router.get(`${this.path}/routers`, this.busController.getRouters)
  }
}

export default BusRoute;
