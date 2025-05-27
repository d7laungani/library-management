import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum BookStatus {
  AVAILABLE = 'available',
  CHECKED_OUT = 'checked_out',
}

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  title: string;

  @Column()
  @ApiProperty()
  author: string;

  @Column()
  @ApiProperty()
  isbn: string;

  @Column('text')
  @ApiProperty()
  description: string;

  @Column({
    type: 'enum',
    enum: BookStatus,
    default: BookStatus.AVAILABLE,
  })
  @ApiProperty({ enum: BookStatus })
  status: BookStatus;

  @Column({ nullable: true, type: 'varchar' })
  @ApiProperty({ required: false, nullable: true })
  checkedOutBy: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  @ApiProperty({ required: false, nullable: true })
  dueDate: Date | null;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
