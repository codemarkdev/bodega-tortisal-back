import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario'})
  @ApiResponse({
    status: 201,
    description: 'Usuario creado correctamente!',
    type: User
  })
  @ApiBody({ type: CreateUserDto})
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar usuario por ID '})
  @ApiResponse({
    status: 200,
    description: 'Usuario Actualizado',
    type: User
  })
  @ApiParam({name: 'id', type: Number, description: 'ID del usuario'})
  @ApiBody({ type: UpdateUserDto })
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @Post('login')
  @ApiOperation({ summary: 'Inicio de sesion del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario Autenticado',
    type: User
  })
  @ApiResponse({
    status: 401,
    description: 'Usuario no autenticado'
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado'
  })
  @ApiBody({ type: LoginUserDto })
  async login(@Body() loginnUserDto: LoginUserDto){
    return this.usersService.login(loginnUserDto);
  }
}
