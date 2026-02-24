import { Trophy, Users, TrendingUp, Target } from "lucide-react";

const defaultStats = [
    {
        icon: Trophy,
        value: "15+",
        label: "Years of Excellence",
        color: "text-accent",
        bg: "bg-accent/10",
    },
    {
        icon: Users,
        value: "5000+",
        label: "Students Trained",
        color: "text-primary",
        bg: "bg-primary/10",
    },
    {
        icon: TrendingUp,
        value: "98%",
        label: "Success Rate",
        color: "text-secondary",
        bg: "bg-secondary/10",
    },
    {
        icon: Target,
        value: "45",
        label: "Top 100 Ranks",
        color: "text-error",
        bg: "bg-error/10",
    },
];

interface TrustIndicatorsProps {
    stats?: any[];
}

export default function TrustIndicators({ stats }: TrustIndicatorsProps) {
    // Merge dynamic values with static icons/colors
    const displayStats = stats && stats.length === 4 ? stats.map((s, i) => ({
        ...defaultStats[i],
        value: s.value,
        label: s.label
    })) : defaultStats;
    return (
        <div className="bg-gradient-to-b from-gray-50 to-white border-y border-gray-200 py-16 md:py-20">
            <div className="container-custom">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                    {displayStats.map((stat, index) => (
                        <div key={index} className="text-center group">
                            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${stat.bg} ${stat.color} mb-5 group-hover:scale-110 transition-transform duration-300 shadow-soft`}>
                                <stat.icon className="w-10 h-10" />
                            </div>
                            <h3 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 mb-2">
                                {stat.value}
                            </h3>
                            <p className="text-sm md:text-base font-bold text-gray-600 uppercase tracking-wider">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
