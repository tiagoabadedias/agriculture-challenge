import { BadRequestException, NotFoundException } from '@nestjs/common';

export class HarvestNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Colheita com ID ${id} não encontrada`);
  }
} 

export class InvalidHarvestDateException extends BadRequestException {
  constructor(date: Date) {
    super(`Data de colheita ${date.toISOString()} é inválida. A data não pode ser futura`);
  }
} 


export class InvalidHarvestQuantityException extends BadRequestException {
  constructor(quantity: number) {
    super(`Quantidade de colheita ${quantity} é inválida. Deve ser maior que zero`);
  }
} 