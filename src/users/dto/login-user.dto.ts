import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {

    @ApiProperty({
        example: 'john_doe',
        description: 'Username del usuario'
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: 'secret_password',
        description: 'Password del usuario'
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}