import { Injectable } from '@nestjs/common';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { PrismaService } from 'src/prisma.service';
import { Question } from '@prisma/client';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async createMany() {
    const questions = Array.from({ length: 30 }).map((item) => {
      const time = new Date().getTime();
      return {
        text: `${time} text ${item}`,
        popupHelpText: `${time} popupHelpText ${item}`,
        simpleHelpText: `${time} simpleHelpText ${item}`,
      };
    });
    console.log('Start create start');
    await this.prisma.question.createMany({ data: questions });
    console.log('End create start');
    return await this.prisma.question.findMany({
      orderBy: { createdOn: 'desc' },
    });
  }

  async findAll() {
    return await this.prisma.question.findMany();
  }

  async findMany({
    skip,
    take,
  }: {
    skip: number;
    take: number;
  }): Promise<Question[]> {
    return this.prisma.question.findMany({
      skip: skip || 0,
      take: take || 10,
    });
  }
}
