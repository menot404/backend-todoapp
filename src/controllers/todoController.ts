import { Request, Response } from "express";
import { CreateTodoDTO, UpdateTodoDTO } from "../types/typeDataTodo";
import Todo from "../models/todoModel";

/**
 * Récupère toutes les tâches avec filtre optionnel
 * @route GET /api/todos
 * @query search - Texte de recherche (catégorie, priorité, titre, deadline)
 */
export const getAllTodos = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;
        let query: any = {};
        if (search && typeof search === "string") {
            const s = search.toLowerCase();
            query = {
                $or: [
                    { title: { $regex: s, $options: "i" } },
                    { category: { $regex: s, $options: "i" } },
                    { priority: { $regex: s, $options: "i" } },
                    { deadline: { $regex: s, $options: "i" } },
                ],
            };
        }
        const todos = await Todo.find(query).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: todos,
            count: todos.length,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des tâches",
            error: error instanceof Error ? error.message : "Erreur inconnue",
        });
    }
};

/**
 * Récupère une tâche par son ID
 * @route GET /api/todos/:id
 */
export const getTodoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Tâche non trouvée",
            });
        }
        res.status(200).json({
            success: true,
            data: todo,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération de la tâche",
            error: error instanceof Error ? error.message : "Erreur inconnue",
        });
    }
};

/**
 * Récupère les tâches par catégorie
 * @route GET /api/todos/category/:category
 */
export const getTodosByCategory = async (req: Request, res: Response) => {
    try {
        const { category } = req.params;
        const todos = await Todo.find({ category });
        res.status(200).json({
            success: true,
            data: todos,
            count: todos.length,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des tâches par catégorie",
            error: error instanceof Error ? error.message : "Erreur inconnue",
        });
    }
};

/**
 * Crée une nouvelle tâche
 * @route POST /api/todos
 */
export const createTodo = async (req: Request, res: Response) => {
    try {
        const { title, category, priority, deadline }: CreateTodoDTO = req.body;
        if (!title || !category || !priority || !deadline) {
            return res.status(400).json({
                success: false,
                message: "Tous les champs sont requis",
            });
        }
        const todo = new Todo({
            title,
            category,
            priority,
            deadline,
            status: "En cours",
        });
        await todo.save();
        res.status(201).json({
            success: true,
            message: "Tâche créée avec succès",
            data: todo,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la création de la tâche",
            error: error instanceof Error ? error.message : "Erreur inconnue",
        });
    }
};

/**
 * Met à jour une tâche
 * @route PUT /api/todos/:id
 */
export const updateTodo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates: UpdateTodoDTO = req.body;
        const todo = await Todo.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true });
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Tâche non trouvée",
            });
        }
        res.status(200).json({
            success: true,
            message: "Tâche mise à jour avec succès",
            data: todo,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour de la tâche",
            error: error instanceof Error ? error.message : "Erreur inconnue",
        });
    }
};

/**
 * Marque une tâche comme terminée
 * @route PATCH /api/todos/:id/complete
 */
export const completeTodo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Tâche non trouvée",
            });
        }
        todo.status = "Terminée";
        todo.completedAt = new Date();
        await todo.save();
        res.status(200).json({
            success: true,
            message: "Tâche marquée comme terminée",
            data: todo,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la completion de la tâche",
            error: error instanceof Error ? error.message : "Erreur inconnue",
        });
    }
};

/**
 * Supprime une tâche
 * @route DELETE /api/todos/:id
 */
export const deleteTodo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedTodo = await Todo.findByIdAndDelete(id);
        if (!deletedTodo) {
            return res.status(404).json({
                success: false,
                message: "Tâche non trouvée",
            });
        }
        res.status(200).json({
            success: true,
            message: "Tâche supprimée avec succès",
            data: deletedTodo,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression de la tâche",
            error: error instanceof Error ? error.message : "Erreur inconnue",
        });
    }
};

/**
 * Récupère les statistiques des tâches
 * @route GET /api/todos/stats/overview
 */
export const getTodoStats = async (req: Request, res: Response) => {
    try {
        const total = await Todo.countDocuments();
        const completed = await Todo.countDocuments({ status: "Terminée" });
        const inProgress = await Todo.countDocuments({ status: "En cours" });
        const pending = await Todo.countDocuments({ status: "En attente" });
        const byCategory = {
            Etude: await Todo.countDocuments({ category: "Etude" }),
            Projet: await Todo.countDocuments({ category: "Projet" }),
            Perso: await Todo.countDocuments({ category: "Perso" }),
        };
        const byPriority = {
            Haute: await Todo.countDocuments({ priority: "Haute" }),
            Moyenne: await Todo.countDocuments({ priority: "Moyenne" }),
            Base: await Todo.countDocuments({ priority: "Base" }),
        };
        res.status(200).json({
            success: true,
            data: {
                total,
                completed,
                inProgress,
                pending,
                byCategory,
                byPriority,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des statistiques",
            error: error instanceof Error ? error.message : "Erreur inconnue",
        });
    }
};
