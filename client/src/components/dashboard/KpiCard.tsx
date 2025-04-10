interface KpiCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon: string;
  iconBgColor: string;
  iconColor: string;
  subtitle?: string;
}

export default function KpiCard({
  title,
  value,
  change,
  icon,
  iconBgColor,
  iconColor,
  subtitle,
}: KpiCardProps) {
  // Format as Indian Rupees if the value is a number and title includes "Value" or "Price" or "Amount"
  const formattedValue = typeof value === "number" && 
    (title.toLowerCase().includes("value") || 
     title.toLowerCase().includes("price") || 
     title.toLowerCase().includes("amount"))
    ? new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
      }).format(value)
    : value;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{formattedValue}</h3>
          
          {change && (
            <span 
              className={`inline-flex items-center text-sm mt-2 ${
                change.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              <i className={change.isPositive ? "ri-arrow-up-s-fill" : "ri-arrow-down-s-fill"}></i> {change.value}
            </span>
          )}
          
          {subtitle && (
            <span className="inline-flex items-center text-sm text-gray-600 mt-2">
              <i className="ri-time-line mr-1"></i> {subtitle}
            </span>
          )}
        </div>
        
        <div className={`${iconBgColor} p-3 rounded-full`}>
          <i className={`${icon} text-xl ${iconColor}`}></i>
        </div>
      </div>
    </div>
  );
}
