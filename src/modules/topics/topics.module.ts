import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Topic } from './models/topic.model';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Topic.modelName, schema: Topic.model.schema },
    ]),
  ],
  controllers: [TopicsController],
  providers: [TopicsService]
})
export class TopicsModule {}
