import { BasePage } from '../../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';

/*
  Generated class for the PasswordModify page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-password-modify',
  templateUrl: 'password-modify.html'
})
export class PasswordModifyPage extends BasePage{
  public newPwd: string;
  public confirmPwd:string;
  constructor(injector:Injector) {
    super(injector);
  }
  //修改密码
  saveNewPassword() {
    if(!this.newPwd){
      this.toast('新密码不能为空!');
      return
    }
    if( this.newPwd.length < 8 || this.newPwd.length > 16){
      this.toast('密码长度必须为8-16位');
      return
    }
    if( this.newPwd != this.confirmPwd){
      this.toast('亲，你两次输入的密码不一致');
      return
    }
    let body = {
      userId: this.storageUtil.getUserId(),
      password: this.confirmPwd,
      orgId: this.storageUtil.getOrgId()
    }
    this.httpUtil.post({
      url: this.apiUrls.updateMyInfo()+'/'+this.storageUtil.getOrgId()+'/'+this.storageUtil.getUserId(),
      param: body,
      success: (data) => {
        
        this.navController.pop().then(()=>{
          this.toast('修改成功');
        });
      },
      fail: (err) => {
        this.toast(err.msg);
      }, finish: () => {
              
      }
    })
  }

}
