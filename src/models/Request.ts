import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { EmbeddedUserSchema } from "./User";
import { yup } from "lib/validator";

// ==================== Request ====================

export interface RequestSchema extends Base {}

@modelOptions({ options: { customName: "Request" } })
export class RequestSchema extends TimeStamps {
  @prop()
  public title!: string;

  @prop()
  public description!: string;

  @prop()
  public evidence?: Buffer;

  @prop()
  public owner!: EmbeddedUserSchema;

  @prop()
  public recipient?: EmbeddedUserSchema;

  @prop()
  public noOfContributors!: number;
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
