import AdminTypingDashboard from "@/components/admin/typing/AdminTypingDashboard";

export const metadata = {
  title: "Typing Manager | Admin",
};

export default function AdminTypingPage() {
  return (
    <div className="bg-white min-h-screen">
      <AdminTypingDashboard />
    </div>
  );
}
