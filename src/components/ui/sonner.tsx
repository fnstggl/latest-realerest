
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      closeButton
      richColors
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "group border-2 rounded-xl bg-white p-4 shadow-md flex items-start",
          title: "font-semibold text-gray-900",
          description: "text-gray-600 text-sm mt-1",
          success: "border-green-500",
          error: "border-red-500",
          info: "border-blue-500",
          warning: "border-yellow-500",
          closeButton: "rounded-full p-1 hover:bg-gray-100"
        },
        duration: 5000,
      }}
      // Prevent stacking/duplicate toasts
      expand={false}
      visibleToasts={1}
      {...props}
    />
  );
};

export { Toaster };
