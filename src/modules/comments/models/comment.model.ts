import { ReturnModelType, prop, getModelForClass, types, Ref } from '@typegoose/typegoose';
// import { BaseModel, schemaOptions } from '../../../shared/base.model';
import { AutoMap } from '@nartc/automapper';
import { Category } from 'src/modules/categories/models/category.model';
import { User } from 'src/modules/users/models/users.model';
import { Post } from 'src/modules/posts/models/post.model';
import { Tag } from 'src/modules/tags/models/tag.model';

export class Comment{

    @prop({ required: [true,'content is required'], default:"" })
    @AutoMap()
    content: String;

    @prop({ required: [true,'date is required'], default: new Date() })
    @AutoMap()
    date: Date;

    @prop({ required: [true,'votes is required'], validate: /^[0-9]*$/, default:0 })
    @AutoMap()
    votes: number;

    @prop({ required: [true,'postld is required'], ref: () => Post, default:null })
    @AutoMap()
    postld: Ref<Post>;

    @prop({ required: [false,'commentld is required'], ref: () => Comment, default:null })
    @AutoMap()
    commentld: Ref<Comment>;

    @prop({ required: [false,'userld is required'], ref: () => User, default: null })
    @AutoMap()
    userld: Ref<User>;

    static get model(): ReturnModelType<typeof Comment> {
        return getModelForClass(Comment);
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
