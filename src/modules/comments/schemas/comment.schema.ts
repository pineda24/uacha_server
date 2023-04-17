import { AutoMap } from '@nartc/automapper';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Post } from 'src/modules/posts/interfaces/post.interface';
import { User } from 'src/modules/users/schemas/user.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ required: [true, 'Content is required']})
  content: string;

  @Prop({ required: [false], default: new Date() })
  date: Date;

  @Prop({
    required: [false, 'Post id is required'],
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  })
  postId: Post;

  @Prop({
    required: [false],
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  })
  commentId: Comment;

  @Prop({
    required: [true, 'User id is required'],
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId: User;

  @Prop({
    required: [false],
    type: mongoose.Schema.Types.Array,
    ref: 'User',
  })
  upVotes: User[];

  @Prop({
    required: [false],
    type: mongoose.Schema.Types.Array,
    ref: 'User',
  })
  downVotes: User[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);