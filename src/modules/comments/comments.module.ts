import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema} from './schemas/comment.schema';
import { UserSchema } from '../users/schemas/user.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: 'Comment', schema: CommentSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
    ])
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
