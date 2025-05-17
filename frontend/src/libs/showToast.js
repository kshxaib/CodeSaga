import { toast } from "sonner";

export const showToast = (resOrError) => {
  console.log(resOrError);
  const success = resOrError?.data?.success
  const error = !resOrError?.data?.success
  if (success) {
    toast.success(resOrError?.data?.message);
    return
  } else if (error) {
    toast.error(resOrError?.response?.data?.message);
  }
};
