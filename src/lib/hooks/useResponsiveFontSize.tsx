import { useEffect, useState } from "react";

export default function useResponsiveFontSize() {
    // const getFontSize = () => (window.innerWidth < 450 ? "16px" : "18px");
    const [fontSize, setFontSize] = useState("16px");

    useEffect(() => {
        const onResize = () => {
            setFontSize("16px");
        };

        // window.addEventListener("resize", onResize);

        return () => {
            // window.removeEventListener("resize", onResize);
        };
    });

    return fontSize;
}
