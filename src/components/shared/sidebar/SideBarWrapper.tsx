import React from "react";
import DesktopNav from "./nav/DesktopNav";
import MobileNav from "./nav/MobileNav";

type Props = React.PropsWithChildren<object>;

const SideBarWrapper = ({ children }: Props) => {
  return (
    <div className="h-full w-full  flex flex-col lg:flex-row lg:max-w-[96rem] lg:mx-auto">
      <MobileNav />
      <DesktopNav />
      <main className="h-[calc(100%-48px)] lg:h-full w-full flex ">
        {children}
      </main>
    </div>
  );
};

export default SideBarWrapper;
