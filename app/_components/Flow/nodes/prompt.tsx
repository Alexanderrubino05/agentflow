import { Handle, NodeProps, Position, Node } from "@xyflow/react";
import { LetterText } from "lucide-react";
import React from "react";
import { NodeData } from ".";

export type PromptNodeData = NodeData &
  Node<{
    prompt?: string;
  }>;

const PromptNode = ({ isConnectable }: NodeProps<PromptNodeData>) => {
  return (
    <div className={"node"}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />

      <PromptNodeContent />

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export const PromptNodeContent = () => {
  return (
    <>
      <LetterText />
      <p className="node-title">Prompt</p>
    </>
  );
};

export default PromptNode;
