import { Node, useNodeConnections, useReactFlow } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { NodeType } from "../nodes";
import { useEffect, useMemo, useState } from "react";
import { Combobox } from "@/components/ui/combobox";
import { PromptNodeData } from "../nodes/prompt";
import { Select } from "@/components/ui/select";
import SheetInputValues from "./inputValues";
import { CodeNodeData } from "../nodes/code";
import PromptDialog from "@/app/(auth)/library/_components/promptDialog";
import { api } from "@/packages/trpc/react";

interface NodeSheetProps {
  node: Node | undefined;
}

type TypeNodeData<T extends NodeType> = T extends "prompt"
  ? PromptNodeData["data"]
  : T extends "code"
  ? CodeNodeData["data"]
  : never;

const NodeSheetContent = ({ node }: { node: Node }) => {
  const type = node.type as NodeType;
  const { updateNodeData } = useReactFlow();
  const [data, setData] = useState(node.data as TypeNodeData<NodeType>);

  const connections = useNodeConnections({
    handleType: "target",
    id: node.id,
  });

  const { data: prompts } = api.library.getPrompts.useQuery();

  useEffect(() => {
    setData(node.data as TypeNodeData<NodeType>);
  }, [node.data]);

  useEffect(() => {
    updateNodeData(node.id, data);
  }, [data, node.id, updateNodeData]);

  const typeContent = useMemo(() => {
    if (!data) return null;
    const { inputValues, outputValues } = data;

    switch (type) {
      case "prompt":
        const { prompt } = data as PromptNodeData["data"];

        return (
          <>
            <Combobox
              options={
                prompts?.map((prompt) => ({
                  label: prompt.title,
                  value: prompt.id,
                })) ?? []
              }
              value={prompt}
              onChange={(value) => {
                const prompt = prompts?.find((p) => p.id === value);
                setData({
                  prompt: value,
                  inputValues: Object.fromEntries(
                    (
                      prompt?.inputValues as {
                        values: string[];
                      }
                    )?.values.map((value) => [value, null]) ?? []
                  ),
                  outputValues: prompt
                    ? {
                        result: {
                          type: "string",
                          response: null,
                        },
                      }
                    : {},
                });
              }}
              placeholder="Select a prompt"
              addOption={{
                children: <PromptDialog>Create a prompt</PromptDialog>,
              }}
            />

            <SheetInputValues
              inputValues={inputValues}
              connections={connections}
            />

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Output Values</h3>

              <div className="flex flex-col gap-2 bg-secondary rounded-md p-2 border">
                {Object.entries(outputValues).map(([key]) => (
                  <div key={key} className="flex justify-between items-center">
                    <label>{key}</label>
                    <p className="text-xs text-muted-foreground">
                      {outputValues[key].type}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      case "code":
        const { code } = data as CodeNodeData["data"];

        return (
          <>
            <Combobox
              options={[]}
              value={code}
              onChange={(value) =>
                setData((prev) => ({ ...prev, code: value }))
              }
              placeholder="Select a code"
              addOption={{
                children: <PromptDialog>Create a code</PromptDialog>,
              }}
            />

            <SheetInputValues
              inputValues={inputValues}
              connections={connections}
            />

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Output Values</h3>

              <div className="flex flex-col gap-2 bg-secondary rounded-md p-2 border">
                {Object.entries(outputValues).map(([key]) => (
                  <div key={key}>
                    <label>{key}</label>
                    <Select
                      // value={value}
                      onValueChange={() => {}}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      default:
        return (
          <p>
            Something went wrong with loading the node. Try again or contact
            support.
          </p>
        );
    }
  }, [type, data, connections, prompts]);

  return (
    <>
      <h1 className="text-lg font-medium">Node</h1>
      <div className="flex flex-col gap-4">{typeContent}</div>
    </>
  );
};

const NodeSheet = ({ node }: NodeSheetProps) => {
  return (
    <div
      className={cn(
        "absolute right-0 top-0 bottom-0 w-72 flex flex-col p-4 gap-2 bg-background border-l transition-transform",
        node
          ? "translate-x-0 duration-200 ease-initial"
          : "translate-x-full duration-75"
      )}
    >
      {node && <NodeSheetContent node={node} />}
    </div>
  );
};

export default NodeSheet;
