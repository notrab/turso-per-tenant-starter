// Let's fake realtime chat stream by refreshing the page every 5 seconds

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AutoRefresh({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  return <>{children}</>;
}
