import Image from "next/image";
import React from "react";

const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <Image
        src="/logo.svg"
        alt="Logo"
        width={120}
        height={120}
        priority
        className="animate-pulse duration-700 w-auto h-auto"
      />
    </div>
  );
};

export default Loading;
