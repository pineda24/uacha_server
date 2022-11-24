import { ReturnModelType, prop, getModelForClass, types, Ref } from '@typegoose/typegoose';
// import { BaseModel, schemaOptions } from '../../../shared/base.model';
import { AutoMap } from '@nartc/automapper';
import { Category } from 'src/modules/categories/models/category.model';
import { User } from 'src/modules/users/models/users.model';

export class PostMD{
    @prop({ required: [true,'title is required'] })
    @AutoMap()
    title: String;

    @prop({ required: [true,'content is required'] })
    @AutoMap()
    content: String;

    @prop({ required: [true,'date is required'],default: new Date() })
    @AutoMap()
    date: Date;

    @prop({ required: [true,'votes is required'],default: 0, validate: /^[0-9]*$/ })
    @AutoMap()
    votes: number;

    @prop({ required: [false,'multimedia is required'] })
    @AutoMap()
    multimedia: String;

    @prop({ required: [false,'categoryld is required'], ref: () => Category, default: null })
    @AutoMap()
    categoryld: Ref<Category>;

    @prop({ required: [false,'userld is required'], ref: () => User, default: null })
    @AutoMap()
    userld: Ref<User>;

    static get model(): ReturnModelType<typeof PostMD> {
        return getModelForClass(PostMD);
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
