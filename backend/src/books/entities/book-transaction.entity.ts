import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Book } from './book.entity';

export enum TransactionType {
  CHECK_OUT = 'check_out',
  CHECK_IN = 'check_in',
}

@Entity()
export class BookTransaction {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ManyToOne(() => Book)
  @JoinColumn({ name: 'bookId' })
  @ApiProperty({ type: () => Book })
  book: Book;

  @Column()
  @ApiProperty()
  bookId: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  @ApiProperty({ enum: TransactionType })
  transactionType: TransactionType;

  @Column({ nullable: true, type: 'varchar' })
  @ApiProperty({ required: false, nullable: true })
  userId: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  @ApiProperty({ required: false })
  dueDate: Date | null;

  @CreateDateColumn()
  @ApiProperty()
  timestamp: Date;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ required: false })
  notes: string | null;
} 