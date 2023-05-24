import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: [true,'Full name user is required'] })
    fullName: string;

    @Prop({ required: [true, 'Email is required'], unique: true })
    email: string;

    @Prop({ required: [true, 'Gender is required'] })
    gender: string;

    @Prop({ required: [true, 'Birthdate is required']})
    birthDate: Date;

    @Prop({ required: [true, 'Description is required'] })
    description: string;

    @Prop({ required: [true, 'Role is required'] })
    role: string;

    @Prop({ required: [true, 'Username is required'], unique: true })
    userName: string;

    @Prop({ required: [true, 'Password is required'] })
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
