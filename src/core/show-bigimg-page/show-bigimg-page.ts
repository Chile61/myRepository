/**
 * Created by zxh on 2017/1/7.
 */
import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { NavParams, Slides, NavController, ToastController, AlertController, Events } from 'ionic-angular';
import { PhotoViewer } from 'ionic-native';
import { EventsConstants } from '../EventsConstants';

@Component({
    selector: 'show-bigimg-page',
    templateUrl: 'show-bigimg-page.html'
})

export class ShowBigImgPage implements AfterViewInit {

    @ViewChild('mySlides') slider: Slides;

    mySlideOptions;
    private sliderIsInit: boolean = false;

    public imgUrls: any = [];
    public selectImgNum: number = 0;//查看图片的下标

    public pages: number = 0;//图片总数
    public selectIndex: number = 1;//当前图片的位置

    public isDelete: boolean = false;//是否能能删除
    constructor(private navParams: NavParams, private navController: NavController, private toastController: ToastController, private alertCtrl: AlertController, private events: Events) {
        this.imgUrls = this.navParams.get('imgUrls') || [];
        this.pages = this.imgUrls.length;
        this.selectImgNum = this.navParams.get('selectImgNum') || 0;
        this.isDelete = this.navParams.get('isDelete') || false;
        this.selectIndex = this.selectImgNum + 1;
        this.mySlideOptions = {
            initialSlide: this.selectImgNum
        };
    }

    ngAfterViewInit() {
        // this.slider.slideTo(this.selectImgNum);
    }

    onSlideChanged() {
        if (this.sliderIsInit) {
            this.selectIndex = this.slider.getActiveIndex() + 1;
            //PhotoViewer.show(this.imgUrls[this.selectIndex-1]);
        } else {
            this.sliderIsInit = true;
        }
    }
    //删除当前照片
    delete() {
        let prompt = this.alertCtrl.create({
            title: '温馨提示',
            message: '确定要当前图片吗?',
            buttons: [
                {
                    text: '确定',
                    handler: () => {
                        this.realDelete();
                    }
                },
                {
                    text: '取消',
                    handler: () => {
                        return;
                    }
                }

            ]
        });
        prompt.present();

    }
    //删除当前照片
    realDelete() {
        this.imgUrls = this.imgUrls.slice(0, this.selectIndex - 1).concat(this.imgUrls.slice(this.selectIndex, this.imgUrls.length));
        this.exit();
        if (this.slider.getActiveIndex() == this.imgUrls.length) {
            console.log(this.slider.getActiveIndex());
            this.slider.slideTo(this.slider.getActiveIndex() - 1);
        } else if (this.slider.getActiveIndex() < this.imgUrls.length) {
            this.slider.slideTo(this.slider.getActiveIndex());
        }
        // if (this.selectIndex < this.imgUrls.length) {
        //     this.selectIndex = this.slider.getActiveIndex() + 1;
        //     this.slider.slideTo(this.slider.getActiveIndex());
        // } else if (this.selectIndex = this.imgUrls.length) {
        //     this.selectIndex = this.slider.getActiveIndex() - 1;
        //     this.slider.slideTo(this.selectIndex);
        // }
        //this.pages = this.imgUrls.length;
    }
    //退出编辑图片，传递数据
    exit() {
        if (this.imgUrls == null || this.imgUrls.length == 0 || this.imgUrls == '') {
            this.events.publish(EventsConstants.DELETE_PICTURE,this.imgUrls);
            this.navController.pop();
        }
    }
    ionViewWillUnload(){
        if(this.isDelete){
            this.events.publish(EventsConstants.DELETE_PICTURE,this.imgUrls);
        }
    }

}
