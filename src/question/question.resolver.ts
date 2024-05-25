import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Subscription,
} from '@nestjs/graphql';
import { QuestionService } from './question.service';
import { Question } from './entities/question.entity';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => Question)
export class QuestionResolver {
  constructor(private readonly questionService: QuestionService) {}

  @Mutation(() => [Question])
  createQuestion(counter: String) {
    console.log('Start creating question');
    return this.questionService.createMany();
  }

  @Query(() => [Question], { name: 'question' })
  findAll() {
    return this.questionService.findAll();
  }

  @Subscription(() => [Question], {
    name: 'questionsChunk',
    resolve: (value) => value.questionsChunk,
  })
  async questionsChunk() {
    const takeCount = 10; // Define the chunk size
    let currentSkip = 0;

    const interval = setInterval(async () => {
      const questions = await this.questionService.findMany({
        skip: currentSkip,
        take: takeCount,
      });

      if (questions.length > 0) {
        questions.map((item) => console.log(item.id));
        pubSub.publish('questionsChunk', { questionsChunk: questions });
        currentSkip += takeCount;
      } else {
        clearInterval(interval);
      }
    }, 1000); // Stream data every second

    return pubSub.asyncIterator('questionsChunk');
  }
}
