import { Controller, Sse } from '@nestjs/common';
import { Observable, interval } from 'rxjs';
import { map, mergeMap, takeWhile } from 'rxjs/operators';
import { QuestionService } from './question.service';

@Controller('sse')
export class SseController {
  constructor(private readonly questionService: QuestionService) {}

  @Sse('questions')
  sendQuestions(): Observable<MessageEvent> {
    const takeCount = 2;
    let currentSkip = 0;

    return interval(1000).pipe(
      mergeMap(async () => {
        const questions = await this.questionService.findMany({
          skip: currentSkip,
          take: takeCount,
        });
        if (questions.length > 0) {
          console.log(questions);
          currentSkip += takeCount;
          return { data: questions } as MessageEvent;
        } else {
          return null;
        }
      }),
      takeWhile((event) => event !== null), // Continue emitting values while the event is not null
      map((event) => {
        console.log(event);
        return event as MessageEvent;
      }),
    );
  }
}
