import { Handle, NodeProps, Position, Node } from "@xyflow/react";
import { Code } from "lucide-react";
import React from "react";
import { NodeData } from ".";

export type CodeNodeData = NodeData &
  Node<{
    code?: string;
  }>;

const CodeNode = ({ isConnectable }: NodeProps<CodeNodeData>) => {
  return (
    <div className={"node"}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />

      <CodeNodeContent />

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export const CodeNodeContent = () => {
  return (
    <>
      <Code />
      <p className="node-title">Code</p>
    </>
  );
};

export default CodeNode;
