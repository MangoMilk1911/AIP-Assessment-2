import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { getModelForClass, modelOptions, prop, Severity } from "@typegoose/typegoose";
import { EmbeddedUserSchema } from "./User";
import { yup } from "utils/validator";

export type Rewards = { [key: string]: number };

// ==================== Contribution ====================

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class ContributionSchema {
  @prop()
  public user!: EmbeddedUserSchema;

  @prop()
  public rewards!: Rewards;
}

// ==================== Request ====================

export interface RequestSchema extends Base {}

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

// ==================== Validation ====================

export const requestValidation = yup.object({
  id: yup.string().isMongoID().requiredWhen("$update").trim(),
  title: yup.string().requiredWhen("$create").trim().min(10).max(90),
  description: yup.string().requiredWhen("$create").trim().min(20).max(500),
  rewards: yup.object().isRewards().when("$create", {
    is: true,
    then: yup.object().required(),
    otherwise: yup.object().optional(),
  }),
});
