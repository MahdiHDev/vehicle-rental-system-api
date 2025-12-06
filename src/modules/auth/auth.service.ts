import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";

const signupUser = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload;

    const hashedPass = await bcrypt.hash(password as string, 10);

    const result = await pool.query(
        `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
        [name, email, hashedPass, phone, role]
    );

    return result;
};

const signinUser = async (email: string, password: string) => {
    console.log({ email });
    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
        email,
    ]);

    console.log(result);
    if (result.rows.length === 0) {
        return null;
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);

    console.log({ match, user });
    if (!match) {
        return false;
    }

    const jwtPayload = {
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const token = jwt.sign(jwtPayload, config.jwtSecret as string, {
        expiresIn: "7d",
    });

    return { token, user };
};

export const authServices = { signupUser, signinUser };
