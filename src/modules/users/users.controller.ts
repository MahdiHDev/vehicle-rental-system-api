import { Request, Response } from "express";
import { userServices } from "./users.service";

const getAllUSer = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getAllUser();
        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows,
        });
    } catch (err: any) {
        return res.status(500).json({
            success: true,
            message: err.message,
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.updateUser(
            req.body,
            req.params.userId!
        );

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "user not found",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: result.rows[0],
            });
        }
    } catch (err: any) {
        console.log(err);
        return res.status(500).json({
            success: true,
            message: err.message,
        });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.deleteUser(req.params.userId!);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
            });
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const userController = {
    getAllUSer,
    updateUser,
    deleteUser,
};
