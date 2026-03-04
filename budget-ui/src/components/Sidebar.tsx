import { Home, PieChart, Users, FileText, Settings, LayoutDashboard, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-brand-dark-plum/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed md:sticky top-0 left-0 z-50
                w-72 md:w-64 bg-gradient-to-b from-brand-dark-plum to-brand-deep-purple/90 h-[calc(100vh-2rem)] my-4 ml-0 md:ml-4 
                flex flex-col justify-between py-6 shrink-0 overflow-hidden rounded-r-2xl md:rounded-2xl shadow-2xl border border-brand-light-pink/10
                transition-transform duration-300 ease-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Background glow specific to sidebar */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-rose-pink/10 blur-3xl rounded-full"></div>

                <div className="px-6 relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                            <LayoutDashboard className="text-brand-light-pink shrink-0" />
                            <span>Planificador</span>
                        </h1>
                        <button onClick={onClose} className="md:hidden text-white/60 hover:text-white p-1">
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="space-y-4">
                        <Link to="/" onClick={() => onClose()} className={`flex items-center gap-4 text-white px-4 py-3 rounded-xl transition-all ${isActive('/') ? 'bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                            <Home size={20} className={isActive('/') ? 'text-brand-light-pink' : ''} />
                            <span className="font-medium">Dashboard</span>
                        </Link>
                        <a href="#" className="flex items-center gap-4 text-white/70 px-4 py-3 rounded-xl transition-all hover:text-white hover:bg-white/5">
                            <PieChart size={20} />
                            <span className="font-medium">Presupuesto</span>
                        </a>
                        <a href="#" className="flex items-center gap-4 text-white/70 px-4 py-3 rounded-xl transition-all hover:text-white hover:bg-white/5">
                            <Users size={20} />
                            <span className="font-medium">Planificación</span>
                        </a>
                        <Link to="/reports" onClick={() => onClose()} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive('/reports') ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                            <FileText size={20} className={isActive('/reports') ? 'text-brand-light-pink' : ''} />
                            <span className="font-medium">Reportes</span>
                        </Link>
                    </nav>
                </div>

                <div className="px-6 relative z-10">
                    <Link to="/settings" onClick={() => onClose()} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive('/settings') ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                        <Settings size={20} className={isActive('/settings') ? 'text-brand-light-pink' : ''} />
                        <span className="font-medium">Ajustes</span>
                    </Link>
                </div>
            </aside>
        </>
    );
};
