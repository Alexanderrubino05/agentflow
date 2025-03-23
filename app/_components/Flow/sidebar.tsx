import React from "react";
import { useFlowContext } from "./context";
import { NodeType } from "./nodes";
import { PromptNodeContent } from "./nodes/prompt";
import { CodeNodeContent } from "./nodes/code";

const Sidebar = () => {
  const { setType } = useFlowContext();

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: NodeType
  ) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="flex flex-col gap-4 p-4 border-r">
      <div>
        <h3 className="text-lg font-bold">Nodes</h3>
        <p className="text-sm text-muted-foreground">
          Drag and drop to add a node to the graph
        </p>
      </div>

      <div
        className="node w-full"
        onDragStart={(event) => onDragStart(event, "prompt")}
        draggable
      >
        <PromptNodeContent />
      </div>

      <div
        className="node w-full"
        onDragStart={(event) => onDragStart(event, "code")}
        draggable
      >
        <CodeNodeContent />
      </div>
    </aside>
  );
};

export default Sidebar;
