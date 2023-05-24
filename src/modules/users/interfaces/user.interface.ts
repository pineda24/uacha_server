import { Document } from "mongoose";

export interface User extends Document {
    readonly fullName: string;
    readonly email: string;
    readonly gender: string;
    readonly birthDate: Date;
    readonly description: string;
    readonly role: string;
    readonly userName: string;
    readonly password: string;
}