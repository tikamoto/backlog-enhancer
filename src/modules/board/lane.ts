import { load, save } from "../common/storage";
import { getProjectKey } from "../common/project";

/**
 * レーンクラス
 */
export class Lane 
{
    private readonly laneDom: Element|null;
    private readonly statusId: number;
    private isOpened: boolean;

    /**
     * コンストラクタ
     * @param statusClassName 
     */
    public constructor(statusId: number)
    {
        this.statusId = statusId;
        this.laneDom = document.querySelector('.SlotBox[data-statusid="' + statusId + '"]')?.closest('section') || null;
        this.isOpened = this.loadOpenStatus();
        this.isOpened ? this.open() : this.close();
    }

    /**
     * レーンを閉じる
     */
    public close(): void
    {
        this.laneDom?.classList.add('closed');
        this.isOpened = false;
        this.saveOpenStatus();
    }

    /**
     * レーンを開く
     */
    public open(): void
    {
        this.laneDom?.classList.remove('closed');
        this.isOpened = true;
        this.saveOpenStatus();
    }

    /**
     * レーンの開閉を切り替える
     */
    public invert(): void
    {
        this.isOpened ? this.close() : this.open();
    }

    /**
     * レーンの開閉状況をストレージに保存する
     */
    private saveOpenStatus(): void
    {
        const projectKey: string = getProjectKey();
        const config: any = load('LaneOpenStatus');
        if (config[projectKey] == undefined) {
            config[projectKey] = {};
        }
        config[projectKey][this.statusId] = this.isOpened;
        save('LaneOpenStatus', config);
    }

    /**
     * レーンの開閉状況をストレージから取得する
     * @returns 
     */
    private loadOpenStatus(): boolean
    {
        const projectKey: string = getProjectKey();
        const config: any = load('LaneOpenStatus');
        if (config[projectKey] == undefined || config[projectKey][this.statusId] == undefined) {
            return true;
        }
        return config[projectKey][this.statusId];
    }
}