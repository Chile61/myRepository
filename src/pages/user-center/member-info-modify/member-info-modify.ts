import { BasePage } from '../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';

/*
  Generated class for the MemberInfoModify page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-member-info-modify',
  templateUrl: 'member-info-modify.html'
})
export class MemberInfoModifyPage extends BasePage{
  public modifyParam: string = '';
  public modifyType: string = '';
  constructor(injector:Injector) {
    super(injector);
    this.modifyType = this.navParams.get('type');
    this.modifyParam = this.navParams.get('modifyParam');
  }

  //保存修改信息
  saveModifyMsg() {
    let body = {
      userId: this.storageUtil.getUserId(),
      
    }
    switch (this.modifyType) {
      case 'nickName' : 
        body["nickName"] = this.modifyParam
        break;
      case 'remark' :
        body["remark"] = this.modifyParam
        break;
    }
    this.httpUtil.post({
      url: this.apiUrls.updateMyInfo()+'/'+this.storageUtil.getOrgId()+'/'+this.storageUtil.getUserId(),
      param: body,
      success: (data) => {
        let userVo = this.storageUtil.getUserInfo();
        switch (this.modifyType) {
          case 'nickName' : 
             userVo.nickName = this.modifyParam
             break;
          case 'remark' :
             userVo.remark = this.modifyParam
             break;
        }
  
        this.storageUtil.saveUserInfo(userVo);
        this.navController.pop();
      },
      fail: (err) => {
        this.toast(err.msg);
      }, finish: () => {
              
      }
    })
  }
}
