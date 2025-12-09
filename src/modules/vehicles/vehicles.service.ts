import { pool } from "../../config/db";

type IvehicleInfo = {
    vehicle_name: string;
    type: "car" | "bike" | "van" | "SUV";
    registration_number: string;
    daily_rent_price: number;
    availability_status: "available" | "booked";
};

const createVehicles = async (payload: Record<string, unknown>) => {
    const {
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
    } = payload;

    const result = await pool.query(
        `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
        [
            vehicle_name,
            type,
            registration_number,
            daily_rent_price,
            availability_status,
        ]
    );

    return result;
};

const getVehicles = async () => {
    const result = await pool.query(`SELECT * FROM vehicles`);
    return result;
};

const getSingleVehicles = async (id: string) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
        id,
    ]);
    return result;
};

const updateVechicles = async (
    payload: Record<string, unknown>,
    vehicleId: string
) => {
    const vehicleInfo = await getSingleVehicles(vehicleId);

    // if (vehicleInfo.rows.length === 0) {
    //     throw new Error("User not found");
    // }

    const updatedData = {
        ...vehicleInfo.rows[0],
        ...payload,
    };

    const {
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
    } = updatedData as IvehicleInfo;

    //  `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
    const result = await pool.query(
        `UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`,
        [
            vehicle_name,
            type,
            registration_number,
            daily_rent_price,
            availability_status,
            vehicleId,
        ]
    );

    return result;
};

const deleteVehicles = async (id: string) => {
    const activeBooking = await pool.query(
        `SELECT id FROM bookings WHERE vehicle_id  = $1 AND status = 'active'`,
        [id]
    );

    if (activeBooking.rows.length > 0) {
        throw new Error("Vehicle cannot be deleted, active booking exist");
    }

    // delete vehicle
    const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);

    return result;
};

export const vehiclesServices = {
    createVehicles,
    getVehicles,
    getSingleVehicles,
    updateVechicles,
    deleteVehicles,
};
