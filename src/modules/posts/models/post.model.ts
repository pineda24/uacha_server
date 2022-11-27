import { ReturnModelType, prop, getModelForClass, types, Ref } from '@typegoose/typegoose';
// import { BaseModel, schemaOptions } from '../../../shared/base.model';
import { AutoMap } from '@nartc/automapper';
import { Category } from 'src/modules/categories/models/category.model';
import { User } from 'src/modules/users/models/users.model';
import { Tag } from 'src/modules/tags/models/tag.model';

export class PostMD{
    @prop({ required: [true,'title is required'] })
    @AutoMap()
    title: String;

    @prop({ required: [true,'content is required'] })
    @AutoMap()
    content: String;

    @prop({ required: [true,'date is required'], default: new Date() })
    @AutoMap()
    date: Date;

    @prop({ required: [false,'multimedia is required'] })
    @AutoMap()
    multimedia: String;

    @prop({ required: [true, 'categoryId is required'], ref: () => Category, default: null })
    @AutoMap()
    categoryId: Ref<Category>;

    @prop({ required: [true, 'topic is required']})
    @AutoMap()
    topic: String;

    @prop({ required: [false,'userId is required'], ref: () => User, default: null })
    @AutoMap()
    userId: Ref<User>;

    @prop({ required: [false,'tags is required'], ref: () => Tag, default: [] })
    @AutoMap()
    tags: Ref<Tag>[];

    @prop({ required: [false,'upVotes is required'], ref: () => User, default: [] })
    @AutoMap()
    upVotes: Ref<User>[];

    @prop({ required: [false,'downVotes is required'], ref: () => User, default: [] })
    @AutoMap()
    downVotes: Ref<User>[];

    static get model(): ReturnModelType<typeof PostMD> {
        return getModelForClass(PostMD);
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
