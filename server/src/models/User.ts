import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import jwt from "jsonwebtoken";

// Disgusting uglyness because typescript doesnt support multiple inheritance...
export interface UserClass extends Base {}

@modelOptions({
  options: { customName: "User" },
  schemaOptions: { collection: "users" },
})
export class UserClass extends TimeStamps {
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
  public withoutPassword(this: DocumentType<UserClass>) {
    const temp = this.toJSON() as UserClass;
    delete temp.password;
    return temp as Omit<UserClass, "password">;
  }

  public generateJWT(this: DocumentType<UserClass>) {
    // prettier-ignore
    return jwt.sign(
      { _id: this._id }, 
      process.env.JWT_SECRET!, 
      { expiresIn: "1h" }
    );
  }
}

export default getModelForClass(UserClass);
