import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SchedulesService } from 'src/schedules/schedules.service';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @Inject(forwardRef(() => SchedulesService))
    private schedulesService: SchedulesService,
  ) {}

  create(createRoomDto: CreateRoomDto) {
    return this.roomRepository.save(createRoomDto);
  }

  findAll() {
    return this.roomRepository.find();
  }

  findOne(id: number) {
    return this.roomRepository.findOne(id);
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return this.roomRepository.update(id, updateRoomDto);
  }

  remove(id: number) {
    return this.roomRepository.delete(id);
  }

  async findAvailable(date: string) {
    const rooms = await this.roomRepository.find();
    const schedules = await this.schedulesService.findByDate(date);
    const roomsList = [];
    const roomsSchedule = [];
    rooms.forEach((room) => {
      const schedule = schedules.reduce((acc, schedule) => {
        if (room.id == schedule.idRoom) {
          acc.push({
            id: schedule.id,
            period: schedule.period,
            interval: schedule.interval,
          });
        }
        return acc;
      }, []);
      roomsList.push({
        id: room.id,
        name: room.name,
        imgURL: room.roomImgUrl,
        value: room.value,
        available: [
          {
            period: 'M',
            interval: ['8-9', '9-10', '10-11', '11-12'],
          },
          {
            period: 'T',
            interval: ['14-15', '15-16', '16-17', '17-18'],
          },
          {
            period: 'N',
            interval: ['18-19', '19-20', '20-21', '21-22'],
          },
        ],
      });
      roomsSchedule.push({
        id: room.id,
        schedule: schedule,
      });
    });
    roomsSchedule.forEach((room) => {
      room.schedule.forEach((schedule) => {
        const index = roomsList
          .map(function (data) {
            return data.id;
          })
          .indexOf(room.id);
        if (schedule.period == 'A') {
          roomsList.splice(index, 1);
        } else if (schedule.period) {
          const periodIndex = roomsList[index].available
            .map(function (data) {
              return data.period;
            })
            .indexOf(schedule.period);
          roomsList[index].available.splice(periodIndex, 1);
          if (roomsList[index].available.length == 0) {
            roomsList.splice(index, 1);
          }
        } else {
          roomsList[index].available.every((obj) => {
            const intervalIndex = obj.interval
              .map(function (data) {
                return data;
              })
              .indexOf(schedule.interval);
            if (intervalIndex != -1) {
              const periodIndex = roomsList[index].available
                .map(function (data) {
                  return data.period;
                })
                .indexOf(obj.period);
              roomsList[index].available[periodIndex].interval.splice(
                intervalIndex,
                1,
              );
              if (
                roomsList[index].available[periodIndex].interval.length == 0
              ) {
                roomsList[index].available.splice(periodIndex, 1);
              }
              if (roomsList[index].available.length == 0) {
                roomsList.splice(index, 1);
              }
              return false;
            }
          });
        }
      });
    });
    return roomsList;
  }

  async updateImage(id: number, image: Express.Multer.File) {
    const room = await this.roomRepository.findOne(id);
    if (!room) {
      throw new BadRequestException("Room Doesn't Exists");
    }
    room.roomImgUrl = image.filename;
    return this.roomRepository.update(id, room);
  }
}
