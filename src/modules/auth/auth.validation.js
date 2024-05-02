import joi from "joi";

// register
export const registerSchema = joi
  .object({
    userName: joi.string().min(3).max(20).required().messages({
      "string.base": "Username should be a string",
      "string.empty": "Username is required",
      "string.min": "Username should have at least 3 characters",
      "string.max": "Username should have at most 20 characters",
      "any.required": "Username is required",
    }),
    email: joi
      .string()
      .email({
        minDomainSegments: 2,
        maxDomainSegments: 3,
        tlds: { allow: ["com", "net", "edu", "org"] },
      })
      .required(),
    password: joi
      .string()
      .pattern(
        new RegExp(
          "^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\\d)[A-Za-z\\d!@#$%^&*]{8,}$"
        )
      ) // At least one uppercase, one special character, one digit, and minimum 8 characters
      .required()
      .messages({
        "string.pattern.base":
          "Password should contain at least one uppercase letter, one special character, one digit, and be minimum 8 characters long",
        "any.required": "Password is required",
      }),
    cPassword: joi.string().valid(joi.ref("password")).required().messages({
      "any.only": "Passwords do not match",
      "any.required": "Confirm password is required",
    }),
  })
  .required();

// activate account
export const activateSchema = joi
  .object({
    activationCode: joi.string().required(),
  })
  .required();

// login
export const loginSchema = joi
  .object({
    email: joi
      .string()
      .email({
        minDomainSegments: 2,
        maxDomainSegments: 3,
        tlds: { allow: ["com", "net", "edu", "org"] },
      })
      .required(),
    password: joi.string().required(),
  })
  .required();

// change password
export const changePasswordSchema = joi
  .object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().required(),
    cPassword: joi.string().valid(joi.ref("newPassword")).required(),
  })
  .required();

// change user name
export const changeUserNameSchema = joi.object({
  userName: joi.string().required(),
});

// send forget code
export const sendForgetCodeSchema = joi
  .object({
    email: joi
      .string()
      .email({
        minDomainSegments: 2,
        maxDomainSegments: 3,
        tlds: { allow: ["com", "net", "edu", "org"] },
      })
      .required(),
  })
  .required();

// set forget code
export const setForgetCodeSchema = joi
  .object({
    forgetCode: joi.string().required(),
  })
  .required();

// reset password
export const resetPasswordSchema = joi
  .object({
    forgetCode: joi.string().required(),
    password: joi.string().required(),
    cPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();
