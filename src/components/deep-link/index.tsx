import React, { useMemo } from "react";
import { oracleUri } from "@/helpers/oracle-uri";
import { handleCopy } from "@/helpers/handle-copy";
import { SwapCopy } from "@/components/icons";
import { usePathname, useSearchParams } from "next/navigation";

const DeepLink = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const queryString = useMemo(() => searchParams.toString(), [searchParams]);

  const fullUri = queryString
    ? `${oracleUri}${pathname}?${queryString}`
    : oracleUri + pathname + "?";

  return (
    <div className="deep-link">
      <div className="deep-link__header">
        <span>LINK</span>
      </div>
      <div className="deep-link__params">
        <span>{fullUri.replace("https://", "www.")}</span>
      </div>
      <button onClick={() => handleCopy(fullUri)}>
        <SwapCopy />
        <span>Copy</span>
      </button>
    </div>
  );
};

export default DeepLink;
