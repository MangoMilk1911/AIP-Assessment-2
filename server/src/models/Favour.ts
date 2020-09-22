import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { EmbeddedUserSchema } from "./User";

@modelOptions({ options: { customName: "Favour" } })
export class FavourSchema extends TimeStamps {
  @prop()
  public creator!: EmbeddedUserSchema;

  @prop()
  public debtor!: EmbeddedUserSchema;

  @prop()
  public recipient!: EmbeddedUserSchema;

  @prop({ type: Number })
  public rewards!: Map<string, number>;

  @prop()
  public initialEvidence?: Buffer;

  @prop()
  public evidence?: Buffer;
}

export default getModelForClass(FavourSchema);
