import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { isValidObjectId } from "mongoose";
import * as yup from "yup";
import { EmbeddedUserSchema } from "./User";

// ==================== Contribution ====================

export class ContributionSchema {
  @prop()
  public user!: EmbeddedUserSchema;

  @prop({ type: Number })
  public rewards!: Map<string, number>;
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

// const isMongoId = yup
//   .string()
//   .test("isMongoId", "${path} is not a valid Mongo ObjectId", isValidObjectId);
const isMongoId = yup
  .string()
  .required()
  .matches(new RegExp("^[0-9a-fA-F]{24}$"));

export const createRequestValidation = yup.object({
  title: yup.string().min(10).max(90).required().trim(),
  description: yup.string().min(20).max(500).required().trim(),
  initRewards: yup.object().required(),
});

export const updateRequestValidation = yup.object({
  id: isMongoId,
  title: yup.string().min(10).max(90).optional().trim(),
  description: yup.string().min(20).max(500).optional().trim(),
});

export const checkIdValidation = yup.object({
  id: isMongoId,
});

export const updateContributionValidation = yup.object({
  id: isMongoId,
  newRewards: yup.object().required(),
});

export const addContributionValidation = yup.object({
  id: isMongoId,
  additionalRewards: yup.object().required(),
});
