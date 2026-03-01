import { Home, PieChart, Users, FileText, Settings, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Sidebar = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    return (
        <aside className="w-64 bg-gradient-to-b from-brand-dark-plum to-brand-deep-purple/90 h-screen my-4 ml-4 flex flex-col justify-between py-6 shrink-0 relative overflow-hidden rounded-2xl shadow-2xl border border-brand-light-pink/10">
            {/* Background glow specific to sidebar */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-rose-pink/10 blur-3xl rounded-full"></div>
            <div className="absolute bottom-20 left-0 w-32 h-32 bg-brand-soft-purple/10 blur-3xl rounded-full"></div>

            <div className="px-6 relative z-10">
                <h1 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                    <LayoutDashboard className="text-brand-light-pink shrink-0" />
                    <span>Planificador de Finanzas</span>
                </h1>

                <nav className="space-y-4">
                    <Link to="/" className={`flex items-center gap-4 text-white px-4 py-3 rounded-xl transition-all ${isActive('/') ? 'bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
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
                    <Link to="/reports" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive('/reports') ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                        <FileText size={20} className={isActive('/reports') ? 'text-brand-light-pink' : ''} />
                        <span className="font-medium">Reportes</span>
                    </Link>
                </nav>
            </div>

            <div className="px-6 relative z-10">
                <a href="#" className="flex items-center gap-4 text-white/70 px-4 py-3 rounded-xl transition-all hover:text-white hover:bg-white/5">
                    <Settings size={20} />
                    <span className="font-medium">Ajustes</span>
                </a>
            </div>
        </aside>
    );
};
