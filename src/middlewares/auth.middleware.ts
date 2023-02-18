import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithStudentUser, RequestWithUser } from '@interfaces/auth.interface';
import userModel from '@models/users.model';
import studentUserModel from '@/models/studentUsers.model';
import { checkUserFlag } from '@/utils/util';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse._id;
      const findUser = await userModel.findById(userId);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, '올바르지 않은 유저 토큰입니다'));
      }
    } else {
      next(new HttpException(404, '유저 토큰정보가 없습니다'));
    }
  } catch (error) {
    next(new HttpException(401, '올바르지 않은 유저 토큰입니다'));
  }
};

const studentAuthMiddleware = async (req: RequestWithStudentUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse._id;
      const findUser = await studentUserModel.findById(userId);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, '올바르지 않은 유저 토큰입니다'));
      }
    } else {
      next(new HttpException(404, '유저 토큰정보가 없습니다'));
    }
  } catch (error) {
    next(new HttpException(401, '올바르지 않은 유저 토큰입니다'));
  }
};

const authTeacherMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse._id;
      const findUser = await userModel.findById(userId);

      if (findUser) {
        req.user = findUser;
        if(!checkUserFlag(findUser.flags, "teacher")) {
          next(new HttpException(401, '해당 기능을 사용할 권한이 없습니다'));  
        }
        next();
      } else {
        next(new HttpException(401, '올바르지 않은 유저 토큰입니다'));
      }
    } else {
      next(new HttpException(404, '유저 토큰정보가 없습니다'));
    }
  } catch (error) {
    next(new HttpException(401, '올바르지 않은 유저 토큰입니다'));
  }
};

const authAdminMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse._id;
      const findUser = await userModel.findById(userId);

      if (findUser) {
        req.user = findUser;
        if(!checkUserFlag(findUser.flags, "admin")) {
          next(new HttpException(401, '해당 기능을 사용할 권한이 없습니다'));  
        }
        next();
      } else {
        next(new HttpException(401, '올바르지 않은 유저 토큰입니다'));
      }
    } else {
      next(new HttpException(404, '유저 토큰정보가 없습니다'));
    }
  } catch (error) {
    next(new HttpException(401, '올바르지 않은 유저 토큰입니다'));
  }
};


const authBusMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse._id;
      const findUser = await userModel.findById(userId);

      if (findUser) {
        req.user = findUser;
        if(!checkUserFlag(findUser.flags, "busdriver")) {
          next(new HttpException(401, '해당 기능을 사용할 권한이 없습니다'));  
        }
        next();
      } else {
        next(new HttpException(401, '올바르지 않은 유저 토큰입니다'));
      }
    } else {
      next(new HttpException(404, '유저 토큰정보가 없습니다'));
    }
  } catch (error) {
    next(new HttpException(401, '올바르지 않은 유저 토큰입니다'));
  }
};

export default authMiddleware;
export { authTeacherMiddleware, authAdminMiddleware, authBusMiddleware, studentAuthMiddleware }
