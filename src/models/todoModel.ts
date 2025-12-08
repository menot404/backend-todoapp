import mongoose, { Schema, Document, Model } from "mongoose";

// Énumérations
const TodoCategory = {
    ETUDE: "Etude",
    PROJET: "Projet",
    PERSO: "Perso"
};

const TodoPriority = {
    HAUTE: "Haute",
    MOYENNE: "Moyenne",
    BASE: "Base"
};

const TodoStatus = {
    EN_COURS: "En cours",
    TERMINEE: "Terminée",
    EN_ATTENTE: "En attente"
};

// Schéma Mongoose
const todoSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Le titre est requis"],
            minlength: [3, "Le titre doit comporter au moins 3 caractères"],
            trim: true
        },
        category: {
            type: String,
            enum: Object.values(TodoCategory),
            required: [true, "La catégorie est requise"],
            default: TodoCategory.ETUDE
        },
        priority: {
            type: String,
            enum: Object.values(TodoPriority),
            required: [true, "La priorité est requise"],
            default: TodoPriority.MOYENNE
        },
        deadline: {
            type: Date,
            required: [true, "La date limite est requise"]
        },
        status: {
            type: String,
            enum: Object.values(TodoStatus),
            default: TodoStatus.EN_COURS
        },
        completedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true, // Ajoute automatiquement createdAt et updatedAt
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Méthodes d'instance
todoSchema.methods.markAsCompleted = function () {
    this.status = TodoStatus.TERMINEE;
    this.completedAt = new Date();
    return this.save();
};

todoSchema.methods.isOverdue = function () {
    return this.deadline < new Date() && this.status !== TodoStatus.TERMINEE;
};

// Méthodes statiques
todoSchema.statics.findByCategory = function (category) {
    return this.find({ category });
};

todoSchema.statics.findByPriority = function (priority) {
    return this.find({ priority });
};

todoSchema.statics.findOverdue = function () {
    return this.find({
        deadline: { $lt: new Date() },
        status: { $ne: TodoStatus.TERMINEE }
    });
};

// Index pour améliorer les performances
todoSchema.index({ status: 1, deadline: 1 });
todoSchema.index({ category: 1 });
todoSchema.index({ priority: 1 });

// Modèle Mongoose

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
export { TodoCategory, TodoPriority, TodoStatus };