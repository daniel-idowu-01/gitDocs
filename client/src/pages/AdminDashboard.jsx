import React from "react";
import DashboardHeader from "../ui/components/DashboardHeader";
import DashboardSideNav from "../ui/components/DashboardSideNav";
import StatCard from "../ui/components/widgets/StatCard";
import { Users, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSideNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>
            <div className="mt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Total Users"
                  value="10,245"
                  icon={<Users className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                  title="Total Revenue"
                  value="$45,678"
                  icon={
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  }
                />
                <StatCard
                  title="Total Orders"
                  value="1,234"
                  icon={
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  }
                />
                <StatCard
                  title="Growth"
                  value="12.5%"
                  icon={
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  }
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
