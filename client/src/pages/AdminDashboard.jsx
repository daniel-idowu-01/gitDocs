import React from "react";
import { useState, useEffect } from "react";
import DashboardHeader from "../ui/components/DashboardHeader";
import DashboardSideNav from "../ui/components/DashboardSideNav";
import DashboardTile from "../ui/components/DashboardTile";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin");
        const result = await response.json();
        setDashboardData(result.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSideNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8 flex flex-col gap-10">
            {Array.isArray(dashboardData) &&
              dashboardData.map((data, index) => (
                <DashboardTile key={index} {...data} />
              ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
