import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length, IsNumber, IsBoolean } from 'class-validator';

export class UpdateProductDto {
        @ApiPropertyOptional({
            example: 'Bolsa de Cemento 42.5 Kg',
            description: 'Nombre del producto',
            required: true
        })
        @IsString({message: 'El nombre debe de ser un string'})
        @Length(1, 100)
        name: string;
    
        @ApiPropertyOptional({
            example: 'Bolsa de cemento 42.5 Kg blanca',
            description: 'Descripcion del producto',
            required: true
        })
        @IsString({message: 'La descripcion del producto debe ser un string'})
        @Length(1, 220)
        description: string;
    
        @ApiPropertyOptional({
            example: '29.50',
            description: 'Precio de compra del producto',
            required: true
        })
        @IsNumber({}, {message: 'El precio debe ser un numero'})
        purchase_price: number;
    
        @ApiPropertyOptional({
            example: '50',
            description: 'Stock del producto',
            required: true
        })
        @IsNumber({}, {message: 'El stock debe ser un numero'})
        quantity: number;
    
        @ApiPropertyOptional({
            example: true,
            description: 'Indica si el producto es de un solo uso',
            required: true
        })
        @IsBoolean({message: 'El valor debe ser true o false'})
        is_consumable: boolean;
}
