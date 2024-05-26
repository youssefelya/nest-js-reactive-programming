import { Controller, Sse } from '@nestjs/common';
import { Observable, interval } from 'rxjs';
import { map, mergeMap, takeWhile } from 'rxjs/operators';
import { QuestionService } from './question.service';

@Controller('sse')
export class SseController {
  constructor(private readonly questionService: QuestionService) {}

  @Sse('questions')
  sendQuestions(): Observable<MessageEvent> {
    const takeCount = 2; // Number of options/tags to fetch per chunk
    let currentSkip = 0;
    const questionId = 'your-question-id'; // Replace with your question ID
    let questionCache = null;

    return interval(1000).pipe(
      mergeMap(async () => {
        if (!questionCache) {
          questionCache = await this.questionService.findQuestionById(
            questionId,
          );
          if (!questionCache) {
            return null;
          }
          questionCache['options'] = [];
        }

        const { options } = await this.questionService.findOptionsAndTags(
          questionCache.id,
          currentSkip,
          takeCount,
        );

        currentSkip += takeCount;

        if (questionCache) {
          questionCache['options'] = questionCache['options'].concat(options);
          //  questionCache['tags'] = questionCache['tags'].concat(tags);
          console.log(questionCache);
          return { data: questionCache } as MessageEvent;
        } else {
          return null;
        }
      }),
      takeWhile((event) => event !== null),
      map((event) => {
        console.log(event);
        return event as MessageEvent;
      }),
    );
  }
}
