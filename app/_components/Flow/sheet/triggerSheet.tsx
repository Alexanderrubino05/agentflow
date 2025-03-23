import { Node, useReactFlow } from "@xyflow/react";
import { NodeData } from "../nodes";
import { Button } from "@/components/ui/button";
import { Expand, PlusIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface TriggerSheetProps {
  node: Node;
}

const TriggerSheet = ({ node }: TriggerSheetProps) => {
  const { updateNodeData } = useReactFlow();
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [editingKeys, setEditingKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    const inputValues = node
      ? ((node.data as NodeData["data"]).inputValues as Record<string, string>)
      : {};

    setInputValues(inputValues);
    // Initialize editing keys with current keys
    const initialEditingKeys = Object.keys(inputValues).reduce(
      (acc, key) => ({ ...acc, [key]: key }),
      {}
    );
    setEditingKeys(initialEditingKeys);
  }, [node]);

  const handleKeyChange = (oldKey: string, newKey: string) => {
    setEditingKeys((prev) => ({ ...prev, [oldKey]: newKey }));
  };

  const handleKeyBlur = (oldKey: string) => {
    const newKey = editingKeys[oldKey];
    if (newKey !== oldKey) {
      const newInputValues = { ...inputValues };
      delete newInputValues[oldKey];
      newInputValues[newKey] = inputValues[oldKey];
      setInputValues(newInputValues);
      setEditingKeys({ ...editingKeys, [newKey]: newKey });
    }
  };

  const handleSave = () => {
    updateNodeData(node.id, { inputValues });
  };

  return (
    <>
      <p className="text-sm text-muted-foreground">
        A trigger node is used to start the flow.
      </p>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Input Variables</p>
          <p className="text-sm text-muted-foreground">
            Enter the input variables that will be used to start the flow.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 bg-secondary rounded-md p-2 border">
            {Object.keys(inputValues).length === 0 ? (
              <p className="text-sm text-muted-foreground p-2">
                No input variables found.
              </p>
            ) : (
              <>
                <Expand className="w-3 h-3 cursor-pointer transition-opacity hover:opacity-50" />
              </>
            )}

            {Object.entries(inputValues).map(([key, value]) => (
              <div key={key} className="flex gap-1 items-center">
                <Input
                  type="text"
                  value={editingKeys[key]}
                  onChange={(e) => handleKeyChange(key, e.target.value)}
                  onBlur={() => handleKeyBlur(key)}
                  placeholder="Key"
                />
                <Input
                  type="text"
                  value={value}
                  placeholder="Value"
                  onChange={(e) => {
                    setInputValues({ ...inputValues, [key]: e.target.value });
                  }}
                />

                <X
                  className="w-8 h-8 text-red-700 transition-opacity hover:opacity-50 cursor-pointer"
                  onClick={() => {
                    const newInputValues = { ...inputValues };
                    delete newInputValues[key];
                    setInputValues(newInputValues);

                    const newEditingKeys = { ...editingKeys };
                    delete newEditingKeys[key];
                    setEditingKeys(newEditingKeys);
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2 self-end">
            <Button
              icon={<PlusIcon />}
              variant="outline"
              type="button"
              size="sm"
              className="w-fit"
              onClick={() => {
                const newKey = "";
                setInputValues({
                  ...inputValues,
                  [newKey]: "",
                });
                setEditingKeys({ ...editingKeys, [newKey]: newKey });
              }}
            >
              Add Variable
            </Button>

            <Button
              type="button"
              size="sm"
              className="w-fit"
              onClick={handleSave}
              disabled={Object.keys(inputValues).length === 0}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TriggerSheet;
