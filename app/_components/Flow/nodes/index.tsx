import { Node } from "@xyflow/react";
import PromptNode from "./prompt";
import CodeNode from "./code";
import { JsonValue } from "type-fest";
import TriggerNode from "./trigger";

const nodeTypes = {
  prompt: PromptNode,
  code: CodeNode,
  trigger: TriggerNode,
};

export type NodeType = keyof typeof nodeTypes;

export type NodeData = Node<{
  inputValues: Record<string, JsonValue>;
  outputValues: Record<
    string,
    {
      type: "string" | "object";
      response: JsonValue;
    }
  >;
}>;

export default nodeTypes;
