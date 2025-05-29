use axum::{
    routing::{get, post, put, delete},
    Router,
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use serde::{Deserialize, Serialize};
use std::sync::{Mutex, Arc};
use std::collections::HashMap;
use chrono::Utc;
use uuid::Uuid;
use tower_http::cors::{CorsLayer, Any};

// Todo struct with serialization support
#[derive(Serialize, Deserialize, Clone)]
struct Todo {
    id: String,
    title: String,
    completed: bool,
    created_at: String,
}

// In-memory storage for todos
struct TodoStore {
    todos: HashMap<String, Todo>,
}

impl TodoStore {
    fn new() -> Self {
        TodoStore {
            todos: HashMap::new(),
        }
    }

    fn add_todo(&mut self, title: String) -> Todo {
        let id = Uuid::new_v4().to_string();
        let todo = Todo {
            id: id.clone(),
            title,
            completed: false,
            created_at: Utc::now().to_rfc3339(),
        };
        self.todos.insert(id.clone(), todo.clone());
        todo
    }

    fn get_all_todos(&self) -> Vec<&Todo> {
        self.todos.values().collect()
    }

    fn update_todo(&mut self, id: &str, title: Option<String>, completed: Option<bool>) -> Option<Todo> {
        if let Some(todo) = self.todos.get_mut(id) {
            if let Some(title) = title {
                todo.title = title;
            }
            if let Some(completed) = completed {
                todo.completed = completed;
            }
            Some(todo.clone())
        } else {
            None
        }
    }

    fn delete_todo(&mut self, id: &str) -> bool {
        self.todos.remove(id).is_some()
    }
}

// Global state
struct AppState {
    store: Mutex<TodoStore>,
}

// Request/Response structs
#[derive(Deserialize)]
struct TodoCreate {
    title: String,
}

#[derive(Deserialize)]
struct TodoUpdate {
    title: Option<String>,
    completed: Option<bool>,
}

async fn get_todos(
    State(state): State<Arc<AppState>>,
) -> Json<Vec<Todo>> {
    let store = state.store.lock().unwrap();
    let todos: Vec<Todo> = store.get_all_todos().into_iter().cloned().collect();
    Json(todos)
}

async fn create_todo(
    State(state): State<Arc<AppState>>,
    Json(todo): Json<TodoCreate>,
) -> Json<Todo> {
    let mut store = state.store.lock().unwrap();
    let new_todo = store.add_todo(todo.title);
    Json(new_todo)
}

async fn update_todo(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>,
    Json(updates): Json<TodoUpdate>,
) -> Result<Json<Todo>, StatusCode> {
    let mut store = state.store.lock().unwrap();
    match store.update_todo(&id, updates.title, updates.completed) {
        Some(todo) => Ok(Json(todo)),
        None => Err(StatusCode::NOT_FOUND),
    }
}

async fn delete_todo(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> Result<(), StatusCode> {
    let mut store = state.store.lock().unwrap();
    if store.delete_todo(&id) {
        Ok(())
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app_state = Arc::new(AppState {
        store: Mutex::new(TodoStore::new()),
    });

    let app = Router::new()
        .route("/api/todos", get(get_todos))
        .route("/api/todos", post(create_todo))
        .route("/api/todos/:id", put(update_todo))
        .route("/api/todos/:id", delete(delete_todo))
        .layer(cors)
        .with_state(app_state);

    println!("Server running on http://localhost:3000");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
