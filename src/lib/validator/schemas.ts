import { yup } from ".";

// =================== User =====================

export const userValidation = yup.object({
  displayName: yup
    .string()
    .formLabel("Display Name")
    .when("$create", {
      is: true,
      then: yup.string().required().trim().min(4).max(30),
    }),
  email: yup.string().formLabel("Email").email().required().trim(),
  password: yup.string().formLabel("Password").trim().required().min(4),
  passwordRepeat: yup
    .string()
    .formLabel("Password Repeat")
    .when("$create", {
      is: true,
      then: yup
        .string()
        .required()
        .equals([yup.ref("password")], "Passwords do not match"),
    }),
  photoURL: yup.string().url().optional().trim(),
});

// ==================== Validation ====================

export const requestValidation = yup.object({
  id: yup.string().isMongoID().trim().when("$create", {
    is: true,
    then: yup.string().optional(),
  }),
  title: yup.string().strict(true).trim().min(10).max(90).when("$create", {
    is: true,
    then: yup.string().required(),
  }),
  description: yup.string().strict(true).trim().min(20).max(500).when("$create", {
    is: true,
    then: yup.string().required(),
  }),
  rewards: yup.object().isRewards().when("$create", {
    is: true,
    then: yup.object().required(),
    otherwise: yup.object().optional(),
  }),
});
