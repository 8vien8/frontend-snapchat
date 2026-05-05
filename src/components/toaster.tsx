import { DevelopIcon } from "@/assets/svgs/toaster.svg";
import { toast } from "sonner";

export const toastVariants = {
  success: (message?: string, description?: string) =>
    toast.success(message ?? "Success", {
      description: description ?? "Operation completed successfully",
      className: "bg-green-500 text-white",
    }),

  error: (message?: string, description?: string) =>
    toast.error(message ?? "Error", {
      description: description ?? "Something went wrong",
      className: "bg-red-500 text-white",
    }),

  warning: (message?: string, description?: string) =>
    toast.warning(message ?? "Warning", {
      description: description ?? "Please check your actions",
      className: "bg-yellow-500 text-black",
    }),

  info: (message?: string, description?: string) =>
    toast.info(message ?? "Info", {
      description: description ?? "Here is some information",
      className: "bg-blue-500 text-white",
    }),

  developing: (message?: string, description?: string) =>
    toast(message ?? "Developing", {
      description: description ?? "This feature is under development",
      className: "bg-gray-800 text-white",
      icon: <DevelopIcon />,
    }),
};
