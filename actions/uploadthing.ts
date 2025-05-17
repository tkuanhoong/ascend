import { UTApi } from "uploadthing/server";
export const utapi = new UTApi({
    // ...options,
});

export const deleteUTFiles = async (files: string[] | string) => {
    try {
        let extractedFilesId: string[] | string = [];
        if (Array.isArray(files)) {
            extractedFilesId = files.map(file => file.split('/').pop() || file);
        } else {
            extractedFilesId = files.split('/').pop() || files;
        }

        await utapi.deleteFiles(extractedFilesId, { keyType: "fileKey" });
    } catch (error) {
        console.error("UTAPI: Error deleting files", error);
    }
};

export const uploadFile = async (file: File) => {
    try {
        const response = await utapi.uploadFiles(file);
        return response;
    } catch (error) {
        console.error("UTAPI: Error uploading files", error);
    }
}