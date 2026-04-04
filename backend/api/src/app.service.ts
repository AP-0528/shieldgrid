import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Policy, Payout } from './entities';
import fetch from 'node-fetch'; // Requires adding to package.json or using built-in in NodeJS 18+

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private mlApiUrl = process.env.ML_API_URL || 'http://localhost:8000';

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Policy) private policyRepository: Repository<Policy>,
    @InjectRepository(Payout) private payoutRepository: Repository<Payout>,
  ) {}

  async onboardUser(data: { fullName: string, workerId: string, upiId: string }) {
    let user = await this.userRepository.findOne({ where: { workerId: data.workerId } });
    if (!user) {
      user = this.userRepository.create(data);
      await this.userRepository.save(user);
      this.logger.log(`Onboarded new worker: ${user.workerId}`);
    } else {
      this.logger.log(`Worker already exists: ${user.workerId}, skipping creation.`);
    }
    return user;
  }

  async issuePolicy(userId: string, zone: string) {
    // 1. Get dynamic pricing from ML oracle
    let premiumData = { base_premium: 15, risk_multiplier: 1.0, final_premium: 15 };
    try {
      const res = await fetch(`${this.mlApiUrl}/evaluate-risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zone_density: 0.8,
          historical_rain_mm: 35.0,
          average_traffic_velocity: 12.0
        })
      });
      if (res.ok) {
        premiumData = await res.json() as any;
      }
    } catch (err) {
      this.logger.warn('ML Oracle unreachable, falling back to base premium.');
    }

    const policy = this.policyRepository.create({
      userId,
      coveragePeriod: 'Current Week',
      weeklyLimit: 1500,
      premiumPaid: premiumData.final_premium,
      coveredZone: zone,
      status: 'LIVE'
    });
    
    await this.policyRepository.save(policy);
    this.logger.log(`Issued LIVE policy ${policy.id} for user ${userId} at premium ${premiumData.final_premium}`);
    return { policy, risk_assessment: premiumData };
  }

  async handleTriggerEvent(data: { zone: string; event_type: string; value: number }) {
    this.logger.log(`Oracle Trigger Received: ${data.event_type} in ${data.zone}`);
    
    // Find all live policies in this zone
    const policies = await this.policyRepository.find({ where: { coveredZone: data.zone, status: 'LIVE' } });
    if (policies.length === 0) {
      this.logger.log('No active policies in this zone. Ignoring trigger.');
      return { message: 'No policies affected.' };
    }

    // For prototype, we mock the worker ping history validation for the first policy
    try {
      const verifyRes = await fetch(`${this.mlApiUrl}/verify-presence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          worker_id: policies[0].userId,
          ping_history: [{"lat": 12.9, "lon": 77.5, "time": "now"}]
        })
      });

      if (!verifyRes.ok) {
        this.logger.error('Worker failed anomaly detection (fraud check). Payout rejected.');
        return { message: 'Fraud threshold exceeded / invalid presence.' };
      }
    } catch (err) {
      this.logger.warn('Could not verify presence with ML API. Proceeding optimistically...');
    }

    // Process payouts for all valid policies
    const payouts = [];
    for (const policy of policies) {
      // Mock Razorpay UPI Payout Call
      const txId = `urpi_test_${Math.random().toString(36).substring(2, 9)}`;
      
      const payout = this.payoutRepository.create({
        policyId: policy.id,
        triggerEvent: data.event_type,
        amount: 800, // proportional payout
        status: 'COMPLETED',
        transactionId: txId
      });
      await this.payoutRepository.save(payout);
      payouts.push(payout);
      this.logger.log(`Processed UPI Payout ${payout.id} for Policy ${policy.id} -> Txn ${txId}`);
    }

    return { success: true, payouts_issued: payouts.length };
  }

  async getPayouts(userId: string) {
    // Find policies for this user
    const policies = await this.policyRepository.find({ where: { userId } });
    const policyIds = policies.map(p => p.id);
    
    if (policyIds.length === 0) return [];

    // Find all payouts for these policies
    const payouts = await this.payoutRepository.find({
      where: policyIds.map(id => ({ policyId: id })),
      order: { issuedAt: 'DESC' }
    });

    return payouts.map(p => ({
      id: p.id,
      date: p.issuedAt.toDateString(),
      payout: `₹${p.amount}`,
      status: p.status,
      trigger: p.triggerEvent,
      location: 'Koramangala, BLR', // Simplified for demo
      coverageWeek: 'Apr 01-07',
      txId: p.transactionId
    }));
  }

  async resetSystem() {
    await this.payoutRepository.delete({});
    await this.policyRepository.delete({});
    await this.userRepository.delete({});
    this.logger.warn('SYSTEM RESET: All user, policy, and payout data wiped for demo purposes.');
    return { success: true, message: 'Database cleared.' };
  }
}
