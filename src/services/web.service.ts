import userModel from "@models/users.model";
import { Request } from "express";
import { importData, getData } from "@utils/googleSheetAPI";
import { Music } from "@/dtos/music.dto";
import musicModel from "@/models/music.model";
import { BusList, getDate } from "@/utils/util";
import ExcelJS from "exceljs";
import dayjs from "dayjs";
import deviceModel from "@/models/devices.model";
import bannerModel from "@/models/banner.model";
import noticeModel from "@/models/notice.model";
import studentUserModel from "@/models/studentUsers.model";
import { HttpException } from "@/exceptions/HttpException";
import studentBordingModel from "@/models/studentBusBoarding.model";
import {
  StudentBusBoarding,
  StudentUser,
  StudentWithBusBoarding,
  User,
} from "@/interfaces/users.interface";
require("dayjs/locale/ko");

class WebService {
  public devices = deviceModel;
  public banners = bannerModel;
  public notices = noticeModel;
  public students = studentUserModel;
  public studentsBorading = studentBordingModel;

  public async getAnalytics(req: Request): Promise<any> {
    const deviceDB = await this.devices.count();
    const bannerDB = (await this.banners.find({ show: true })).length;
    const noticeDB = await this.notices.count();
    return {
      device: deviceDB,
      banner: bannerDB,
      notice: noticeDB,
    };
  }

  public async deleteStudent(req: Request): Promise<any> {
    const student = await this.students.findByIdAndDelete(req.params.id);    
    if (!student) throw new HttpException(404, "해당 학생이 없습니다");
    await this.studentsBorading.deleteMany({ userId: student._id });
    return student;
  }

  public async getStudents(req: Request): Promise<any> {
    if (req.query.name) {
      const students = await this.students.find(
        {
          name: {
            $regex: req.query.name as string,
            $options: "i",
          },
        },
        { password: 0 }
      );
      return students;
    } else if (req.query.phone) {
      const students = await this.students.find(
        {
          phone: {
            $regex: req.query.phone as string,
            $options: "i",
          },
        },
        { password: 0 }
      );
      return students;
    } else if (req.query.route) {
      const students = await this.students.find(
        {
          route: {
            $regex: req.query.route as string,
            $options: "i",
          },
        },
        { password: 0 }
      );
      return students;
    } else {
      const students = await this.students.find({}, { password: 0 });
      return students;
    }
  }

  public async getStudentsApprove(req: Request): Promise<any> {
    const students = await this.students.find(
      {
        isVerified: false,
      },
      { password: 0 }
    );
    return students;
  }

  public async getBoardingStudents(
    date: string,
    route?: string
  ): Promise<StudentWithBusBoarding[]> {
    if (date) {
      const boardingWithUser: StudentWithBusBoarding[] = [];
      const formatDate = dayjs(date).format("YYYY-MM-DD");
      const boardings = await this.studentsBorading.find({
        bordingTime: {
          $gte: new Date(`${formatDate} 00:00:00`),
          $lte: new Date(`${formatDate} 23:59:59`),
        },
      });
      for await (const boarding of boardings) {
        const student = await this.students.findOne({
          _id: boarding.userId,
        });
        if (!student) continue;
        boardingWithUser.push({
          ...student.toJSON(),
          boarding,
        });
      }
      return boardingWithUser;
    } else {
      const boardingWithUser: StudentWithBusBoarding[] = [];
      const boardings = await this.studentsBorading.find().limit(50);
      for await (const boarding of boardings) {
        const student = await this.students.findOne({
          _id: boarding.userId,
        });
        if (!student) continue;
        boardingWithUser.push({
          ...student.toJSON(),
          boarding,
        });
      }
      return boardingWithUser;
    }
  }

