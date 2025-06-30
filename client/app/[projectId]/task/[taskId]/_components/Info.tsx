import React from "react";
import Header from "./layout/Header";
import EditTaskDialog from "./actions/EditTaskDialog";

const Info = () => {
  return (
    <div className="w-full mt-10 flex justify-between items-center">
      <Header />
      <div className="flex justify-end gap-6">
        <EditTaskDialog />
      </div>
    </div>
  );
};

export default Info;
