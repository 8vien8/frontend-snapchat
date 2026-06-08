import { DotWaveAnimation } from "@/lib/ui/animations/dot-wave.animation";
import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-auth-light">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />

        <div className="text-center">
          <p className="text-sm text-muted-foreground flex pointer-events-none select-none">
            Please wait a moment <DotWaveAnimation />
          </p>
        </div>
      </div>
    </div>
  );
}
