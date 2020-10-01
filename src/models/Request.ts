import { getModelForClass, modelOptions, prop, Severity } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { EmbeddedUserSchema } from "./User";
import { yup } from "lib/validator";

export type Rewards = { [key: string]: number };

// // ==================== Contribution ====================

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class ContributionSchema {
  @prop()
  public user!: EmbeddedUserSchema;

  @prop()
  public rewards!: Rewards;
}

// ==================== Request ====================

@modelOptions({ options: { customName: "Request" } })
export class RequestSchema extends TimeStamps {
  @prop()
  public title!: string;

  @prop({ type: ContributionSchema, _id: false })
  public contributions!: Map<string, ContributionSchema>;

  @prop()
  public description!: string;

  @prop()
  public evidence?: Buffer;

  @prop()
  public owner!: EmbeddedUserSchema;

  @prop()
  public recipient?: EmbeddedUserSchema;
}

const Request = getModelForClass(RequestSchema);

// ==================== Validation ====================

export const requestValidation = yup.object({
  id: yup.string().isMongoID().optionalWhen("$create").trim(),
  title: yup.string().strict(true).requiredWhen("$create").trim().min(10).max(90),
  description: yup.string().strict(true).requiredWhen("$create").trim().min(20).max(500),
  rewards: yup.object().isRewards().when("$create", {
    is: true,
    then: yup.object().required(),
    otherwise: yup.object().optional(),
  }),
});

export default Request;
