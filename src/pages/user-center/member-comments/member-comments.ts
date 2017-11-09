import { EmojiUtils } from '../../../core/EmojiUtils';
import { CourseDetailPage } from '../../study/course-detail/course-detail';
import { UserCourseCommentVo } from '../../../models/userCenter/UserCourseCommentVo';
import { BasePage } from '../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';

/*
  Generated class for the MemberComments page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-member-comments',
  templateUrl: 'member-comments.html'
})
export class MemberCommentsPage extends BasePage{
  public commentsList: Array<UserCourseCommentVo> = [];
  public page: number = 1;
  public pageSize: number = 10;
  public canLoadMore: boolean = false;
  constructor(injector:Injector,private emojiUtils: EmojiUtils) {
    super(injector);
    this.getMyCourseComments();
  }
  getMyCourseComments(refresher?) {
        let body = {
            userId: this.storageUtil.getUserId(),
            orgId: this.storageUtil.getOrgId(),
            pageNum: this.page,
            pageSize: this.pageSize
        };

        this.httpUtil.get({
            url: this.apiUrls.getMyCourseComments(),
            param: body,
            success: (res) => {
              console.log(res);
             // this.commentsList = data.result;
              if (this.page == 1) {
                this.commentsList = [];
              }
              if(res.result == null || res.result == ''){
                this.canLoadMore = false;
                return;
              }
              this.commentsList = this.commentsList.concat(res.result);
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
  doRefresh(refresher, isRefresh: boolean) {
    if (isRefresh) {
       this.showLoading();
       this.page = 1;
    } else {
       this.page = this.page + 1;
    }
    this.getMyCourseComments(refresher);
  }
  //表情标签转图片
  transSmils(commentContent: string) {
      return this.emojiUtils.transSmiles(commentContent);
  }
  //进入课程详情页
  toCourseDetail(courseId: number) {
      this.navController.push(CourseDetailPage, {courseId: courseId});
  }
}
