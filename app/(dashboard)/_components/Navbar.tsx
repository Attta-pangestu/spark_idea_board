import React from "react";
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <div className="flex items-center gap-x-4 p-5  w-full h-[60px] bg-green-500">
      <div className="hidden lg:flex flex-1 bg-yellow-500">Search</div>
      <UserButton />
    </div>
  );
};

export default Navbar;
