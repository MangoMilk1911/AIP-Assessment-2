import {
  getModelForClass,
  prop,
  DocumentType,
  ReturnModelType,
} from "@typegoose/typegoose";

class UserSchema {
  @prop()
  public name!: string;

  @prop()
  public favNumber?: number;

  // Example of an instance method
  public static async someInstanceMethod(
    this: DocumentType<typeof UserSchema>,
    someParam: string
  ) {
    return this.name + " is an oi! " + someParam;
  }

  public static async exists(
    this: ReturnModelType<typeof UserSchema>,
    val: string
  ) {
    const foundUser = await this.findById(val);
    if (!foundUser) throw new Error("No User with that ID exists.");
  }
}

export default getModelForClass(UserSchema, {
  schemaOptions: { collection: "users" },
});
