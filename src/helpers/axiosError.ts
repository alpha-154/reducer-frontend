import { AxiosError } from "axios";

export const handleAxiosError = (error: any) => {
  const axiosError = error as AxiosError<{ message: string }>;
  return axiosError.response?.data?.message || "An unexpected error occurred while fetching the data!";
};
