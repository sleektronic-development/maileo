export interface CharCounterProps {
  value: string;
  limit?: number;
  className?: string;
}

type SendStatus = "idle" | "sending" | "success" | "error";

export interface SendAnimationProps {
  status: SendStatus;
  className?: string;
}

export type ToolbarButtonProps = {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
};
