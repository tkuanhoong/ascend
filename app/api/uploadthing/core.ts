import { currentUser } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const checkAuth = async () => {
    const user = await currentUser();

    if (!user) throw new UploadThingError("Unauthorised");

    return { userId: user.id, };
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    courseImage: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
        // Set permissions and file types for this FileRoute
        .middleware(checkAuth)
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);

            console.log("file url", file.ufsUrl);

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId };
        }),
    chapterAttachment: f({
        text: { maxFileSize: "128MB", maxFileCount: 1, },
        image: { maxFileSize: "128MB", maxFileCount: 1, },
        video: { maxFileSize: "128MB", maxFileCount: 1, },
        audio: { maxFileSize: "128MB", maxFileCount: 1, },
        pdf: { maxFileSize: "128MB", maxFileCount: 1, },
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
            maxFileSize: "128MB",
            maxFileCount: 1,
        },
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
            maxFileSize: "128MB", maxFileCount: 1,
        },
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
            maxFileSize: "128MB", maxFileCount: 1,
        },
    })
        .middleware(checkAuth)
        .onUploadComplete(() => { }),
    chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "256GB" } })
        .middleware(checkAuth)
        .onUploadComplete(() => { }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
