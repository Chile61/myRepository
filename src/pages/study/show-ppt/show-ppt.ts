/**
 * Created by zxh on 2016/12/23.
 */
import {Component, Injector, ViewChild} from "@angular/core";
import {BasePage} from "../../../core/base-page/BasePage";
import {Slides, Platform} from "ionic-angular";

@Component({
    selector: 'page-show-ppt',
    templateUrl: 'show-ppt.html'
})

//显示PPT或者PDF
export class ShowPPTPage extends BasePage {

    @ViewChild('mySlideOptions') slider: Slides;

    private resUrl: string;
    public pages: number;
    public pageTitle: string;
    public imageResUrl: any = [];
    public selectIndex: number = 1;

    // public showImages: any = [];
    private backFunction: Function;

    constructor(injector: Injector,private platform: Platform) {
        super(injector);
        this.resUrl = this.navParams.get('url');
        this.pages = this.navParams.get('pages');
        this.pageTitle = this.navParams.get('pageTitle');
        this.initResUrl();
        // this.initShowImages();
        this.initBackButton();
    }

    //初始化资源地址
    initResUrl() {
        if (this.pages < 1) {
            return;
        }
        for (let i = 0; i < this.pages; i++) {
            this.imageResUrl[i] = this.resUrl + "/" + (i + 1) + ".jpg";
        }
    }

    // initShowImages() {
    //     if (this.imageResUrl.length - this.showImages.length > 3) {
    //         let showImageCount = this.showImages.length;
    //         for (let i = showImageCount; i < showImageCount + 3; i++) {
    //             this.showImages[i] = this.imageResUrl[i];
    //         }
    //     } else {
    //         for (let i = this.showImages.length; i < this.imageResUrl.length; i++) {
    //             this.showImages[i] = this.imageResUrl[i];
    //         }
    //     }
    // }

    onSlideChanged() {
        console.log('onSlideChanged');
        this.selectIndex = this.slider.getActiveIndex() + 1;
        // if (this.selectIndex == this.imageResUrl.length) {
        //     return;
        // }
        // if (this.selectIndex == this.showImages.length) {
        //     this.initShowImages();
        // }
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
