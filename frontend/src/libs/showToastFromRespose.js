import { toast } from "sonner";

export const showToastFromResponse = (res) => {
    if (res?.data?.success) {
        toast.success(res.data.message || "Success");
    } else {
        toast.error(res.data.message || "Operation failed");
    }
};