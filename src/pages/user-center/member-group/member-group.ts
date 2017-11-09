import { PersonGroupVo } from '../../../models/userCenter/PersonGroupVo';
import { BasePage } from '../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';

/*
  Generated class for the MemberGroup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-member-group',
  templateUrl: 'member-group.html'
})
export class MemberGroupPage extends BasePage{
  public personGroup: Array<PersonGroupVo>;
  constructor(injector:Injector) {
    super(injector);
    this.showLoading();
    this.getMyPersonGrp();
  }
  //获取人群信息
  getMyPersonGrp(){
    let param = {
      userId: this.storageUtil.getUserId(),
      orgId: this.storageUtil.getOrgId()
    }
    this.httpUtil.get({
      url: this.apiUrls.getMyPersonGrp(),
      param: param,
      success: data => {
        console.log('人群:')
        console.log(data);
        this.personGroup = data.result;
      },
      fail: (err) => {
        this.toast(err.msg);
      }, finish: () => {
        this.dismissLoading();
      }
    })
  }
  //
  savePersonGroupId(id){
    if(id){
      this.storageUtil.setStorageValue('PERSON_GRP_ID',id);
      this.navController.pop();
    }else{
      this.toast('切换人群失败');
    }
    
  }


}
