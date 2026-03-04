import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface UserCardProps {
    id: string;
    name: string;
    balance: string;
    variant: "primary" | "secondary";
}

export const UserCard = ({ id, name, balance, variant }: UserCardProps) => {
    const isPrimary = variant === "primary";
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/user-incomes/${id}`)}
            className={`p-5 rounded-3xl relative overflow-hidden transition-transform hover:scale-105 cursor-pointer 
      ${isPrimary
                    ? 'bg-gradient-to-br from-[#5D3C64] to-[#7B466A] border border-white/20 shadow-lg shadow-[#7B466A]/30'
                    : 'bg-gradient-to-br from-[#9F6496] to-[#D391B0] border border-white/30 shadow-lg shadow-[#D391B0]/30'
                }`}
        >
            {/* Decorative Glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-50 
        ${isPrimary ? 'bg-[#D391B0]' : 'bg-white'}`}></div>

            <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30">
                        <span className="text-xl font-bold text-white">{name.charAt(0)}</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Ingresos de {name}</h3>
                    </div>
                </div>
                <Link
                    to={`/add-transaction?type=ingreso&user=${id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shadow-sm ml-auto text-white"
                    title="Añadir Ingreso"
                >
                    <Plus size={20} />
                </Link>
            </div>

            <div className="mb-2 relative z-10">
                <div className="w-full h-[2px] bg-white/10 rounded-full mb-1">
                    <div className="h-full bg-white/40 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-xs text-white/60">Límite Mensual</span>
            </div>

            <div className="flex justify-between items-end relative z-10">
                <div>
                    <p className="text-sm text-white/70 mb-1">Disponible</p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">${balance}</h2>
                </div>
            </div>
        </div>
    );
};
