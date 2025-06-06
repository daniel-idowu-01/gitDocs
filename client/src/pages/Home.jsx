import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../utils/authContext";
import Header from "../ui/Header";

const Home = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <div>
      <Header />
    </div>
  );
};

export default Home;
