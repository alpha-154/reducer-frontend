import { AxiosError } from "axios";
import { toast } from "sonner";

export const handleAxiosErrorWithToastMessage = (error: any) => {
  const axiosError = error as AxiosError<{ message: string }>;
  if (axiosError.response && axiosError.response.data) {
    toast.error(
      axiosError.response.data.message ||
        "Something went wrong. Please try again later."
    );
  }
  return axiosError.response?.data?.message || "An unexpected error occurred";
};
