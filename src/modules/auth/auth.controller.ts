import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signupUser = async (req: Request, res: Response) => {
    try {
        const result = await authServices.signupUser(req.body);

        res.status(201).json({
            success: true,
            message: "User Signed Up successfully",
            data: result.rows[0],
        });
    } catch (err: any) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const signinUser = async (req: Request, res: Response) => {
    try {
    } catch (err: any) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const authControllers = { signupUser, signinUser };
