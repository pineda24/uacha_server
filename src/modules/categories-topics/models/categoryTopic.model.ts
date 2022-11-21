import { ReturnModelType, prop, getModelForClass, types, Ref } from '@typegoose/typegoose';
// import { BaseModel, schemaOptions } from '../../../shared/base.model';
import { AutoMap } from '@nartc/automapper';
import { Category } from 'src/modules/categories/models/category.model';
import { Topic } from 'src/modules/topics/models/topic.model';

export class CategoryTopic{
    @prop({ required: [true,'categoryld is required'], ref: () => Category, default: null })
    @AutoMap()
    categoryld: Ref<Category>;

    @prop({ required: [true,'categoryld is required'], ref: () => Topic, default: null })
    @AutoMap()
    topicld: Ref<Topic>;

    static get model(): ReturnModelType<typeof CategoryTopic> {
        return getModelForClass(CategoryTopic);
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
