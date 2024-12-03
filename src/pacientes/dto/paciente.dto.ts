import { IsNotEmpty, IsString, IsDate, IsEmail, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePacienteDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellidoPaterno: string;

  @IsNotEmpty()
  @IsString()
  apellidoMaterno: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  fechaNacimiento: Date;

  @IsNotEmpty()
  @IsString()
  telefono: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  contrasena: string;

  @IsNotEmpty()
  @IsString()
  nacionalidad: string;

  @IsNotEmpty()
  @IsString()
  sexo: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  ultimaCita?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  proximaCita?: Date;

  @IsOptional()
  @IsString()
  tratamiento?: string;

  @IsOptional()
  @IsBoolean()
  tieneAlergia?: boolean;

  @IsOptional()
  @IsString()
  motivoConsulta?: string;

  @IsOptional()
  @IsString()
  fotoPerfil?: string;
}

export class UpdatePacienteDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellidoPaterno?: string;

  @IsOptional()
  @IsString()
  apellidoMaterno?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaNacimiento?: Date;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  contrasena?: string;

  @IsOptional()
  @IsString()
  nacionalidad?: string;

  @IsOptional()
  @IsString()
  sexo?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  ultimaCita?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  proximaCita?: Date;

  @IsOptional()
  @IsString()
  tratamiento?: string;

  @IsOptional()
  @IsBoolean()
  tieneAlergia?: boolean;

  @IsOptional()
  @IsString()
  motivoConsulta?: string;

  @IsOptional()
  @IsString()
  fotoPerfil?: string;
}