  public async studentsApproveById(req: Request): Promise<any> {
    const students = await this.students.findOne(
      {
        _id: req.params.id,
      },
      { password: 0 }
    );
    if (!students) throw new HttpException(404, "찾을 수 없는 학생입니다");
    if (students.isVerified)
      throw new HttpException(409, "이미 승인된 학생입니다");
    await this.students.updateOne(
      {
        _id: req.params.id,
      },
      {
        isVerified: true,
      }
    );
    return students;
  }

  public async getStudentsBoradingXlsx(req: Request): Promise<{
    studentsXlsx: Buffer;
    fileName: string;
  }> {
    const students = await this.students.findOne(
      {
        _id: req.params.id,
      },
      { password: 0 }
    );
    if (!students) throw new HttpException(404, "찾을 수 없는 학생입니다");
    const busboardingList = await this.studentsBorading.find({
      userId: req.params.id,
    });
    const dataSet = [];

    for await (const busboarding of busboardingList) {
      dataSet.push({
        date: dayjs(busboarding.bordingTime).format("YYYY-MM-DD HH:mm:ss"),
        bus: BusList[busboarding.busId],
        name: students.name,
        phone: students.phone,
        department: students.department,
        grade: students.grade,
        class: students.class,
        classNumber: students.number,
      });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");
    worksheet.columns = [
      { header: "이름", key: "name", width: 20 },
      { header: "연락처", key: "phone", width: 20 },
      { header: "학과", key: "department", width: 20 },
      { header: "학년", key: "grade", width: 5 },
      { header: "반", key: "class", width: 5 },
      { header: "번호", key: "classNumber", width: 5 },
      { header: "탑승일", key: "date", width: 20 },
      { header: "탑승버스", key: "bus", width: 10 },
    ];
    ["A", "B", "C", "D", "E", "F", "G", "H"].map((cell) => {
      worksheet.getCell(`${cell}1`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "cce6ff" },
      };
    });
    worksheet.insertRows(2, dataSet);
    const xlsxBuffer = (await workbook.xlsx.writeBuffer()) as Buffer;

    return {
      studentsXlsx: xlsxBuffer,
      fileName: `${students.department} ${students.grade}학년 ${students.class}반 ${students.number}번 ${students.name} 탑승기록.xlsx`,
    };
  }

  public async getStudentBoradingXlsx(): Promise<{
    studentsXlsx: Buffer;
    fileName: string;
  }> {
    const students = await this.students.find({}, { password: 0 });
    if (students.length === 0)
      throw new HttpException(404, "찾을 수 없는 학생입니다");

    const dataSet = [];

    for await (const student of students) {
      const busboardingList = await this.studentsBorading.find({
        userId: student._id,
      });

      for await (const busboarding of busboardingList) {
        dataSet.push({
          date: dayjs(busboarding.bordingTime).format("YYYY-MM-DD HH:mm:ss"),
          bus: BusList[busboarding.busId],
          name: student.name,
          phone: student.phone,
          department: student.department,
          grade: student.grade,
          class: student.class,
          classNumber: student.number,
        });
      }
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");
    worksheet.columns = [
      { header: "이름", key: "name", width: 20 },
      { header: "연락처", key: "phone", width: 20 },
      { header: "학과", key: "department", width: 20 },
      { header: "학년", key: "grade", width: 5 },
      { header: "반", key: "class", width: 5 },
      { header: "번호", key: "classNumber", width: 5 },
      { header: "탑승일", key: "date", width: 20 },
      { header: "탑승버스", key: "bus", width: 10 },
    ];
    ["A", "B", "C", "D", "E", "F", "G", "H"].map((cell) => {
      worksheet.getCell(`${cell}1`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "cce6ff" },
      };
    });
    worksheet.insertRows(2, dataSet);
    const xlsxBuffer = (await workbook.xlsx.writeBuffer()) as Buffer;

    return {
      studentsXlsx: xlsxBuffer,
      fileName: `전체학생 탑승기록.xlsx`,
    };
  }
}

export default WebService;
