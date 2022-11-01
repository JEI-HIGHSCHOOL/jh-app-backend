import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import LocationController from '@/controllers/location.controller';

class LocationRoute implements Routes {
  public path = '/location';
  public router = Router();
  public locationController = new LocationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.locationController.updateLocation);
  }
}

export default LocationRoute;
