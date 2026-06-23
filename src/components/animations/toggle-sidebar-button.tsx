"use client";

import * as motion from "motion/react-client";
import { useSidebar } from "@/components/sidebar/sidebar-context";
import { cn } from "@/lib/utils";

export default function ToggleSideBarButton() {
  const { toggleSidebar, open, isMobile } = useSidebar();

  const toggleSwitch = () => {
    toggleSidebar();
  };

  return (
    <button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      className="toggle-container items-center p-1 border-2"
      style={{
        ...container,
        justifyContent: "flex-" + (isMobile ? "start" : open ? "end" : "start"),
        backgroundColor: open ? "var(--color-primary)" : "var(--color-muted)",
      }}
      onClick={toggleSwitch}
    >
      <motion.div
        className={cn(
          "toggle-handle",
          open ? " bg-primary-foreground" : "bg-primary",
        )}
        style={handle}
        layout
        transition={{
          type: "spring",
          visualDuration: 0.5,
          bounce: 0.2,
        }}
      />
    </button>
  );
}

/**
 * ==============   Styles   ================
 */

const container = {
  width: 38,
  height: 22,
  borderRadius: 50,
  cursor: "pointer",
  display: "flex",
};

const handle = {
  width: 16,
  height: 16,
  borderRadius: "50%",
};
