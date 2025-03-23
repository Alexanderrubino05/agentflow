import { ReactFlowProvider } from "@xyflow/react";
import Flow from "../_components/Flow";
import { getCurrentSession } from "@/packages/lib/auth";

export default async function Home() {
  await getCurrentSession();

  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
