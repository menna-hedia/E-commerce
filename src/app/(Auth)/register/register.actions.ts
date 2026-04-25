'use server';

import { RegisterObjectType } from "./page";


export async function RegisterAction(data: RegisterObjectType) {
    try {
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/auth/signup`, {
            method: "post",
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        });

        const finalRes = await res.json();
        console.log('finalRes', finalRes);

      return res.ok;

    } catch (error) {
        console.log('err', error);
    }
}