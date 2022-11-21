import { Test, TestingModule } from '@nestjs/testing';
import { PostsTagsController } from './posts-tags.controller';
import { PostsTagsService } from './posts-tags.service';

describe('PostsTagsController', () => {
  let controller: PostsTagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsTagsController],
      providers: [PostsTagsService],
    }).compile();

    controller = module.get<PostsTagsController>(PostsTagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
