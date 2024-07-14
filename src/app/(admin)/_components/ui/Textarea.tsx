import "@/app/(admin)/_styles/base/base.scss";
import TextareaStyles from "@/app/(admin)/_styles/ui/textarea.module.scss";
import React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`${TextareaStyles.textarea} ${className}`}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
