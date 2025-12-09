# Architecture Document

## Backend Architecture

### Layered Structure
```
Controllers → Services → Utils → Data Layer
```

**Controllers** (`backend/src/controllers/`)
- Handle HTTP requests and responses
- Validate input parameters
- Format API responses
- Error handling and logging

**Services** (`backend/src/services/`)
- Business logic implementation
- Data processing orchestration
- Response formatting

**Utils** (`backend/src/utils/`)
- Streaming CSV data loader
- Search and filter algorithms
- Sorting and pagination logic

**Routes** (`backend/src/routes/`)
- API endpoint definitions
- Route-to-controller mapping
- Middleware configuration

### API Endpoints
- `GET /api/sales` - Retrieve sales data with filtering, search, sort, pagination
- `GET /api/sales/filters` - Get available filter options

## Frontend Architecture

### Component Structure
```
App (Main Container)
├── Sidebar (Navigation)
├── SearchBar (Search Input)
├── FilterBar (Multi-select Filters)
├── SummaryCards (Metrics Display)
├── SalesTable (Data Grid)
├── Pagination (Page Navigation)
└── SortDropdown (Sort Controls)
```

**State Management**
- React hooks for local component state
- Centralized query state in App component
- Effect-based data fetching with debouncing

**Services** (`frontend/src/services/`)
- API client configuration
- HTTP request handling
- Error management

## Data Flow

```
User Interaction → Component State → API Request → Backend Processing → Response → UI Update
```

1. User interacts with search/filter/sort components
2. Component state updates trigger debounced effects
3. API requests sent with query parameters
4. Backend streams CSV data and applies filters
5. Processed results returned with pagination metadata
6. Frontend updates data state and re-renders components

## Folder Structure

```
truestate-assignment/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic
│   │   └── utils/           # Data processing utilities
│   ├── data/                # CSV data files
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API client
│   │   ├── styles/          # CSS files
│   │   └── App.jsx          # Main application
│   ├── public/              # Static assets
│   └── package.json
└── docs/
    └── architecture.md      # This document
```

## Module Responsibilities

### Backend Modules

**StreamingDataLoader** (`utils/streamingDataLoader.js`)
- CSV file streaming and parsing
- Memory-efficient data processing
- Filter options caching
- Search and filter application

**SalesController** (`controllers/salesController.js`)
- HTTP request validation
- Query parameter parsing
- Response formatting
- Error handling

**SalesRoutes** (`routes/salesRoutes.js`)
- API endpoint routing
- Middleware configuration
- Route-to-controller mapping

### Frontend Modules

**App.jsx**
- Central state management
- API orchestration
- Component coordination
- Effect-based data fetching

**FilterBar.jsx**
- Multi-select filter interface
- Dropdown positioning
- Filter state management
- Checkbox interactions

**SalesTable.jsx**
- Data grid rendering
- Row formatting
- Loading states
- Responsive design

**API Service** (`services/api.js`)
- HTTP client configuration
- Request/response handling
- Error management
- Base URL configuration
