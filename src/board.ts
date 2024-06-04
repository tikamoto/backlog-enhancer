import { fetchWatchList } from "./modules/common/project";
import { Card } from "./modules/board/card";
import { Lane } from "./modules/board/lane";

/**
 * fetchのインターセプト
 */
const { fetch: _fetch } = window;
window.fetch = async (...args) => {
    const [resource, config] = args;
    const response = await _fetch(resource, config);
    window.dispatchEvent(new CustomEvent('fetch', {
        'detail': {
            'request' : {'resource': resource, 'config': config},
            'response': response.clone()
        }
    }));
    return response;
};

/**
 * fetch時実行
 * 優先度とウォッチ状況をカード上に表示する
 */
window.addEventListener('fetch', async (e: any) => {

    const resource = e.detail.request.resource;
    const config = e.detail.request.config;

    //fetch先がボード表示用の課題取得APIでなければ終了
    if (resource != '/board-api/kanban') {
        return;
    }

    //fetch対象がカード取得APIでなければ終了
    try {
        if (!config || !config.body) {
            return;
        }
        const json = JSON.parse(config.body);
        if (!json.operationName || json.operationName != 'getCards') {
            return;
        }
    } catch(e) {
        return;
    }
    
    //fetch先のAPIに再度アクセスして課題データを取得
    config.signal = null;
    config.body = config.body.replace(/    created\\n/, '    created\\n    priority\\n'); //優先度も追加で取得しておく
    const data = await (await _fetch(resource, config)).json();

    //課題データが取得できなければ終了
    const cards = data?.data?.cards?.cards;
    if (!cards || !cards.length) {
        return;
    }

    //この時点でカードDOMがまだ生成されていない可能性があるので生成されるまでリトライを繰り返す
    const interval = setInterval(async () => {

        //カードのDOMが存在しなければ生成されるまで以降の処理をスキップしてリトライ
        const firstCard = new Card(cards[0].issue.issueKey);
        if (!firstCard.exists()) {
            return;
        }

        //優先度をカードに反映
        cards.forEach((c: any) => {
            const card = new Card(c.issue.issueKey);
            card.visualizePriority(c.issue.priority);
        });

        //ウォッチ状況をカードに反映
        const watchList: any = await fetchWatchList();
        watchList.forEach((issue: any) => {
            const card = new Card(issue.issueKey);
            card.visualizeWatchStatus(issue.comment);
        });

        clearInterval(interval);
    }, 100);
});

/**
 * 画面ロード時実行
 * レーンを開閉できるようにする
 */
window.addEventListener('load', () => {

    //この時点でレーンのDOMがまだ生成されていない可能性があるので生成されるまでリトライを繰り返す
    const interval = setInterval(() => {

        //レーンのDOM（状態アイコンで判断）が存在しなければ以降の処理をスキップしてリトライ
        if (!document.querySelector('.StatusIcon')) {
            return;
        }

        //レーンの開閉制御
        document.querySelectorAll('.StatusIcon').forEach((el: Element) => {
            const statusId = (el.closest('section').querySelector('.SlotBox[data-statusid]') as HTMLElement).dataset.statusid;
            const lane = new Lane(Number(statusId));
            el.addEventListener('click', () => {
                lane.invert();
            });
        });

        clearInterval(interval);
    }, 100);
});
