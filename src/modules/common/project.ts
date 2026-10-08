/**
 * プロジェクトキー取得
 */
export const getProjectKey = (): string => location.pathname.match(/^\/board\/(.*)/)![1];
    
/**
 * ウォッチリスト取得
 */
export const fetchWatchList = async (): Promise<any> => {
    const data: any[] = await (await fetch('/r/issue-watches.json')).json();
    return data.map((item: any) => ({
        issueKey: item.issue?.issueKey || '',
        comment: item.note || ''
    }));
};

    