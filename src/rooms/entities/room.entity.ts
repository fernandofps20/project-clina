import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  desc: string;
  @Column()
  value: number;
  @Column()
  street: string;
  @Column()
  number: string;
  @Column({ default: '' })
  complement: string;
  @Column()
  neighborhood: string;
  @Column()
  city: string;
  @Column()
  state: string;
  @Column()
  country: string;
  @Column()
  zip: string;
  @Column()
  roomImgUrl: string;
}
