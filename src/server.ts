import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
require("dotenv").config();

import todoRoutes from "./routes/todoRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité et utilitaire
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Middleware pour parser JSON et les données URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Route de santé de l'API
 * @route GET /
 */
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "API Todo App - Serveur actif",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Routes de l'API
 */
app.use("/api/todos", todoRoutes);

/**
 * Route 404
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Endpoint non trouvé",
    path: req.path,
  });
});

/**
 * Gestion des erreurs globales
 */
app.use(
  (
    err: Error,
    req: Request,
    res: Response,
    next: (err: Error) => void
  ) => {
    console.error("Erreur:", err);
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
);

// Démarrage du serveur
const startServer = async () => {
  try {
    // Note: Les données sont actuellement stockées en mémoire.
    // Pour une vraie application, connectez-vous à MongoDB ici:
    // await todoConnection();

    app.listen(PORT, () => {
      console.log(`✅ Serveur lancé à http://localhost:${PORT}`);
      console.log(`📝 API des todos disponible à http://localhost:${PORT}/api/todos`);
    });
  } catch (error) {
    console.error("❌ Erreur au démarrage du serveur:", error);
    process.exit(1);
  }
};

startServer();

