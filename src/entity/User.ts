import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string

  @Column()
  @Field()
  firstName: string

  @Column()
  @Field()
  lastName: string

  @Column('text', { unique: true })
  @Field()
  email: string

  @Column() // intentionally left off @Field() decorator to prevent the field from being resolved
  password: string

  @Column('int', { default: 0 })
  count: number
}
