"use client";

import React from "react";
import { useOrganization, UserButton } from "@clerk/nextjs";
import { SearchInput } from "./Search";
import { OrgSwicther } from "../orgsidebar/OrgSwitcher";
import { InviteTrigger } from "./InviteOrg";
import { NewButton } from "../sidebar/NewButton";

const Navbar = () => {
  const { organization } = useOrganization();
  return (
    <div className="relative flex items-center  gap-x-4 p-5 w-full h-[60px] ">
      <div className="hidden lg:flex flex-1 ">
        <SearchInput />
      </div>
      <div className="block lg:hidden flex-1">
        <OrgSwicther />
      </div>
      {organization && <InviteTrigger />}
      <UserButton />
    </div>
  );
};

export default Navbar;
