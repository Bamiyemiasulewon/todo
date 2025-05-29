# Todo App with Rust Backend

A full-stack Todo application with a Rust backend using Axum and a vanilla JavaScript frontend.

## Features

- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- Filter todos (all/active/completed)
- Real-time updates
- Clean and modern UI

## Tech Stack

### Backend
- Rust
- Axum (Web Framework)
- Tokio (Async Runtime)
- Serde (Serialization)
- UUID (Unique IDs)

### Frontend
- Vanilla JavaScript
- HTML5
- CSS3

## Getting Started

### Prerequisites
- Rust (latest stable version)
- A web browser
- Git

### Running the Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Run the server:
```bash
cargo run
```

The backend server will start at `http://localhost:3000`

### Running the Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Serve the static files using any static file server. For example, with Python:
```bash
python -m http.server 8080
```

The frontend will be available at `http://localhost:8080`

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## License

MIT 