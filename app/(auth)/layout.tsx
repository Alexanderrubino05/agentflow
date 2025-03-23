import type { Metadata } from "next";
import "../globals.css";
import "@xyflow/react/dist/style.css";
import Header from "../_components/Header";
import { WithSession } from "../_providers/auth/Session";

export const metadata: Metadata = {
  title: "Agent Flow",
  description: "Agent Flow",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WithSession>
      <div className="h-screen w-screen flex flex-col">
        <Header />
        {children}
      </div>
    </WithSession>
  );
}
