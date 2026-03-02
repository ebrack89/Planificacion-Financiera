import React, { useState, useEffect } from 'react';
import { Calculator, Hourglass, Calendar, Banknote, ArrowRight } from "lucide-react";

interface SalaryCalculatorProps {
    onCalculate: (total: number, details: string) => void;
    initialHourlyRate?: number;
    initialDailyViatico?: number;
}

export const SalaryCalculator: React.FC<SalaryCalculatorProps> = ({
    onCalculate,
    initialHourlyRate = 3000,
    initialDailyViatico = 2700
}) => {
    const [hours, setHours] = useState<number>(0);
    const [hourlyRate, setHourlyRate] = useState<number>(initialHourlyRate);
    const [days, setDays] = useState<number>(0);
    const [viaticos, setViaticos] = useState<number>(initialDailyViatico);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        const calculatedTotal = (hours * hourlyRate) + (days * viaticos);
        setTotal(calculatedTotal);

        const details = `${hours}h x $${hourlyRate.toLocaleString('es-AR')} + ${days}d x $${viaticos.toLocaleString('es-AR')}`;
        onCalculate(calculatedTotal, details);
    }, [hours, hourlyRate, days, viaticos, onCalculate]);

    return (
        <div className="glass-panel p-6 bg-gradient-to-br from-brand-dark-plum/40 to-black/20 border border-white/5 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <Calculator size={22} />
                </div>
                <div>
                    <h3 className="text-white font-bold tracking-tight">Calculador de Sueldo</h3>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Fórmula Oficial</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Horas */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-white/60 ml-1">
                        <Hourglass size={14} className="text-brand-light-pink" />
                        Horas Trabajadas
                    </label>
                    <input
                        type="number"
                        value={hours || ''}
                        onChange={(e) => setHours(Number(e.target.value))}
                        placeholder="0"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-brand-light-pink transition-all"
                    />
                </div>

                {/* Precio Hora */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-white/60 ml-1">
                        <Banknote size={14} className="text-brand-light-pink" />
                        Precio por Hora
                    </label>
                    <input
                        type="number"
                        value={hourlyRate || ''}
                        onChange={(e) => setHourlyRate(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-brand-light-pink transition-all"
                    />
                </div>

                {/* Días */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-white/60 ml-1">
                        <Calendar size={14} className="text-brand-light-pink" />
                        Días Trabajados
                    </label>
                    <input
                        type="number"
                        value={days || ''}
                        onChange={(e) => setDays(Number(e.target.value))}
                        placeholder="0"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-brand-light-pink transition-all"
                    />
                </div>

                {/* Viáticos */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-white/60 ml-1">
                        <Banknote size={14} className="text-brand-light-pink" />
                        Viático Diario
                    </label>
                    <input
                        type="number"
                        value={viaticos || ''}
                        onChange={(e) => setViaticos(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-brand-light-pink transition-all"
                    />
                </div>
            </div>

            <div className="pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                    <div className="text-white/40 text-xs font-medium">Total Calculado</div>
                    <div className="flex items-center gap-2 h-8 px-3 rounded-lg bg-orange-500/10 text-orange-400 text-sm font-bold animate-pulse-slow">
                        $ {total.toLocaleString('es-AR')}
                    </div>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-white/30 italic">
                    <ArrowRight size={10} />
                    {hours}h × ${hourlyRate} + {days}d × ${viaticos}
                </div>
            </div>
        </div>
    );
};
