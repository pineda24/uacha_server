import { ReturnModelType, prop, getModelForClass, types } from '@typegoose/typegoose';
// import { BaseModel, schemaOptions } from '../../../shared/base.model';
import { AutoMap } from '@nartc/automapper';

export class User{
    @prop({ required: [true,'fullName user is required'] })
    @AutoMap()
    fullName: String;

    @prop({ required: [true, 'email is required'] })
    @AutoMap()
    email: String;

    @prop({ required: [true, 'gender is required'] })
    @AutoMap()
    gender: String;

    @prop({ required: [true, 'birthDate is required'], default: new Date() })
    @AutoMap()
    birthDate: Date;

    @prop({ required: [true, 'description is required'], default: "" })
    @AutoMap()
    description: String;

    @prop({ required: [true, 'userName is required'], unique: true })
    @AutoMap()
    userName: String;

    @prop({ required: [true, 'password is required'] })
    @AutoMap()
    password: String;

    static get model(): ReturnModelType<typeof User> {
        return getModelForClass(User);
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
