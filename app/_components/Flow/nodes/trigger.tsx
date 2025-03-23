import { Handle, NodeProps, Position } from "@xyflow/react";
import { Zap } from "lucide-react";
import React from "react";
import { NodeData } from ".";

const TriggerNode = ({ isConnectable }: NodeProps<NodeData>) => {
  return (
    <div className={"node"}>
      <TriggerNodeContent />

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export const TriggerNodeContent = () => {
  return (
    <>
      <Zap />
      <p className="node-title">Trigger</p>
    </>
  );
};

export default TriggerNode;
