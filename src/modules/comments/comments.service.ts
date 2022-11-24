import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './models/comment.model';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: ReturnModelType<typeof Comment>,
  ) {}

  async create(createCommentDto: Comment) {
    try {
      const createUser = new this.commentModel(createCommentDto);
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

  async findbyPostId(id: string) {
    try {
      return await this.commentModel.aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$postld', { $toObjectId: id }],
            },
          },
        },
        {
          $lookup: {
            from: 'comments',
            localField: 'commentld',
            foreignField: '_id',
            as: 'comments',
          },
        },
      ]);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async addComment(objectAdd: any) {
    try {
      const { commentId, subCommentId } = objectAdd;
      let comment: any = await this.commentModel.findOne({ _id: subCommentId });
      return await this.commentModel.findByIdAndUpdate(
        { _id: commentId },
        { $push: { comments: comment } },
        { upsert: true, new: true },
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async removeComment(objectRemove: any) {
    try {
      const { commentId, subCommentId } = objectRemove;
      let comment: any = await this.commentModel.findOne({ _id: subCommentId });
      return await this.commentModel.findByIdAndUpdate(
        { _id: commentId },
        { $pull: { comments: comment } },
        { upsert: true, new: true },
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findAll() {
    try {
      return await this.commentModel.find({});
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
