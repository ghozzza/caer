"use client";

import React from "react";
import NavLink from "./navbar-link";

const DesktopNavigation: React.FC = () => {
  return (
    <div className="hidden md:flex items-center space-x-6">
      <NavLink href="/earn">
        <span>Add LP</span>
      </NavLink>
      <NavLink href="/borrow">
        <span>Borrow</span>
      </NavLink>
      <NavLink href="/trade">
        <span>Swap</span>
      </NavLink>

      <NavLink href="/faucets">
        <span>Faucets</span>
      </NavLink>
    </div>
  );
};

export default DesktopNavigation;
