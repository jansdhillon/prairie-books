"use server"

import PocketBase from 'pocketbase';

export const startAdmin = async () => {
    const pb = new PocketBase('http://127.0.0.1:8090');
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
        throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be set in the environment');
    }
    await pb.admins.authWithPassword(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
    return pb;
}
