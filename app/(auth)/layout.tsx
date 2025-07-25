import { isAuthenticated } from "@/lib/actions/auth.action";
import React, { ReactNode } from "react";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/");
  return <div className="auth-layout">{children}</div>;
};

export default layout;
