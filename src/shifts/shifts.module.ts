import { Module } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { ShiftsController } from './shifts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from './entities/shift.entity';
import { Employee } from 'src/employees/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shift, Employee])],
  controllers: [ShiftsController],
  providers: [ShiftsService],
})
export class ShiftsModule {}
