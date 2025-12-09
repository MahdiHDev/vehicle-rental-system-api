import { pool } from "../config/db";

export const autoReturnExpiredBooking = async () => {
    const activeBookings = await pool.query(
        `SELECT * FROM bookings WHERE status = 'active'`
    );

    const today = new Date();

    for (const booking of activeBookings.rows) {
        const rentEndDate = new Date(booking.rent_end_date);

        if (rentEndDate < today) {
            await pool.query(
                `UPDATE bookings SET status = 'returned' WHERE id = $1`,
                [booking.id]
            );
        }

        await pool.query(
            `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
            [booking.vehicle_id]
        );
    }
};
