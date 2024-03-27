import Navigation from "../components/Navigation";
import { Inter } from "next/font/google";
import React from 'react';

type RootLayoutProps = {
  children: React.ReactNode
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

export default RootLayout;