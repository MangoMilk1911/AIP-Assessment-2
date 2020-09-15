import { getModelForClass, prop, DocumentType } from "@typegoose/typegoose";

class UserSchema {
  @prop({ unique: true, maxlength: 30 })
  public username!: string;

  @prop()
  public profile_picture!: number;

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
