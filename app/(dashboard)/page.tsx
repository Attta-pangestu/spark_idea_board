"use client";
import { CreateOrganization, useOrganization } from "@clerk/nextjs";
import React from "react";
import { BoardList } from "./_components/board/BoardList";
import { EmptyNotif } from "./_components/board/EmptyNotif";

interface DashboardProps {
  searchParams: {
    search?: string;
    favorites?: string;
  };
}

const DashboardPage = ({ searchParams }: DashboardProps) => {
  const { organization } = useOrganization();

  return (
    <div className="p-6 w-full h-[calc(100%-80px)]   ">
      {searchParams && JSON.stringify(searchParams)}

      {organization ? (
        <BoardList  query={searchParams} />
      ) : (
        <EmptyNotif
          imageUrl="/elements.svg"
          title="Welcome to Spark Board"
          description="Create a board to get started"
          buttonText="Create Board"
          buttonContent={<CreateOrganization />}
        />
      )}
    </div>
  );
};

export default DashboardPage;
