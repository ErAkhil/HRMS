const MONTHS = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];
const VALUES = [225, 231, 235, 238, 244, 248];

const CHART = {
  min: 215,
  max: 260,
  width: 340,
  height: 140,
  padX: 36,
  padY: 16,
};

function getPoint(value: number, index: number, count: number) {
  const range = CHART.max - CHART.min;
  const chartW = CHART.width - CHART.padX * 2;
  const chartH = CHART.height - CHART.padY * 2;
  const x = CHART.padX + (index / (count - 1)) * chartW;
  const y = CHART.padY + chartH - ((value - CHART.min) / range) * chartH;
  return { x, y };
}

function GridLines() {
  const range = CHART.max - CHART.min;
  const chartH = CHART.height - CHART.padY * 2;
  const chartW = CHART.width - CHART.padX * 2;

  return [0, 0.25, 0.5, 0.75, 1].map((t) => {
    const y = CHART.padY + chartH * (1 - t);
    const val = Math.round(CHART.min + range * t);
    return (
      <g key={t}>
        <line x1={CHART.padX} y1={y} x2={CHART.padX + chartW} y2={y} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4,4" className="dark:stroke-dark-3" />
        <text x={CHART.padX - 4} y={y + 4} fontSize="9" fill="#9CA3AF" textAnchor="end">{val}</text>
      </g>
    );
  });
}

export function HeadcountChart() {
  const chartW = CHART.width - CHART.padX * 2;
  const chartH = CHART.height - CHART.padY * 2;
  const points = VALUES.map((value, index) => {
    const { x, y } = getPoint(value, index, VALUES.length);
    return `${x},${y}`;
  }).join(" ");
  const areaPoints = `${CHART.padX},${CHART.padY + chartH} ${points} ${CHART.padX + chartW},${CHART.padY + chartH}`;

  return (
    <div>
      <svg viewBox={`0 0 ${CHART.width} ${CHART.height}`} className="w-full">
        <defs>
          <linearGradient id="hcGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </linearGradient>
        </defs>
        <GridLines />
        {/* Area fill */}
        <polygon points={areaPoints} fill="url(#hcGrad)" />
        {/* Line */}
        <polyline points={points} fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Points */}
        {VALUES.map((value, i) => {
          const { x, y } = getPoint(value, i, VALUES.length);
          return <circle key={MONTHS[i]} cx={x} cy={y} r="4" fill="white" stroke="#4F46E5" strokeWidth="2" />;
        })}
        {/* X Labels */}
        {MONTHS.map((m, i) => {
          const { x } = getPoint(VALUES[i], i, MONTHS.length);
          return <text key={m} x={x} y={CHART.height - 3} fontSize="9" fill="#9CA3AF" textAnchor="middle">{m}</text>;
        })}
      </svg>
    </div>
  );
}
