const express = require('express');
const fs = require('fs');
const path = require('path');
const { authenticateToken, requireAdmin } = require('./auth');
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

// Save property data
const savePropertyData = (data) => {
  try {
    const dataPath = path.join(__dirname, '../data/properties.json');
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving property data:', error);
    return false;
  }
};

// Generate unique ID for new properties
const generatePropertyId = () => {
  return new Date().getTime().toString(36) + Math.random().toString(36).substr(2);
};

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

// POST /properties - Create a new property (Admin only)
router.post('/properties', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { platform, furnishing, location, plot_area, rent, security_deposit, specification, tenant_preferred } = req.body;

    // Validate required fields
    if (!platform || !furnishing || !location || !plot_area || !rent || !security_deposit || !specification || !tenant_preferred) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'All fields are required: platform, furnishing, location, plot_area, rent, security_deposit, specification, tenant_preferred',
        requiredFields: ['platform', 'furnishing', 'location', 'plot_area', 'rent', 'security_deposit', 'specification', 'tenant_preferred']
      });
    }

    // Validate platform
    const validPlatforms = ['magicbrix', '99acres', 'housing'];
    if (!validPlatforms.includes(platform.toLowerCase())) {
      return res.status(400).json({
        error: 'Invalid platform',
        message: `Platform must be one of: ${validPlatforms.join(', ')}`
      });
    }

    // Validate rent and security_deposit are numbers
    if (isNaN(rent) || isNaN(security_deposit)) {
      return res.status(400).json({
        error: 'Invalid data type',
        message: 'Rent and security_deposit must be valid numbers'
      });
    }

    // Load existing data
    const propertyData = loadPropertyData();

    // Create new property object
    const newProperty = {
      _id: generatePropertyId(),
      furnishing: furnishing.trim(),
      location: location.trim(),
      plot_area: plot_area.trim(),
      rent: parseInt(rent),
      security_deposit: parseInt(security_deposit),
      specification: specification.trim(),
      tenant_preferred: tenant_preferred.trim(),
      created_at: new Date().toISOString(),
      created_by: req.user.email
    };

    // Initialize platform array if it doesn't exist
    if (!propertyData[platform.toLowerCase()]) {
      propertyData[platform.toLowerCase()] = [];
    }

    // Add new property to the platform
    propertyData[platform.toLowerCase()].push(newProperty);

    // Save updated data
    const saved = savePropertyData(propertyData);
    if (!saved) {
      return res.status(500).json({
        error: 'Save failed',
        message: 'Failed to save the new property'
      });
    }

    // Return success response
    res.status(201).json({
      message: 'Property created successfully',
      property: newProperty,
      platform: platform.toLowerCase()
    });

  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create property'
    });
  }
});

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

module.exports = router; 