import { IsString, IsInt, IsDate, IsOptional } from 'class-validator';

export class ActualizarCitaDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsDate()
  fechaHora?: Date;

  @IsOptional()
  @IsInt()
  servicioId?: number;

  @IsOptional()
  @IsString()
  comentarios?: string;

  @IsOptional()
  @IsInt()
  pacienteId?: number;
}

