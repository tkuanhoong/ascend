import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.APP_URL
})

export default apiClient;

// export class ApiClient {
//     private static instance: ApiClient;
//     private apiClient = axios.create({
//         baseURL: process.env.APP_URL
//     });

//     public static getInstance(): ApiClient {
//         if (!ApiClient.instance) {
//             ApiClient.instance = new ApiClient();
//         }
//         return ApiClient.instance;
//     }

//     async deleteCourseById(courseId: string): Promise<void> {
//         try {
//             await this.apiClient.delete(`/api/courses/${courseId}`);
//         } catch (error) {
//             console.error(`Failed to delete course with ID ${courseId}:`, error);
//             throw error;
//         }
//     }
// }
