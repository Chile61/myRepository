import { Component, Injector } from "@angular/core";
import { Platform,App } from "ionic-angular";
import { TabsPage } from "../tabs/tabs";
import { BasePage } from "../../core/base-page/BasePage";
import { ForgetPasswordPage } from './forget-password/forget-password';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage extends BasePage {

    public tabTag: string = 'tabPwd';
    public orgCode: string;
    public username: string;
    public password: string;
    public phoneNo: string;
    public checkNum: string;
    public canGetVerifyCode: boolean;
    public checkText: string;
    public FUN_LOGIN_UNP:'FUN_LOGIN_UNP';
    public FUN_LOGIN_MNC:'FUN_LOGIN_MNC';
    public loginWays: { loginWayCode: string }={ loginWayCode:this.FUN_LOGIN_UNP};
    public loginLogoUrl: string;
    constructor(injector: Injector, public platform: Platform, public app: App) {
        super(injector);
        //删除滑动页
        let active = this.navController.getActive();
        let pageName = active.name;
        if(pageName == 'IndexSlidesPage'){
        	let index = active.index;
            this.navController.remove(index,1);
        }
        // 初始化企业编码
        this.orgCode = this.storageUtil.getOrgCode();

        // 初始化验证码
        this.canGetVerifyCode = true;
        this.checkText = "获取验证码";
        console.log(this.loginWays)
        this.showLoading();
        this.getLoginConfig();
        // var div = document.querySelector('pageLogin');
        // console.log(div);
        // div.innerHTML='<input type="text" value="test document"/>';
    }

    // 企业基本信息
    getLoginConfig() {
        let param = {
            orgCode: this.orgCode,
            deviceType: this.platform.is('ios') ? 2 : 1
        };

        this.httpUtil.get({
            url: this.apiUrls.getUrlSpecialConfig(),
            param: param,
            success: (data) => {
                this.loginLogoUrl = data.result.loginLogoUrl;
                this.loginWays = data.result.orgLoginWays;
            },
            fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
                this.dismissLoading();
            }
        })
    }

    // 用户名+密码
    bindBtnLogin() {
        if (!this.username) {
            this.toast('请输入用户名');
            return;
        }
        if (!this.password) {
            this.toast('请输入密码');
            return;
        }

        let body = {
            'prodType': 'PROD_STD_CO00',
            'clientType': 'CLIENT_WEB',
            'orgCode': this.orgCode,
            'username': this.username,
            'password': this.password
        };

        this.showLoading('正在登录...');

        this.httpUtil.post({
            url: this.apiUrls.getUrlLoginWithPwd(),
            param: body,
            success: (data) => {
                this.storageUtil.saveLoginInfo(data.result);
                this.init();
        
            },
            fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
                this.dismissLoading();
            }
        });
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
            orgCode: this.orgCode,
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

    // 手机登陆
    quickLogin() {

        if (!this.phoneNo) {
            this.toast('请输入手机号码');
            return;
        }
        if (this.utils.isPhoneNumber(this.phoneNo) == false) {
            this.toast('请输入有效的手机号码');
            return;
        }
        let body = {
            'prodType': 'PROD_STD_CO00',
            'clientType': 'CLIENT_WEB',
            'orgCode': this.orgCode,
            'mobile': this.phoneNo,
            'checkNum': this.checkNum
        };

        this.showLoading('正在登录...');

        this.httpUtil.post({
            url: this.apiUrls.getUrlLoginWithTel(),
            param: body,
            success: (data) => {
                this.storageUtil.saveLoginInfo(data.result);
                this.init();
            },
            fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
                this.dismissLoading();
            }
        });
    }
    //获取模块化配置
    init(){
      let param = {
        orgId: this.storageUtil.getOrgId()
      }
      this.httpUtil.get({
        url: this.apiUrls.getUrlModuleConfig(),
        param: param,
        success: data => {
          this.log(data);
          this.storageUtil.saveModuleConfig(data.result);
          this.app.getRootNav().push(TabsPage);
          if(this.app.getRootNav().length()>1){
              this.app.getRootNav().remove(0,this.app.getRootNav().length()-1);
          }
        },
        fail: (err) => {
          this.toast(err.msg);
        }, finish: () => {
          this.dismissLoading();
        }
      })
    }
    //忘记密码
    enterResPwd() {
        this.navController.push(ForgetPasswordPage);
    }
}
