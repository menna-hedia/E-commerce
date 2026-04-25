'use server';

import { cookies } from "next/headers";
import { LoginObjectType } from "./loginForm";

export async function LoginAction(data: LoginObjectType) {
    try {
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/auth/signin`, {
            method: "post",
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        });
        const finalRes = await res.json();
        console.log('finalRes', finalRes);

        if (res.ok) {
            const cookie = await cookies();
            cookie.set('token', finalRes.token, {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 24 * 3,
                sameSite: "lax",
            });
            return true;
        }
        return false;
    } catch (error) {
        console.log('err', error);
    }
}