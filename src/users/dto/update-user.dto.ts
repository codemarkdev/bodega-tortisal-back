import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class UpdateUserDto {
        @ApiProperty({
            example: 'john_doe',
            description: 'Username'
        })
        @IsString()
        @Length(3, 50)
        username?: string;
    
        @ApiProperty({
            example: 'secretpassword',
            description: 'Password of username'
        })
        @IsString()
        @Length(8, 50)
        password?: string;
    
        @ApiProperty({
            example: 'admin',
            description: 'Role of user'
        })
        @IsString()
        role?: string // Valor por defecto admin
}
