/**
 * HTMLからDOMを生成
 */
export const createElementFromHTML = (html: string): Element => {
    const tempEl: Element = document.createElement('div');
    tempEl.innerHTML = html;
    return tempEl.firstElementChild || tempEl;
};