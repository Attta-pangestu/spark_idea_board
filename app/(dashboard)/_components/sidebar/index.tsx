import React from "react";
import { NewButton } from "./NewButton";
import { List } from "./List";

const Sidebar = () => {
  return (
    <aside className="fixed z-[1] left-0 bg-blue-950 w-[60px] h-full flex flex-col items-center  gap-y-4 text-white py-4 ">
      <NewButton />
      <List />
    </aside>
  );
};

export default Sidebar;
