import React from "react";
import { RouteProps } from "react-router-dom";
import MenuDisplay from "./Menu/MenuDisplay";

type HomePageProps = {
  location: RouteProps["location"];
};

const HomePage: React.FC<HomePageProps> = ({ location }) => {
  // if we are under a menu system - clear investigation id in case have transitioned here with it set
  sessionStorage.removeItem("investigationId");

  return <MenuDisplay location={location} />;
};

export default HomePage;
