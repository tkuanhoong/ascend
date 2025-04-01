import { toast } from "sonner";

type ToastOptions = {
    message?: string;
    description?: string;
}

export function successToast({ message = 'Example Title', description }: ToastOptions) {
    toast.success(message, {
        description: description,
    });
}

export const errorToast = ({ message = 'Something went wrong' }: ToastOptions) => {
    toast.error(message, {
        position: 'top-center'
    })
}