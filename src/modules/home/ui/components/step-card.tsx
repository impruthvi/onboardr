interface StepCardProps {
  number: string;
  title: string;
  description: string;
  active?: boolean;
}
// Step Card Component
export const StepCard = ({
  number,
  title,
  description,
  active = false,
}: StepCardProps) => {
  return (
    <div
      className={`p-4 rounded-lg border ${
        active ? "border-indigo-500 bg-indigo-50" : "border-slate-200"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
            active ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-500"
          }`}
        >
          {number}
        </div>
        <div>
          <h4
            className={`font-medium mb-1 ${
              active ? "text-indigo-700" : "text-slate-700"
            }`}
          >
            {title}
          </h4>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  );
};
