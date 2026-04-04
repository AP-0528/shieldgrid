import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User, Policy, Payout } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5433,
      username: process.env.DB_USER || 'shieldgrid_user',
      password: process.env.DB_PASSWORD || 'shieldgrid_password',
      database: process.env.DB_NAME || 'shieldgrid',
      entities: [User, Policy, Payout],
      synchronize: true, // For demo purposes only; use migrations in prod
    }),
    TypeOrmModule.forFeature([User, Policy, Payout]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
