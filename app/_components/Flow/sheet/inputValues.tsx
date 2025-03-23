import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NodeData } from "../nodes";
import { useNodesData } from "@xyflow/react";
import { NodeConnection } from "@xyflow/system";
import { useMemo } from "react";

const ConnectionItem = ({ source }: { source: string }) => {
  const nodeData = useNodesData(source)?.data as NodeData["data"];
  return (
    <>
      {Object.entries(nodeData.outputValues).map(([key]) => (
        <SelectItem key={key} value={key}>
          {source} - {key}
        </SelectItem>
      ))}
    </>
  );
};

const SheetInputValues = ({
  inputValues,
  connections,
}: {
  inputValues: NodeData["data"]["inputValues"];
  connections: NodeConnection[];
}) => {
  const SelectItems = useMemo(() => {
    return (
      <>
        {connections.map((con) => (
          <ConnectionItem key={con.source} source={con.source} />
        ))}
      </>
    );
  }, [connections]);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">Input Values</h3>

      <div className="flex flex-col gap-2 bg-secondary rounded-md p-2 border">
        <span className="text-xs text-muted-foreground">
          {Object.keys(inputValues).length} / {Object.keys(inputValues).length}
        </span>

        {Object.entries(inputValues).map(([key]) => (
          <div key={key} className="flex justify-between items-center gap-2">
            <label>{key}</label>
            <Select>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>{SelectItems}</SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SheetInputValues;
