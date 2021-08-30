import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { RoomsService } from 'src/rooms/rooms.service';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @Inject(forwardRef(() => RoomsService))
    private roomsService: RoomsService,
  ) {}

  async create(createScheduleDto: CreateScheduleDto) {
    const schedules = await this.scheduleRepository.find({
      idRoom: createScheduleDto.idRoom,
      date: createScheduleDto.date,
    });
    const available = [
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
    ];
    try {
      schedules.forEach((schedule) => {
        if (schedule.period == 'A') {
          throw 'Room Already Reserved';
        } else if (schedule.period) {
          const periodIndex = available
            .map(function (data) {
              return data.period;
            })
            .indexOf(schedule.period);
          available.splice(periodIndex, 1);
          if (available.length == 0) {
            throw 'Room Already Reserved';
          }
        } else {
          available.every((obj) => {
            const intervalIndex = obj.interval
              .map(function (data) {
                return data;
              })
              .indexOf(schedule.interval);
            if (intervalIndex != -1) {
              const periodIndex = available
                .map(function (data) {
                  return data.period;
                })
                .indexOf(obj.period);
              available[periodIndex].interval.splice(intervalIndex, 1);
              if (available[periodIndex].interval.length == 0) {
                available.splice(periodIndex, 1);
              }
              if (available.length == 0) {
                throw 'Room Already Reserved';
              }
              return false;
            }
          });
        }
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
    if (createScheduleDto.period) {
      if (createScheduleDto.period == 'A') {
        if (available.length == 3) {
          for (const i in available) {
            if (available[i].interval.length < 4) {
              throw new BadRequestException('Period Already Reserved');
            }
          }
        } else {
          throw new BadRequestException('Period Already Reserved');
        }
        return this.scheduleRepository.save(createScheduleDto);
      } else {
        const periodIndex = available
          .map(function (data) {
            return data.period;
          })
          .indexOf(createScheduleDto.period);
        if (periodIndex != -1) {
          if (available[periodIndex].interval.length < 4) {
            throw new BadRequestException('Period Already Reserved');
          } else {
            return this.scheduleRepository.save(createScheduleDto);
          }
        } else {
          throw new BadRequestException('Period Already Reserved');
        }
      }
    } else {
      for (const i in available) {
        const intervalIndex = available[i].interval
          .map(function (data) {
            return data;
          })
          .indexOf(createScheduleDto.interval);
        if (intervalIndex != -1) {
          return this.scheduleRepository.save(createScheduleDto);
        } else {
          throw new BadRequestException('Interval Already Reserved');
        }
      }
    }
  }

  findAll() {
    return this.scheduleRepository.find();
  }

  async findRoom(idRoom: number, date: string) {
    const room = await this.roomsService.findOne(idRoom);
    const schedules = await this.scheduleRepository.find({ idRoom, date });
    const roomAvailability = {
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
    };
    const schedule = schedules.map((schedule) => {
      return {
        id: schedule.id,
        period: schedule.period,
        interval: schedule.interval,
      };
    });
    const roomSchedule = {
      id: room.id,
      schedules: schedule,
    };
    for (const i in roomSchedule.schedules) {
      if (roomSchedule.schedules[i].period == 'A') {
        roomAvailability.available = [];
        return roomAvailability;
      } else if (roomSchedule.schedules[i].period) {
        const periodIndex = roomAvailability.available
          .map(function (data) {
            return data.period;
          })
          .indexOf(roomSchedule.schedules[i].period);
        roomAvailability.available.splice(periodIndex, 1);
        if (roomAvailability.available.length == 0) {
          roomAvailability.available = [];
          return roomAvailability;
        }
      } else {
        roomAvailability.available.every((obj) => {
          const intervalIndex = obj.interval
            .map(function (data) {
              return data;
            })
            .indexOf(roomSchedule.schedules[i].interval);
          if (intervalIndex != -1) {
            const periodIndex = roomAvailability.available
              .map(function (data) {
                return data.period;
              })
              .indexOf(obj.period);
            roomAvailability.available[periodIndex].interval.splice(
              intervalIndex,
              1,
            );
            if (roomAvailability.available[periodIndex].interval.length == 0) {
              roomAvailability.available.splice(periodIndex, 1);
            }
            return false;
          }
        });
      }
    }
    return roomAvailability;
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return this.scheduleRepository.update(id, updateScheduleDto);
  }

  remove(id: number) {
    return this.scheduleRepository.delete(id);
  }

  async findByDate(date: string) {
    return this.scheduleRepository.find({ date });
  }
}
