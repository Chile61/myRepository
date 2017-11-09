/**
 * Created by zxh on 2016/12/23.
 */
import {Component, Injector} from "@angular/core";
import {BasePage} from "../../../core/base-page/BasePage";
import {Platform} from "ionic-angular";

@Component({
    selector: 'page-show-image',
    templateUrl: 'show-image.html'
})

//显示长图
export class ShowImagePage extends BasePage{

    public url: string = '';
    public pageTitle: string;

    private backFunction: Function;

    constructor(injector: Injector,private platform: Platform){
        super(injector);
        this.url = this.navParams.get('url') || '';
        this.pageTitle = this.navParams.get('pageTitle') || '图片';
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
