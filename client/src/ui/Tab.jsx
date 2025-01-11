import React from "react";

const Tab = () => {
  const style =
    "border border-[#ff7f50] text-[#ff7f50] rounded-full px-6 py-2 hover:cursor-pointer hover:opacity-80";
  return (
    <div className="flex items-center justify-between gap-10 mb-5 z-50">
      <section className={style}>Documentation</section>
      <section className={style}>Repo Insights</section>
    </div>
  );
};

export default Tab;
