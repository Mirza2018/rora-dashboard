import React from "react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        {/* Logo Box */}
        <div className="flex justify-center">
          <div className="relative w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">R</span>

            {/* Animated Ring */}
            <span className="absolute inset-0 rounded-2xl border-4 border-primary/30 animate-ping"></span>
          </div>
        </div>

        {/* Text */}
        <p className="text-primary text-sm font-medium tracking-wide">
          Loading RORA Dashboard...
        </p>

        {/* Spinner */}
        <div className="flex justify-center">
          <div className="w-6 h-6 border-4 border-primary! border-t-transparent! rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
