import React from 'react';

const StatCard = ({ title, value, icon, color, onClick, clickable }: any) => (
<div
onClick={clickable ? onClick : undefined}
className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 transition-all ${clickable ? 'cursor-pointer hover:shadow-md hover:scale-[1.02]' : ''}`}
>
<div className={`p-4 rounded-full ${color} shrink-0`}>{icon}</div>
<div className="min-w-0">
<p className="text-slate-500 text-sm font-medium truncate">{title}</p>
<p className="text-2xl font-bold text-slate-800">{value}</p>
{clickable && <p className="text-xs text-lime-600 mt-1 font-medium">Ver detalle →</p>}
</div>
</div>
);

export default StatCard;