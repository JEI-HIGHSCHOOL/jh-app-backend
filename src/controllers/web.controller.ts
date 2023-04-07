import WebService from '@/services/web.service';
import ResponseWrapper from '@/utils/ResponseWarppar';
import { NextFunction, Request, Response } from 'express';
import stream from 'stream';

class WebController {
  public webService = new WebService();

  public getAnalytics = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const analyticsData = await this.webService.getAnalytics(req)
      ResponseWrapper(req, res, {data: analyticsData})
    } catch (error) {
      next(error);
    }
  };

  public getStudents = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const students = await this.webService.getStudents(req)
      ResponseWrapper(req, res, {data: students})
    } catch (error) {
      next(error);
    }
  }

  public deleteStudent = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const students = await this.webService.deleteStudent(req)
      ResponseWrapper(req, res, {data: students})
    } catch (error) {
      next(error);
    }
  }

  public editStudent = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const students = await this.webService.editStudent(req)
      ResponseWrapper(req, res, {data: students})
    } catch (error) {
      next(error);
    }
  }

  public getStudentsApprove = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const students = await this.webService.getStudentsApprove(req)
      ResponseWrapper(req, res, {data: students})
    } catch (error) {
      next(error);
    }
  }

  public getBoardingList = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const { date, route } = req.query
      const boardings = await this.webService.getBoardingStudents(date as string, route as string)
      ResponseWrapper(req, res, {data: boardings})
    } catch (error) {
      next(error);
    }
  }

  public getStudentsApproveById = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const students = await this.webService.studentsApproveById(req)
      ResponseWrapper(req, res, {data: students})
    } catch (error) {
      next(error);
    }
  }

  public getStudentsBoradingXlsx = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const studentsXlsx: {
        studentsXlsx: Buffer;
        fileName: string;
      } = await this.webService.getStudentsBoradingXlsx(req)
      const readStream = new stream.PassThrough();
      readStream.end(studentsXlsx.studentsXlsx);
      res.set({
        'Access-Control-Expose-Headers': 'filename',
        'filename': `${encodeURIComponent(`${studentsXlsx.fileName}`)}`,
        'Content-Type': 'text/xlsx'
      });
      readStream.pipe(res);
    } catch (error) {
      next(error);
    }
  }

  public getStudentBoradingXlsx = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const studentsXlsx: {
        studentsXlsx: Buffer;
        fileName: string;
      } = await this.webService.getStudentBoradingXlsx()
      const readStream = new stream.PassThrough();
      readStream.end(studentsXlsx.studentsXlsx);
      res.set({
        'Access-Control-Expose-Headers': 'filename',
        'filename': `${encodeURIComponent(`${studentsXlsx.fileName}`)}`,
        'Content-Type': 'text/xlsx'
      });
      readStream.pipe(res);
    } catch (error) {
      next(error);
    }
  }
}

export default WebController;
