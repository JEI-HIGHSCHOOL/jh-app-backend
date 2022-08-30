import { Request, Response } from "express";

const ResponseWrapper = (
    req: Request,
    res: Response,
    { data = null, message = null, status = 200 }
  ) => {
    return res.status(status).json({
      status,
      message: message ? message : "요청을 성공적으로 실행했습니다",
      data,
      path: req.path,
    });
  };

export default ResponseWrapper;