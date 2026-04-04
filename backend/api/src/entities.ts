import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  workerId: string;

  @Column()
  upiId: string;

  @Column({ default: 'Zomato' })
  linkedPlatform: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity()
export class Policy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  coveragePeriod: string; // e.g., 'Apr 01-07'

  @Column('float')
  weeklyLimit: number;

  @Column('float')
  premiumPaid: number;

  @Column()
  coveredZone: string;

  @Column()
  status: string; // 'LIVE', 'EXPIRED'
}

@Entity()
export class Payout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  policyId: string;

  @Column()
  triggerEvent: string; // e.g., 'RAINFALL_50MM'

  @Column('float')
  amount: number;

  @Column()
  status: string; // 'PENDING', 'COMPLETED', 'REJECTED'

  @Column({ nullable: true })
  transactionId: string;

  @CreateDateColumn()
  issuedAt: Date;
}
