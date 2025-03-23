"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/packages/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface PromptDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const PromptDialog = ({ open, onOpenChange, children }: PromptDialogProps) => {
  const [isOpen, setIsOpen] = useState(open);
  const [inputVariables, setInputVariables] = useState<string[]>([]);

  const createPrompt = api.library.createPrompt.useMutation();
  const utils = api.useUtils();

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const extractVariables = (text: string) => {
    const matches = text.match(/\{([^}]+)\}/g) || [];
    return [...new Set(matches.map((match) => match.slice(1, -1)))];
  };

  const formSchema = z.object({
    title: z.string().min(1),
    prompt: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      prompt: "",
    },
    reValidateMode: "onChange",
  });

  // Watch for changes in the prompt field
  const prompt = form.watch("prompt");

  useEffect(() => {
    const variables = extractVariables(prompt);
    setInputVariables(variables);
  }, [prompt]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await createPrompt.mutateAsync({
      title: data.title,
      prompt: data.prompt,
      inputValues: inputVariables,
    });

    utils.library.getPrompts.invalidate();

    form.reset();
    setIsOpen(false);
    onOpenChange?.(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        onOpenChange?.(open);
        form.reset();
      }}
    >
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto min-w-[65vw]"
        onKeyDown={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Create a Prompt</DialogTitle>
          <DialogDescription>
            Create a prompt to use in your flow.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a title for your prompt"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      className="h-60 resize-none"
                      placeholder="Write your prompt here..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Define an input variable with {"{brackets}"}
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="flex gap-2 items-center w-full overflow-x-auto">
              <h3 className="text-sm font-medium">Input Variables:</h3>

              {inputVariables.map((variable, index) => (
                <div
                  key={index}
                  className="text-sm bg-secondary rounded-full p-1 px-3 border"
                >
                  {variable}
                </div>
              ))}

              {inputVariables.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No input variables detected
                </div>
              )}
            </div>

            <Button
              isLoading={createPrompt.isPending}
              type="submit"
              className="w-fit self-end"
            >
              Create Prompt
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PromptDialog;
