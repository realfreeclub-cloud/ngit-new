import { getQuestions } from "@/app/actions/questions";
import { getAllCourses } from "@/app/actions/courses";
import QuestionBankClient from "@/components/admin/questions/QuestionBankClient";

export const dynamic = "force-dynamic";

export default async function QuestionBankPage() {
    const [questionsRes, coursesRes] = await Promise.all([
        getQuestions(),
        getAllCourses()
    ]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Question Bank</h1>
            <QuestionBankClient
                initialQuestions={questionsRes.questions || []}
                courses={coursesRes.courses || []}
            />
        </div>
    );
}
