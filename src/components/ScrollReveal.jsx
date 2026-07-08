import { useRef, useEffect, useState } from "react";

export default function ScrollReveal({ children, animation = "slideUp", delay = 0, threshold = 0.1 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px", threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  const styles = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible 
      ? (animation === "popIn" ? "scale(1)" : animation === "slideRight" ? "translateX(0)" : "translateY(0)") 
      : (animation === "popIn" ? "scale(0.85)" : animation === "slideRight" ? "translateX(-40px)" : "translateY(40px)"),
    transition: `all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s`,
  };

  return (
    <div ref={ref} style={styles}>
      {children}
    </div>
  );
}
