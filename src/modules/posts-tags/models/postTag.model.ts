import { ReturnModelType, prop, getModelForClass, types, Ref } from '@typegoose/typegoose';
// import { BaseModel, schemaOptions } from '../../../shared/base.model';
import { AutoMap } from '@nartc/automapper';
import { Category } from 'src/modules/categories/models/category.model';
import { User } from 'src/modules/users/models/users.model';
import { PostMD } from 'src/modules/posts/models/post.model';
import { Tag } from 'src/modules/tags/models/tag.model';

export class PostTag{

    @prop({ required: [false,'userld is required'], ref: () => PostMD, default: null })
    @AutoMap()
    postld: Ref<PostMD>;

    @prop({ required: [false,'tagld is required'], ref: () => Tag, default: null })
    @AutoMap()
    tagld: Ref<Tag>;

    static get model(): ReturnModelType<typeof PostTag> {
        return getModelForClass(PostTag);
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}
