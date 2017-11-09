import { BasePage } from '../../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'page-information-news',
    templateUrl: 'information-news.html'
})
export class InformationNewsPage extends BasePage {
    public pageTitle: string = '';
    public newsId: number;
    public type: number;
    public objType: number;
    public resUrl: any;
    public myUrl: string;
    constructor(injector: Injector, private sanitizer: DomSanitizer) {
        super(injector);
        //this.pageTitle = this.navParams.data.title;
        this.newsId = this.navParams.data.id;
        this.type = this.navParams.data.type;
        this.objType = this.navParams.data.objType;
        this.initPage();
    }
    initPage() {
        if (this.objType == 1) {
            this.pageTitle = '新闻';
        } else {
            this.pageTitle = '公告';
        }
        this.log(this.type);
        this.myUrl = this.navParams.data.content;
        this.resUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.myUrl);



    }


}