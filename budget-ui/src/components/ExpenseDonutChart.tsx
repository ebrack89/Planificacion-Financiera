import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useBudget } from "../context/BudgetContext";

const CHART_COLORS = [
    "#3b82f6", // blue
    "#eab308", // yellow
    "#a855f7", // purple
    "#10b981", // emerald
    "#06b6d4", // cyan
    "#e8567f", // rose-pink
    "#f97316", // orange
    "#64748b", // slate
    "#f43f5e", // rose
    "#14b8a6", // teal
    "#6366f1", // indigo
    "#f59e0b", // amber
    "#84cc16", // lime
    "#d946ef", // fuchsia
    "#0ea5e9", // sky
];

interface TooltipProps {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: { percent: number } }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-brand-deep-purple border border-brand-muted-purple/50 rounded-xl px-4 py-2.5 shadow-xl">
                <p className="text-white font-bold text-sm">{payload[0].name}</p>
                <p className="text-brand-light-pink text-sm font-semibold">
                    ${payload[0].value.toLocaleString("es-AR")}
                </p>
                <p className="text-white/50 text-xs">
                    {(payload[0].payload.percent * 100).toFixed(1)}%
                </p>
            </div>
        );
    }
    return null;
};

export const ExpenseDonutChart = () => {
    const { expenses, categories } = useBudget();

    const data = categories
        .map((cat, i) => {
            const total = expenses
                .filter(exp => exp.categoryId === cat.id)
                .reduce((sum, exp) => sum + exp.amount, 0);
            return {
                name: cat.name,
                value: total,
                color: CHART_COLORS[i % CHART_COLORS.length],
            };
        })
        .filter(d => d.value > 0)
        .sort((a, b) => b.value - a.value);

    const grandTotal = data.reduce((sum, d) => sum + d.value, 0);

    // Calculate percent for each slice
    const dataWithPercent = data.map(d => ({
        ...d,
        percent: grandTotal > 0 ? d.value / grandTotal : 0,
    }));

    if (data.length === 0) return null;

    return (
        <div className="glass-panel p-4">
            <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-2">
                Distribución de Gastos
            </h4>
            {/* Chart */}
            <div className="w-full h-40 mb-3">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={dataWithPercent}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={68}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                        >
                            {dataWithPercent.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="space-y-1.5">
                {dataWithPercent.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                        <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-white/80 text-xs font-medium">{entry.name}</span>
                        <span className="text-white/30 text-xs ml-auto">
                            ${entry.value.toLocaleString("es-AR")}
                        </span>
                        <span className="text-white/50 text-xs font-semibold w-12 text-right">
                            {(entry.percent * 100).toFixed(1)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
