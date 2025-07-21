/**
 * Request Validation Utilities
 * Handles input validation using Joi
 */

const Joi = require("joi")

/**
 * Validate influencer analysis request
 * @param {Object} data - Request body data
 * @returns {Object} Joi validation result
 */
function validateAnalysisRequest(data) {
  const schema = Joi.object({
    influencer: Joi.string()
      .trim()
      .min(1)
      .max(50)
      .pattern(/^[a-zA-Z0-9._-]+$/)
      .required()
      .messages({
        "string.pattern.base": "Influencer username can only contain letters, numbers, dots, underscores, and hyphens",
        "string.min": "Influencer username must be at least 1 character long",
        "string.max": "Influencer username cannot exceed 50 characters",
      }),

    brand: Joi.string().trim().min(1).max(100).required().messages({
      "string.min": "Brand name must be at least 1 character long",
      "string.max": "Brand name cannot exceed 100 characters",
    }),

    platform: Joi.string().valid("instagram", "youtube", "tiktok", "twitter").default("instagram").messages({
      "any.only": "Platform must be one of: instagram, youtube, tiktok, twitter",
    }),

    limit: Joi.number().integer().min(1).max(50).default(10).messages({
      "number.min": "Limit must be at least 1",
      "number.max": "Limit cannot exceed 50",
    }),
  })

  return schema.validate(data, { abortEarly: false })
}

/**
 * Validate feedback submission request
 * @param {Object} data - Request body data
 * @returns {Object} Joi validation result
 */
function validateFeedbackRequest(data) {
  const schema = Joi.object({
    influencer: Joi.string().trim().required(),
    brand: Joi.string().trim().required(),
    analysisId: Joi.string().optional(),
    feedback: Joi.string().valid("positive", "negative", "neutral").required(),
    rating: Joi.number().integer().min(1).max(5).optional(),
    comments: Joi.string().max(1000).optional().allow(""),
  })

  return schema.validate(data, { abortEarly: false })
}

module.exports = {
  validateAnalysisRequest,
  validateFeedbackRequest,
}
