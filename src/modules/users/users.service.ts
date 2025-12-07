import { pool } from "../../config/db";

type IUser = {
    name: string;
    email: string;
    phone: string;
    role: "admin" | "customer";
};

const getAllUser = async () => {
    const result = await pool.query(
        `SELECT id, name, email, phone, role FROM users`
    );

    return result;
};

// const updateVechicles = async (
//     payload: Record<string, unknown>,
//     vehicleId: string
// ) => {
//     const vehicleInfo = await getSingleVehicles(vehicleId);

//     // if (vehicleInfo.rows.length === 0) {
//     //     throw new Error("User not found");
//     // }

//     const updatedData = {
//         ...vehicleInfo.rows[0],
//         ...payload,
//     };

//     const {
//         vehicle_name,
//         type,
//         registration_number,
//         daily_rent_price,
//         availability_status,
//     } = updatedData as IvehicleInfo;

//     //  `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
//     const result = await pool.query(
//         `UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`,
//         [
//             vehicle_name,
//             type,
//             registration_number,
//             daily_rent_price,
//             availability_status,
//             vehicleId,
//         ]
//     );

//     return result;
// };

const updateUser = async (payload: Record<string, unknown>, userId: string) => {
    const userInfo = await pool.query(`SELECT * FROM users WHERE id = $1`, [
        userId,
    ]);

    if (userInfo.rows.length === 0) {
        throw new Error("User not found");
    }

    const updatedData = {
        ...userInfo.rows[0],
        ...payload,
    };

    const { name, phone, email, role } = updatedData as IUser;

    const result = await pool.query(
        `UPDATE users SET name=$1, phone=$2, email=$3, role=$4 WHERE id=$5 RETURNING *`,
        [name, phone, email, role, userId]
    );

    delete result.rows[0].password;
    return result;
};

const deleteUser = async (id: string) => {
    const userInfo = await pool.query(`SELECT * FROM users WHERE id = $1`, [
        id,
    ]);

    console.log(userInfo);

    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

    return result;
};

export const userServices = {
    getAllUser,
    updateUser,
    deleteUser,
};
