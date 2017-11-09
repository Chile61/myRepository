import { UserRankingVo } from '../../../models/userCenter/UserRankingVo';
import { UserVo } from '../../../models/core/UserVo';
import { DeptHierarchyVo } from '../../../models/userCenter/DeptHierarchyVo';
import { BasePage } from '../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';

/*
  Generated class for the MemberRank page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-member-rank',
  templateUrl: 'member-rank.html'
})
export class MemberRankPage extends BasePage{
  public deptOptions : any;
  public deptBar: string = '';

  public TOTAL_RANK: string = '003';
  public MONTH_RANK: string = '002';
  public WEEK_RANK: string = '001';
  public rankBar: string = this.TOTAL_RANK;
  
  public deptList: Array<DeptHierarchyVo> = [];
  public rankingList: Array<UserVo> = [];
  public pageNum: number = 1;
  public pageSize: number = 10;
  public myRanking: UserRankingVo;

  public canLoadMore: boolean = false;
  constructor(injector:Injector) {
    super(injector);
    this.showLoading();
    this.getMyDept();

    //
    this.deptOptions = {
      title: '选择部门'  
    };
  }
  //获取部门列表
  getMyDept() {
    let body = {
      userId: this.storageUtil.getUserId(),
      orgId: this.storageUtil.getOrgId()
    }
    this.httpUtil.get({
      url: this.apiUrls.getMyDept(),
      param: body,
      success: (data) => {
         console.log(data);
         this.deptList = data.result;
         this.deptBar = this.deptList[0].deptId.toString();
         this.getMyRanking();
         this.getRankingChart();
      },
      fail: (err) => {
         this.toast(err.msg);
      }, finish: () => {
         this.dismissLoading();
      }
    })
  }
  //学习排行
  getRankingChart(refresher?) {
    let body = {
      userId: this.storageUtil.getUserId(),
      orgId: this.storageUtil.getOrgId(),
      range: this.rankBar,
      deptId: this.deptBar,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    }
    this.httpUtil.get({
      url: this.apiUrls.getRankingChart(),
      param: body,
      success: (res) => {
         console.log(res);
         //this.rankingList = res.result;
         if (this.pageNum == 1) {
           this.rankingList = [];
         }
         if(res.result == null || res.result == ''){
           this.canLoadMore = false;
           return;
         }
         this.rankingList = this.rankingList.concat(res.result);
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
    })
  }
  //获取我的排行(footer)
  getMyRanking() {
    let body = {
      userId: this.storageUtil.getUserId(),
      orgId: this.storageUtil.getOrgId(),
      range: this.rankBar,
      deptId: this.deptBar
    }
    this.httpUtil.get({
      url: this.apiUrls.getMyRanking(),
      param: body,
      success: (data) => {
         console.log(data);
         this.myRanking = data.result;
      },
      fail: (err) => {
         this.toast(err.msg);
      }, finish: () => {
         this.dismissLoading();
      }
    })
  }
  //切换时间范围
  clickRankBar(index) {
    if(this.rankBar == index){
      return;
    }
    this.pageNum = 1;
    this.showLoading();

    this.rankBar = index;
    this.getMyRanking();
    this.getRankingChart();
  }
  //切换部门
  bindDeptOptions() {
    this.pageNum = 1;
    this.getMyRanking();
    this.getRankingChart();
  }

  doRefresh(refresher, isRefresh: boolean) {
    if (isRefresh) {
       this.showLoading();
       this.pageNum = 1;
    } else {
       this.pageNum = this.pageNum + 1;
    }
    this.getRankingChart(refresher);
  }
}
