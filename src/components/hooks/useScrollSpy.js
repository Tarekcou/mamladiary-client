import { useEffect, useState } from "react";

const useScrollSpy = (sectionIds = [], offset = 0) => {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      let foundId = "";

      for (let id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();

          // Detect section earlier and fix for last section (contacts)
          const isVisible =
            rect.top <= window.innerHeight / 3 &&
            rect.bottom >= window.innerHeight * 0.1; // prevents small negative values at bottom

          if (isVisible) {
            foundId = id;
            break;
          }
        }
      }

      // Fallback to "home" if no section matched
      setActiveId(foundId || "home");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sectionIds, offset]);

  useEffect(() => {
    if (activeId) {
      const currentHash = window.location.hash;
      const newHash = activeId === "home" ? "/" : `#${activeId}`;

      if (currentHash !== newHash) {
        history.replaceState(null, "", newHash);
      }
    }
  }, [activeId]);

  return activeId;
};

export default useScrollSpy;
