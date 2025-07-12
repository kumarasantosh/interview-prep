import { handleLogout, isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");
  return (
    <div className="root-layout">
      <nav>
        <div className="flex  items-center w-full">
          <Link href="/" className="flex items-center gap-2">
            <Image width={32} height={32} src="/logo.svg" alt="" />
          </Link>
          <div className="flex   w-full justify-between">
            <h2 className="text-primary-500 ml-2">Interview Prep</h2>
            <form action={handleLogout}>
              <Button type="submit">Logout</Button>
            </form>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
};

export default Layout;
