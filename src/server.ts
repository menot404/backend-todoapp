const express = require('express');
import { Request, Response } from "express";
// charge environment variables from .env file
require('dotenv').config();
const todoConnection = require('./config/data/todoData');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and urlencoded data
app.use(express.json());
// to support URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

/**
* @param req Request
* @param res Response
* @returns Hello World! message
 */

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// start the server after establishing database connection

const startServer = async () => {
  try {
    // establish database connection
    await todoConnection();
    // start the server
    app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

