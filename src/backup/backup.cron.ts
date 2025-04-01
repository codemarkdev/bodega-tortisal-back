import { Injectable, OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';
import * as moment from 'moment-timezone';
import { BackupService } from './backup.service';

@Injectable()
export class BackupCron implements OnModuleInit {
  constructor(private readonly backupService: BackupService) {}

  onModuleInit() {
    this.scheduleBackup();
    console.log('🛠️  Cron job de respaldo de base de datos activado (9 PM hora de El Salvador).');
  }

  private scheduleBackup() {
    cron.schedule('* * * * *', async () => {
      const now = moment().tz('America/El_Salvador');
      if (now.hour() === 21 && now.minute() === 0) {
        console.log('⏳ Iniciando respaldo diario de la base de datos a las 9 PM (hora de El Salvador)...');
        await this.backupService.createBackup();
      }
    });
  }
}
