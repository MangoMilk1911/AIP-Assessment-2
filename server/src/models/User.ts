import {
  getModelForClass,
  modelOptions,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

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

  /**
   * Util function for validation
   * @param userId
   */
  public static async exists(
    this: ReturnModelType<typeof UserClass>,
    userId: string
  ) {
    const foundUser = await this.findById(userId);
    if (!foundUser) throw new Error("No User with that ID exists.");
  }
}

export default getModelForClass(UserClass);
