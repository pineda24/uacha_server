import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag } from './models/tag.model';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Tag.modelName, schema: Tag.model.schema },
    ]),
  ],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService]
})
export class TagsModule {}
