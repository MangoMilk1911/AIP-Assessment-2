import { getModelForClass, prop, DocumentType } from "@typegoose/typegoose";

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
}

export default getModelForClass(UserSchema, {
  schemaOptions: { collection: "users" },
});
