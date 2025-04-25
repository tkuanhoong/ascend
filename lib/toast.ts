import { toast } from "sonner";

type ToastOptions = {
    message?: string;
    description?: string;
    position?: string;
}

export function successToast({ message = 'Example Title', description }: ToastOptions) {
    toast.success(message, {
        position: 'top-center',
        description,
    });
}

export const errorToast = ({ message = 'Something went wrong' }: ToastOptions) => {
    toast.error(message, {
        position: 'top-center'
    })
}

export const unexpectedErrorToast = () => errorToast({ message: "Something went wrong", })