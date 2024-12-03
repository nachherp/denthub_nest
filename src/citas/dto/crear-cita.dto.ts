import { IsNotEmpty, IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateCitaDto {
  @IsNotEmpty()
  @IsNumber()
  pacienteId: number;

  @IsNotEmpty()
  @IsString()
  telefono: string;

  @IsNotEmpty()
  @IsDateString()
  fechaHora: string;

  @IsNotEmpty()
  @IsNumber()
  servicioId: number;

  @IsOptional()
  @IsString()
  comentarios?: string;
}

