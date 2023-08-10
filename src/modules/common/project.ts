import { createElementFromHTML } from "./util";

/**
 * プロジェクトキー取得
 */
export const getProjectKey = (): string => location.pathname.match(/^\/board\/(.*)/)![1];
    
/**
 * ウォッチリスト取得
 */
export const fetchWatchList = (): Promise<any> => {
    return new Promise(async resolve => {
        const watchList: Object[] = [];
        const data: string = await (await fetch('/globalbar/watchItems')).text();
        const dom: Element = createElementFromHTML('<div>' + data + '</div>');
        dom.querySelectorAll('li.watch-list__item').forEach((li: Element) => {
            const issueKey: string = li.querySelector('p.watch-list__key')?.innerHTML || '';
            const comment: string = li.querySelector('span.watch-list__note.js_note-text')?.innerHTML || '';
            watchList.push({
                issueKey: issueKey,
                comment: comment
            });
        });
        resolve(watchList);
    });
};

    