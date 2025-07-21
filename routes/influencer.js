/**
 * Influencer Routes
 * Defines all API endpoints related to influencer analysis
 */

const express = require("express")
const router = express.Router()
const influencerController = require("../controllers/influencerController")

/**
 * @route   POST /api/influencer/analyze
 * @desc    Analyze influencer content for brand sentiment
 * @access  Public
 * @body    { influencer: string, brand: string, platform?: string }
 */
router.post("/analyze", influencerController.analyzeInfluencer)

/**
 * @route   GET /api/influencer/content
 * @desc    Fetch influencer content without analysis
 * @access  Public
 * @query   { influencer: string, platform?: string, limit?: number }
 */
router.get("/content", influencerController.fetchContent)

/**
 * @route   POST /api/influencer/feedback
 * @desc    Submit feedback on AI analysis results
 * @access  Public
 * @body    { influencer: string, brand: string, feedback: string, rating?: number, comments?: string }
 */
router.post("/feedback", influencerController.submitFeedback)

module.exports = router
