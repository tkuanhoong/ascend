import { UserRole } from '@/prisma/app/generated/prisma/client';
import { type DefaultSession } from "next-auth"


declare module "next-auth" {
    interface User {
        id?: string;
        role: UserRole;
    }
    interface Session {
        user: {
            id: string;
            role: UserRole;
        } & DefaultSession["user"]
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        id: string;
        role: UserRole;
    }
}

declare module "@auth/core/adapters" {
    interface AdapterUser {
        id: string;
        role: UserRole;
    }
}