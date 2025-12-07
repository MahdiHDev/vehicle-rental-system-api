import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.service";

const createVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.createVehicles(req.body);

        res.status(201).json({
            success: false,
            message: "Vehicle Created Successfully!",
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

const getVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.getVehicles();

        res.status(200).json({
            success: true,
            message: "Vehicles retrived successfully",
            data: result.rows,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err,
        });
    }
};

const getSingleVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.getSingleVehicles(
            req.params.vehicleId as string
        );

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicles not found",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicle retrieved successfully",
                data: result.rows[0],
            });
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const updateVechicles = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.updateVechicles(
            req.body,
            req.params.vehicleId!
        );

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "user not found",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicle updated successfully",
                data: result.rows[0],
            });
        }

        // console.log("result: ", result);
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const deleteVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.deleteVehicles(
            req.params.vehicleId!
        );

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicle deleted successfully",
            });
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const vehiclesContoller = {
    createVehicles,
    getVehicles,
    getSingleVehicles,
    updateVechicles,
    deleteVehicles,
};
