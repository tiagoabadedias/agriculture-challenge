
import { IsValidDocument } from '../validators/document.validator';
import { validate } from 'class-validator';

class TestClass {
  @IsValidDocument()
  document: string;

  constructor(document: string) {
    this.document = document;
  }
}

describe('IsValidDocument', () => {
  it('deve validar um CPF válido', async () => {
    const test = new TestClass('123.456.789-09');
    const errors = await validate(test);
    expect(errors.length).toBe(0);
  });

  it('deve validar um CNPJ válido', async () => {
    const test = new TestClass('12.345.678/0001-95');
    const errors = await validate(test);
    expect(errors.length).toBe(0);
  });

  it('deve rejeitar um CPF inválido', async () => {
    const test = new TestClass('111.111.111-11');
    const errors = await validate(test);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isValidDocument).toBe('Documento inválido. Deve ser um CPF ou CNPJ válido.');
  });

  it('deve rejeitar um CNPJ inválido', async () => {
    const test = new TestClass('11.111.111/1111-11');
    const errors = await validate(test);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isValidDocument).toBe('Documento inválido. Deve ser um CPF ou CNPJ válido.');
  });

  it('deve rejeitar um documento com formato inválido', async () => {
    const test = new TestClass('123456');
    const errors = await validate(test);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isValidDocument).toBe('Documento inválido. Deve ser um CPF ou CNPJ válido.');
  });

  it('deve rejeitar um documento vazio', async () => {
    const test = new TestClass('');
    const errors = await validate(test);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isValidDocument).toBe('Documento inválido. Deve ser um CPF ou CNPJ válido.');
  });

  it('deve rejeitar um documento undefined', async () => {
    const test = new TestClass(undefined);
    const errors = await validate(test);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isValidDocument).toBe('Documento inválido. Deve ser um CPF ou CNPJ válido.');
  });

  it('deve rejeitar um documento null', async () => {
    const test = new TestClass(null);
    const errors = await validate(test);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isValidDocument).toBe('Documento inválido. Deve ser um CPF ou CNPJ válido.');
  });

  it('deve validar um CPF com dígitos repetidos diferentes', async () => {
    const test = new TestClass('123.456.789-09');
    const errors = await validate(test);
    expect(errors.length).toBe(0);
  });

  it('deve validar um CNPJ com dígitos repetidos diferentes', async () => {
    const test = new TestClass('12.345.678/0001-95');
    const errors = await validate(test);
    expect(errors.length).toBe(0);
  });

  it('deve rejeitar um CPF com todos os dígitos iguais', async () => {
    const test = new TestClass('111.111.111-11');
    const errors = await validate(test);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isValidDocument).toBe('Documento inválido. Deve ser um CPF ou CNPJ válido.');
  });

  it('deve rejeitar um CNPJ com todos os dígitos iguais', async () => {
    const test = new TestClass('11.111.111/1111-11');
    const errors = await validate(test);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isValidDocument).toBe('Documento inválido. Deve ser um CPF ou CNPJ válido.');
  });

  it('deve validar um CPF sem formatação', async () => {
    const test = new TestClass('12345678909');
    const errors = await validate(test);
    expect(errors.length).toBe(0);
  });

  it('deve validar um CNPJ sem formatação', async () => {
    const test = new TestClass('12345678000195');
    const errors = await validate(test);
    expect(errors.length).toBe(0);
  });
}); 