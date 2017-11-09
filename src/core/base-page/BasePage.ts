/**
 * Created by Awei on 2016/12/22.
 */
import { Utils } from "../Utils";
import { Injector } from "@angular/core";
import { ApiUrls } from "../http/ApiUrls";
import { HttpUtil } from "../http/HttpUtil";
import { StorageUtil } from "../storage/StorageUtil";
import { LoadingController, Loading, NavParams, NavController, ToastController, AlertController, Events,App } from 'ionic-angular';
import {MyApp} from '../../app/app.component';
import { Constants } from '../Constants';

export class BasePage {

    private isDebug: boolean;

    public utils: Utils;
    public apiUrls: ApiUrls;
    public loading: Loading;
    public httpUtil: HttpUtil;
    public navParams: NavParams;
    public storageUtil: StorageUtil;
    public navController: NavController;
    public loadingCtrl: LoadingController;
    public toastController: ToastController;
    public alertCtrl: AlertController;
    private _selfEvents: Events;
    public _app:App;

    constructor(public injector: Injector) {
        this.isDebug = true;
        this.utils = this.injector.get(Utils);
        this.apiUrls = this.injector.get(ApiUrls);
        this.httpUtil = this.injector.get(HttpUtil);
        this.navParams = this.injector.get(NavParams);
        this.storageUtil = this.injector.get(StorageUtil);
        this.navController = this.injector.get(NavController);
        this.loadingCtrl = this.injector.get(LoadingController);
        this.toastController = this.injector.get(ToastController);
        this.alertCtrl = this.injector.get(AlertController);
        this._app = this.injector.get(App);
        this._selfEvents = this.injector.get(Events);
        this._selfEvents.unsubscribe(Constants.LOGIN_EVENT);
        this._selfEvents.subscribe(Constants.LOGIN_EVENT,(msg:string)=>{
            this._selfEvents.unsubscribe(Constants.LOGIN_EVENT);
            let alert = this.alertCtrl.create({
                title:'警告',
                message: msg,
                buttons:[{
                    text:'确定',
                    handler:() =>{
                        this._app.getRootNav().push(MyApp);
                        if(this._app.getRootNav().length()>1){
                            this._app.getRootNav().remove(0,this._app.getRootNav().length()-1);
                        }
                    }
                }]
            })
            alert.present();
        });
    }

    // 打印日志
    log(msg: any) {
        if (this.isDebug) {
            console.log(msg)
        }
    }

    // 弹出Loading，默认10s自动关闭
    showLoading(msg?: string, time?: number) {
        this.loading = this.loadingCtrl.create({
            content: msg || '正在加载中...',
            duration: time || 10 * 500
        });
        this.loading.present();
    }

    // 弹出Loading，不会自动关闭
    showBigLoading(msg?: string) {
        // console.log('start show');
        // this.loading = this.loadingCtrl.create({
        //     content: msg || '正在加载中...'
        // });
        // this.loading.present();
    }

    // 关闭Loading
    dismissLoading() {
        console.log('end show');
        if(this.loading){
            this.loading.dismissAll();
        }
    }

    // Toast
    toast(msg: any) {
        let toast = this.toastController.create({
            message: msg,
            duration: 2 * 1000
        });
        toast.present();
    }

}
