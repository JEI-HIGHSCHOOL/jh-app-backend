import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public id: string;

  @IsString()
  public password: string;
  @IsString()
  public name: string;
}

export class UserLoginDto {
  @IsString()
  public id: string;

  @IsString()
  public password: string;
}
