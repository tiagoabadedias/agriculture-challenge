import { BadRequestException, NotFoundException } from '@nestjs/common';

export class FarmNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Fazenda com ID ${id} não encontrada`);
  }
} 

export class InvalidFarmAreaException extends BadRequestException {
  constructor(area: number) {
    super(`Área da fazenda ${area} é inválida. Deve ser maior que zero`);
  }
} 