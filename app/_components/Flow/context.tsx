"use client";
import { createSafeContext } from "@/lib/safeContext";
import { Dispatch, SetStateAction } from "react";
import { NodeType } from "./nodes";

interface FlowContextType {
  type: NodeType;
  setType: Dispatch<SetStateAction<NodeType>>;
}

export const [FlowContextProvider, useFlowContext] =
  createSafeContext<FlowContextType>(
    "Flow context component was not found in the tree"
  );
