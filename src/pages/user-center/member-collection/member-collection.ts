import { DiscussSubjectMiniVo } from '../../../models/circle/DiscussSubjectMiniVo';
import { CourseMiniVo } from '../../../models/study/CourseMiniVo';
import { Component, Injector } from '@angular/core';
import { BasePage } from '../../../core/base-page/BasePage';
import { MemberCollectionSearchPage } from '../member-collection-search/member-collection-search';
import { CourseDetailPage } from '../../study/course-detail/course-detail';

/*
  Generated class for the MemberCollection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-member-collection',
  templateUrl: 'member-collection.html'
})
export class MemberCollectionPage extends BasePage{
  public collectionBar: string = 'course';

  public page: number = 1;
  public pageSize: number = 10;
  public collectionCourseList: Array<CourseMiniVo> = [];
  public collectionSubjectList: Array<DiscussSubjectMiniVo> = [];

  public canLoadMore: boolean = false;
  constructor(injector:Injector) {
    super(injector);
    this.showLoading();
    this.getFavoritedCourses();
  }
  //课程收藏
  getFavoritedCourses(refresher?) {
    if(!refresher){
      this.page = 1;
    }
    let body = {
            userId: this.storageUtil.getUserId(),
            orgId: this.storageUtil.getOrgId(),
            pageNum: this.page,
            pageSize: this.pageSize
        };

        this.httpUtil.get({
            url: this.apiUrls.getMyFavoritedCourses(),
            param: body,
            success: (res) => {
              console.log(res);
              //this.collectionCourseList = res.result;
              if (this.page == 1) {
                this.collectionCourseList = [];
              }
              if(res.result == null || res.result == ''){
                this.canLoadMore = false;
                return;
              }
          
              this.collectionCourseList = this.collectionCourseList.concat(res.result);
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
  //话题收藏
  getFavoritedSubject(refresher?) {
    if(!refresher){
      this.page = 1;
    }
    let body = {
            userId: this.storageUtil.getUserId(),
            orgId: this.storageUtil.getOrgId(),
            pageNum: this.page,
            pageSize: this.pageSize
        };

        this.httpUtil.get({
            url: this.apiUrls.getMyFavoritedSubject(),
            param: body,
            success: (res) => {
              console.log(res);
             
              if (this.page == 1) {
                this.collectionSubjectList = [];
              }
              if(res.result == null || res.result == ''){
                this.canLoadMore = false;
                return;
              }
          
              this.collectionSubjectList = this.collectionSubjectList.concat(res.result);
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
  //进入课程详情页
  toCourseDetail(courseId: number) {
      this.navController.push(CourseDetailPage, {courseId: courseId});
  }
  //进入搜索页
  enterCollectionSearch() {
    this.navController.push(MemberCollectionSearchPage)
  }
  //
  doRefresh(refresher, isRefresh: boolean) {
    if (isRefresh) {
       this.showLoading();
       this.page = 1;
    } else {
       this.page = this.page + 1;
    }
    if(this.collectionBar == 'course'){
      this.getFavoritedCourses(refresher);
    }else{
      this.getFavoritedSubject(refresher);
    }
  }
}
