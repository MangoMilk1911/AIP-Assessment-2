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
