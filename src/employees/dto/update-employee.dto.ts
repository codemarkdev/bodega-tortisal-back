import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsString, IsNotEmpty, Matches, IsOptional, Length } from "class-validator"

export class UpdateEmployeeDto {
        @ApiPropertyOptional({
            example: 'Juan Antonio',
            description: 'Nombres del empleado',
            required: true
        })
        @IsString({message: 'El nombre debe ser un string'})
        @IsNotEmpty({message: 'Este campo no puede ser null'})
        @Length(1, 256)
        firstname: string
    
        @ApiPropertyOptional({
            example: 'Baiza Hernandez',
            description: 'Apellidos del empleado',
            required: true
        })
        @IsString({message: 'El apellido debe ser un string'})
        @IsNotEmpty({message: 'Este campo no puede ser null'})
        @Length(1, 256)
        lastname: string
    
        @ApiPropertyOptional({
            example: '00000000-0',
            description: 'Dui del empleado',
            required: false
        })
        @IsString({message: 'El dui debe ser un string'})
        @Matches(/^\d{8}-\d$/, { message: 'El DUI debe tener el formato 00000000-0' })
        @IsOptional()
        @Length(0, 10)
        dui: string
}
