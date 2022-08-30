import MusicService from '@/services/music.service';
import ResponseWrapper from '@/utils/ResponseWarppar';
import { NextFunction, Request, Response } from 'express';

class MuiscController {
  public musicService = new MusicService();

  public addMusic = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const addMusicData = await this.musicService.addMusic(req)
      ResponseWrapper(req, res, {data: addMusicData})
    } catch (error) {
      next(error);
    }
  };
}

export default MuiscController;
