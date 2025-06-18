import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

export class InvalidProducerDocumentException extends BadRequestException {
  constructor(document: string) {
    super(`Documento ${document} é inválido`);
  }
} 
export class ProducerNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Produtor com ID ${id} não encontrado`);
  }
} 

export class ProducerAlreadyExistsException extends ConflictException {
  constructor(document: string) {
    super(`Produtor com documento ${document} já existe`);
  }
} 