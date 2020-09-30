import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { isValidObjectId } from "mongoose";
import * as yup from "yup";
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

// ========== Validation ========== //

const isMongoId = yup
  .string()
  .required()
  .matches(new RegExp("^[0-9a-fA-F]{24}$"));

export const checkIdValidation = yup.object({
  id: isMongoId,
});

export const createFavourValidation = yup.object({
  debtor: yup.string().required(),
  recipient: yup.string().required(),
  rewards: yup.object().required(),
  initialEvidence: yup.string(),
  // .test("isBuffer ", "Must contain Buffer", (value) => {
  //   const buffer = Buffer.from(value);
  //   return Buffer.isBuffer(buffer);
  // }),
});

export const updateFavourRewardsValidation = yup.object({
  id: isMongoId,
  rewards: yup.object().required(),
});

export const updateFavourEvidenceValidation = yup.object({
  id: isMongoId,
  evidence: yup.string().test("isBuffer ", "Must contain buffer", (value) => {
    const buffer = Buffer.from(value);
    return Buffer.isBuffer(buffer);
  }),
});

export const deleteFavourValidation = yup.object({
  id: isMongoId,
  favour: yup.object().required(),
});
