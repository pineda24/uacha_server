import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop({ required: [true, 'Title is required'] })
  title: string;

  @Prop({ required: [false], default: [] })
  topics: Array<string>[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
