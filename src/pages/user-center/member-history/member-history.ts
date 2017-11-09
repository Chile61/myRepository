import { MetadataOverride } from '@angular/core/testing';
import { ReadingHistoryVo } from '../../../models/userCenter/ReadingHistoryVo';
import { CourseDetailPage } from '../../study/course-detail/course-detail';
import { Component, Injector } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BasePage } from '../../../core/base-page/BasePage';

/*
  Generated class for the MemberHistory page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-member-history',
  templateUrl: 'member-history.html'
})
export class MemberHistoryPage extends BasePage{
  public totalCount: number = 0;
  public historyList : Array<ReadingHistoryVo> = [];
  public page: number = 1;
  public pageSize: number = 10;
  public canLoadMore: boolean = false;
  constructor(injector:Injector) {
    super(injector);
    this.getMyHistroy();
  }

  ionViewDidLoad() {
    console.log('Hello MemberHistoryPage Page');
  }
  getMyHistroy(refresher?) {
        let body = {
            userId: this.storageUtil.getUserId(),
            orgId: this.storageUtil.getOrgId(),
            pageNum: this.page,
            pageSize: this.pageSize
        };

        this.httpUtil.get({
            url: this.apiUrls.getMyStudyHistoryByDay(),
            param: body,
            success: (res) => {
              //this.log(data);
              this.totalCount = res.totalCount;
              //this.historyList = data.result;
              if (this.page == 1) {
                this.historyList = [];
              }
              if(res.result == null || res.result == ''){
                this.canLoadMore = false;
                return;
              }
              console.log('----------------');
              this.historyList = this.historyList.concat(res.result);
              if (res.result.length >= this.pageSize) {
                this.canLoadMore = true;
              } else {
                this.canLoadMore = false;
              } 
            },
            fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
                if(refresher){
                  refresher.complete();
                }
                this.dismissLoading();
            }
        });
  }
   //判断两个时间戳(Timestamp)是否在同一天  
   isTheSameDate(time1,time2) {  
     
   }
   //计算时间
  isTheDate(timestamp) {
      var date = new Date(timestamp);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      
      var result = year + '年' + (month < 10 ? '0' + month : month) + '月' + (day < 10 ? '0' + day : day) ;
    return result;
  }
  //集合时间
  bindTime(index){
    if(index == 0){
      return true
    }
    var CURRENCY = this.historyList[index].readTime;
    var BEFORE =  this.historyList[index-1].readTime;
    if(this.isTheDate(BEFORE) == this.isTheDate(CURRENCY)){
      return false
    }
    return true
  }
  //进入课程详情页
  toCourseDetail(courseId: number) {
      this.navController.push(CourseDetailPage, {courseId: courseId});
  }
  doRefresh(refresher, isRefresh: boolean) {
    if (isRefresh) {
       this.showLoading();
       this.page = 1;
    } else {
       this.page = this.page + 1;
    }
    this.getMyHistroy(refresher);
  }
}
