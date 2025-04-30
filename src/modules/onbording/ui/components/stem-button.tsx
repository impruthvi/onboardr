import { CheckCircle } from "lucide-react";

interface StepButtonProps {
  number: number;
  title: string;
  active?: boolean;
  completed?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const StepButton = ({
  number,
  title,
  active = false,
  completed = false,
  onClick,
  disabled = false,
}: StepButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
          flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
          ${
            active
              ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
              : ""
          }
          ${
            completed
              ? "bg-green-100 text-green-700 border border-green-300"
              : ""
          }
          ${
            !active && !completed
              ? "bg-slate-100 text-slate-700 border border-slate-200"
              : ""
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-80"}
        `}
    >
      <div
        className={`
          h-6 w-6 rounded-full flex items-center justify-center text-sm font-medium
          ${active ? "bg-indigo-600 text-white" : ""}
          ${completed ? "bg-green-600 text-white" : ""}
          ${!active && !completed ? "bg-slate-400 text-white" : ""}
        `}
      >
        {completed ? <CheckCircle className="h-4 w-4" /> : number + 1}
      </div>
      <span>{title}</span>
    </button>
  );
};
