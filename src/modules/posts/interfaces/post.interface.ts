import { Document } from "mongoose";
import mongoose from "mongoose";

export interface Post extends Document {
    readonly title: string;
    readonly content: string;
    readonly date: Date;
    readonly multimedia: string;
    readonly categoryId: mongoose.Schema.Types.ObjectId;
    readonly topic: string;
    readonly userId: mongoose.Schema.Types.ObjectId;
    readonly tags: mongoose.Schema.Types.Array;
    readonly upVotes: mongoose.Schema.Types.Array;
    readonly downVotes: mongoose.Schema.Types.Array;
}
