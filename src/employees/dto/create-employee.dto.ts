import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";

export class CreateEmployeeDto {
    @ApiProperty({
        example: 'Juan Antonio',
        description: 'Nombres del empleado',
        required: true
    })
    @IsString({message: 'El nombre debe ser un string'})
    @IsNotEmpty({message: 'Este campo no puede ser null'})
    @Length(1, 256)
    firstname: string

    @ApiProperty({
        example: 'Baiza Hernandez',
        description: 'Apellidos del empleado',
        required: true
    })
    @IsString({message: 'El apellido debe ser un string'})
    @IsNotEmpty({message: 'Este campo no puede ser null'})
    @Length(1, 256)
    lastname: string

    @ApiProperty({
        example: '00000000-0',
        description: 'Dui del empleado',
        required: false
    })
    @IsString({message: 'El dui debe ser un string'})
    @Matches(/^\d{8}-\d$/, { message: 'El DUI debe tener el formato 00000000-0' })
    @IsOptional()
    @Length(1, 10)
    dui: string
}
