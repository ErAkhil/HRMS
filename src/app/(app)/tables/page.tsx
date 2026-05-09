import Breadcrumb from "@/components/layout/breadcrumb";
import { InvoiceTable } from "@/components/tables/invoice-table";
import { TopChannels } from "@/components/tables/top-channels";
import { TopChannelsSkeleton } from "@/components/tables/top-channels/skeleton";
import { TopProducts } from "@/components/tables/top-products";
import { TopProductsSkeleton } from "@/components/tables/top-products/skeleton";

import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tables",
};

const TablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Tables" />

      <div className="space-y-10">
        <Suspense fallback={<TopChannelsSkeleton />}>
          <TopChannels />
        </Suspense>
        
        <Suspense fallback={<TopProductsSkeleton />}>
          <TopProducts />
        </Suspense>

        <InvoiceTable />
      </div>
    </>
  );
};

export default TablesPage;
