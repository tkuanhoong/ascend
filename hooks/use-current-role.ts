import { UserRole } from ".prisma/client";
import { useSession } from "next-auth/react";

export const useCurrentRole = () => {
    const session = useSession();

    const role = session.data?.user.role;

    const isAdmin = role === UserRole.ADMIN;

    return { role, isAdmin };
}