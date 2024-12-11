import React from "react";
import StatCard from "./widgets/StatCard";
import { Users, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";

const DashboardTile = ({ title, data }) => {
  const icons = [
    <Users className="h-4 w-4 text-muted-foreground" />,
    <DollarSign className="h-4 w-4 text-muted-foreground" />,
    <ShoppingCart className="h-4 w-4 text-muted-foreground" />,
    <TrendingUp className="h-4 w-4 text-muted-foreground" />,
  ];

  return (
    <article>
      <h3 className="text-gray-700 text-xl font-medium">{title}</h3>
      <div className="mt-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((item, index) => (
            <StatCard
              key={index}
              title={item.name}
              value={item.value}
              icon={icons[index % icons.length]} // Cycle through icons
            />
          ))}
        </div>
      </div>
    </article>
  );
};

export default DashboardTile;