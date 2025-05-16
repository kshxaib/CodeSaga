import { toast } from "sonner";

export const showToast = (resOrError) => {
  console.log(resOrError);
  const success = resOrError?.data?.success
  const error = resOrError?.response?.data?.message
  if (success) {
    toast.success(resOrError?.data?.message);
  } else if (error) {
    toast.error(resOrError?.response?.data?.message);
  }
};
