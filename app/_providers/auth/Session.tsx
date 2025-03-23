"use client";

import { SessionProvider } from "next-auth/react";

export const WithSession = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
