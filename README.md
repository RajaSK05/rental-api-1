# Rental Property API

A Node.js/Express API for fetching rental property data from different platforms (MagicBrix, 99acres, Housing.com).

## Features

- Get all rental properties from specific platforms
- JSON-based data storage
- RESTful API endpoints
- Error handling and validation
- CORS enabled for cross-origin requests from localhost frontends
- Support for multiple development ports (3000, 3001, 4000, 5000, 8000, 8080)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### GET /
Lists all available platforms with property counts and endpoints.

**Response:**
```json
{
  "message": "Rental Property API",
  "availablePlatforms": {
    "magicbrix": {
      "platform": "magicbrix",
      "propertyCount": 3,
      "endpoint": "/magicbrix"
    },
    "99acres": {
      "platform": "99acres",
      "propertyCount": 3,
      "endpoint": "/99acres"
    },
    "housing": {
      "platform": "housing",
      "propertyCount": 3,
      "endpoint": "/housing"
    }
  },
  "usage": "Use GET /:platformName to fetch properties for a specific platform"
}
```

### GET /:platform-name
Get all properties from a specific platform.

**Supported platforms:**
- `magicbrix`
- `99acres`
- `housing`

**Example requests:**
```bash
GET /magicbrix
GET /99acres
GET /housing
```

**Response:**
```json
[
  {
    "_id": "660a4cfc26359788e3806e9b",
    "furnishing": "Semi-Furnished",
    "location": "Athipalayam, Coimbatore",
    "plot_area": "3049 sqft",
    "rent": 16000,
    "security_deposit": 60000,
    "specification": "2 BHK",
    "tenant_preferred": "Bachelors/Family"
  }
]
```

### GET /health
Health check endpoint to verify API status.

**Response:**
```json
{
  "status": "OK",
  "message": "Rental Property API is running",
  "timestamp": "2025-09-15T10:30:00.000Z"
}
```

## Error Responses

### 404 - Platform Not Found
```json
{
  "error": "Platform not found",
  "message": "Platform 'invalidplatform' is not available. Available platforms: magicbrix, 99acres, housing"
}
```

### 500 - Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Failed to fetch properties"
}
```

## Data Structure

Properties are stored in `/data/properties.json` with the following structure:

```json
{
  "platform_name": [
    {
      "_id": "unique_id",
      "furnishing": "Semi-Furnished|Fully-Furnished|Unfurnished",
      "location": "Area, City",
      "plot_area": "X sqft",
      "rent": number,
      "security_deposit": number,
      "specification": "X BHK",
      "tenant_preferred": "Bachelors|Family|Bachelors/Family"
    }
  ]
}
```

## Project Structure

```
be-api/
├── data/
│   └── properties.json     # Property data storage
├── routes/
│   └── properties.js       # API route handlers
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
└── README.md             # Documentation
```

## CORS Configuration

The API is configured to allow cross-origin requests from common localhost development ports:

- `http://localhost:3000` - `http://localhost:8080`
- `http://127.0.0.1:3000` - `http://127.0.0.1:8080`

**For Production Deployment:**
Update the `corsOptions.origin` array in `server.js` to include your production domain:

```javascript
origin: [
  // ... existing localhost entries
  'https://yourdomain.com',
  'https://www.yourdomain.com'
]
```

## Usage Examples

```bash
# Get all platforms
curl http://localhost:3000/

# Get MagicBrix properties
curl http://localhost:3000/magicbrix

# Get 99acres properties
curl http://localhost:3000/99acres

# Get Housing.com properties
curl http://localhost:3000/housing

# Health check
curl http://localhost:3000/health
``` 