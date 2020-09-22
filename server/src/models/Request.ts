import { prop, modelOptions, getModelForClass } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { EmbeddedUserSchema } from "./User";

// ==================== Contribution ====================

export class ContributionSchema {
  @prop()
  public user!: EmbeddedUserSchema;

  @prop({ type: Number })
  public rewards!: Map<string, number>;
}

// ==================== Request ====================

@modelOptions({ options: { customName: "Request" } })
export class RequestSchema extends TimeStamps {
  @prop()
  public title!: string;

  @prop({ type: [ContributionSchema], _id: false })
  public contributions!: ContributionSchema[];

  @prop()
  public description!: string;

  @prop()
  public evidence?: Buffer;

  @prop()
  public recipient?: EmbeddedUserSchema;
}

export default getModelForClass(RequestSchema);
