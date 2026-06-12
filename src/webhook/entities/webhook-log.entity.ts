import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('webhook_logs')
export class WebhookLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  orderId: string | null;

  @Column({ type: 'json' })
  payload: Record<string, unknown>;

  @Column({ default: false })
  isOutbound: boolean;

  @Column({ type: 'int', nullable: true })
  statusCode: number | null;

  @Column({ nullable: true, type: 'text' })
  error: string | null;

  @CreateDateColumn()
  receivedAt: Date;
}
