import { Document } from 'mongoose';

export interface Category extends Document {
    readonly title: string;
    readonly topics: Array<string>[];
}
