# Retail Sales Management System

A full-stack retail sales management application with advanced search, filtering, sorting, and pagination capabilities. Built for handling large-scale sales data efficiently with real-time streaming and memory optimization. Features multiselect filters, debounced search, and responsive design for optimal user experience.

## Tech Stack

**Backend:** Node.js, Express.js, CSV Parser  
**Frontend:** React 18, Vite, Axios  
**Styling:** CSS3

## Search Implementation Summary

Implements case-insensitive full-text search across Customer Name and Phone Number fields. Search uses debouncing (150ms) for performance optimization and works seamlessly with active filters and sorting. The backend performs efficient string matching using lowercase comparison.

## Filter Implementation Summary

Multi-select filtering for Customer Region, Gender, Age Range, Product Category, Payment Method, Order Status, Store Location, and Date Range. Filters use checkbox-based multiselect interface, support case-insensitive matching, and work in combination. All filters maintain state across pagination and sorting operations.

## Sorting Implementation Summary

Supports sorting by Date (Newest/Oldest First), Quantity (High/Low), and Customer Name (A-Z/Z-A). Sorting preserves active search and filter states. Backend implements in-memory sorting with efficient comparison algorithms for optimal performance.

## Pagination Implementation Summary

Fixed page size of 10 items per page with Previous/Next navigation and direct page number selection. Pagination maintains all active search, filter, and sort states. Displays current page, total pages, and total item count. Backend implements efficient slice-based pagination with metadata response.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   Backend runs on `http://localhost:5002`

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

### Access Application
Open `http://localhost:3000` in your browser after starting both servers.

## Architecture Document
Located at: `/docs/architecture.md`
