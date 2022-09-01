import { IsOptional, IsString } from 'class-validator';

export class PushDto {
  @IsString()
  public deviceId: string;

  @IsString()
  public token: string;
}

export class NoticeDto {
  @IsString()
  public title: string;

  @IsString()
  public description: string;
  @IsString()
  @IsOptional()
  public url: string;
}

export class NoticeAddDto {
  @IsString()
  public title: string;

  @IsString()
  public description: string;
}
