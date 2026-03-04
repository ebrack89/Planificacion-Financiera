import React, { useRef, useState } from 'react';
import { Download, Upload, Settings as SettingsIcon, AlertCircle, CheckCircle2, CloudLightning, Loader2 } from "lucide-react";
import { useBudget } from '../context/BudgetContext';

export const SettingsPage = () => {
    const { exportData, importData, syncToCloud } = useBudget();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
    const [isSyncing, setIsSyncing] = useState(false);

    const handleExport = () => {
        try {
            exportData();
            setStatus({ type: 'success', message: 'Datos exportados correctamente. Revisa tus descargas.' });
        } catch (error) {
            setStatus({ type: 'error', message: 'Error al exportar los datos.' });
        }
    };

    const handleSyncToCloud = async () => {
        setIsSyncing(true);
        setStatus({ type: null, message: '' });
        try {
            await syncToCloud();
            setStatus({ type: 'success', message: '¡Sincronización completa! Todos tus datos locales están ahora en la nube.' });
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: 'Error al sincronizar con la nube.' });
        } finally {
            setIsSyncing(false);
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                importData(json);
                setStatus({ type: 'success', message: '¡Datos importados con éxito! La página se ha actualizado.' });
            } catch (error) {
                setStatus({ type: 'error', message: 'El archivo no es válido o está dañado.' });
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    return (
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            <header className="mb-8 mt-2">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-brand-rose-pink/20 rounded-lg">
                        <SettingsIcon className="text-brand-rose-pink" size={24} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Ajustes</h1>
                </div>
                <p className="text-white/60 text-sm md:text-base">Gestiona tus datos y configuración de la aplicación</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                {/* Cloud Sync Card */}
                <div className="bg-brand-rose-pink/5 backdrop-blur-xl border border-brand-rose-pink/20 rounded-3xl p-8 hover:border-brand-rose-pink/40 transition-all group col-span-1 md:col-span-2">
                    <div className="w-12 h-12 bg-brand-rose-pink/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <CloudLightning className="text-brand-rose-pink" size={24} />
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-3">Sincronizar con la Nube (Real-Time)</h2>
                    <p className="text-white/50 mb-6 text-sm leading-relaxed">
                        Migra tus datos locales a la base de datos en tiempo real. Esto permitirá que todos tus dispositivos estén sincronizados automáticamente.
                        <strong> Solo necesitas hacer esto una vez por dispositivo para subir lo que ya tienes.</strong>
                    </p>
                    <button
                        onClick={handleSyncToCloud}
                        disabled={isSyncing}
                        className="w-full py-4 bg-brand-rose-pink hover:bg-brand-rose-pink/80 disabled:opacity-50 text-white rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-rose-pink/20"
                    >
                        {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <CloudLightning size={18} />}
                        {isSyncing ? 'Sincronizando...' : 'Subir datos a la Nube'}
                    </button>
                </div>

                {/* Export Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-brand-rose-pink/30 transition-all group">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Download className="text-blue-400" size={24} />
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-3">Exportar Datos</h2>
                    <p className="text-white/50 mb-6 text-sm leading-relaxed">
                        Descarga una copia de seguridad de toda tu planificación financiera en un archivo JSON.
                    </p>
                    <button
                        onClick={handleExport}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                        <Download size={18} />
                        Descargar Respaldo
                    </button>
                </div>

                {/* Import Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-brand-soft-purple/30 transition-all group">
                    <div className="w-12 h-12 bg-brand-soft-purple/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Upload className="text-brand-soft-purple" size={24} />
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-3">Importar Datos</h2>
                    <p className="text-white/50 mb-6 text-sm leading-relaxed">
                        Sube un archivo de respaldo previamente exportado.
                    </p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".json"
                        className="hidden"
                    />
                    <button
                        onClick={handleImportClick}
                        className="w-full py-4 bg-brand-soft-purple hover:bg-brand-soft-purple/80 text-white rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-soft-purple/20"
                    >
                        <Upload size={18} />
                        Subir Archivo
                    </button>
                </div>
            </div>

            {status.type && (
                <div className={`mt-8 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-4xl ${status.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}>
                    {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <p className="font-medium">{status.message}</p>
                </div>
            )}
        </main>
    );
};
