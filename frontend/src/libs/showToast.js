import { toast } from "sonner";

export const showToast = (resOrError) => {
  const res = resOrError?.response || resOrError;

  if (!res?.data) {
    toast.error("Unexpected error occurred");
    return;
  }

  const { success, message } = res.data;

  if (success) {
    toast.success(message || "Success");
  } else {
    toast.error(message || "Failed: " + message);
  }
};
