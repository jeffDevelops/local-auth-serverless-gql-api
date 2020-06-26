import { InputType, Field } from 'type-graphql'
import { IsEmail } from 'class-validator'

@InputType()
export class UserExistsInput {
  @Field(() => String!)
  @IsEmail()
  email: string
}
