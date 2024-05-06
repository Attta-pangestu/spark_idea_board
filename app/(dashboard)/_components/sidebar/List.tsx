"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { Item } from "./Item";

export const List = () => {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (!userMemberships?.data?.length) return null;

  console.log(userMemberships.data);

  return (
    <ul className="space-y-4">
      {userMemberships.data?.map((membership) => (
        <li key={membership.id}>
          <Item
            id={membership.organization.id}
            name={membership.organization.name}
            src={membership.organization.imageUrl}
          />
        </li>
      ))}
      <li>org</li>
    </ul>
  );
};
