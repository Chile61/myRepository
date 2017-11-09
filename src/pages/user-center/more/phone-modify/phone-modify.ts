import { BasePage } from '../../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the PhoneModify page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-forget-password',//page-phone-modify
  templateUrl: 'phone-modify.html'
})
export class PhoneModifyPage extends BasePage{

  public phoneNo: string;
  public checkNum: string;
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
            url: this.apiUrls.getTelCode(),
            param: body,
            success: (data) => {
                this.timer(60);
                this.canGetVerifyCode = false;
            
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

  //完成手机绑定
  bindMobile() {
    
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
      mobile: this.phoneNo,
      checkNum: this.checkNum

    }
    this.httpUtil.post({
      url: this.apiUrls.getBindMobile()+'/'+this.storageUtil.getOrgId()+'/'+this.storageUtil.getUserId(),
      param: body,
      success: (data) => {
        let userVo = this.storageUtil.getUserInfo();
        userVo.mobile = this.phoneNo;

        this.storageUtil.saveUserInfo(userVo);
        this.navController.pop();
      },
      fail: (err) => {
         this.toast(err.msg);
      }, finish: () => {
         this.dismissLoading();
      }
    })
  }

}
