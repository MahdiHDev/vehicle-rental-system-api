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
    const activeBookings = await pool.query(
        `SELECT id FROM bookings WHERE customer_id = $1 AND status = 'active'`,
        [id]
    );

    if (activeBookings.rows.length > 0) {
        throw new Error("User cannot be deleted, Active bookings exist");
    }

    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);

    console.log(result);
    return result;
};

export const userServices = {
    getAllUser,
    updateUser,
    deleteUser,
};
