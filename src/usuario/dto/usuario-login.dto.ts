import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UsuarioLoginDto {
  @ApiProperty()
  @IsString()
  readonly username: string;

  @ApiProperty()
  @IsString()
  readonly password: string;
}
