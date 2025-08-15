import { MentorSidebar } from "@/components/mentor/layouts/Sidebar";
import { MentorHeader } from "@/components/mentor/layouts/MentorHeader";
import { Outlet } from "react-router-dom";

export function MentorLayout() {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Full-width navbar - Fixed/sticky at the top */}
      <MentorHeader />

      {/* Content area with sidebar and main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed on desktop, sliding on mobile */}
        <MentorSidebar />

        {/* Main scrollable content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}