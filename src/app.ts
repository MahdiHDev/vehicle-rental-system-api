import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";

const app = express();
//parser
app.use(express.json());

// initializeing DB
initDB();

// auth route
app.use("/api/v1/auth/", authRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("Vehicle Rental System");
});

export default app;
