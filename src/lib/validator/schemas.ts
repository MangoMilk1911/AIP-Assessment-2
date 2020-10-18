import { yup } from ".";

// =================== User =====================

export const userValidation = yup.object({
  displayName: yup.string().requiredWhen("$create").trim().min(4).max(30),
  email: yup.string().email().required().trim(),
  password: yup.string().trim().required().min(4),
  passwordRepeat: yup
    .string()
    .requiredWhen("$create")
    .equals([yup.ref("password")], "passwords do not match"),
  photoURL: yup.string().url().optional().trim(),
});
