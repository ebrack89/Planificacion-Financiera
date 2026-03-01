export const TopBar = () => {
    const now = new Date();
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentPeriod = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

    return (
        <header className="flex justify-between items-center py-2 px-6">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-wide">Planificación Financiera</h2>
                <p className="text-white/60 text-xs mt-1">Resumen mensual y control presupuestario</p>
            </div>

            <div className="flex items-center gap-6 glass-panel px-4 py-2 rounded-full">
                <div className="text-sm text-white/80">
                    <span className="opacity-60">Periodo</span> {currentPeriod}
                </div>
            </div>
        </header>
    );
};
