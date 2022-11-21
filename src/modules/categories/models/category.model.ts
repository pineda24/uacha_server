import { ReturnModelType, prop, getModelForClass, types } from '@typegoose/typegoose';
// import { BaseModel, schemaOptions } from '../../../shared/base.model';
import { AutoMap } from '@nartc/automapper';

export class Category{
    @prop({ required: [true,'title is required'] })
    @AutoMap()
    title: String;

    @prop({ required: [true,'description is required'] })
    @AutoMap()
    description: String;

    static get model(): ReturnModelType<typeof Category> {
        return getModelForClass(Category);
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
