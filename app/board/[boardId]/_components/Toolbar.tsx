import React from "react";

export const Toolbar = () => {
  const ToolWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <div
        className={`bg-white rounded-md p-1.5 flex gap-y-2 flex-col items-center shadow-md`}
      >
        {children}
      </div>
    );
  };

  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
      <ToolWrapper>
        <div>pencil</div>
        <div>square</div>
        <div>Circle</div>
        <div>Ellipsis</div>
      </ToolWrapper>
      <ToolWrapper>
        <div>Undo</div>
        <div>Redo</div>
      </ToolWrapper>
    </div>
  );
};
