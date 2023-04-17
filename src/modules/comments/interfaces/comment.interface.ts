import mongoose, { Document } from "mongoose";

export interface Comment extends Document {
    readonly content: string;
    readonly date: Date;
    readonly postId: mongoose.Schema.Types.ObjectId;
    readonly commentId: mongoose.Schema.Types.ObjectId;
    readonly userId: mongoose.Schema.Types.ObjectId;
    readonly upVotes: mongoose.Schema.Types.Array;
    readonly downVotes: mongoose.Schema.Types.Array;
}
