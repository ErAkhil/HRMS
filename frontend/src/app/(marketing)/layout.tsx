import type { PropsWithChildren } from "react";
import { MarketingNavbar } from "./_components/marketing-navbar";
import { MarketingFooter } from "./_components/marketing-footer";

export default function MarketingLayout({ children }: PropsWithChildren) {
  return (
    <>
      <MarketingNavbar />
      {children}
      <MarketingFooter />
    </>
  );
}
