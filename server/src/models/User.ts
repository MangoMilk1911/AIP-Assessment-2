import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
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

  @prop({ select: false }) // Don't include password by default
  public password?: string;

  @prop()
  public profilePicture?: Buffer;

  /**
   * Return the document data excluding the password field.
   *
   * @param this the User Document Object
   */
  public withoutPassword(this: DocumentType<User>) {
    const temp = this.toJSON() as User;
    delete temp.password;
    return temp as Omit<User, "password">;
  }
}

export default getModelForClass(User);
