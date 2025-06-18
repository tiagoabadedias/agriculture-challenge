import { InvalidProducerDocumentException, ProducerAlreadyExistsException, ProducerNotFoundException } from './producer.exception';
import { CustomLogger } from '../../common/logging/logger.service'; 'src/common/logging/logger.service';
import { ProducerRepository } from './producer.repository';
import { CreateProducerDto } from './producer.dto';
import { Producer } from './producer.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProducerService {
  constructor(
    private readonly producerRepository: ProducerRepository,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext('ProducerService');
  }

  private validateDocument(document: string): void {
    const cleanDocument = document.replace(/[^\d]/g, '');
    if (cleanDocument.length !== 11 && cleanDocument.length !== 14) {
      throw new InvalidProducerDocumentException(document);
    }
  }

  private formatDocument(document: string): string {
    this.logger.debug(`[formatDocument] Iniciando formatação do documento: ${document}`);
    const cleanDocument = document.replace(/[^\d]/g, '');
    let formattedDocument: string;

    if (cleanDocument.length === 11) {
      formattedDocument = cleanDocument.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cleanDocument.length === 14) {
      formattedDocument = cleanDocument.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    } else {
      formattedDocument = cleanDocument;
    }

    this.logger.debug(`[formatDocument] Documento formatado: ${formattedDocument}`);
    return formattedDocument;
  }

  async create(data: CreateProducerDto): Promise<Producer> {
    this.logger.log(`[create] Iniciando criação de produtor - Documento: ${data.document}`);

    this.validateDocument(data.document);
    const formattedData = {
      ...data,
      document: this.formatDocument(data.document),
    };

    this.logger.debug(`[create] Verificando existência de produtor com documento: ${formattedData.document}`);
    const existingProducer = await this.producerRepository.findByDocument(formattedData.document);
    
    if (existingProducer) {
      this.logger.warn(`[create] Tentativa de criar produtor com documento já existente: ${formattedData.document}`);
      throw new ProducerAlreadyExistsException(formattedData.document);
    }

    const producer = await this.producerRepository.create(formattedData);
    this.logger.log(`[create] Produtor criado com sucesso - ID: ${producer.id}`);

    return producer;
  }

  async findAll(): Promise<Producer[]> {
    this.logger.log('[findAll] Iniciando busca de todos os produtores');

    const producers = await this.producerRepository.findAll();
    this.logger.log(`[findAll] Busca concluída - Total: ${producers.length} produtores`);

    return producers;
  }

  async findById(id: string): Promise<Producer> {
    this.logger.log(`[findById] Iniciando busca de produtor - ID: ${id}`);

    const producer = await this.producerRepository.findById(id);
    
    if (!producer) {
      this.logger.warn(`[findById] Produtor não encontrado - ID: ${id}`);
      throw new ProducerNotFoundException(id);
    }

    this.logger.log(`[findById] Produtor encontrado - ID: ${id}`);
    return producer;
  }

  async update(id: string, data: Partial<CreateProducerDto>): Promise<Producer> {
    this.logger.log(`[update] Iniciando atualização de produtor - ID: ${id}`);

    await this.findById(id);
    
    if (data.document) {
      this.validateDocument(data.document);
    }

    const formattedData = {
      ...data,
      document: data.document ? this.formatDocument(data.document) : undefined,
    };

    const producer = await this.producerRepository.update(id, formattedData);
    this.logger.log(`[update] Produtor atualizado com sucesso - ID: ${id} - Campos: ${Object.keys(formattedData).join(', ')}`);

    return producer;
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`[delete] Iniciando remoção de produtor - ID: ${id}`);

    await this.findById(id);
    await this.producerRepository.delete(id);
    this.logger.log(`[delete] Produtor removido com sucesso - ID: ${id}`);
  }
}
