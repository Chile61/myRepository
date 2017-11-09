import { HelpDetailsPage } from '../help-details/help-details';
import { HelpQnaListVo } from '../../../../models/userCenter/HelpQnaListVo';
import { HelpQnaTypeVo } from '../../../../models/userCenter/HelpQnaTypeVo';
import { BasePage } from '../../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Help page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-help',
  templateUrl: 'help.html'
})
export class HelpPage extends BasePage{
  public qnaTitleList: Array<HelpQnaTypeVo> = [];
  public qnaCurrentItem: number;

  public qnaTypeList: Array<HelpQnaListVo> = [];
  public page: number = 1;
  public pageSize: number = 8;
  public canLoadMore: boolean = false;
  constructor(injector:Injector) {
    super(injector);
    this.showLoading();
    this.getQnaTitle();
  }
  //获取问题类型
  getQnaTitle() {
       this.httpUtil.get({
           url: this.apiUrls.getTypeList(),
           success: (data) => {     
              
              console.log(data);
              this.qnaTitleList = data.result;
              if(data.result){
                this.qnaCurrentItem = this.qnaTitleList[0].value;
                this.getQnaList();
              }
           },fail: (err) => {
              this.toast(err.msg);
           }, finish: () => {
              this.dismissLoading();
          }
       })
  }
  //进入问题详细页
  //选择类型
  selectQnaItem(value) {
    if(this.qnaCurrentItem == value){
      return
    }
    this.qnaCurrentItem = value;
    this.page = 1;

    this.showLoading();
    this.getQnaList();
  }
  //获取问题列表
  getQnaList(refresher?) {
    let param = {
      moduleValue: 1,
			qnaTypeValue: this.qnaCurrentItem,
			page: this.page,
			pageSize: this.pageSize
    }
    this.httpUtil.get({
           url: this.apiUrls.getQnaList(),
           param: param,
           success: (res) => {     
              
              console.log(res);
              // this.qnaTypeList = res.result;
              if (this.page == 1) {
                this.qnaTypeList = [];
              }
              if(res.result == null || res.result == ''){
                this.canLoadMore = false;
                return;
              }
            
              this.qnaTypeList = this.qnaTypeList.concat(res.result);
              if (res.result.length >= this.pageSize) {
                this.canLoadMore = true;
              } else {
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
  doRefresh(refresher, isRefresh: boolean) {
    if (isRefresh) {
       this.showLoading();
       this.page = 1;
    } else {
       this.page = this.page + 1;
    }
    this.getQnaList(refresher);
  }
  //进入问题详细页
  enterQnaDetail(id) {
    console.log(id);
    this.navController.push(HelpDetailsPage,{ qnaContentId:id });
  }
}
