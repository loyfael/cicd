import { useState } from "react";
import { TodoItem } from "./TodoItem";
import { TodoItemEdit } from "./TodoItemEdit";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  isEditing?: boolean;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTodoText = (formData.get("newTodo") as string).trim();

    if (!newTodoText) return;

    setTodos([
      ...todos,
      { id: Date.now(), text: newTodoText, completed: false },
    ]);

    (e.currentTarget as HTMLFormElement).reset();
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEdit = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: true } : todo
      )
    );
  };

  const updateTodo = (id: number, text: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text, isEditing: false } : todo
      )
    );
  };

  const cancelEdit = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: false } : todo
      )
    );
  };

  return (
    <div className="todo-list">
      <h1>Ma Liste de Tâches</h1>
      <form className="add-todo" onSubmit={addTodo}>
        <input type="text" name="newTodo" placeholder="Nouvelle tâche" />
        <button type="submit">Ajouter</button>
      </form>
      <ul>
        {todos.map((todo) =>
          todo.isEditing ? (
            <TodoItemEdit
              key={todo.id}
              todo={todo}
              onUpdate={updateTodo}
              onCancel={cancelEdit}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ) : (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onStartEdit={startEdit}
            />
          )
        )}
      </ul>
    </div>
  );
}
