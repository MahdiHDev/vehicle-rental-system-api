import { pool } from "../../config/db";
import { vehiclesServices } from "../vehicles/vehicles.service";

// logic
// total_price = daily_rent_price × number_of_days
// number_of_days = rent_end_date - rent_start_date
const createBooking = async (payload: Record<string, unknown>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    const vehicleInfo = await vehiclesServices.getSingleVehicles(
        vehicle_id as string
    );

    if (!vehicleInfo.rows.length) {
        throw new Error("Vehicle not found");
    }

    // logic for date difference
    const start = new Date(rent_start_date as string);
    const end = new Date(rent_end_date as string);

    if (end <= start) {
        throw new Error("rent_end_date must be after rent_start_date");
    }

    const difference = end.getTime() - start.getTime();

    const number_of_days = Math.ceil(difference / (1000 * 60 * 60 * 24));

    const total_price = vehicleInfo.rows[0].daily_rent_price * number_of_days;

    const result = await pool.query(
        `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
            customer_id,
            vehicle_id,
            rent_start_date,
            rent_end_date,
            total_price,
            "active",
        ]
    );

    await vehiclesServices.updateVechicles(
        { availability_status: "booked" },
        vehicle_id as string
    );

    return result;
};

export const bookingServices = { createBooking };
