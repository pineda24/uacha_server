import { ReturnModelType, prop, getModelForClass, types } from '@typegoose/typegoose';
// import { BaseModel, schemaOptions } from '../../../shared/base.model';
import { AutoMap } from '@nartc/automapper';

export class Topic{
    @prop({ required: [true,'description is required'] })
    @AutoMap()
    description: String;

    static get model(): ReturnModelType<typeof Topic> {
        return getModelForClass(Topic);
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
