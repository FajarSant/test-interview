"use client";

import React, { useCallback, useMemo } from "react";
import {
  createEditor,
  Descendant,
  Editor,
  Element as SlateElement,
  Transforms,
  BaseEditor,
} from "slate";
import {
  Slate,
  Editable,
  withReact,
  useSlate,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";
import { Button } from "@/components/ui/button";

import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
} from "lucide-react";

// 👇 Custom Types
type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

type ParagraphElement = {
  type: "paragraph";
  align?: "left" | "center" | "right" | "justify";
  children: CustomText[];
};

type ListItemElement = {
  type: "list-item";
  children: CustomText[];
};

type BulletedListElement = {
  type: "bulleted-list";
  children: ListItemElement[];
};

type NumberedListElement = {
  type: "numbered-list";
  children: ListItemElement[];
};

type CustomElement =
  | ParagraphElement
  | ListItemElement
  | BulletedListElement
  | NumberedListElement;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    align: "left",
    children: [{ text: "Tulis artikel di sini..." }],
  },
];

interface RichTextEditorProps {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );

  return (
    <Slate editor={editor} initialValue={value} onChange={onChange}>
      <div className="flex flex-wrap gap-2 mb-2">
        {/* Marks */}
        <MarkButton format="bold">
          <Bold size={16} />
        </MarkButton>
        <MarkButton format="italic">
          <Italic size={16} />
        </MarkButton>
        <MarkButton format="underline">
          <Underline size={16} />
        </MarkButton>

        {/* Alignment */}
        <AlignButton format="left">
          <AlignLeft size={16} />
        </AlignButton>
        <AlignButton format="center">
          <AlignCenter size={16} />
        </AlignButton>
        <AlignButton format="right">
          <AlignRight size={16} />
        </AlignButton>
        <AlignButton format="justify">
          <AlignJustify size={16} />
        </AlignButton>

        {/* Blocks */}
        <BlockButton format="bulleted-list">
          <List size={16} />
        </BlockButton>
        <BlockButton format="numbered-list">
          <ListOrdered size={16} />
        </BlockButton>
      </div>

      <Editable
        renderLeaf={renderLeaf}
        renderElement={renderElement}
        placeholder="Tulis konten artikel..."
        className="min-h-[150px] p-2 border rounded"
      />
    </Slate>
  );
}

// 🔤 Inline formatting
function isMarkActive(editor: Editor, format: keyof Omit<CustomText, "text">) {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

function toggleMark(editor: Editor, format: keyof Omit<CustomText, "text">) {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

function MarkButton({
  format,
  children,
}: {
  format: keyof Omit<CustomText, "text">;
  children: React.ReactNode;
}) {
  const editor = useSlate();
  const active = isMarkActive(editor, format);
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="sm"
      className={active ? "bg-blue-500 text-white" : ""}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
      aria-pressed={active}
      title={format.charAt(0).toUpperCase() + format.slice(1)}
    >
      {children}
    </Button>
  );
}

// 📐 Alignment formatting
function isAlignActive(editor: Editor, format: ParagraphElement["align"]) {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      "align" in n &&
      n.align === format,
  });
  return !!match;
}

function toggleAlign(editor: Editor, format: ParagraphElement["align"]) {
  const isActive = isAlignActive(editor, format);
  Transforms.setNodes<SlateElement>(
    editor,
    { align: isActive ? undefined : format },
    { match: (n) => SlateElement.isElement(n), split: true }
  );
}

function AlignButton({
  format,
  children,
}: {
  format: ParagraphElement["align"];
  children: React.ReactNode;
}) {
  const editor = useSlate();
  const active = isAlignActive(editor, format);
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="sm"
      className={active ? "bg-blue-500 text-white" : ""}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleAlign(editor, format);
      }}
      aria-pressed={active}
      title={
        format
          ? "Align " + format.charAt(0).toUpperCase() + format.slice(1)
          : "Align"
      }
    >
      {children}
    </Button>
  );
}

// 🔳 Block formatting (list)
function isBlockActive(editor: Editor, format: CustomElement["type"]) {
  const [match] = Editor.nodes(editor, {
    match: (n): n is SlateElement =>
      SlateElement.isElement(n) && n.type === format,
  });
  return !!match;
}

function toggleBlock(editor: Editor, format: CustomElement["type"]) {
  const isActive = isBlockActive(editor, format);
  const isList = format === "bulleted-list" || format === "numbered-list";

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      SlateElement.isElement(n) &&
      (n.type === "bulleted-list" || n.type === "numbered-list"),
    split: true,
  });

  const newType: CustomElement["type"] = isActive
    ? "paragraph"
    : isList
    ? "list-item"
    : format;

  Transforms.setNodes(editor, { type: newType });

  if (!isActive && isList) {
    const block: SlateElement = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

function BlockButton({
  format,
  children,
}: {
  format: CustomElement["type"];
  children: React.ReactNode;
}) {
  const editor = useSlate();
  const active = isBlockActive(editor, format);
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="sm"
      className={active ? "bg-blue-500 text-white" : ""}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleBlock(editor, format);
      }}
      aria-pressed={active}
      title={format}
    >
      {children}
    </Button>
  );
}

// 🔤 Leaf rendering
function Leaf({ attributes, children, leaf }: RenderLeafProps) {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  return <span {...attributes}>{children}</span>;
}

// 🔳 Block rendering
function Element({ attributes, children, element }: RenderElementProps) {
  const style = {
    textAlign: "align" in element && element.align ? element.align : "left",
  };

  switch (element.type) {
    case "bulleted-list":
      return (
        <ul {...attributes} className="list-disc pl-6" style={style}>
          {children}
        </ul>
      );
    case "numbered-list":
      return (
        <ol {...attributes} className="list-decimal pl-6" style={style}>
          {children}
        </ol>
      );
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "paragraph":
    default:
      return (
        <p {...attributes} style={style}>
          {children}
        </p>
      );
  }
}
