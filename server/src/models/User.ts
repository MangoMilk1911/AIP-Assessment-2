import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@modelOptions({
  schemaOptions: { collection: "users" },
})
class User extends TimeStamps {
  @prop({
    index: true,
    unique: true,
    maxlength: 30,
    set: (val: string) => val.toLowerCase(),
    get: (val: string) => val,
  })
  public username!: string;

  @prop({ index: true, unique: true }) // TODO: Add validation
  public email!: string;

  @prop()
  public password!: string;

  @prop()
  public profilePicture?: Buffer;
}

export default getModelForClass(User);
