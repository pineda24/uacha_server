import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CategoriesTopicsModule } from './modules/categories-topics/categories-topics.module';
import { TopicsModule } from './modules/topics/topics.module';
import { PostsModule } from './modules/posts/posts.module';
import { PostsTagsModule } from './modules/posts-tags/posts-tags.module';
import { TagsModule } from './modules/tags/tags.module';
import { CommentsModule } from './modules/comments/comments.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // MongooseModule.forRoot(
    //   "mongodb+srv://admin:admin@cluster0.s3spylg.mongodb.net/?retryWrites=true&w=majority"
    // ),
    MongooseModule.forRoot(
      "mongodb+srv://admin:admin@cluster0.s3spylg.mongodb.net/test",
      {
        useNewUrlParser: true,
      }
    ),
    UsersModule,
    CategoriesModule,
    CategoriesTopicsModule,
    TopicsModule,
    PostsModule,
    PostsTagsModule,
    TagsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
