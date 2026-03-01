import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const areaData = [
    { name: 'S1', income: 4000, expenses: 2400 },
    { name: 'S2', income: 3000, expenses: 1398 },
    { name: 'S3', income: 2000, expenses: 9800 },
    { name: 'S4', income: 2780, expenses: 3908 },
    { name: 'S5', income: 1890, expenses: 4800 },
];

const pieData = [
    { name: 'Sueldos', value: 445800 },
    { name: 'Publicidad', value: 2000000 },
    { name: 'Operativos', value: 1044000 },
];

const COLORS = ['#D391B0', '#7B466A', '#9F6496'];

export const Charts = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-2">
            <div className="lg:col-span-2 p-4 glass-panel">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xl font-bold text-white">Flujo Semanal</h3>
                    <span className="px-3 py-0.5 bg-white/10 rounded-full text-xs text-brand-light-pink font-medium">Feb 2026</span>
                </div>
                <div className="h-[140px] w-full mt-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={areaData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#D391B0" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#D391B0" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7B466A" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#7B466A" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#ffffff60" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#ffffff60" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0C0420', borderColor: '#7B466A', borderRadius: '12px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="income" stroke="#D391B0" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                            <Area type="monotone" dataKey="expenses" stroke="#7B466A" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="p-4 glass-panel flex flex-col items-center justify-center relative">
                <h3 className="text-xl font-bold text-white mb-1 self-start absolute top-4 left-4">Distribución</h3>
                <div className="h-[140px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={60}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {pieData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#5D3C64', borderRadius: '8px', border: 'none', color: '#fff' }}
                                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Monto']}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-4 w-full justify-center">
                    {pieData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-white/80">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                            {entry.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
