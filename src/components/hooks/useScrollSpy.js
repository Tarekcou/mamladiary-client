import { useEffect, useState } from "react";

const useScrollSpy = (sectionIds = [], offset = 0) => {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    let timeoutId;

    const handleScroll = () => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        let foundId = "";

        for (let id of sectionIds) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();

            const isVisible =
              rect.top <= window.innerHeight / 3 &&
              rect.bottom >= window.innerHeight * 0.1;

            if (isVisible) {
              foundId = id;
              break;
            }
          }
        }

        setActiveId(foundId || "home");
      }, 50); // debounce: prevents instant execution
    };

    // Listen for scroll, resize, and hash changes
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    window.addEventListener("hashchange", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("hashchange", handleScroll);
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
