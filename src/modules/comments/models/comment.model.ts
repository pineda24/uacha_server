import { ReturnModelType, prop, getModelForClass, types, Ref } from '@typegoose/typegoose';
// import { BaseModel, schemaOptions } from '../../../shared/base.model';
import { AutoMap } from '@nartc/automapper';
import { Category } from 'src/modules/categories/models/category.model';
import { User } from 'src/modules/users/models/users.model';
import { PostMD } from 'src/modules/posts/models/post.model';
import { Tag } from 'src/modules/tags/models/tag.model';

export class Comment{

    @prop({ required: [true,'content is required'], default:"" })
    @AutoMap()
    content: String;

    @prop({ required: [false,'date is required'], default: new Date() })
    @AutoMap()
    date: Date;

    @prop({ required: [false, 'postId is required'], ref: () => PostMD, default: null })
    @AutoMap()
    postId: Ref<PostMD>;

    @prop({ required: [false,'commentFather is required'], ref: () => Comment, default: null })
    @AutoMap()
    commentId: Ref<Comment>;

    // @prop({ required: [false,'comments is required'], ref: () => Comment, default:[] })
    // @AutoMap()
    // comments: Ref<Comment>[];

    @prop({ required: [true,'userId is required'], ref: () => User, default: null })
    @AutoMap()
    userId: Ref<User>;

    @prop({ required: [false,'upVotes is required'], ref: () => User, default: [] })
    @AutoMap()
    upVotes: Ref<User>[];

    @prop({ required: [false,'downVotes is required'], ref: () => User, default: [] })
    @AutoMap()
    downVotes: Ref<User>[];

    static get model(): ReturnModelType<typeof Comment> {
        return getModelForClass(Comment);
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
