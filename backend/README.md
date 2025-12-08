# Retail Sales Management System - Backend

## Overview
RESTful API for managing retail sales data with advanced search, filtering, sorting, and pagination capabilities.

## Tech Stack
- Node.js
- Express.js
- CSV Parser

## Setup

1. Install dependencies:
```bash
npm install
```

2. Place your `sales_data.csv` file in the `backend/data/` directory

3. Start the server:
```bash
npm run dev
```

## API Endpoints

### GET /api/sales
Get sales data with optional query parameters.

**Query Parameters:**
- `search` - Search by customer name or phone number
- `customerRegion` - Filter by region (comma-separated)
- `gender` - Filter by gender (comma-separated)
- `ageMin` - Minimum age
- `ageMax` - Maximum age
- `productCategory` - Filter by category (comma-separated)
- `tags` - Filter by tags (comma-separated)
- `paymentMethod` - Filter by payment method (comma-separated)
- `dateFrom` - Start date (YYYY-MM-DD)
- `dateTo` - End date (YYYY-MM-DD)
- `sortBy` - Sort field (date, quantity, customerName)
- `sortOrder` - Sort order (asc, desc)
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10)

**Example:**
```
GET /api/sales?search=john&sortBy=date&sortOrder=desc&page=1&pageSize=10
```

### GET /api/sales/filters
Get available filter options (unique values for each filterable field).

## Project Structure
```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── index.js         # Entry point
├── data/                # CSV data files
└── package.json
```

## Features
- Full-text search across customer name and phone
- Multi-select filtering
- Flexible sorting
- Efficient pagination
- In-memory data caching for performance
