import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  isLoading?: boolean;
  className?: string;
};

export default function Loader({ isLoading, className }: Props) {
  if (!isLoading) return null;

  return <Loader2 className={cn("animate-spin", className)} />;
}
