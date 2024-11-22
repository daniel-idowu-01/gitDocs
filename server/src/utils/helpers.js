import Joi from "joi";

export const validateGithubUrl = (url) => {
  const githubUrlSchema = Joi.string()
    .uri()
    .pattern(/^https:\/\/github\.com\/[^\/]+\/[^\/]+/, "GitHub repository URL")
    .message(
      'Invalid GitHub URL format. URL should be in the form of "https://github.com/username/repository/...".'
    );

  const { error } = githubUrlSchema.validate(url);

  if (error) {
    return { valid: false, message: error.details[0].message };
  }

  return { valid: true, message: "Valid GitHub URL." };
};

export const validateCreateUser = (user) => {
  const schema = Joi.object({
    username: Joi.string()
      .pattern(new RegExp("^[a-zA-Z_][a-zA-Z0-9_]{1,19}$"))
      .required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(
        new RegExp(
          /^(?=.*[0-9])(?=.*[!@#$%^&*?_\-.,?!:;'“”()\[\]{}+\-×*÷\/=$&*@#%^_|/<>=])[a-zA-Z0-9!@#$%^&*?_\-.,?!:;'“”()\[\]{}+\-×*÷\/=$&*@#%^_|/<>=]{8,30}$/
        )
      )
      .required(),
    roleId: Joi.string().hex().length(24).optional(),
  });

  const { error } = schema.validate(user);

  if (error) {
    return { valid: false, message: error.details[0].message };
  }

  return { valid: true, message: "Valid GitHub URL." };
};

export const isEmpty = (obj) => {
  for (let x in obj) {
    return false;
  }
  return true;
};
