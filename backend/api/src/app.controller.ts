import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth(): string {
    return 'ShieldGrid Transaction API is running';
  }

  @Post('users/onboard')
  async onboard(@Body() body: { fullName: string, workerId: string, upiId: string }) {
    return this.appService.onboardUser(body);
  }

  @Post('policy/issue')
  async issuePolicy(@Body() body: { userId: string, zone: string }) {
    return this.appService.issuePolicy(body.userId, body.zone);
  }

  // Called internally by the Trigger Oracle (FastAPI)
  @Post('payouts/trigger')
  async triggerPayout(@Body() body: { zone: string, event_type: string, value: number }) {
    return this.appService.handleTriggerEvent(body);
  }

  @Get('payouts/:userId')
  async getPayouts(@Param('userId') userId: string) {
    return this.appService.getPayouts(userId);
  }

  @Post('demo/reset')
  async reset(@Body() body: any) {
    return this.appService.resetSystem();
  }
}
