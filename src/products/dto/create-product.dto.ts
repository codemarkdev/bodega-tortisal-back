import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreateProductDto {
    @ApiProperty({
        example: 'Bolsa de Cemento 42.5 Kg',
        description: 'Nombre del producto',
        required: true
    })
    @IsString({message: 'El nombre debe de ser un string'})
    @IsNotEmpty({message: 'Este campo no puede ser null'})
    @Length(1, 100)
    name: string;

    @ApiProperty({
        example: 'Bolsa de cemento 42.5 Kg blanca',
        description: 'Descripcion del producto',
        required: true
    })
    @IsString({message: 'La descripcion del producto debe ser un string'})
    @IsNotEmpty({message: 'Este campo no puede ser null'})
    @Length(1, 220)
    description: string;

    @ApiProperty({
        example: '29.50',
        description: 'Precio de compra del producto',
        required: true
    })
    @IsNumber({}, {message: 'El precio debe ser un numero'})
    @IsNotEmpty({message: 'Este campo no puede ser null'})
    purchase_price: number;

    @ApiProperty({
        example: '50',
        description: 'Stock del producto',
        required: true
    })
    @IsNumber({}, {message: 'El stock debe ser un numero'})
    @IsNotEmpty({message: 'Este campo no puede ser null'})
    quantity: number;

    @ApiProperty({
        example: true,
        description: 'Indica si el producto es de un solo uso',
        required: true
    })
    @IsBoolean({message: 'El valor debe ser true o false'})
    @IsNotEmpty({message: 'Este campo no puede ser null'})
    is_consumable: boolean;
}
