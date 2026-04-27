import TypingExamListing from "@/components/typing/TypingExamListing";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function OfficialExamsPage() {
  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <Link href="/typing" className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Practice
        </Link>
      </div>
      <TypingExamListing />
    </div>
  );
}
