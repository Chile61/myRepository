import {Component, Injector} from "@angular/core";
import {BasePage} from "../../../core/base-page/BasePage";
import {DomSanitizer} from '@angular/platform-browser';
import {Platform} from "ionic-angular";
/**
 * Created by zxh on 2017/2/4.
 */
@Component({
    selector: 'show-h5-page',
    templateUrl: 'show-h5.html'
})

export class ShowH5Page extends BasePage {

    public contents: string = '';
    public pageTitle: string;
    public sanitizeHtml: any;

    private backFunction: Function;

    constructor(injector: Injector,
                private sanitize: DomSanitizer,
    private platform: Platform) {
        super(injector);
        this.contents = this.navParams.get('contents') || '';
        this.pageTitle = this.navParams.get('pageTitle') || '内容';
        this.sanitizeHtml = this.sanitize.bypassSecurityTrustHtml(this.contents);
        this.initBackButton();
    }

    //初始化物理按钮监听
    initBackButton() {
        this.platform.ready().then(() => {
            this.backFunction = this.platform.registerBackButtonAction(() => {
                this.navController.pop();
            }, 100);
        });
    }

    //界面销毁
    ionViewWillUnload() {
        if(this.backFunction) {
            this.backFunction();
        }
    }
}
