import React, { Suspense } from "react";
import VerifyOtpClient from "./VerifyOtpClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      {/* Client component uses useSearchParams; wrap in Suspense to avoid CSR bailout warnings */}
      <VerifyOtpClient />
    </Suspense>
  );
}
