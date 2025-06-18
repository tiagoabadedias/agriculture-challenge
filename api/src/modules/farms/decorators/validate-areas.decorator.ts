import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export function validateFarmAreas(body: any): any {
  if (body.totalArea === undefined || body.arableArea === undefined || body.vegetationArea === undefined) {
    throw new BadRequestException('Todos os campos de área (total, agricultável e vegetação) são obrigatórios');
  }

  const totalArea = Number(body.totalArea);
  const arableArea = Number(body.arableArea);
  const vegetationArea = Number(body.vegetationArea);

  if (isNaN(totalArea) || isNaN(arableArea) || isNaN(vegetationArea)) {
    throw new BadRequestException('Todos os campos de área devem ser números válidos');
  }

  if (totalArea < 0 || arableArea < 0 || vegetationArea < 0) {
    throw new BadRequestException('Todos os campos de área devem ser números positivos');
  }

  const sum = arableArea + vegetationArea;
  if (sum > totalArea) {
    throw new BadRequestException('A soma das áreas agricultável e de vegetação não pode ultrapassar a área total da fazenda');
  }

  return body;
}

export const ValidateFarmAreas = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return validateFarmAreas(request.body);
});
