import { Request, Response } from "express";
import { autoReturnExpiredBooking } from "../../utils/autoReturnExpoireBookings";
import { bookingServices } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingServices.createBooking(req.body);

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
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

const getAllBookings = async (req: Request, res: Response) => {
    const userInfo = req.user!;
    console.log(userInfo);

    autoReturnExpiredBooking();

    try {
        const result = await bookingServices.getAllBookings(userInfo);

        res.status(200).json({
            success: true,
            message: "Bookings retrived successfully",
            data: result,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const updateBookings = async (req: Request, res: Response) => {
    autoReturnExpiredBooking();
    try {
        const result = await bookingServices.updateBookings(
            req.params.bookingId!,
            req.body.status!,
            req.user!
        );

        if (req.user?.role) {
            return res.status(200).json({
                success: true,
                message: "Booking cancelled successfully",
                data: result,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Booking marked as returned. Vehicle is now available",
            data: result,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const bookingController = {
    createBooking,
    getAllBookings,
    updateBookings,
};
