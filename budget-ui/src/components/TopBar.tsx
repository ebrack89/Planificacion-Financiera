import { Menu } from "lucide-react";

interface TopBarProps {
    onMenuClick: () => void;
}

export const TopBar = ({ onMenuClick }: TopBarProps) => {
    const now = new Date();
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentPeriod = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

    return (
        <header className="flex justify-between items-center py-4 px-6 border-b border-white/5 bg-brand-dark-plum/40 backdrop-blur-md sticky top-0 z-30 shrink-0">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-colors"
                >
                    <Menu size={20} />
                </button>
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white tracking-tight">Planificación</h2>
                </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                <span className="text-xs text-brand-light-pink font-bold">{currentPeriod}</span>
            </div>
        </header>
    );
};
