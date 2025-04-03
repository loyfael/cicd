import { Todo } from "./TodoList";

interface TodoItemEditProps {
  todo: Todo;
  onUpdate: (id: number, text: string) => void;
  onCancel: (id: number) => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TodoItemEdit({
  todo,
  onUpdate,
  onCancel,
  onToggle,
  onDelete,
}: TodoItemEditProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedText = (formData.get(`edit-${todo.id}`) as string).trim();

    if (updatedText) {
      onUpdate(todo.id, updatedText);
    } else {
      onCancel(todo.id);
    }
  };

  return (
    <li>
      <input
        type="checkbox"
        name={`todo-${todo.id}`}
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <form onSubmit={handleSubmit} style={{ flex: 1 }}>
        <input
          type="text"
          name={`edit-${todo.id}`}
          defaultValue={todo.text}
          autoFocus
          onBlur={(e) => {
            if (e.target.value.trim()) {
              onUpdate(todo.id, e.target.value.trim());
            } else {
              onCancel(todo.id);
            }
          }}
        />
      </form>
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
