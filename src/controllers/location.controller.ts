import { RequestWithUser } from '@/interfaces/auth.interface';
import LocationService from '@/services/location.service';
import MusicService from '@/services/music.service';
import ResponseWrapper from '@/utils/ResponseWarppar';
import { NextFunction, Request, Response } from 'express';

class LocationController {
  public locationService = new LocationService();

  public updateLocation = async(req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const updateLocationData = await this.locationService.locationUpdate(req)
      ResponseWrapper(req, res, {data: updateLocationData})
    } catch (error) {
      next(error);
    }
  };
}

export default LocationController;
