import axios from "axios";
import { toast } from "sonner";

const apiClient = axios.create({
    baseURL: process.env.APP_URL
})

// handle unexpected error globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        toast.error(
            error.response?.data?.error || "An unexpected error occurred"
            , {
                position: 'top-center'
            }
        );

        return Promise.reject(error);
    }
);

export default apiClient;