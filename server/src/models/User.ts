import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export interface UserClass extends Base<string> {}

@modelOptions({
  options: { customName: "User" },
  schemaOptions: { collection: "users" },
})
export class UserClass extends TimeStamps {
  @prop()
  public _id!: string;

  @prop()
  public email!: string;

  @prop()
  public displayName!: string;

  @prop()
  public photoURL?: string;
}

export default getModelForClass(UserClass);
