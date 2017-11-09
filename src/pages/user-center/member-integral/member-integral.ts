import { IntegralEventVo } from '../../../models/userCenter/IntegralEventVo';
import { IntegralRankVo } from '../../../models/userCenter/IntegralRankVo';
import { IntegralRewardVo } from '../../../models/userCenter/IntegralRewardVo';
import { IntegralAccountingItemVo } from '../../../models/userCenter/IntegralAccountingItemVo';
import { UserIntegralInfoVo } from '../../../models/userCenter/UserIntegralInfoVo';
import { BasePage } from '../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the MemberIntegral page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-member-integral',
  templateUrl: 'member-integral.html'
})
export class MemberIntegralPage extends BasePage{
  public myIntegral:UserIntegralInfoVo;
  public integralBar: string = 'reward';

  public rewardList: Array<IntegralRewardVo>;
  public orginList: Array<IntegralAccountingItemVo>;
  public statementsList: Array<IntegralRankVo>;
  public rulesList: Array<IntegralEventVo>;

  public pageNum: number = 1;
  public pageSize: number = 10;

  public canLoadMore: boolean = false;
  constructor(injector:Injector) {
    super(injector);
    this.showLoading();
    this.getMyIntegralInfo();
    this.getIntegralRewards();
  }
  //获取我的积分
  getMyIntegralInfo(refresher?:any) {
       let body = {
           userId: this.storageUtil.getUserId(),
           orgId: this.storageUtil.getOrgId()
       };
       this.httpUtil.get({
           url: this.apiUrls.getMyIntegral(),
           param: body,
           success: (data) => {     

              this.myIntegral = data.result;
              console.log( this.myIntegral);
           },fail: (err) => {
              this.toast(err.msg);
           }, finish: () => {
              if(refresher){
                refresher.complete();
              }
              this.dismissLoading();
          }
       })
  }
  //绑定进度条
  integralProgress(currency : number,next :number) {

      let percent = currency/next;
      let progress ={
        'width': percent*100+'%'
      }
      return progress;

  }
  //积分奖励
  getIntegralRewards() {
    this.canLoadMore = false;
    let body = {
           userId: this.storageUtil.getUserId(),
           orgId: this.storageUtil.getOrgId()
       };
       this.httpUtil.get({
           url: this.apiUrls.getIntegralRewards(),
           param: body,
           success: (data) => {     
              console.log(data);
              this.rewardList = data.result;
              
           },fail: (err) => {
              this.toast(err.msg);
           }, finish: () => {
              this.dismissLoading();
          }
       })
  }
  //积分来源
  getIntegralOrgins(refresher?:any) {
    if(refresher!=null){
      this.pageNum = 1;
    }
    let body = {
           userId: this.storageUtil.getUserId(),
           orgId: this.storageUtil.getOrgId(),
           pageNum: this.pageNum,
           pageSize: this.pageSize
       };
       this.httpUtil.get({
           url: this.apiUrls.getIntegralAccountingDetail(),
           param: body,
           success: (data) => {     
              console.log(data);
              //this.orginList = data.result;
              if(this.pageNum == 1){
                this.orginList = [];
              }
             
              if(data.result == null || data.result ==''){
                this.canLoadMore = false;
                return;
              }

              this.orginList = this.orginList.concat(data.result.list);
              if(data.result.list.length >= this.pageSize){
                this.canLoadMore = true;
              }else{
                this.canLoadMore = false;
              }
              
           },fail: (err) => {
              this.toast(err.msg);
           }, finish: () => {
              if(refresher){
                  refresher.complete();
                }
              this.dismissLoading();
          }
       })
  }
  //等级说明
  getIntegralStatements() {
    this.canLoadMore = false;
    let body = {
           userId: this.storageUtil.getUserId(),
           orgId: this.storageUtil.getOrgId()
       };
       this.httpUtil.get({
           url: this.apiUrls.getIntegralRanks(),
           param: body,
           success: (data) => {     
              console.log(data);
              this.statementsList = data.result;
              
           },fail: (err) => {
              this.toast(err.msg);
           }, finish: () => {
              this.dismissLoading();
          }
       })
  }
  //积分规则
  getIntegralRules() {
    this.canLoadMore = false;
    let body = {
           userId: this.storageUtil.getUserId(),
           orgId: this.storageUtil.getOrgId()
       };
       this.httpUtil.get({
           url: this.apiUrls.getIntegralRules(),
           param: body,
           success: (data) => {     
              console.log(data);
              this.rulesList = data.result;
              
           },fail: (err) => {
              this.toast(err.msg);
           }, finish: () => {
              this.dismissLoading();
          }
       })
  }

  //
  doRefresh(refresher, isRefresh: boolean) {

    if (isRefresh) {
      // this.showLoading();
       this.pageNum = 1;
       this.getMyIntegralInfo(refresher);
    } else {
       this.pageNum = this.pageNum + 1;
    }
    if(this.integralBar == 'origin'){
      this.getIntegralOrgins(refresher);
    }
  }
}
