import { NextFunction, Request, Response } from "express";

export const adminOrSelf = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const loggedUser = req.user!;
        console.log("Logged User", loggedUser);
        const id = req.params.userId;
        console.log("id, ", id);

        if (loggedUser.role === "admin") {
            return next();
        }
        if (loggedUser.id == id) {
            console.log("check with id");
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "Forbidden: You are not allowed to access this resource",
        });
    };
};
