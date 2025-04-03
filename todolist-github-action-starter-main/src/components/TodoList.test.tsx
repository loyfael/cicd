import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TodoList } from "./TodoList";

describe("TodoList", () => {
  it("devrait ajouter une nouvelle tâche", () => {
    render(<TodoList />);

    const input = screen.getByPlaceholderText("Nouvelle tâche");
    const addButton = screen.getByText("Ajouter");

    fireEvent.change(input, { target: { value: "Nouvelle tâche test" } });
    fireEvent.click(addButton);

    expect(screen.getByText("Nouvelle tâche test")).toBeInTheDocument();
  });

  it("devrait marquer une tâche comme complétée", () => {
    render(<TodoList />);

    // Ajouter une tâche
    const input = screen.getByPlaceholderText("Nouvelle tâche");
    const addButton = screen.getByText("Ajouter");
    fireEvent.change(input, { target: { value: "Tâche à compléter" } });
    fireEvent.click(addButton);

    // Marquer comme complétée
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it("devrait supprimer une tâche", () => {
    render(<TodoList />);

    // Ajouter une tâche
    const input = screen.getByPlaceholderText("Nouvelle tâche");
    const addButton = screen.getByText("Ajouter");
    fireEvent.change(input, { target: { value: "Tâche à supprimer" } });
    fireEvent.click(addButton);

    // Supprimer la tâche
    const deleteButton = screen.getByTitle("Supprimer");
    fireEvent.click(deleteButton);

    expect(screen.queryByText("Tâche à supprimer")).not.toBeInTheDocument();
  });
});
