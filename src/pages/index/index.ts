import { BasePage } from '../../core/base-page/BasePage';
import { StorageUtil } from '../../core/storage/StorageUtil';
import { NavController, Platform, ToastController } from 'ionic-angular';
import { Component, Injector } from '@angular/core';
import { LoginPage } from '../login/login';
import { ConfigKey } from '../../core/storage/ConfigKey';
import { IndexSlidesPage } from './index-slides/index-slides';
import { ThemeUtils } from '../../core/ThemeUtils';

@Component({
  selector: 'page-index',
  templateUrl: 'index.html'
})
export class IndexPage extends BasePage{
  orgCodeVal: string = '';
  constructor(public platform: Platform, public toastCtrl: ToastController,injector:Injector,private themeUtils:ThemeUtils) {
    super(injector);
    //let orgCode = localStorage.getItem('orgCode');
    // if(orgCode && orgCode!=''){
    //   this.orgCodeVal = orgCode;
    //   this.navCtrl.push(LoginPage);
    // }
  }

  ionViewDidLoad() {
    let time = this.navController.length();
    console.log('___time:' +time);
    console.log('Hello IndexPage Page');
  }
  //下一步
  bindBtnLogin() {
    if(this.orgCodeVal){
      let val = this.storageUtil.getStorageValue(ConfigKey.ORG_CODE,'');
      if(this.orgCodeVal != val){
        this.storageUtil.setStorageValue(ConfigKey.ORG_CODE,this.orgCodeVal);
        this.showLoading();
        //SpecialConfig
        this.getLoginConfig();  
      }else{
        this.navController.push(LoginPage);
      }
    }
  }
  //企业基本信息
  getLoginConfig(){
    let type = 1;
    if (this.platform.is('ios')) {
      type = 2;
    }
    let param = {
      orgCode: this.orgCodeVal ,
      deviceType: type
    }
  
    this.httpUtil.get({
      url: this.apiUrls.getUrlSpecialConfig(),
        param: param,
        success:data =>{
          this.themeUtils.saveTheme(data.result);
          this.navController.push(IndexSlidesPage,{introducePages:data.result.introducePages["1920*1080"]});
          
          //this.navController.push(LoginPage);
          // this.result = data.result;
          // this.url = this.result.loginLogoUrl;
          // this.loginWays = this.result.orgLoginWays;
    		},
        fail: (err) => {
           this.toast(err.msg);
        }, finish: () => {

           this.dismissLoading();
        }
    })
  }
}
