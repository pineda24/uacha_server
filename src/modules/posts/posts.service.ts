import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Tag } from '../tags/models/tag.model';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostMD } from './models/post.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostMD.name)
    private postModel: ReturnModelType<typeof PostMD>,
    @InjectModel(Tag.name)
    private tagsModel: ReturnModelType<typeof Tag>,
  ) {}

  async create(createPostDto: PostMD) {
    try {
      const createUser = new this.postModel(createPostDto);
      return await createUser
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

  async findAll() {
    try {
      // return await this.postModel.find({});
      let post:any = await this.postModel.aggregate([
        {
          $lookup: {
            from: 'posttags',
            localField: '_id',
            foreignField: 'postld',
            as: 'tags',
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            content: 1,
            date: 1,
            votes: 1,
            multimedia: 1,
            tags: 1,
          },
        },
      ]);
      let tags = await this.tagsModel.find({});
      for (let i = 0; i < post.length; i++) {
        let tagsList:any = [];
        for (let j = 0; j < post[i].tags.length; j++) {
          for (let k = 0; k < tags.length; k++) {
            if(tags[k]._id.toString() == post[i].tags[j].tagld.toString()) tagsList.push(tags[i].description);
          }
        }
        console.log(tagsList);
        post[i].tags = tagsList;
      }
      return post;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
