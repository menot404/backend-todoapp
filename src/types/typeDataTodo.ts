export type TodoPriority = "Haute" | "Moyenne" | "Base";
export type TodoCategory = "Etude" | "Projet" | "Perso";
export type TodoState = "En cours" | "Terminée" | "En attente";

export interface typeDataTodo {
    id: string;
    title: string;
    category: TodoCategory;
    priority: TodoPriority;
    deadline: string; // ISO 8601 date string
    state: TodoState;
    createdAt: string; // ISO 8601 date string
    updatedAt?: string; // ISO 8601 date string
}

export interface CreateTodoDTO {
    title: string;
    category: TodoCategory;
    priority: TodoPriority;
    deadline: string;
}

export interface UpdateTodoDTO {
    title?: string;
    category?: TodoCategory;
    priority?: TodoPriority;
    deadline?: string;
    state?: TodoState;
}
