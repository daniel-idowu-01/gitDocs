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

export const isEmpty = (obj) => {
  for (let x in obj) {
    return false;
  }
  return true;
};
