import { OrganizationSwitcher } from "@clerk/nextjs";

export const OrgSwicther = () => {
  return (
    <OrganizationSwitcher
      hidePersonal
      appearance={{
        elements: {
          rootBox: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          },
          organizationSwitcherTrigger: {
            padding: "6px",
            width: "100%",
            maxWidth: "300px",
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            justifyContent: "space-between",
            backgroundColor: "white",
          },
        },
      }}
    />
  );
};
