/**
 * カードクラス
 */
export class Card
{
    public readonly issueKey: string;
    public readonly summary: string|null;
    private readonly cardDom: Element|null;

    /**
     * コンストラクタ
     * @param issueKey 
     */
    public constructor(issueKey: string)
    {
        this.issueKey = issueKey;
        this.cardDom = document.querySelector('a.card-label[href="/view/' + issueKey + '"]')?.closest('li.card') || null;
        this.summary = this.cardDom?.querySelector('.card-summary')?.textContent || null;
    }

    /**
     * カードDOMが存在するか
     * @returns 
     */
    public exists(): boolean
    {
        return this.cardDom != null;
    }

    /**
     * 優先度を可視化する
     * @param priorityId 
     * @returns 
     */
    public visualizePriority(priorityId: number): boolean
    {
        if (!this.exists()) {
            return false;
        }

        let priorityName = '';
        switch(priorityId){
            case 2:  priorityName = 'high'; break;
            case 3:  priorityName = 'middle'; break;
            case 4:  priorityName = 'low'; break;
        }
        this.cardDom?.classList.add('priority-' + priorityName);

        return true;
    }

    /**
     * ウォッチ状況を可視化する
     * @param comment 
     * @returns 
     */
    public visualizeWatchStatus(comment: string): boolean
    {
        if (!this.exists()) {
            return false;
        }

        this.cardDom?.classList.add('watch');
        if (comment) {
            let commentDom: Element = this.cardDom?.querySelector('div.watch-comment') || document.createElement('div');
            if(!commentDom.classList.contains('watch-comment')) {
                commentDom.classList.add('watch-comment');
                this.cardDom?.append(commentDom);
            }
            commentDom.textContent = '📝' + comment;
        }
        
        return true;
    }
}