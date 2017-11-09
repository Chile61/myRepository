/**
 * Created by zxh on 2016/12/24.
 */
import {Component, Injector} from "@angular/core";
import {BasePage} from "../../../core/base-page/BasePage";
import {DomSanitizer} from "@angular/platform-browser";
import {Platform} from "ionic-angular";

@Component({
    selector: 'page-show-html',
    templateUrl: 'show-html.html'
})

//显示链接
export class ShowHtmlPage extends BasePage {

    private url: string = '';
    public pageTitle: string;
    public resUrl: any;

    private backFunction: Function;

    constructor(injector: Injector,
                private sanitizer: DomSanitizer,
                private platform: Platform) {
        super(injector);
        this.url = this.navParams.get('url') || '';
        this.pageTitle = this.navParams.get('pageTitle') || '内容';
        this.resUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
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
        if (this.backFunction) {
            this.backFunction();
        }
    }
}
