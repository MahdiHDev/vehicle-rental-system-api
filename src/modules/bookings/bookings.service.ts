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

    const vehicle = {
        vehicle_name: vehicleInfo.rows[0].vehicle_name,
        daily_rent_price: vehicleInfo.rows[0].daily_rent_price,
    };

    console.log(vehicle);

    const finalPayload = {
        ...result.rows,
        vehicle: vehicle,
    };

    return finalPayload;
};

const getAllBookings = async (payload: Record<string, unknown>) => {
    const userInfo = await pool.query("SELECT * FROM users WHERE id = $1", [
        payload.id,
    ]);
    console.log("payload: ", payload);

    if (payload.role === "admin") {
        const result = await pool.query(` SELECT 
                b.id,
                b.customer_id,
                b.vehicle_id,
                b.rent_start_date,
                b.rent_end_date,
                b.total_price,
                b.status,

                u.name AS customer_name,
                u.email AS customer_email,

                v.vehicle_name,
                v.registration_number
            FROM bookings b
            JOIN users u ON b.customer_id = u.id
            JOIN vehicles v ON b.vehicle_id = v.id`);

        const finalResult = result.rows.map((row) => ({
            id: row.id,
            customer_id: row.customer_id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date,
            rent_end_date: row.rent_end_date,
            total_price: row.total_price,
            status: row.status,
            customer: {
                name: row.customer_name,
                email: row.customer_email,
            },
            vehicle: {
                vehicle_name: row.vehicle_name,
                registration_number: row.registration_number,
            },
        }));

        return finalResult;
    }

    const result = await pool.query(
        `SELECT 
        b.id,
        b.customer_id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.total_price,
        b.status,

        v.vehicle_name,
        v.registration_number,
        v.type AS vehicle_type
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1`,
        [userInfo.rows[0].id]
    );

    const finalResult = result.rows.map((row) => ({
        id: row.id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        vehicle: {
            vehicle_name: row.vehicle_name,
            registration_number: row.registration_number,
            type: row.vehicle_type,
        },
    }));
    return finalResult;
};

const updateBookings = async (
    bookingId: string,
    status: string,
    user: Record<string, unknown>
) => {
    console.log(bookingId, status, user);

    const getBooking = await pool.query(
        `SELECT * FROM bookings WHERE id = $1`,
        [bookingId]
    );

    if (!getBooking.rows.length) {
        throw new Error("Booking not found");
    }

    const booking = getBooking.rows[0];

    console.log("Booking from db", booking);

    const now = new Date();
    const startingBooking = new Date(booking.rent_start_date);

    const statusValidation = ["cancelled", "returned"];
    if (!statusValidation.includes(status)) {
        throw new Error("Invalid status");
    }

    if (user.role === "customer") {
        if (booking.customer_id !== user.id) {
            throw new Error("Your cannot modify other users booking");
        }

        if (status !== "cancelled") {
            throw new Error("Customer can only cancel booking");
        }

        if (now >= startingBooking) {
            throw new Error("Cannot cancel because booking is already started");
        }

        if (booking.status !== "active") {
            throw new Error("Only active booking can be cancelled");
        }
    }

    if (user.role === "admin") {
        if (status !== "returned") {
            throw new Error("Admin only change order to returned");
        }
    }

    const updateBookings = await pool.query(
        `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
        [status, bookingId]
    );

    if (status === "returned" || status === "cancelled") {
        const updatedVehicleInfo = await vehiclesServices.updateVechicles(
            { availability_status: "available" },
            booking.vehicle_id
        );

        if (status === "cancelled") {
            return updateBookings.rows[0];
        }

        const finalResult = {
            ...updateBookings.rows[0],
            vehicle: {
                availability_status:
                    updatedVehicleInfo.rows[0].availability_status,
            },
        };
        return finalResult;
    }
};

export const bookingServices = {
    createBooking,
    getAllBookings,
    updateBookings,
};
