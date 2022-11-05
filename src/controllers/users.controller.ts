import { NextFunction, Response } from 'express';
import userService from '@services/users.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
import ResponseWrapper from '@/utils/ResponseWarppar';

class UsersController {
  public userService = new userService();

  public changePassword = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const changePaswwordData = await this.userService.changePaswword(req);

      ResponseWrapper(req, res, { data: changePaswwordData, message: '비밀번호 변경이 완료되었습니다.' })
    } catch (error) {
      next(error);
    }
  };

  public getUsers = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const usersData = await this.userService.getUsers();

      ResponseWrapper(req, res, { data: usersData })
    } catch (error) {
      next(error);
    }
  };

  public updateRole = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const updateRoleData = await this.userService.updateRole(req);

      ResponseWrapper(req, res, { data: updateRoleData })
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
