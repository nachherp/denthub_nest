import { IsString, IsOptional, IsDate, IsBoolean, IsArray, ValidateNested, IsEnum, IsEmail, IsPhoneNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { Prisma } from '@prisma/client';

enum Sexo {
  Masculino = 'Masculino',
  Femenino = 'Femenino'
}

class ProcedimientoAnteriorCreateInput implements Prisma.ProcedimientoAnteriorCreateWithoutPacienteInput {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;
}

export class CreatePacienteDto implements Omit<Prisma.pacienteCreateInput, 'id' | 'createdAt' | 'updatedAt'> {
  @IsString()
  nombre: string;

  @IsString()
  apellidoPaterno: string;

  @IsString()
  apellidoMaterno: string;

  @IsDate()
  @Type(() => Date)
  fechaNacimiento: Date;

  @IsEmail()
  correoElectronico: string;

  @IsString()
  contrasena: string;

  @IsPhoneNumber()
  numeroTelefono: string;

  @IsString()
  nacionalidad: string;

  @IsEnum(Sexo)
  sexo: Sexo;

  @IsBoolean()
  tieneAlergia: boolean;

  @IsString()
  @IsOptional()
  fotoPerfil?: string;

  @IsString()
  @IsOptional()
  motivoConsulta?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  ultimaVisita?: Date;

  @IsString()
  @IsOptional()
  doloresDentales?: string;

  @IsString()
  @IsOptional()
  condicionActual?: string;

  @IsBoolean()
  @IsOptional()
  tratamientoCompletado?: boolean;

  @IsString()
  @IsOptional()
  labios?: string;

  @IsString()
  @IsOptional()
  encias?: string;

  @IsString()
  @IsOptional()
  pisoBoca?: string;

  @IsString()
  @IsOptional()
  vestibulos?: string;

  @IsString()
  @IsOptional()
  paladar?: string;

  @IsString()
  @IsOptional()
  temporoMandibula?: string;

  @IsString()
  @IsOptional()
  carrillos?: string;

  @IsString()
  @IsOptional()
  lengua?: string;

  @IsString()
  @IsOptional()
  cuello?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProcedimientoAnteriorCreateInput)
  @IsOptional()
  procedimientosAnteriores?: Prisma.ProcedimientoAnteriorCreateNestedManyWithoutPacienteInput;
}

export class UpdatePacienteDto implements Partial<Omit<CreatePacienteDto, 'contrasena'>> {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  apellidoPaterno?: string;

  @IsString()
  @IsOptional()
  apellidoMaterno?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fechaNacimiento?: Date;

  @IsEmail()
  @IsOptional()
  correoElectronico?: string;

  @IsPhoneNumber()
  @IsOptional()
  numeroTelefono?: string;

  @IsString()
  @IsOptional()
  nacionalidad?: string;

  @IsEnum(Sexo)
  @IsOptional()
  sexo?: Sexo;

  @IsBoolean()
  @IsOptional()
  tieneAlergia?: boolean;

  @IsString()
  @IsOptional()
  fotoPerfil?: string;

  @IsString()
  @IsOptional()
  motivoConsulta?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  ultimaVisita?: Date;

  @IsString()
  @IsOptional()
  doloresDentales?: string;

  @IsString()
  @IsOptional()
  condicionActual?: string;

  @IsBoolean()
  @IsOptional()
  tratamientoCompletado?: boolean;

  @IsString()
  @IsOptional()
  labios?: string;

  @IsString()
  @IsOptional()
  encias?: string;

  @IsString()
  @IsOptional()
  pisoBoca?: string;

  @IsString()
  @IsOptional()
  vestibulos?: string;

  @IsString()
  @IsOptional()
  paladar?: string;

  @IsString()
  @IsOptional()
  temporoMandibula?: string;

  @IsString()
  @IsOptional()
  carrillos?: string;

  @IsString()
  @IsOptional()
  lengua?: string;

  @IsString()
  @IsOptional()
  cuello?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProcedimientoAnteriorCreateInput)
  @IsOptional()
  procedimientosAnteriores?: Prisma.ProcedimientoAnteriorUpdateManyWithoutPacienteNestedInput;
}

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

