import { Request, Response } from "express";
import { authServices } from "./auth.service";

const signupUser = async (req: Request, res: Response) => {
    try {
        const result = await authServices.signupUser(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
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
    const { email, password } = req.body;
    try {
        const result = await authServices.signinUser(email, password);

        if (!result) {
            res.status(401).json({
                success: false,
                message: "Invalid Credential",
            });
        }

        res.status(200).json({
            success: true,
            message: "Login successfull",
            data: result,
        });
    } catch (err: any) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const authControllers = { signupUser, signinUser };
