const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Load property data
const loadPropertyData = () => {
  try {
    const dataPath = path.join(__dirname, '../data/properties.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading property data:', error);
    return {};
  }
};

// GET /:platformName - Get all properties for a specific platform
router.get('/:platformName', (req, res) => {
  try {
    const { platformName } = req.params;
    const propertyData = loadPropertyData();
    
    // Check if platform exists
    if (!propertyData[platformName]) {
      return res.status(404).json({
        error: 'Platform not found',
        message: `Platform '${platformName}' is not available. Available platforms: ${Object.keys(propertyData).join(', ')}`
      });
    }
    
    const properties = propertyData[platformName];
    
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch properties'
    });
  }
});

// GET / - Get all platforms and their property counts
router.get('/', (req, res) => {
  try {
    const propertyData = loadPropertyData();
    const platformSummary = {};
    
    Object.keys(propertyData).forEach(platform => {
      platformSummary[platform] = {
        platform: platform,
        propertyCount: propertyData[platform].length,
        endpoint: `/${platform}`
      };
    });
    
    res.json({
      message: 'Rental Property API',
      availablePlatforms: platformSummary,
      usage: 'Use GET /:platformName to fetch properties for a specific platform'
    });
  } catch (error) {
    console.error('Error fetching platform summary:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch platform information'
    });
  }
});

module.exports = router; 