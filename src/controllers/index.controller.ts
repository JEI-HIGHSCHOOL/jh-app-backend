import ResponseWrapper from '@/utils/ResponseWarppar';
import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      ResponseWrapper(req, res, {})
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
