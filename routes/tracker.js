/**
 * Influencer Tracker Routes
 * API endpoints for managing tracked influencers and competitors
 */

const express = require("express")
const { body, validationResult } = require("express-validator")
const logger = require("../utils/logger")

const router = express.Router()

// Mock data store (replace with database in production)
const trackedInfluencers = [
  {
    id: "1",
    handle: "@techguru",
    platform: "youtube",
    category: "influencer",
    isActive: true,
    addedAt: new Date().toISOString(),
    lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    followers: 125000,
    engagementRate: 4.2,
    recentPosts: 3,
    brand: "TechBrand",
  },
  {
    id: "2",
    handle: "@competitor_brand",
    platform: "instagram",
    category: "competitor",
    isActive: true,
    addedAt: new Date().toISOString(),
    lastUpdate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    followers: 89000,
    engagementRate: 3.8,
    recentPosts: 5,
    brand: "CompetitorBrand",
  },
]

/**
 * @route   GET /api/tracker/list
 * @desc    Get all tracked influencers and competitors
 * @access  Public
 */
router.get("/list", (req, res) => {
  try {
    const { category, platform, active } = req.query

    let filtered = [...trackedInfluencers]

    // Apply filters
    if (category) {
      filtered = filtered.filter((item) => item.category === category)
    }
    if (platform) {
      filtered = filtered.filter((item) => item.platform === platform)
    }
    if (active !== undefined) {
      filtered = filtered.filter((item) => item.isActive === (active === "true"))
    }

    // Calculate stats
    const stats = {
      total: trackedInfluencers.length,
      active: trackedInfluencers.filter((item) => item.isActive).length,
      influencers: trackedInfluencers.filter((item) => item.category === "influencer").length,
      competitors: trackedInfluencers.filter((item) => item.category === "competitor").length,
      platforms: {
        youtube: trackedInfluencers.filter((item) => item.platform === "youtube").length,
        instagram: trackedInfluencers.filter((item) => item.platform === "instagram").length,
        linkedin: trackedInfluencers.filter((item) => item.platform === "linkedin").length,
      },
    }

    res.json({
      success: true,
      data: filtered,
      stats,
      metadata: {
        timestamp: new Date().toISOString(),
        filtered: filtered.length,
        total: trackedInfluencers.length,
      },
    })

    logger.info("Tracker list retrieved", {
      total: trackedInfluencers.length,
      filtered: filtered.length,
      filters: { category, platform, active },
    })
  } catch (error) {
    logger.error("Error retrieving tracker list", { error: error.message })
    res.status(500).json({
      success: false,
      message: "Failed to retrieve tracker list",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
})

/**
 * @route   POST /api/tracker/add
 * @desc    Add new influencer or competitor to tracking list
 * @access  Public
 */
router.post(
  "/add",
  [
    body("handle")
      .trim()
      .isLength({ min: 1, max: 50 })
      .matches(/^@?[a-zA-Z0-9._-]+$/)
      .withMessage("Handle must be valid social media username"),
    body("platform")
      .isIn(["youtube", "instagram", "linkedin"])
      .withMessage("Platform must be youtube, instagram, or linkedin"),
    body("category").isIn(["influencer", "competitor"]).withMessage("Category must be influencer or competitor"),
    body("brand").optional().trim().isLength({ max: 100 }).withMessage("Brand name must be less than 100 characters"),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { handle, platform, category, brand } = req.body

      // Check if already exists
      const exists = trackedInfluencers.find(
        (item) => item.handle.toLowerCase() === handle.toLowerCase() && item.platform === platform,
      )

      if (exists) {
        return res.status(409).json({
          success: false,
          message: "This account is already being tracked",
          existing: exists,
        })
      }

      // Create new tracker
      const newTracker = {
        id: Date.now().toString(),
        handle: handle.startsWith("@") ? handle : `@${handle}`,
        platform,
        category,
        brand: brand || null,
        isActive: true,
        addedAt: new Date().toISOString(),
        lastUpdate: "Just added",
        followers: 0,
        engagementRate: 0,
        recentPosts: 0,
      }

      trackedInfluencers.push(newTracker)

      res.status(201).json({
        success: true,
        message: "Tracker added successfully",
        data: newTracker,
      })

      logger.info("New tracker added", {
        handle: newTracker.handle,
        platform,
        category,
        id: newTracker.id,
      })
    } catch (error) {
      logger.error("Error adding tracker", { error: error.message })
      res.status(500).json({
        success: false,
        message: "Failed to add tracker",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      })
    }
  },
)

/**
 * @route   PUT /api/tracker/:id/toggle
 * @desc    Toggle tracking status for an influencer/competitor
 * @access  Public
 */
router.put("/:id/toggle", (req, res) => {
  try {
    const { id } = req.params
    const tracker = trackedInfluencers.find((item) => item.id === id)

    if (!tracker) {
      return res.status(404).json({
        success: false,
        message: "Tracker not found",
      })
    }

    tracker.isActive = !tracker.isActive
    tracker.lastUpdate = new Date().toISOString()

    res.json({
      success: true,
      message: `Tracking ${tracker.isActive ? "enabled" : "disabled"}`,
      data: tracker,
    })

    logger.info("Tracker status toggled", {
      id,
      handle: tracker.handle,
      isActive: tracker.isActive,
    })
  } catch (error) {
    logger.error("Error toggling tracker", { error: error.message })
    res.status(500).json({
      success: false,
      message: "Failed to toggle tracker",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
})

/**
 * @route   DELETE /api/tracker/:id
 * @desc    Remove influencer/competitor from tracking list
 * @access  Public
 */
router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params
    const index = trackedInfluencers.findIndex((item) => item.id === id)

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Tracker not found",
      })
    }

    const removed = trackedInfluencers.splice(index, 1)[0]

    res.json({
      success: true,
      message: "Tracker removed successfully",
      data: removed,
    })

    logger.info("Tracker removed", {
      id,
      handle: removed.handle,
      platform: removed.platform,
    })
  } catch (error) {
    logger.error("Error removing tracker", { error: error.message })
    res.status(500).json({
      success: false,
      message: "Failed to remove tracker",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
})

/**
 * @route   POST /api/tracker/sync
 * @desc    Manually trigger sync for all active trackers
 * @access  Public
 */
router.post("/sync", async (req, res) => {
  try {
    const activeTrackers = trackedInfluencers.filter((item) => item.isActive)

    // Simulate sync process (replace with real API calls)
    const syncPromises = activeTrackers.map(async (tracker) => {
      // Mock data update
      tracker.followers = Math.floor(Math.random() * 100000) + 50000
      tracker.engagementRate = Math.round((Math.random() * 5 + 1) * 10) / 10
      tracker.recentPosts = Math.floor(Math.random() * 10) + 1
      tracker.lastUpdate = new Date().toISOString()

      return tracker
    })

    await Promise.all(syncPromises)

    res.json({
      success: true,
      message: `Synced ${activeTrackers.length} trackers successfully`,
      data: {
        synced: activeTrackers.length,
        timestamp: new Date().toISOString(),
      },
    })

    logger.info("Manual sync completed", {
      trackersSync: activeTrackers.length,
    })
  } catch (error) {
    logger.error("Error during sync", { error: error.message })
    res.status(500).json({
      success: false,
      message: "Sync failed",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
})

module.exports = router
