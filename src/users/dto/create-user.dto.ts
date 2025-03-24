import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        example: 'john_doe',
        description: 'Username',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    @Length(3, 50)
    username: string;

    @ApiProperty({
        example: 'secretpassword',
        description: 'Password of username',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    @Length(8, 50)
    password: string;

    @ApiProperty({
        example: 'admin',
        description: 'Role of user',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    role?: string = 'admin'; // Valor por defecto admin
}
