import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { BackupCron } from './backup.cron';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BackupController } from './backup.controller';

@Module({
  imports: [ConfigModule], // 👈 Importar ConfigModule
  providers: [BackupService, BackupCron, ConfigService],
  controllers: [BackupController],
  exports: [BackupService],
})
export class BackupModule {}
