import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreatePostsTagDto } from './dto/create-posts-tag.dto';
import { UpdatePostsTagDto } from './dto/update-posts-tag.dto';
import { PostTag } from './models/postTag.model';

@Injectable()
export class PostsTagsService {

  constructor(
    @InjectModel( PostTag.name )
    private postTagsModel: ReturnModelType<typeof PostTag>,
  ) {}

  async create(createPostsTagDto: PostTag) {
    try {
      const createTag = new this.postTagsModel(createPostsTagDto);
      return await createTag
        .save()
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err;
        });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  findAll() {
    return `This action returns all postsTags`;
  }

  findOne(id: number) {
    return `This action returns a #${id} postsTag`;
  }

  update(id: number, updatePostsTagDto: UpdatePostsTagDto) {
    return `This action updates a #${id} postsTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} postsTag`;
  }
}
