import { ReturnModelType, prop, getModelForClass, types, Ref } from '@typegoose/typegoose';
import { AutoMap } from '@nartc/automapper';

export class Category{
    @prop({ required: [true,'title is required'] })
    @AutoMap()
    title: String;

    @prop({ required: [true,'description is required'] })
    @AutoMap()
    description: String;

    @prop({ required: [false,'tags is required'], default: [] })
    @AutoMap()
    topics: Array<String>[];

    static get model(): ReturnModelType<typeof Category> {
        return getModelForClass(Category);
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
