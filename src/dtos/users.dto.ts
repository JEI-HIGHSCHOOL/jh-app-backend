import { IsIn, IsString } from "class-validator";

export class CreateUserDto {
  @IsString({ message: "아이디를 입력해주세요" })
  public id: string;

  @IsString({ message: "비밀번호를 입력해주세요" })
  public password: string;
  @IsString({ message: "이름을 입력해주세요" })
  public name: string;
}

export class StudentUserDto {
  @IsString({ message: "전화번호를 입력해주세요" })
  phone: string;
  @IsString({ message: "비밀번호를 입력해주세요" })
  password: string;
}

export class CreateStudentUserDto {
  @IsString({ message: "전화번호를 입력해주세요" })
  public phone: string;

  @IsString({ message: "비밀번호를 입력해주세요" })
  public password: string;
  @IsString({ message: "이름을 입력해주세요" })
  public name: string;

  @IsString({ message: "과를 선택해주세요" })
  public department: string;

  @IsString({ message: "학년을 입력해주세요" })
  public grade: string;

  @IsString({ message: "반을 입력해주세요" })
  public class: string;

  @IsString({ message: "번호를 입력해주세요" })
  public number: string;
  @IsString({ message: "노선을 선택해주세요" })
  public route: string;
}

export class TokenRefreshDto {
  @IsString({ message: "아이디를 입력해주세요" })
  public _id: string;

  @IsString({ message: "토큰정보를 입력해주세요" })
  public token: string;
}

export class StudentTokenRefreshDto {

  @IsString({ message: "토큰정보를 입력해주세요" })
  public refresh_token: string;
}

export class UserLoginDto {
  @IsString({ message: "아이디를 입력해주세요" })
  public id: string;

  @IsString({ message: "비밀번호를 입력해주세요" })
  public password: string;
}

export class CangePasswordDto {
  @IsString({ message: "기존 비밀번호를 입력해주세요" })
  public password: string;

  @IsString({ message: "변경하실 비밀번호를 입력해주세요" })
  public changePassword: string;
}

export class UpdateRoleDto {
  @IsIn(["teacher", "admin", "busdriver"], { message: "올바르지 않은 권한 입니다" })
  public role: string;
}
