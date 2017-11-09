import { HelpPage } from '../help/help';
import { AboutUsPage } from '../about-us/about-us';
import { FuncIntroductionPage } from '../func-introduction/func-introduction';
import { StorageUtil } from '../../../../core/storage/StorageUtil';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PhoneModifyPage } from '../phone-modify/phone-modify';
import { PasswordModifyPage } from '../password-modify/password-modify';

/*
  Generated class for the MoreHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-more-home',
  templateUrl: 'more-home.html'
})
export class MoreHomePage {
  public tel: string ;

  constructor(public navCtrl: NavController,public storageUtil:StorageUtil) {
    let userVo = this.storageUtil.getUserInfo(); 
    this.tel = userVo.mobile;
  }
  //每次进入
  ionViewWillEnter() {
    console.log('refresh');
    let userVo = this.storageUtil.getUserInfo(); 
    this.tel = userVo.mobile;
  }
  //修改手机号码
  enterModifyPhone(){
    if(!this.tel){
      return;
    }
    this.navCtrl.push(PhoneModifyPage);
  }
  //帮助中心
  enterHelpCenter() {
    this.navCtrl.push(HelpPage);
  }
  //修改密码
  enterModifyPwd(){
    this.navCtrl.push(PasswordModifyPage);
  }
  //进入功能介绍
  enterFuncIntroduction(){
    this.navCtrl.push(FuncIntroductionPage);
  }
  //关于我们
  enterAboutUs(){
    this.navCtrl.push(AboutUsPage);
  }
}
