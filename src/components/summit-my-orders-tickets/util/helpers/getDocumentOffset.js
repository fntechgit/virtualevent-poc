import { getWindowScroll } from "./getWindowScroll";

export const getDocumentOffset = (element) => {
    const rect = element.getBoundingClientRect();
    const scroll = getWindowScroll();

    return { top: rect.top + scroll.top, left: rect.left + scroll.left }
};