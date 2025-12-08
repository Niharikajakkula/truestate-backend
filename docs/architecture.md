# Retail Sales Management System - Architecture

## System Overview
A full-stack web application for managing retail sales data with advanced search, filtering, sorting, and pagination capabilities.

## Architecture Diagram
```
┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │
│   Frontend      │◄───────►│    Backend      │
│   (React)       │  HTTP   │   (Express)     │
│                 │         │                 │
└─────────────────┘         └─────────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │   CSV Data      │
                            │   (In-Memory)   │
                            └─────────────────┘
```

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Data Processing**: csv-parser
- **CORS**: cors middleware

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Styling**: CSS3

## Backend Architecture

### Layered Structure
```
Controllers → Services → Models
```

#### Controllers (`src/controllers/`)
- Handle HTTP requests and responses
- Validate input parameters
- Format responses
- Error handling

#### Services (`src/services/`)
- Business logic implementation
- Search algorithm
- Filter logic
- Sorting implementation
- Pagination logic

#### Models (`src/models/`)
- Data storage (in-memory)
- Data access layer

#### Routes (`src/routes/`)
- API endpoint definitions
- Route-to-controller mapping

#### Utils (`src/utils/`)
- CSV data loader
- Helper functions

### API Endpoints

#### GET /api/sales
Retrieve sales data with optional query parameters.

**Query Parameters:**
- `search` (string): Search term for customer name or phone
- `customerRegion` (string): Comma-separated regions
- `gender` (string): Comma-separated genders
- `ageMin` (number): Minimum age
- `ageMax` (number): Maximum age
- `productCategory` (string): Comma-separated categories
- `tags` (string): Comma-separated tags
- `paymentMethod` (string): Comma-separated payment methods
- `dateFrom` (string): Start date (YYYY-MM-DD)
- `dateTo` (string): End date (YYYY-MM-DD)
- `sortBy` (string): Field to sort by (date, quantity, customerName)
- `sortOrder` (string): Sort direction (asc, desc)
- `page` (number): Page number (default: 1)
- `pageSize` (number): Items per page (default: 10)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalItems": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET /api/sales/filters
Get available filter options.

**Response:**
```json
{
  "customerRegions": [...],
  "genders": [...],
  "productCategories": [...],
  "tags": [...],
  "paymentMethods": [...]
}
```

## Frontend Architecture

### Component Structure
```
App
├── SearchBar
├── FilterPanel
├── SortDropdown
├── SalesTable
└── Pagination
```

### State Management
- Local component state using React hooks
- Centralized query state in App component
- Effect-based data fetching

### Data Flow
1. User interacts with UI components
2. Component updates local state
3. State change triggers effect in App
4. API call made with updated parameters
5. Response updates sales data and pagination
6. UI re-renders with new data

## Key Features Implementation

### Search
- Case-insensitive matching
- Searches across customer name and phone number
- Debounced input for performance

### Filtering
- Multi-select checkboxes for categorical data
- Range inputs for numerical/date data
- Filters work in combination
- State preserved across operations

### Sorting
- Three sort fields: date, quantity, customer name
- Ascending/descending order
- Maintains active filters and search

### Pagination
- Fixed page size (10 items)
- Smart page number display
- Previous/Next navigation
- Total count display

## Data Processing Pipeline

```
Raw CSV Data
    ↓
Load & Parse
    ↓
In-Memory Storage
    ↓
Apply Search Filter
    ↓
Apply Multi-Filters
    ↓
Apply Sorting
    ↓
Apply Pagination
    ↓
Return Results
```

## Performance Considerations

### Backend
- In-memory data storage for fast access
- Efficient filtering algorithms
- Single-pass data processing where possible

### Frontend
- Component-level optimization
- Minimal re-renders
- Efficient state updates
- Responsive design

## Security Considerations
- CORS enabled for cross-origin requests
- Input validation on backend
- Error handling and logging
- No sensitive data exposure

## Scalability Notes

### Current Implementation
- In-memory data storage
- Suitable for datasets up to ~100K records
- Single-server deployment

### Future Enhancements
- Database integration (PostgreSQL/MongoDB)
- Server-side caching (Redis)
- API rate limiting
- Load balancing
- Microservices architecture

## Deployment

### Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Production
```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run build
```

## Testing Strategy
- Unit tests for services and utilities
- Integration tests for API endpoints
- Component tests for React components
- E2E tests for critical user flows

## Monitoring & Logging
- Console logging for development
- Error tracking
- Performance monitoring
- API request logging
