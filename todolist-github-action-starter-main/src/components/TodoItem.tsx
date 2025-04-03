import { Todo } from "./TodoList";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onStartEdit: (id: number) => void;
}

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onStartEdit,
}: TodoItemProps) {
  return (
    <li>
      <input
        type="checkbox"
        name={`todo-${todo.id}`}
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span
        style={{
          textDecoration: todo.completed ? "line-through" : "none",
        }}
        onDoubleClick={() => onStartEdit(todo.id)}
      >
        {todo.text}
      </span>
      <div className="todo-actions">
        <button
          type="button"
          className="delete-button"
          onClick={() => onDelete(todo.id)}
          title="Supprimer"
        >
          🗑️
        </button>
      </div>
    </li>
  );
}
