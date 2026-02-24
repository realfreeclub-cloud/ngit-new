import { getCourseDetails } from "@/app/actions/courses";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    PlayCircle, CheckCircle2, Lock, FileText,
    Brain, Clock, BookOpen, Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LessonType } from "@/models/Lesson";

const typeLabel: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    VIDEO: { label: "Video", icon: PlayCircle, color: "text-primary", bg: "bg-primary/10" },
    PDF: { label: "PDF", icon: FileText, color: "text-red-600", bg: "bg-red-50" },
    QUIZ: { label: "Quiz", icon: Brain, color: "text-indigo-600", bg: "bg-indigo-50" },
};

export default async function CourseOverviewPage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;
    const data = await getCourseDetails(courseId);

    if (!data.success || !data.course) notFound();

    const { course, lessons, enrollment, completedLessonIds = [] } = data;

    // Which lesson to resume
    const lastId = enrollment?.lastWatchedLessonId?._id ?? enrollment?.lastWatchedLessonId;
    const nextLesson =
        lastId
            ? lessons.find((l: any) => l._id.toString() === lastId.toString()) ?? lessons[0]
            : lessons[0];

    const completedCount = completedLessonIds.length;
    const progressPct = enrollment?.progress ?? 0;

    return (
        <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-10 animate-in fade-in duration-500">

            {/* Hero */}
            <div className="text-center space-y-4 py-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-indigo-100 rounded-[1.5rem] flex items-center justify-center text-primary mx-auto shadow">
                    <BookOpen className="w-10 h-10" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{course.title}</h1>
                {course.description && (
                    <p className="text-slate-500 leading-relaxed max-w-xl mx-auto text-base">{course.description}</p>
                )}

                {/* Stats row */}
                <div className="flex items-center justify-center gap-6 text-sm font-bold text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{lessons.length} Lessons</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" />{completedCount} Completed</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="flex items-center gap-1.5 text-primary"><Trophy className="w-4 h-4" />{progressPct}% Progress</span>
                </div>

                {/* Progress bar */}
                {progressPct > 0 && (
                    <div className="max-w-xs mx-auto">
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-primary to-indigo-500 h-full rounded-full transition-all duration-700"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* CTA */}
                {lessons.length > 0 ? (
                    <Link href={`/student/courses/${courseId}/lessons/${nextLesson?._id ?? lessons[0]._id}`}>
                        <Button
                            size="lg"
                            className="h-14 px-10 rounded-2xl text-lg font-bold gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all bg-gradient-to-r from-primary to-indigo-600 mt-2"
                        >
                            {progressPct > 0 ? "Resume Learning" : "Start Learning"}
                            <PlayCircle className="w-5 h-5 fill-white" />
                        </Button>
                    </Link>
                ) : (
                    <div className="bg-slate-50 border-2 border-dashed rounded-2xl p-8 text-center text-slate-400">
                        No lessons uploaded yet. Check back soon!
                    </div>
                )}
            </div>

            {/* Lesson Roadmap */}
            {lessons.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-black text-slate-900">
                        Course Roadmap
                        <span className="ml-2 text-sm font-normal text-slate-400">
                            ({completedCount}/{lessons.length} done)
                        </span>
                    </h2>

                    <div className="relative">
                        {/* Vertical connector line */}
                        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-100" />

                        <div className="space-y-3">
                            {lessons.map((lesson: any, index: number) => {
                                const isCompleted = completedLessonIds.includes(lesson._id.toString());
                                const isLocked = !lesson.isFree && !enrollment?.isActive;
                                const isCurrent =
                                    nextLesson?._id?.toString() === lesson._id.toString() &&
                                    !isCompleted;
                                const meta = typeLabel[lesson.type] ?? typeLabel.VIDEO;
                                const IconComp = meta.icon;

                                return (
                                    <div key={lesson._id} className="flex items-start gap-4 relative">
                                        {/* Step node */}
                                        <div className={cn(
                                            "z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-black text-sm border-2 transition-all",
                                            isCompleted
                                                ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200"
                                                : isCurrent
                                                    ? "bg-primary border-primary text-white shadow-md shadow-primary/30 scale-110"
                                                    : isLocked
                                                        ? "bg-white border-slate-200 text-slate-300"
                                                        : "bg-white border-slate-200 text-slate-500"
                                        )}>
                                            {isCompleted
                                                ? <CheckCircle2 className="w-5 h-5" />
                                                : isLocked
                                                    ? <Lock className="w-4 h-4" />
                                                    : index + 1
                                            }
                                        </div>

                                        {/* Card */}
                                        <Link
                                            href={isLocked ? "#" : `/student/courses/${courseId}/lessons/${lesson._id}`}
                                            className={cn(
                                                "flex-1 group flex items-center justify-between gap-4 border-2 rounded-2xl p-4 transition-all",
                                                isCompleted
                                                    ? "bg-emerald-50 border-emerald-100 hover:border-emerald-300"
                                                    : isCurrent
                                                        ? "bg-primary/5 border-primary/30 hover:border-primary/60 shadow-sm"
                                                        : isLocked
                                                            ? "bg-slate-50 border-slate-100 cursor-not-allowed opacity-60"
                                                            : "bg-white border-slate-100 hover:border-primary/30 hover:shadow-sm"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", meta.bg, meta.color)}>
                                                    <IconComp className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={cn(
                                                        "font-bold text-sm line-clamp-1 transition-colors",
                                                        isCompleted ? "text-emerald-800" : isCurrent ? "text-primary" : "text-slate-800"
                                                    )}>
                                                        {lesson.title}
                                                        {isCurrent && (
                                                            <span className="ml-2 text-[9px] font-black bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                                Continue
                                                            </span>
                                                        )}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className={cn("text-[10px] font-bold uppercase tracking-wider", meta.color)}>
                                                            {meta.label}
                                                        </span>
                                                        {lesson.duration && (
                                                            <span className="flex items-center gap-0.5 text-[10px] text-slate-400 font-medium">
                                                                <Clock className="w-3 h-3" /> {lesson.duration}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right badge */}
                                            <div className="shrink-0">
                                                {isCompleted ? (
                                                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                        ✓ Done
                                                    </span>
                                                ) : isLocked ? (
                                                    <Lock className="w-4 h-4 text-slate-300" />
                                                ) : (
                                                    <PlayCircle className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                                                )}
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
