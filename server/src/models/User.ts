import { getModelForClass, prop } from "@typegoose/typegoose";

class UserSchema {
  @prop({ unique: true, maxlength: 30 })
  public username!: string;

  @prop({ unique: true }) //might want to add validate: Y33T
  public email!: string;

  @prop()
  public password!: string;

  @prop({ maxlength: 30 })
  public firstName!: string;

  @prop({ maxlength: 30 })
  public lastName!: string;

  /*
  @prop()
  public profilePicture!: ImageData;
  */

  /*
  @prop({ default: Date.now() })
  public dateCreated!: Date;
  */

  @prop()
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

export default getModelForClass(UserSchema, {
  schemaOptions: { collection: "users" },
});
