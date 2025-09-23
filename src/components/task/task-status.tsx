import { FaRegClipboard } from "react-icons/fa";

interface TaskStatusStatsProps {
  completed: number;      // процент (0-100)
  inProgress: number;     // процент (0-100)
  notStarted: number;     // процент (0-100)
}

const statusData = [
  {
    label: "Completed",
    color: "text-green-600",
    ring: "stroke-green-600",
    dot: "bg-green-600",
  },
  {
    label: "In Progress",
    color: "text-blue-600",
    ring: "stroke-blue-600",
    dot: "bg-blue-600",
  },
  {
    label: "Not Started",
    color: "text-red-500",
    ring: "stroke-red-500",
    dot: "bg-red-500",
  },
];

function getCircle(percent: number, color: string) {
  // SVG circle: 2πr = 2*3.14*28 = ~176
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <svg width={64} height={64} className="block">
      <circle
        cx={32}
        cy={32}
        r={28}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={7}
      />
      <circle
        cx={32}
        cy={32}
        r={28}
        fill="none"
        strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ * 0.25}
        className={color}
      />
    </svg>
  );
}

export function TaskStatusStats({
  completed,
  inProgress,
  notStarted,
}: TaskStatusStatsProps) {
  const stats = [
    { value: completed, ...statusData[0] },
    { value: inProgress, ...statusData[1] },
    { value: notStarted, ...statusData[2] },
  ];

  return (
    <div className="bg-card rounded-xl shadow p-5">
      <div className="flex items-center gap-2 mb-4">
        <FaRegClipboard className="text-gray-400" />
        <span className="text-sm font-medium text-red-400">Task Status</span>
      </div>
      <div className="flex gap-8 justify-center">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <div className="relative">
              {getCircle(stat.value, stat.ring)}
              <span className="absolute inset-0 flex items-center justify-center font-semibold text-lg">
                {stat.value}%
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${stat.dot}`} />
              <span className={stat.color}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}