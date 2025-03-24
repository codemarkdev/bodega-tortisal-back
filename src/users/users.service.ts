import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}

  async create(createUserDto: CreateUserDto) {
    
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...CreateUserDto,
      username: createUserDto.username,
      password: hashedPassword,
      role: createUserDto.role
    });

    return this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: {id: id}})

    if (!user) { 
      throw new HttpException(`El usuario con el ID: ${id} no fue encontrado`, HttpStatus.NOT_FOUND)
    };

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({where: {id:id}})

    if (!user) { 
      throw new HttpException(`El usuario con el ID: ${id} no fue encontrado`, HttpStatus.NOT_FOUND)
    };

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);

    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({where: {id: id}})

    if (!user) { 
      throw new HttpException(`El usuario con el ID: ${id} no fue encontrado`, HttpStatus.NOT_FOUND)
    };

    return await this.userRepository.remove(user);

  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({ where: { username: loginUserDto.username }})

    if(!user) {
      throw new HttpException(`Usuario con el username: ${loginUserDto.username}`, HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);

    if (!isPasswordValid) {
      throw new HttpException(`Las credenciales no son validas`, HttpStatus.UNAUTHORIZED)
    }

    return user;
  }
}
