import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../utils/authContext";
import Header from "../ui/Header";

const Home = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <div className="bg-[#031f39]">
      <Header />
    </div>
  );
};

export default Home;
