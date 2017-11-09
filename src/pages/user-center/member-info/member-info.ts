import { MemberInfoModifyPage } from '../member-info-modify/member-info-modify';
import { BasePage } from '../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { ActionSheetController} from 'ionic-angular';
import { UserVo } from '../../../models/userCenter/userVo';


/*
  Generated class for the MemberInfo page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-member-info',
  templateUrl: 'member-info.html'
})
export class MemberInfoPage extends BasePage{
　public userVo:UserVo;
  constructor(injector:Injector,public actionSheetCtrl:ActionSheetController) {
    super(injector);
    this.getMemberInfo();
  }
  //每次进入
  ionViewWillEnter() {
    console.log('refresh');
    this.getMemberInfo();
  }
  //更改用户性别
  modifyMemberGender() {
    let actionSheet = this.actionSheetCtrl.create({
      title:'',
      buttons:[
        {
          text:'男',
          handler: () =>{
            this.saveModifyMsg('男')
          }
        },{
          text:'女',
          handler: () =>{
            this.saveModifyMsg('女')
          }
        },{
          text:'取消',
          role:'cancel',
          handler: () =>{
            console.log('cancel');
          }
        }
      ]
    });
    actionSheet.present();
  }
  //修改用户性别
  saveModifyMsg(sex) {
    let body = {
      userId: this.storageUtil.getUserId(),
      gender: sex
    }
    this.httpUtil.post({
      url: this.apiUrls.updateMyInfo()+'/'+this.storageUtil.getOrgId()+'/'+this.storageUtil.getUserId(),
      param: body,
      success: (data) => {
        let userVo = this.storageUtil.getUserInfo();
        userVo.sex = (sex=='男' ? 1:2);
        this.storageUtil.saveUserInfo(userVo);

        this.userVo.sex = (sex=='男' ? 1:2);
      },
      fail: (err) => {
        this.toast(err.msg);
      }, finish: () => {
              
      }
    })
  }
  //进入信息修改
  enterMemberModify(val,type) {
    console.log('type:'+ type);
    this.navController.push(MemberInfoModifyPage,{ modifyParam: val,type: type});
  }
  //获取用户信息
  getMemberInfo()　{
     this.userVo = this.storageUtil.getUserInfo();
     console.log(this.userVo)
  }
}
