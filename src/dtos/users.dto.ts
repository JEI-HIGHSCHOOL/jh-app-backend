import { IsIn, IsString } from "class-validator";

export class CreateUserDto {
  @IsString({ message: "아이디를 입력해주세요" })
  public id: string;

  @IsString({ message: "비밀번호를 입력해주세요" })
  public password: string;
  @IsString({ message: "이름을 입력해주세요" })
  public name: string;
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
  @IsIn(["teacher", "admin"], { message: "올바르지 않은 권한 입니다" })
  public role: string;
}
