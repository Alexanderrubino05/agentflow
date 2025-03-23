"use client";

import {
  ReactFlow,
  addEdge,
  type Node,
  Background,
  Controls,
  useReactFlow,
  useNodesState,
  useEdgesState,
  type Connection,
} from "@xyflow/react";
import { useRef, useState } from "react";
import { useCallback } from "react";
import { FlowContextProvider } from "./context";
import Sidebar from "./sidebar";
import nodeTypes, { NodeData, NodeType } from "./nodes";
import NodeSheet from "./sheet/nodeSheet";

let id = 0;
const getId = () => `node${id++}`;

const Flow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [type, setType] = useState<NodeType>("prompt");
  const [selectedNode, setSelectedNode] = useState<Node | undefined>(undefined);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode: NodeData = {
        id: getId(),
        type,
        position,
        data: {
          inputValues: {},
          outputValues: {},
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, type, setNodes]
  );

  return (
    <FlowContextProvider value={{ type, setType }}>
      <div className="flex h-full relative grow">
        <Sidebar />
        <div className="h-full w-full" ref={reactFlowWrapper}>
          <ReactFlow
            proOptions={{ hideAttribution: true }}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={(_, node) => setSelectedNode(node)}
            onPaneClick={() => setSelectedNode(undefined)}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            nodeTypes={nodeTypes}
          >
            <Background />
            <Controls className="absolute bottom-2 left-2 flex items-center gap-2" />
          </ReactFlow>
        </div>

        <NodeSheet node={selectedNode} />
      </div>
    </FlowContextProvider>
  );
};

export default Flow;
