import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { QuestionModule } from './question/question.module';
import { SseController } from './question/sse.controller';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    QuestionModule,
    PrismaModule,
  ],
  controllers: [AppController, SseController],
  providers: [AppService],
})
export class AppModule {}
