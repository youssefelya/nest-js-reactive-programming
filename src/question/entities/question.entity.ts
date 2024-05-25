import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Question {
  @Field(() => String)
  id: string;

  @Field(() => String)
  text: string;

  @Field(() => String)
  simpleHelpText: string;
  @Field(() => Date)
  createdOn: Date;
  @Field(() => Date)
  updatedOn: Date;
  @Field(() => Boolean)
  isDeleted: Boolean;
}
