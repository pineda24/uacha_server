import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {Comment} from './models/comment.model';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Comment.modelName, schema: Comment.model.schema },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
