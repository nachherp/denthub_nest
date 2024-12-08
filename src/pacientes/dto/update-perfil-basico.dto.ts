import { IsString, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

export class UpdatePerfilBasicoDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  apellidoPaterno?: string;

  @IsString()
  @IsOptional()
  apellidoMaterno?: string;

  @IsEmail()
  @IsOptional()
  correoElectronico?: string;

  @IsPhoneNumber()
  @IsOptional()
  numeroTelefono?: string;
}

