import { MyApp } from '../../../app/app.component';
import { Component, Injector } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BasePage } from '../../../core/base-page/BasePage';

/*
  Generated class for the RetrievePassword page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-retrieve-password',
  templateUrl: 'retrieve-password.html'
})
export class RetrievePasswordPage extends BasePage{
  public token: string;
  public password: string;
  public confirmPwd: string;
  constructor(injector:Injector) {
    super(injector);
    this.token = this.navParams.get('token');
    console.log(this.token);
  }

  resPwd(){
    if(!this.password){
      this.toast('新密码不能为空');
      return
    }
    if(this.password.length < 8 || this.password.length > 16){
      this.toast('密码长度必须为8-16位');
      return
    }
    if(!this.confirmPwd){
      this.toast('确认密码不能为空');
      return
    }
    if(this.password != this.confirmPwd){
      this.toast('亲,你两次输入的密码不一致');
      return
    }

    this.showLoading('请稍后...');

    let body = {
      token: this.token,
      newPassword: this.password
    }
    this.httpUtil.post({
      url: this.apiUrls.getResPwd(),
      param: body,
      success: (data) => {
         this.navController.push(MyApp);
      },
      fail: (err) => {
         this.toast(err.msg);
      }, finish: () => {
         this.dismissLoading();
      }
    })
  }

}
