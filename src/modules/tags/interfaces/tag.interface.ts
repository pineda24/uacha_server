import { Document } from "mongoose";

export interface Tag extends Document {
    readonly description: string;
}