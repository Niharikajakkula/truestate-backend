# Retail Sales Management System - Frontend

## Overview
React-based frontend for the Retail Sales Management System with advanced search, filtering, sorting, and pagination.

## Tech Stack
- React 18
- Vite
- Axios
- CSS3

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will run on `http://localhost:3000`

## Features

### Search
- Full-text search across customer name and phone number
- Real-time search with debouncing
- Clear search functionality

### Filters
- Multi-select filters for:
  - Customer Region
  - Gender
  - Product Category
  - Tags
  - Payment Method
- Range filters for:
  - Age (min/max)
  - Date (from/to)
- Clear all filters option

### Sorting
- Sort by Date (Newest/Oldest First)
- Sort by Quantity (High/Low)
- Sort by Customer Name (A-Z/Z-A)

### Pagination
- 10 items per page
- Next/Previous navigation
- Page number selection
- Total items count

## Project Structure
```
frontend/
├── src/
│   ├── components/      # React components
│   │   ├── SearchBar.jsx
│   │   ├── FilterPanel.jsx
│   │   ├── SalesTable.jsx
│   │   ├── SortDropdown.jsx
│   │   └── Pagination.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── styles/          # CSS files
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/
├── index.html
└── package.json
```

## API Integration
The frontend connects to the backend API at `http://localhost:5000/api`

Endpoints used:
- `GET /api/sales` - Fetch sales data
- `GET /api/sales/filters` - Get filter options
