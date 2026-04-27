"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { TypingEngineModule } from "@/modules/typing/TypingEngineModule";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function TypingPracticeContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const cat = searchParams.get("cat");
  const val = searchParams.get("val");
  
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  const engineConfig = useMemo(() => ({
    title: content?.title || "Practice Session",
    duration: content?.duration || 10,
    backspaceMode: content?.backspaceMode || "full",
    highlightMode: content?.highlightMode || "word",
    wordLimit: 0
  }), [content]);

  useEffect(() => {
    let isMounted = true;
    const fetchContent = async () => {
        try {
            const res = await fetch(`/api/typing/practice?type=${type}&cat=${cat}&val=${val}`);
            if (!res.ok) throw new Error("Failed to load content");
            const data = await res.json();
            if (isMounted) {
                setContent(data);
                setLoading(false);
            }
        } catch (error) {
            if (isMounted) {
                toast.error("Failed to load practice content");
                router.push('/typing');
            }
        }
    };
    fetchContent();
    return () => { isMounted = false; };
  }, [type, cat, val, router]);

  const handleComplete = (results: any) => {
    toast.success("Practice completed!");
    // For practice, we might not save to DB or we can save to a different table.
    // For now, just show a message and go back.
    router.push('/typing');
  };

  if (loading) return (
    <div className="flex justify-center py-20 min-h-screen bg-slate-50 items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <TypingEngineModule 
        passage={content?.content || ""} 
        config={engineConfig}
        onComplete={handleComplete}
      />
    </div>
  );
}

export default function TypingPracticePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TypingPracticeContent />
        </Suspense>
    )
}
