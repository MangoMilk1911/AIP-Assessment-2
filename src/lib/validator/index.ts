import * as yup from "yup";
import { isValidObjectId } from "mongoose";
import { NextApiRequest } from "next";

// =================== Assign custom validators =====================

declare module "yup" {
  interface StringSchema<T> {
    isMongoID(): yup.StringSchema<T>;
    requiredWhen(conext: string): yup.StringSchema<T>;
    optionalWhen(conext: string): yup.StringSchema<T>;
  }
}

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

// =================== Validator HOF =====================

type ValidatorActions = "create";

export default function createValidator<T>(schema: yup.Schema<T>) {
  return function (req: NextApiRequest, action?: ValidatorActions) {
    return schema.validate(
      { ...req.query, ...req.body },
      { abortEarly: false, stripUnknown: true, context: { [action]: true } }
    );
  };
}

// Re-export yup and use this reference to ensure custom validators are assigned
export { yup };
