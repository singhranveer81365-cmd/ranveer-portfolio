import React, { useEffect, useRef, useState } from "react";
const cursorImage = new URL("../assets/images/cursor/cursor.png", import.meta.url).href;

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isHidden, setIsHidden] = useState(true);

  // Position trackers for frame interpolation
  const mousePos = useRef({ x: 0, y: 0 });
  const innerPos = useRef({ x: 0, y: 0 });
  const outerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Detect mobile/touch devices - do not enable custom cursor for coarse pointers
    const supportsTouch = window.matchMedia("(pointer: coarse)").matches;
    if (supportsTouch) {
      setIsHidden(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      setIsHidden(false);
    };

    const onMouseLeave = () => {
      setIsHidden(true);
    };

    const onMouseEnter = () => {
      setIsHidden(false);
    };

    const onMouseDown = () => {
      setClicked(true);
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x: mousePos.current.x, y: mousePos.current.y }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    };

    const onMouseUp = () => {
      setClicked(false);
    };

    // Magnetic and content interactions
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if hovering a button, link, or elements with hover-state attributes
      const interactiveEl = target.closest("button, a, [role='button'], [data-cursor]");
      if (interactiveEl) {
        setIsHovered(true);
        const dataCursor = interactiveEl.getAttribute("data-cursor");
        if (dataCursor) {
          setCursorText(dataCursor.toUpperCase());
        } else if (interactiveEl.tagName === "A") {
          setCursorText("VIRTUAL");
        } else if (interactiveEl.tagName === "BUTTON") {
          setCursorText("CLICK");
        } else {
          setCursorText("VIEW");
        }
      } else {
        setIsHovered(false);
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseover", handleMouseOver);

    // Lerp smoothing animation loop
    let animationFrameId: number;
    const lerp = (start: number, end: number, amt: number) => (1 - amt) * start + amt * end;

    const tick = () => {
      // Inner cursor follows immediately
      innerPos.current.x = mousePos.current.x;
      innerPos.current.y = mousePos.current.y;

      // Outer cursor trails behind with fast, high-DPI snappy lerp interpolation
      const lerpFactor = isHovered ? 0.25 : 0.45; 
      outerPos.current.x = lerp(outerPos.current.x, mousePos.current.x, lerpFactor);
      outerPos.current.y = lerp(outerPos.current.y, mousePos.current.y, lerpFactor);

      if (outerRef.current) {
  outerRef.current.style.transform =
    `translate3d(${outerPos.current.x}px, ${outerPos.current.y}px, 0) translate(-50%, -50%)`;
}
       animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered]);

  if (isHidden) return null;

  return (
    <>
      {/* Click ripple animations */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="fixed pointer-events-none rounded-full border border-white/40 z-[99999999] opacity-100 animate-ping"
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40,
            height: 40,
            animationDuration: "0.6s",
          }}
        />
      ))}
       
        {/* Cursor element */}

      <div
  ref={outerRef}
  className="fixed top-0 left-0 pointer-events-none z-[99999999]"
  style={{
    width: "55px",
    height: "55px",
    willChange: "transform",
  }}
>
  <img
    src={cursorImage}
    alt="cursor"
    className={`w-full h-full object-contain transition-transform duration-200 ${
      isHovered ? "scale-125" : "scale-100"
    } drop-shadow-[0_0_18px_rgba(77,168,255,0.35)]`}
  />
</div>
    </>
  );
}