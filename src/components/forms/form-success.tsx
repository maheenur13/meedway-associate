import { CheckCircle2 } from "lucide-react";

export function FormSuccess({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-success/30 bg-success/10 px-6 py-10 text-center">
      <CheckCircle2 className="h-10 w-10 text-success" />
      <p className="max-w-sm text-[15px] font-medium text-ink">{message}</p>
    </div>
  );
}
