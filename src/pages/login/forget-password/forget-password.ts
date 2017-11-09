import { BasePage } from '../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RetrievePasswordPage } from './../retrieve-password/retrieve-password';

@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html'
})
export class ForgetPasswordPage extends BasePage{

  public phoneNo: string;
  public checkNum: string;
  public token: string;
  public canGetVerifyCode: boolean;
  public checkText: string;

  constructor(injector:Injector) {
    super(injector);
    // 初始化验证码
    this.canGetVerifyCode = true;
    this.checkText = "获取验证码";

  }
   // 验证码
    askForCheckNum() {
        if (this.canGetVerifyCode == false) {
            return;
        }
        if (!this.phoneNo) {
            this.toast('请输入手机号码');
            return;
        }
        if (this.utils.isPhoneNumber(this.phoneNo) == false) {
            this.toast('请输入有效的手机号码');
            return;
        }

        let body = {
            prodType: 'PROD_STD_CO00',
            clientType: 'CLIENT_WEB',
            orgCode: this.storageUtil.getOrgCode(),
            mobile: this.phoneNo
        };

        this.showLoading('请稍后...');

        this.httpUtil.get({
            url: this.apiUrls.getForgetTelCode(),
            param: body,
            success: (data) => {
                this.timer(60);
                this.canGetVerifyCode = false;
                this.token = data.result;
                return true;
            },
            fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
                this.dismissLoading();
            }
        });
    }

    // 定时器
    timer(wait) {
        if (wait == 0) {
            this.canGetVerifyCode = true;
            this.checkText = "获取验证码"
        } else {
            this.checkText = '已发送(' + wait + ')秒';
            wait--;
            setTimeout(() => {
                this.timer(wait);
            }, 1000)
        }
    }

  //跳转到密码设置
  enterResPwd() {
    
    if (!this.phoneNo) {
       this.toast('请输入手机号码');
       return;
    }
    if (!this.checkNum) {
       this.toast('请输入验证码');
       return;
    }

    this.showLoading('请稍后...');
    let body = {
      token: this.token,
      mobile: this.phoneNo,
      checkNum: this.checkNum

    }
    this.httpUtil.post({
      url: this.apiUrls.getCheckTelCode(),
      param: body,
      success: (data) => {
         this.navController.push(RetrievePasswordPage,{ token: this.token });
      },
      fail: (err) => {
         this.toast(err.msg);
      }, finish: () => {
         this.dismissLoading();
      }
    })
  }

}
