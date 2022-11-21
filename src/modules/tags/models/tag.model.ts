import { ReturnModelType, prop, getModelForClass, types, Ref } from '@typegoose/typegoose';
// import { BaseModel, schemaOptions } from '../../../shared/base.model';
import { AutoMap } from '@nartc/automapper';
import { Category } from 'src/modules/categories/models/category.model';
import { User } from 'src/modules/users/models/users.model';

export class Tag{
    @prop({ required: [true,'description is required'] })
    @AutoMap()
    description: String;

    static get model(): ReturnModelType<typeof Tag> {
        return getModelForClass(Tag);
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
