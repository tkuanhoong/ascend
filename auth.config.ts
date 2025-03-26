import Credentials from "next-auth/providers/credentials";

import { type NextAuthConfig } from "next-auth"
import { ZodError } from "zod";
import { verifyPassword } from "./lib/hash";
import { LoginSchema } from "./lib/zod";
import { getUserByEmail } from "@/data/user";

export default {
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                try {
                    const validatedResult = LoginSchema.safeParse(credentials);

                    if (validatedResult.success) {
                        const { email, password } = validatedResult.data;

                        const user = await getUserByEmail(email);

                        if (!user || !user.password) return null;

                        const isValidPassword = await verifyPassword(password, user.password);

                        if (isValidPassword) {
                            return user;
                        };
                    }

                    return null;
                } catch (error) {
                    if (error instanceof ZodError) {
                        return null;
                    }
                    return null;
                }

            },
        }),
    ],
} satisfies NextAuthConfig