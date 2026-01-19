"use client";

import * as React from "react";

// --- Utility Function ---
type ClassValue = string | number | boolean | null | undefined;
function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}

// --- SVG Icon Components ---
const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 5.25L12 18.75"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.75 12L12 5.25L5.25 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Props Interface ---
interface PromptBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// --- The PromptBox Component ---
export function PromptBox({
  value,
  onChange,
  onSubmit,
  placeholder = "Describe your startup idea...",
  disabled = false,
  className,
}: PromptBoxProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  React.useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim().length >= 10 && !disabled) {
        onSubmit();
      }
    }
  };

  const hasText = value.trim().length > 0;
  const canSubmit = value.trim().length >= 10;

  const handleClick = () => {
    if (canSubmit && !disabled) {
      onSubmit();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-[28px] p-2 shadow-sm transition-colors bg-surface border border-foreground/20 cursor-text",
        "focus-within:border-yc-orange focus-within:ring-1 focus-within:ring-yc-orange",
        className
      )}
      onClick={() => textareaRef.current?.focus()}
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full resize-none border-0 bg-transparent p-3 text-foreground text-lg placeholder:text-foreground/40 focus:ring-0 focus-visible:outline-none min-h-12"
      />

      <div className="mt-0.5 p-1 pt-0">
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleClick}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              hasText
                ? "bg-yc-orange text-black hover:scale-105 hover:shadow-[0_0_20px_rgba(255,102,0,0.5)] cursor-pointer"
                : "bg-foreground/20 text-foreground/40 cursor-not-allowed"
            )}
          >
            <SendIcon className="h-6 w-6" />
            <span className="sr-only">Validate idea</span>
          </button>
        </div>
      </div>
    </div>
  );
}
