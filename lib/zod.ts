import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email().min(1),
    password: z.string().min(6)
});

export const RegisterSchema = z.object({
    email: z.string().min(1, {
        message: "Email is required",
    }).email({
        message: "Invalid email address",
    }),
    password: z.string().min(6, {
        message: "Minimum 6 characters required",
    }),
    confirmPassword: z.string().min(6, {
        message: "Minimum 6 characters required",
    }),
    name: z.string().min(1, {
        message: "Name is required",
    }),
    identityNo: z.string().min(1, {
        message: "IC Number is required",
    })
        .refine((val) => !val.includes('-'), {
            message: "Do not include '-' for IC Number",
        }) // Remove dashes for consistent processing
        .refine(data => /^\d{6}\d{2}\d{4}$/.test(data), {
            message: "Invalid IC Number format",
        }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // This will point the error to the confirmPassword field
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email(),
});

export const ResetPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum 6 characters required",
    }),
    confirmPassword: z.string().min(6, {
        message: "Minimum 6 characters required",
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // This will point the error to the confirmPassword field
});

export const ChangePasswordSchema = z.object({
    current: z.string().min(6, {
        message: "Minimum 6 characters required",
    }),
    password: z.string().min(6, {
        message: "Minimum 6 characters required",
    }),
    confirmPassword: z.string().min(6, {
        message: "Minimum 6 characters required",
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: "New Passwords do not match",
    path: ["confirmPassword"], // This will point the error to the confirmPassword field
});

export const ProfileSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required",
    }),
});

export const CreateCourseSchema = z.object({
    title: z.string().min(1, {
        message: "Course title is required",
    }),
});