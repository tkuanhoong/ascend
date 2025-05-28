import { auth } from "@/auth";
import { UserRole } from ".prisma/client";

export const currentUser = async () => {
    const session = await auth();
    return session?.user;
}

export const currentRole = async () => {
    const session = await auth();
    return session?.user.role;
}

export const currentUserId = async () => {
    const session = await auth();
    return session?.user.id;
}

export const isCurrentUserAdmin = async () => {
    const session = await auth();
    return session?.user.role === UserRole.ADMIN;
}