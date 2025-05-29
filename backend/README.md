# Todo List Backend

A RESTful API backend for the todo list application built with Rust and Rocket.

## Features

- RESTful API endpoints for CRUD operations
- In-memory storage with thread-safe access
- JSON request/response handling
- UUID-based todo identification
- ISO timestamp for creation dates
- Error handling for invalid requests

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/{id}` - Update a todo
- `DELETE /api/todos/{id}` - Delete a todo

## Data Structure

```rust
struct Todo {
    id: String,          // UUID
    title: String,       // Todo title
    completed: bool,     // Completion status
    created_at: String,  // ISO timestamp
}
```

## Getting Started

1. Make sure you have Rust installed (https://rustup.rs/)
2. Navigate to the backend directory
3. Run the development server:
   ```bash
   cargo run
   ```
4. The server will start on `http://localhost:8000`

## Development

The backend is built with:
- Rocket web framework
- Serde for JSON serialization
- UUID for unique identifiers
- Chrono for timestamp handling

## API Usage Examples

### Create a Todo
```bash
curl -X POST http://localhost:8000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Rust"}'
```

### Get All Todos
```bash
curl http://localhost:8000/api/todos
```

### Update a Todo
```bash
curl -X PUT http://localhost:8000/api/todos/{id} \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Delete a Todo
```bash
curl -X DELETE http://localhost:8000/api/todos/{id}
```

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

## Notes

- The backend uses in-memory storage, so todos will be lost when the server restarts
- For production use, consider implementing persistent storage
- CORS is enabled by default for development 