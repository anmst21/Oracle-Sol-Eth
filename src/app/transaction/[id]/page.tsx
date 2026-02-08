import Transaction from "@/components/transaction";
import { RelayTransaction } from "@/types/relay-transaction";
import { queryRequests } from "@reservoir0x/relay-kit-hooks";
import { notFound } from "next/navigation";
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const id = (await params).id;
  let data;
  try {
    data = await queryRequests("https://api.relay.link", {
      id,
      limit: 1,
    });
  } catch (err) {
    console.error("Error fetching transaction", err);
    // any fetch error → 404
    return notFound();
  }

  const tx: RelayTransaction | undefined = data?.requests?.[0];
  if (!tx) {
    // no transaction found → 404
    return notFound();
  }
  // console.log("transaction", data);
  return (
    <div className="transaction-page">
      <Transaction transaction={tx} />
    </div>
  );
}
