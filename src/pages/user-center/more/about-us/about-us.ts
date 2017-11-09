import { BasePage } from '../../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

/*
  Generated class for the AboutUs page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html'
})
export class AboutUsPage extends BasePage{
  public resUrl:string;
  constructor(injector:Injector,public platform: Platform) {
    super(injector);
    this.getAboutUs();
  }
  //
  getAboutUs(){
       let body = {
           userId: this.storageUtil.getUserId(),
           orgId: this.storageUtil.getOrgId(),
           deviceType: this.platform.is('ios') ? 2 : 1
       };
       this.httpUtil.get({
           url: this.apiUrls.aboutUs(),
           param: body,
           success: (data) => {     
             console.log(data);
             this.resUrl = data;
           },fail: (err) => {
              this.toast(err.msg);
           }, finish: () => {
              //this.dismissLoading();
          }
       })
  }
}
