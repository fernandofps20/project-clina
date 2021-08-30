import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Room } from 'src/rooms/entities/room.entity';
@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room)
  @JoinColumn({ name: 'idRoom' })
  @Column()
  idRoom: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'idUser' })
  @Column()
  idUser: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ default: '' })
  period: string;

  @Column({ default: '' })
  interval: string;
}
