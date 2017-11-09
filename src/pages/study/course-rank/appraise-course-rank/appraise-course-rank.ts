/**
 * Created by zxh on 2017/3/6.
 */
import {Component, Injector, ViewChild} from "@angular/core";
import {CourseMiniVo} from "../../../../models/study/CourseMiniVo";
import {BasePage} from "../../../../core/base-page/BasePage";
import {DBUtils} from "../../../../core/db/DBUtils";
import {Platform, Events} from "ionic-angular";
import {EventsConstants} from "../../../../core/EventsConstants";
import {CategoryUtils} from "../../CategoryUtils";
import {CourseDetailPage} from "../../course-detail/course-detail";
import {DBTableName} from "../../../../core/db/DBTableName";

@Component({
    selector: 'page-course-rank',
    templateUrl: 'appraise-course-rank.html'
})

//课程点赞排行
export class CourseAppraiseRankPage extends BasePage {

    @ViewChild('CourseRankContent') CourseRankContent;

    private REFRESH_CODE = 'CourseAppraiseRankPage';//已读置灰刷新列表通知Code

    public courseList: Array<CourseMiniVo> = [];//点赞排行课程
    private pageNum: number = 1;
    private pageSize: number = 10;
    public canLoadMore: boolean = false;

    constructor(injector: Injector,
                private dbUtils: DBUtils,
                private platform: Platform,
                private events: Events) {
        super(injector);
        this.showLoading();
        this.getAppraiseCourseList();
        this.events.subscribe(EventsConstants.REFRESH_COURSE_LIST, (date) => {
            if (date && date.length > 0) {
                if (date[0].refreshCode == this.REFRESH_CODE) {
                    this.courseList[date[0].index].isRead = true;
                }
            }
        });
    }

    toTop() {
        this.CourseRankContent.scrollToTop();
    }

    //获取点赞排行课程列表
    getAppraiseCourseList(refresher?: any) {
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            personGrpId: this.storageUtil.getPersonGrpId(),
            pageNum: this.pageNum,
            pageSize: this.pageSize
        };
        this.httpUtil.get({
            url: this.apiUrls.getUrlMostAppraise(), param: params, success: (res) => {
                if (this.pageNum == 1) {
                    this.courseList = [];
                }
                if (res.result == null || res.result == '') {
                    this.canLoadMore = false;
                    return;
                }
                this.courseList = this.courseList.concat(res.result);
                for (let i = (this.pageNum - 1) * this.pageSize; i < this.courseList.length; i++) {
                    this.getCourseReadState(i);
                }
                if (res.result.length >= this.pageSize) {
                    this.canLoadMore = true;
                } else {
                    this.canLoadMore = false;
                }
            }, fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
                if (refresher != null) {
                    refresher.complete();
                }
                this.dismissLoading();
            }
        });
    }

    getCategoryCss(categoryName: string) {
        return CategoryUtils.getCategoryCss(categoryName);
    }

    //跳转到课程详情
    toCourseDetail(index: number) {
        this._app.getRootNav().push(CourseDetailPage, {
            courseId: this.courseList[index].courseId,
            courseListIndex: index,
            refreshCode: this.REFRESH_CODE
        });
    }


    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.showLoading();
            this.pageNum = 1;
        } else {
            this.pageNum = this.pageNum + 1;
        }
        this.getAppraiseCourseList(refresher);
    }

    //获取课程已读状态
    getCourseReadState(index: number) {
        if (this.platform.is('mobile')) {
            this.dbUtils.selectByWhere({
                tableName: DBTableName.READ_COURSE_TABLE,
                where: 'courseId = ' + this.courseList[index].courseId,
                success: (result) => {
                    if (result.length > 0) {
                        this.courseList[index].isRead = true;
                    } else {
                        this.courseList[index].isRead = false;
                    }
                }
            });
        } else {
            this.courseList[index].isRead = false;
        }
    }
}
