import TypingResultDetails from "@/components/typing/TypingResultDetails";
import { Suspense } from "react";

export default function ResultPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="p-20 text-center font-bold">Loading Report...</div>}>
      <TypingResultDetails params={params} />
    </Suspense>
  );
}
