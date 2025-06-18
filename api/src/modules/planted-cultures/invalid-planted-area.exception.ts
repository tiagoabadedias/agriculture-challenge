import { BadRequestException, NotFoundException } from '@nestjs/common';

export class InvalidPlantedAreaException extends BadRequestException {
  constructor(area: number) {
    super(`Área plantada ${area} é inválida. Deve ser maior que zero`);
  }
} 

export class PlantedCultureNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Cultura plantada com ID ${id} não encontrada`);
  }
} 

export class InvalidPlantingDateException extends BadRequestException {
  constructor(date: Date) {
    super(`Data de plantio ${date.toISOString()} é inválida. Não pode ser uma data futura`);
  }
} 