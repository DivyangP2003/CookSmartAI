// app/_components/ui/toaster.js
"use client";

import { Toaster as Sonner } from "sonner";

const Toaster = (props) => {
  return (
    <Sonner
      theme="light" // force light theme always
      toastOptions={{
        className: "bg-white text-black border border-gray-300 shadow-sm", // default style
      }}
      {...props}
    />
  );
};

export { Toaster };
