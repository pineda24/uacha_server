import { ReturnModelType, prop, getModelForClass, types, Ref } from '@typegoose/typegoose';
// import { BaseModel, schemaOptions } from '../../../shared/base.model';
import { AutoMap } from '@nartc/automapper';
import { Topic } from 'src/modules/topics/models/topic.model';

export class Category{
    @prop({ required: [true,'title is required'] })
    @AutoMap()
    title: String;

    @prop({ required: [true,'description is required'] })
    @AutoMap()
    description: String;

    @prop({ required: [false,'tags is required'], ref: () => Topic, default: [] })
    @AutoMap()
    topics: Ref<Topic>[];

    static get model(): ReturnModelType<typeof Category> {
        return getModelForClass(Category);
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
