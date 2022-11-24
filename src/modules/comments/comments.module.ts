import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {Comment} from './models/comment.model';
import { User } from '../users/models/users.model';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Comment.modelName, schema: Comment.model.schema },
    ]),
    MongooseModule.forFeature([
      { name: User.modelName, schema: User.model.schema },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
