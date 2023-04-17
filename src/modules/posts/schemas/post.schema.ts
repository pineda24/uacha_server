import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/modules/categories/schemas/category.schema';
import { Tag } from 'src/modules/tags/schemas/tag.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ required: [true, 'Title is required'] })
  title: string;

  @Prop({ required: [true, 'Content is required'] })
  content: string;

  @Prop({ required: [true, 'Date is required'] })
  date: Date;

  @Prop({ required: [false, 'Multimedia is required'] })
  multimedia: string;

  @Prop({
    required: [true, 'CategoryId is required'],
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  })
  categoryId: Category;

  @Prop({ required: [true, 'Topic is required'] })
  topic: string;

  @Prop({
    required: [false, 'User id is required'],
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId: User;

  @Prop({
    required: [false, 'Tags are required'],
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
  })
  tags: Tag[];

  @Prop({
    required: [false, 'Upvotes are required'],
    type: mongoose.Schema.Types.Array,
    ref: 'User',
  })
  upVotes: User[];

  @Prop({
    required: [false, 'Downvotes are required'],
    type: mongoose.Schema.Types.Array,
    ref: 'User',
  })
  downVotes: User[];
}

export const PostSchema = SchemaFactory.createForClass(Post);