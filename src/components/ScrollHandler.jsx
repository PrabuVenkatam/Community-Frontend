import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

const ScrollHandler = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // 1. Reset browser window scroll
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // 2. Reset scroll position on custom scrollable layout containers
    const scrollTargets = document.querySelectorAll(
      "main, .scroll-reset-target, [class*='overflow-y-auto'], [class*='overflow-auto']"
    );
    scrollTargets.forEach((target) => {
      if (target) {
        target.scrollTop = 0;
        if (typeof target.scrollTo === "function") {
          target.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
      }
    });
  }, [pathname, search]);

  return <Outlet />;
};

export default ScrollHandler;
