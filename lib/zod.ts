import { CourseStatus, SectionLevel, UserRole } from ".prisma/client";
import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().trim().email().min(1),
    password: z.string().trim().min(6)
});

export const RegisterSchema = z.object({
    email: z.string().trim().min(1, {
        message: "Email is required",
    }).email({
        message: "Invalid email address",
    }),
    password: z.string().trim().min(6, {
        message: "Minimum 6 characters required",
    }),
    confirmPassword: z.string().trim().min(6, {
        message: "Minimum 6 characters required",
    }),
    name: z.string().trim().min(1, {
        message: "Name is required",
    }),
    identityNo: z.string().trim().min(1, {
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
    email: z.string().trim().email(),
});

export const ResetPasswordSchema = z.object({
    password: z.string().trim().min(6, {
        message: "Minimum 6 characters required",
    }),
    confirmPassword: z.string().trim().min(6, {
        message: "Minimum 6 characters required",
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // This will point the error to the confirmPassword field
});

export const ChangePasswordSchema = z.object({
    current: z.string().trim().min(6, {
        message: "Minimum 6 characters required",
    }),
    password: z.string().trim().min(6, {
        message: "Minimum 6 characters required",
    }),
    confirmPassword: z.string().trim().min(6, {
        message: "Minimum 6 characters required",
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: "New Passwords do not match",
    path: ["confirmPassword"], // This will point the error to the confirmPassword field
});

export const ProfileSchema = z.object({
    name: z.string().trim().min(1, {
        message: "Name is required",
    }),
});

export const CreateCourseSchema = z.object({
    title: z.string().trim().min(1, {
        message: "Course title is required",
    }),
});

export const CreateSectionSchema = z.object({
    title: z.string().trim().min(1, {
        message: "Section title is required",
    }),
});

export const CreateChapterSchema = z.object({
    title: z.string().trim().min(1, {
        message: "Chapter title is required",
    }),
});
export const FileBackupSchema = z.object({
    selectedSections: z.object({
        id: z.string(),
        chapterIds: z.string().array()
    }).array()
});


export const JSONFileSchema = z.object({
    file: z
        .instanceof(File, { message: "File is required" })
        .refine((file) => ["application/json"].includes(file.type), {
            message: "Invalid document file type",
        }),
});

export const AdminCourseStatusSchema = z.object({
    status: z.nativeEnum(CourseStatus),
    reason: z.string().nullable().optional(),
})

export const AdminEditUserFormSchema = z.object({
    name: z.string().trim().min(1, {
        message: "Full Name is required",
    }),
    email: z.string().trim().min(1, {
        message: "Email is required",
    }).email({
        message: "Invalid email address",
    }),
    identificationNo: z
        .string().trim()
        .min(1, {
            message: "Identification Number is required",
        })
        .refine((val) => !val.includes("-"), {
            message: "Do not include '-' for IC Number",
        }) // Remove dashes for consistent processing
        .refine((data) => /^\d{6}\d{2}\d{4}$/.test(data), {
            message: "Invalid IC Number format",
        }),
    role: z.nativeEnum(UserRole, {
        required_error: "Please select a role",
    }),
});

export const AdminCreateUserSchema = z.object({
    email: z.string().trim().min(1, {
        message: "Email is required",
    }).email({
        message: "Invalid email address",
    }),
    name: z.string().trim().min(1, {
        message: "Full Name is required",
    }),
    role: z.nativeEnum(UserRole, {
        required_error: "Please select a role",
    }),
    identificationNo: z.string().trim().min(1, {
        message: "IC Number is required",
    })
        .refine((val) => !val.includes('-'), {
            message: "Do not include '-' for IC Number",
        }) // Remove dashes for consistent processing
        .refine(data => /^\d{6}\d{2}\d{4}$/.test(data), {
            message: "Invalid IC Number format",
        }),
    password: z.string().trim().min(6, {
        message: "Minimum 6 characters required",
    }),
    confirmPassword: z.string().trim().min(6, {
        message: "Minimum 6 characters required",
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // This will point the error to the confirmPassword field
});

export const AICourseDescriptionSchema = z.object({
    prompt: z
        .string().trim()
        .min(1, { message: "This field is required" }),
})

// Zod schema for validating the imported course structure
export const ChapterImportSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().nullable(),
    position: z.number(),
    isFree: z.boolean(),
});

export const SectionImportSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    position: z.number(),
    level: z.nativeEnum(SectionLevel).nullable(),
    estimatedTime: z.number().nullable(),
    chapters: z.array(ChapterImportSchema).optional(),
});

export const CourseImportSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().nullable(),
    price: z.number().nullable(),
    categoryId: z.string().nullable(),
    sections: z.array(SectionImportSchema).optional(),
});

export const AICourseImportSchema = z.object({
    title: z.string().min(1),
    description: z.string().nullable(),
    price: z.number().nullable(),
    categoryId: z.string().nullable(),
    sections: z.array(z.object({
        title: z.string().min(1),
        position: z.number(),
        level: z.nativeEnum(SectionLevel).nullable(),
        estimatedTime: z.number().nullable(),
        chapters: z.array(z.object({
            title: z.string().min(1),
            description: z.string().nullable(),
            position: z.number(),
            isFree: z.boolean(),
        })).optional(),
    })).optional(),
})