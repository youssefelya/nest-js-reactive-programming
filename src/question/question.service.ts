import { Injectable } from '@nestjs/common';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { PrismaService } from 'src/prisma.service';
import { Option, Question, Tag } from '@prisma/client';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async createMany() {
    const time = new Date().getTime();

    // Define the question
    const question = {
      text: `${time} text`,
      popupHelpText: `${time} popupHelpText`,
      simpleHelpText: `${time} simpleHelpText`,
      options: {
        create: Array.from({ length: 100 }).map((_, index) => ({
          name: `${time} option ${index + 1}`,
          isOther: false,
          tags: {
            create: [
              { name: `Tag ${index + 1}A` },
              { name: `Tag ${index + 1}B` },
            ],
          },
        })),
      },
    };

    console.log('Start create start');
    const createdQuestion = await this.prisma.question.create({
      data: question,
    });
    console.log('End create start');

    return createdQuestion;
  }

  async findAll() {
    return await this.prisma.question.findMany({
      include: { options: true, tags: true },
    });
  }

  async findMany({
    skip,
    take,
  }: {
    skip: number;
    take: number;
  }): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      skip: skip || 0,
      take: take || 10,
      include: {
        options: true,
        tags: true,
      },
    });

    // Assuming you have only one question
    if (questions.length === 1) {
      const question = questions[0];
      question.options = question.options.slice(skip, skip + take);
      question.tags = question.tags.slice(skip, skip + take);
    }

    return questions;
  }

  async findQuestionById(id: string): Promise<Question> {
    const result = await this.prisma.question.findMany({});
    return result[0];
  }

  async findOptionsAndTags(
    questionId: string,
    skip: number,
    take: number,
  ): Promise<{ options: Option[]; tags: Tag[] }> {
    const options = await this.prisma.option.findMany({
      where: { questions: { some: { id: questionId } } },
      skip: skip || 0,
      take: take || 10,
    });

    const tags = await this.prisma.tag.findMany({
      where: { questions: { some: { id: questionId } } },
      skip: skip || 0,
      take: take || 10,
    });

    return { options, tags };
  }
}
