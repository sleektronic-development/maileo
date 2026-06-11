"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

import { DomainExtension } from "@/data/domain-extention";

import { CharCounter } from "@/components/partials/char-counter";
import { SendAnimation } from "@/components/partials/send-animation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { updateAnalytics } from "@/utils/analytics";

import {
  SendHorizonal,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  Undo2,
  Redo2,
  Paperclip,
  X,
} from "lucide-react";

const formSchema = z.object({
  fromName: z.string().min(1, "From Name is required"),
  fromUser: z.string().min(1, "From user is required"),
  fromOrg: z.string().min(1, "From org is required"),
  ext: z.nativeEnum(DomainExtension),
  to: z.string().min(1, "To is required"),
  replyTo: z.string().email("Invalid email").or(z.literal("")).optional(),
  cc: z.string().optional(),
  bcc: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
});

type FormValues = z.infer<typeof formSchema>;

function ToolbarButton({
  active,
  disabled,
  onClick,
  children,
  label,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={[
        "h-9 w-9 inline-flex items-center justify-center rounded-md border",
        "border-border bg-background hover:bg-muted",
        active ? "ring-2 ring-ring" : "",
        disabled ? "opacity-50 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function RichEmailEditor({
  value,
  onChange,
  disabled,
  resetKey,
}: {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
  resetKey: number;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write your email..." }),
    ],
    content: value,
    immediatelyRender: false,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "font-serif text-[16px] leading-[1.6]",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div
      key={resetKey}
      className={["space-y-4 mt-8", disabled ? "opacity-60" : ""].join(" ")}
    >
      <div className="flex flex-wrap gap-2">
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          disabled={!!disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          disabled={!!disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Underline"
          active={editor.isActive("underline")}
          disabled={!!disabled}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Bullets"
          active={editor.isActive("bulletList")}
          disabled={!!disabled}
          onClick={() => {
            if (!editor.state.selection.empty) {
              editor.chain().focus().toggleBulletList().run();
            }
          }}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Ordered"
          active={editor.isActive("orderedList")}
          disabled={!!disabled}
          onClick={() => {
            if (!editor.state.selection.empty) {
              editor.chain().focus().toggleOrderedList().run();
            }
          }}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Link"
          disabled={!!disabled}
          onClick={() => {
            const url = prompt("Enter URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Undo"
          disabled={!!disabled || !editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Redo"
          disabled={!!disabled || !editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div
        className={[
          "min-h-[200px] border !bg-input rounded-md p-3 bg-white",
          disabled ? "pointer-events-none" : "",
        ].join(" ")}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default function EmailComposer() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [html, setHtml] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [editorResetKey, setEditorResetKey] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ext: DomainExtension.GOV,
      fromName: "",
      fromUser: "",
      fromOrg: "",
      to: "",
      replyTo: "",
      cc: "",
      bcc: "",
      subject: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (!html || html.replace(/<[^>]+>/g, "").trim().length < 5) {
      toast.error("Email body is too short");
      return;
    }

    setStatus("sending");

    const toFinal = values.to.trim();
    const fromEmail = `${values.fromUser}@${values.fromOrg}.${values.ext}`;
    const ccList = (values.cc || "")
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);
    const bccList = (values.bcc || "")
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    const formData = new FormData();

    formData.append("fromName", values.fromName);
    formData.append("fromEmail", fromEmail);
    formData.append("to", toFinal);

    if (values.replyTo?.trim()) {
      formData.append("replyTo", values.replyTo.trim());
    }

    ccList.forEach((email) => formData.append("cc[]", email));
    bccList.forEach((email) => formData.append("bcc[]", email));
    formData.append("subject", values.subject);

    const htmlWithFont = `
<div style="
  font-family: 'Times New Roman', Times, serif;
  font-size: 16px;
  line-height: 1.6;
">
  ${html}
</div>
`;

    formData.append("html", htmlWithFont);

    attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    console.group("EMAIL SEND (FormData)");
    console.log("toFinal:", toFinal);
    console.log("fromEmail:", fromEmail);
    console.log("subject:", values.subject);
    console.log("cc:", ccList);
    console.log("bcc:", bccList);
    console.log("replyTo:", values.replyTo);
    console.log(
      "attachments:",
      attachments.map((file) => file.name)
    );
    console.groupEnd();

    try {
      await axios.post("/api/send", formData);

      toast.success("Email sent");
      updateAnalytics("sent");
      setStatus("success");
      form.reset();
      setHtml("");
      setAttachments([]);
      setEditorResetKey((key) => key + 1);
    } catch (err) {
      console.error(err);
      const message =
        axios.isAxiosError(err) && err.response?.data?.details
          ? String(err.response.data.details)
          : "Send failed";

      toast.error(message);
      updateAnalytics("failed");
      setStatus("error");
    }

    setTimeout(() => setStatus("idle"), 1500);
  };

  const subjectValue =
    useWatch({ control: form.control, name: "subject" }) || "";

  return (
    <div className="w-full md:max-w-3xl layout-standard md:section-padding-standard py-6 flex flex-col gap-6">
      <div>
        <Label className="text-sm font-medium">From Name</Label>
        <Input
          className="mt-2 h-[50px] border-border bg-input"
          {...form.register("fromName")}
        />
      </div>

      <div>
        <Label className="text-sm font-medium">From</Label>
        <div className="flex items-center gap-2">
          <Input
            className="mt-2 h-[50px] border-border bg-input"
            {...form.register("fromUser")}
          />
          <span>@</span>
          <Input
            className="mt-2 h-[50px] border-border bg-input"
            {...form.register("fromOrg")}
          />
          <span>.</span>

          <select
            {...form.register("ext")}
            className="h-[50px] px-2 border rounded-md"
          >
            {Object.values(DomainExtension).map((extension) => (
              <option key={extension} value={extension}>
                {extension}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">To</Label>
        <Input
          className="mt-2 h-[50px] border-border bg-input"
          {...form.register("to")}
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Reply To</Label>
        <Input
          className="mt-2 h-[50px] border-border bg-input"
          {...form.register("replyTo")}
        />
      </div>

      <div>
        <Label className="text-sm font-medium">CC</Label>
        <Input
          className="mt-2 h-[50px] border-border bg-input"
          {...form.register("cc")}
        />
      </div>

      <div>
        <Label className="text-sm font-medium">BCC</Label>
        <Input
          className="mt-2 h-[50px] border-border bg-input"
          {...form.register("bcc")}
        />
      </div>

      <div>
        <Label className="text-sm font-medium">Subject</Label>
        <Input
          className="mt-2 h-[50px] border-border bg-input"
          {...form.register("subject")}
        />
        <CharCounter value={subjectValue} limit={150} />
      </div>

      <Separator />

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="md:w-[300px] w-full h-12 bg-primary hover:bg-primary-hover !text-primary-foreground"
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <Paperclip className="h-4 w-4" /> File Attachment
        </Button>

        <input
          id="file-input"
          type="file"
          multiple
          className="hidden"
          onChange={(event) => {
            const files = Array.from(event.target.files || []);
            if (!files.length) return;

            setAttachments((current) => [...current, ...files]);
            event.currentTarget.value = "";
          }}
        />
      </div>

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 px-3 py-1 text-sm border rounded-full bg-muted"
            >
              <span className="max-w-[200px] truncate">{file.name}</span>
              <button
                type="button"
                onClick={() =>
                  setAttachments((current) =>
                    current.filter((_, itemIndex) => itemIndex !== index)
                  )
                }
              >
                <X className="h-3 w-3 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}

      <RichEmailEditor
        value={html}
        onChange={setHtml}
        resetKey={editorResetKey}
      />

      <div className="flex items-center justify-between mt-4">
        <SendAnimation status={status} />

        <Button
          className="h-12 !rounded-sm hover:bg-primary-hover"
          onClick={form.handleSubmit(onSubmit)}
          disabled={status === "sending"}
        >
          <SendHorizonal className="h-4 w-4" />
          Send Email
        </Button>
      </div>
    </div>
  );
}
