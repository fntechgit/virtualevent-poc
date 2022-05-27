export const getWindowScroll = () => {
    const top = window.pageYOffset || document.documentElement.scrollTop;
    const left = window.pageXOffset || document.documentElement.scrollLeft;

    return { top, left };
}