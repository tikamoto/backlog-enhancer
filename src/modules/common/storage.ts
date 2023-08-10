/**
 * ストレージから値をロード
 */
export const load = (key: string): Object => JSON.parse(localStorage.getItem('BacklogEnhancer.' + key) || '{}');

/**
 * ストレージに値を保存
 */
export const save = (key: string, json:Object): void => localStorage.setItem('BacklogEnhancer.' + key, JSON.stringify(json));