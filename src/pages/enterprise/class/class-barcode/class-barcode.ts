import { CodeVo } from '../../../../models/class/CodeVo';
import { BasePage } from '../../../../core/base-page/BasePage';
import { Component, Injector} from '@angular/core';
import { BarcodeScanner } from 'ionic-native';
import { Utils } from '../../../../core/Utils';
import { AttenHistoryPage } from '../class-attenhistory/class-attenhistory';
import { ClassIntroductionPage } from '../class-introduction/class-introduction';
import { CaptureResultPage } from '../capture-result/capture-result';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'page-class-barcode',
    templateUrl: 'class-barcode.html'
})

export class ClassBarcodePage extends BasePage{
    //班级签到
    public CLASS_SIGN_IN: string = 'CLASS_SIGN_IN';
    //加入班级
    public JOIN_CLASS: string = 'JOIN_CLASS';
    //1、首页跳转   2、班级 
    public fromType: number = 2;
    public urlText: string = 'http://beta.study2win.net/front/r/?k=eyJjbGFzc0lkIjo5NDksInR5cGUiOiJKT0lOX0NMQVNTIn0=&scho=1';
    public utils: Utils;
    //二维码type
    public scho: string = '';
    public codeVo: CodeVo;
    public classId: number;
    constructor(injector: Injector, public sanitize: DomSanitizer) {
        super(injector);
        this.fromType = this.navParams.data.fromType;
        this.classId = this.navParams.data.id;
    }
    //扫码
    goBarcode() {
        this.getClassBarcode();
    }

    //签到历史
    goSignHistory() {
        this.navController.push(AttenHistoryPage, { id: this.classId });
    }

    getClassBarcode() {
        BarcodeScanner.scan().then((barcodeData) => {
            this.urlText = barcodeData.text;
            this.handleDecode();
        }, (err) => {
            let alert = this.alertCtrl.create({
                title: '签到提示1',
                message: '签到失败，请确认二维码是否为本次签到使用的二维码',
                buttons: [
                    {
                        text: '取消',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: '重新签到',
                        handler: () => {
                            this.getClassBarcode();
                        }
                    }
                ]
            });
            alert.present();
        });
    }

    //处理扫描的二维码
    handleDecode() {
        if (this.utils.isStringNull(this.urlText)) {
            // let alert = this.alertCtrl.create({
            //     title: '签到提示2',
            //     message: '扫描失败',
            //     buttons: [
            //         {
            //             text: '取消',
            //             role: 'cancel',
            //             handler: () => {
            //                 console.log('Cancel clicked');
            //             }
            //         },
            //         {
            //             text: '重新扫描',
            //             handler: () => {
            //                 this.getClassBarcode();
            //             }
            //         }
            //     ]
            // });
            // alert.present();
            return;
        }else if(!this.urlText.startsWith('http')){
                let alert = this.alertCtrl.create({
                title: '签到提示3',
                message: '签到失败，请确认二维码是否为本次签到使用的二维码',
                buttons: [
                    {
                        text: '取消',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: '重新签到',
                        handler: () => {
                            this.getClassBarcode();
                        }
                    }
                ]
            });
            alert.present();
        }else {

            if (this.urlText.indexOf("scho") >= 0) {
                let index = this.urlText.indexOf("scho");
                this.scho = this.urlText.substring(index + 5, index + 7);
            }
            switch (this.scho) {
                case '1'://app端
                    this.showLoading('正在解析二维码...', 10);
                    this.httpUtil.get({
                        url: this.urlText, param: null, success: (res) => {
                            this.codeVo = res.result;
                            switch (this.codeVo.type) {
                                case this.CLASS_SIGN_IN://班级签到
                                    this.navController.push(AttenHistoryPage, { id: this.codeVo.params.classId, fromType: this.fromType });
                                    this.toast(res.msg);
                                    break;
                                case this.JOIN_CLASS://加入班级
                                    this.navController.push(ClassIntroductionPage, { id: this.codeVo.params.classId });
                                    break;
                            }
                        }, fail: (res) => {
                            let alert = this.alertCtrl.create({
                                title: '扫描提示4',
                                message: res.msg,
                                buttons: [
                                    {
                                        text: '返回',
                                        role: 'cancel',
                                        handler: () => {
                                            console.log('Cancel clicked');
                                        }
                                    },
                                    {
                                        text: '重新扫描',
                                        handler: () => {
                                            this.getClassBarcode();
                                        }
                                    }
                                ]
                            });
                            alert.present();

                        }, finish: () => {
                            this.dismissLoading();
                        }
                    });
                    break;
                case '2'://内部微信页
                    if (this.fromType == 1) {//从首页进来的    
                        this.navController.push(CaptureResultPage, { result: this.urlText});
                    } else {
                        let alert = this.alertCtrl.create({
                            title: '签到提示5',
                            message: '签到失败，请确认二维码是否为本次签到使用的二维码',
                            buttons: [
                                {
                                    text: '取消',
                                    role: 'cancel',
                                    handler: () => {
                                        console.log('Cancel clicked');
                                    }
                                },
                                {
                                    text: '重新签到',
                                    handler: () => {
                                        this.getClassBarcode();
                                    }
                                }
                            ]
                        });
                        alert.present();
                    }
                    break;
                case ''://外部链接
                    if (this.fromType == 1) {//首页进入
                        let alert = this.alertCtrl.create({
                            title: '外部链接',
                            message: this.urlText,
                            buttons: [
                                {
                                    text: '取消',
                                    role: 'cancel',
                                    handler: () => {
                                        console.log('Cancel clicked');
                                    }
                                },
                                {
                                    text: '继续访问',
                                    handler: () => {
                                        this.navController.push(CaptureResultPage, { result: this.urlText});
                                    }
                                }
                            ]
                        });
                        alert.present();

                    } else {
                        let alert = this.alertCtrl.create({
                            title: '签到提示6',
                            message: '签到失败，请确认二维码是否为本次签到使用的二维码',
                            buttons: [
                                {
                                    text: '取消',
                                    role: 'cancel',
                                    handler: () => {
                                        console.log('Cancel clicked');
                                    }
                                },
                                {
                                    text: '重新签到',
                                    handler: () => {
                                        this.getClassBarcode();
                                    }
                                }
                            ]
                        });
                        alert.present();
                    }
                    break;
            }
        }

    }

}