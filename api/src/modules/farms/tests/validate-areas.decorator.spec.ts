import { validateFarmAreas } from '../decorators/validate-areas.decorator';
import { BadRequestException } from '@nestjs/common';

describe('validateFarmAreas', () => {
  it('deve estar definido', () => {
    expect(validateFarmAreas).toBeDefined();
  });

  it('deve validar áreas com valores válidos', () => {
    const body = {
      totalArea: 1000,
      arableArea: 600,
      vegetationArea: 400,
    };

    const result = validateFarmAreas(body);
    expect(result).toEqual(body);
  });

  it('deve aceitar valores numéricos como string', () => {
    const body = {
      totalArea: '1000',
      arableArea: '600',
      vegetationArea: '400',
    };

    const result = validateFarmAreas(body);
    expect(result).toEqual(body);
  });

  it('deve lançar erro quando campos obrigatórios estão ausentes', () => {
    const body = {
      totalArea: 1000,
    };

    expect(() => validateFarmAreas(body))
      .toThrow(BadRequestException);
    expect(() => validateFarmAreas(body))
      .toThrow('Todos os campos de área (total, agricultável e vegetação) são obrigatórios');
  });

  it('deve lançar erro quando campos não são números válidos', () => {
    const body = {
      totalArea: 'abc',
      arableArea: 'def',
      vegetationArea: 'ghi',
    };

    expect(() => validateFarmAreas(body))
      .toThrow(BadRequestException);
    expect(() => validateFarmAreas(body))
      .toThrow('Todos os campos de área devem ser números válidos');
  });

  it('deve lançar erro quando campos são negativos', () => {
    const body = {
      totalArea: -1000,
      arableArea: -600,
      vegetationArea: -400,
    };

    expect(() => validateFarmAreas(body))
      .toThrow(BadRequestException);
    expect(() => validateFarmAreas(body))
      .toThrow('Todos os campos de área devem ser números positivos');
  });

  it('deve lançar erro quando a soma das áreas excede a área total', () => {
    const body = {
      totalArea: 1000,
      arableArea: 600,
      vegetationArea: 500,
    };

    expect(() => validateFarmAreas(body))
      .toThrow(BadRequestException);
    expect(() => validateFarmAreas(body))
      .toThrow('A soma das áreas agricultável e de vegetação não pode ultrapassar a área total da fazenda');
  });

  it('deve aceitar quando a soma das áreas é igual à área total', () => {
    const body = {
      totalArea: 1000,
      arableArea: 600,
      vegetationArea: 400,
    };

    const result = validateFarmAreas(body);
    expect(result).toEqual(body);
  });

  it('deve aceitar quando a soma das áreas é menor que a área total', () => {
    const body = {
      totalArea: 1000,
      arableArea: 500,
      vegetationArea: 300,
    };

    const result = validateFarmAreas(body);
    expect(result).toEqual(body);
  });

  it('deve aceitar valores zero', () => {
    const body = {
      totalArea: 0,
      arableArea: 0,
      vegetationArea: 0,
    };

    const result = validateFarmAreas(body);
    expect(result).toEqual(body);
  });

  it('deve lançar erro quando apenas um campo é inválido', () => {
    const body = {
      totalArea: 1000,
      arableArea: 'invalid',
      vegetationArea: 400,
    };

    expect(() => validateFarmAreas(body))
      .toThrow(BadRequestException);
    expect(() => validateFarmAreas(body))
      .toThrow('Todos os campos de área devem ser números válidos');
  });

  it('deve lançar erro quando apenas um campo é negativo', () => {
    const body = {
      totalArea: 1000,
      arableArea: -600,
      vegetationArea: 400,
    };

    expect(() => validateFarmAreas(body))
      .toThrow(BadRequestException);
    expect(() => validateFarmAreas(body))
      .toThrow('Todos os campos de área devem ser números positivos');
  });
}); 