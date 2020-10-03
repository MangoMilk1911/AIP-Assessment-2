import * as yup from "yup";
import { isValidObjectId } from "mongoose";
import { NextApiRequest } from "next";
import { Rewards } from "models/Contribution";

// =================== Assign custom validators =====================

declare module "yup" {
  interface ObjectSchema<T> {
    isRewards(): yup.ObjectSchema<Rewards>;
  }

  interface StringSchema<T> {
    isMongoID(): yup.StringSchema<T>;
    requiredWhen(conext: string): yup.StringSchema<T>;
    optionalWhen(conext: string): yup.StringSchema<T>;
  }
}

yup.addMethod(yup.object, "isRewards", function (this: yup.ObjectSchema) {
  return this.strict(true).test("isReward", "${path} must be a map of numbers", (val) => {
    if (!val) return true; // Allow for omitted rewards

    const quantities = Object.values(val);
    if (quantities.length === 0) return false;
    return !quantities.some((quantity) => typeof quantity !== "number");
  });
});

yup.addMethod(yup.string, "isMongoID", function (this: yup.StringSchema) {
  return this.strict(true).test("isMongoID", "${path} is not a valid Object ID", function (val) {
    return isValidObjectId(val);
  });
});

yup.addMethod(yup.string, "requiredWhen", function (this: yup.StringSchema, context: string) {
  return this.when(context, {
    is: true,
    then: this.required(),
    otherwise: this.optional(),
  });
});

yup.addMethod(yup.string, "optionalWhen", function (this: yup.StringSchema, context: string) {
  return this.when(context, {
    is: true,
    then: this.optional(),
    otherwise: this.required(),
  });
});

// Re-export yup and use this reference to ensure custom validators are assigned
export { yup };

type ValidatorActions = "create";

export default function createValidator<T>(schema: yup.Schema<T>) {
  return function (req: NextApiRequest, action?: ValidatorActions) {
    return schema.validate(
      { ...req.query, ...req.body },
      { abortEarly: false, stripUnknown: true, context: { [action]: true } }
    );
  };
}
