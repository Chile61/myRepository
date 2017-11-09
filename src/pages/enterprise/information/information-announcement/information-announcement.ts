import { BasePage } from '../../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';

@Component({
    selector: 'page-information-announcement',
    templateUrl: 'information-announcement.html'
})
export class AnnouncementPage extends BasePage {
    public title: string;
    public time: number;
    public content: string;
    public objType: number;
    public pageTitle: string;
    constructor(injector: Injector) {
        super(injector);
        this.title = this.navParams.data.title;
        this.title = this.navParams.data.time;
        this.content = this.navParams.data.content;
        this.objType = this.navParams.data.objType;
        this.getAnnouncement();
    }

    getAnnouncement() {
        if (this.objType == 1) {
            this.pageTitle = '新闻';
        } else if (this.objType == 2) {
            this.pageTitle = '公告';
        }
    }
}