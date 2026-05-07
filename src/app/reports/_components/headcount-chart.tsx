const MONTHS = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];
const VALUES = [225, 231, 235, 238, 244, 248];

export function HeadcountChart() {
  const min = 215;
  const max = 260;
  const range = max - min;
  const width = 340;
  const height = 140;
  const padX = 36;
  const padY = 16;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const points = VALUES.map((v, i) => {
    const x = padX + (i / (VALUES.length - 1)) * chartW;
    const y = padY + chartH - ((v - min) / range) * chartH;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `${padX},${padY + chartH} ${points} ${padX + chartW},${padY + chartH}`;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <defs>
          <linearGradient id="hcGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padY + chartH * (1 - t);
          const val = Math.round(min + range * t);
          return (
            <g key={t}>
              <line x1={padX} y1={y} x2={padX + chartW} y2={y} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4,4" className="dark:stroke-dark-3" />
              <text x={padX - 4} y={y + 4} fontSize="9" fill="#9CA3AF" textAnchor="end">{val}</text>
            </g>
          );
        })}
        {/* Area fill */}
        <polygon points={areaPoints} fill="url(#hcGrad)" />
        {/* Line */}
        <polyline points={points} fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Points */}
        {VALUES.map((v, i) => {
          const x = padX + (i / (VALUES.length - 1)) * chartW;
          const y = padY + chartH - ((v - min) / range) * chartH;
          return <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="#4F46E5" strokeWidth="2" />;
        })}
        {/* X Labels */}
        {MONTHS.map((m, i) => {
          const x = padX + (i / (MONTHS.length - 1)) * chartW;
          return <text key={m} x={x} y={height - 3} fontSize="9" fill="#9CA3AF" textAnchor="middle">{m}</text>;
        })}
      </svg>
    </div>
  );
}
