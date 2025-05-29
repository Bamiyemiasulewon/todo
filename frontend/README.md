# Todo List Frontend

A modern, responsive todo list application built with HTML, CSS, and JavaScript.

## Features

- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- Filter todos (All, Active, Completed)
- Clear completed todos
- Edit todos inline (double-click to edit)
- Responsive design
- Loading states and error handling
- Success/error notifications
- Keyboard shortcuts (Enter to save, Esc to cancel)

## Getting Started

1. Make sure the backend server is running on `http://localhost:8000`
2. Open `index.html` in your web browser
3. Start managing your todos!

## Usage

- **Add Todo**: Type in the input field and press Enter or click Add
- **Complete Todo**: Click the checkbox next to a todo
- **Edit Todo**: Double-click the todo text
- **Delete Todo**: Click the × button that appears when hovering over a todo
- **Filter Todos**: Use the filter buttons (All, Active, Completed)
- **Clear Completed**: Click the "Clear completed" button

## Keyboard Shortcuts

- **Enter**: Save changes when editing a todo
- **Esc**: Cancel editing a todo

## Browser Support

The application works in all modern browsers that support:
- ES6+ JavaScript
- CSS Grid and Flexbox
- Fetch API

## Development

The frontend is built with vanilla JavaScript and doesn't require any build tools. Simply edit the files:

- `index.html`: Main HTML structure
- `style.css`: Styling and layout
- `script.js`: Application logic and API communication

## API Integration

The frontend expects a REST API with the following endpoints:

- `GET /api/todos`: Get all todos
- `POST /api/todos`: Create a new todo
- `PUT /api/todos/{id}`: Update a todo
- `DELETE /api/todos/{id}`: Delete a todo

## Error Handling

The application includes:
- Loading states during API calls
- Error messages for failed operations
- Success notifications for completed actions
- Automatic error message dismissal after 3 seconds 