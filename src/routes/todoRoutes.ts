import { Router } from "express";
import {
    getAllTodos,
    getTodoById,
    getTodosByCategory,
    createTodo,
    updateTodo,
    completeTodo,
    deleteTodo,
    getTodoStats,
} from "../controllers/todoController";

const router = Router();

// GET - Récupère toutes les tâches (avec filtre optionnel)
router.get("/", getAllTodos);

// GET - Statistiques
router.get("/stats/overview", getTodoStats);

// GET - Tâches par catégorie
router.get("/category/:category", getTodosByCategory);

// GET - Tâche par ID
router.get("/:id", getTodoById);

// POST - Crée une nouvelle tâche
router.post("/", createTodo);

// PUT - Met à jour une tâche
router.put("/:id", updateTodo);

// PATCH - Marque une tâche comme terminée
router.patch("/:id/complete", completeTodo);

// DELETE - Supprime une tâche
router.delete("/:id", deleteTodo);

export default router;
