import TypingExamListing from "@/components/typing/TypingExamListing";

export const metadata = {
  title: "Typing Exams | National Genius Institute",
  description: "Practice and excel in government-standard typing tests.",
};

export default function TypingPage() {
  return (
    <div className="pt-20">
      <TypingExamListing />
    </div>
  );
}
