import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsNotEmpty, Min } from 'class-validator';

export class UpdateToolsIssuedDto {
  @ApiProperty({ description: 'Cantidad devuelta', example: 2, minimum: 0 })
  @IsInt()
  @IsPositive()
  @Min(0)
  @IsNotEmpty()
  quantity_returned: number;
}