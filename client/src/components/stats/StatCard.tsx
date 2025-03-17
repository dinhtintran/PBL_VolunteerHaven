interface StatCardProps {
  label: string;
  value: string | number;
  suffix?: string;
}

export function StatCard({ label, value, suffix }: StatCardProps) {
  return (
    <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
      <div className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">{label}</div>
      <div className="order-1 text-5xl font-extrabold text-primary">{value}</div>
      {suffix && <div className="order-3 text-sm text-gray-500">{suffix}</div>}
    </div>
  );
}

export default StatCard;
