import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { bookingRoutes } from "./modules/bookings/bookings.route";
import { userRoutes } from "./modules/users/users.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicles.routes";

const app = express();
//parser
app.use(express.json());

// initializeing DB
initDB();

// auth route
app.use("/api/v1/auth/", authRoutes);

// vehicle route
app.use("/api/v1/vehicles", vehicleRoutes);

// User route
app.use("/api/v1/users", userRoutes);

// Booking route
app.use("/api/v1/bookings", bookingRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("Vehicle Rental System");
});

export default app;
