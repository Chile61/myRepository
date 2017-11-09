/**
 * Created by zxh on 2016/12/20.
 */
import {Component, Injector, ViewChild} from "@angular/core";
import {CourseTypeVo} from "../../../models/study/CourseTypeVo";
import {CourseMiniVo} from "../../../models/study/CourseMiniVo";
import {CourseDetailPage} from "../course-detail/course-detail";
import {BasePage} from "../../../core/base-page/BasePage";
import {CategoryUtils} from "../CategoryUtils";
import {DBTableName} from "../../../core/db/DBTableName";
import {Platform, Events} from "ionic-angular";
import {DBUtils} from "../../../core/db/DBUtils";
import {EventsConstants} from "../../../core/EventsConstants";

@Component({
    selector: 'page-more-course',
    templateUrl: 'more-course.html'
})

//更多课程(课程形式)
export class MoreCoursePage extends BasePage {

    @ViewChild('MoreCourseContent') MoreCourseContent;

    private REFRESH_CODE = 'MoreCoursePage';//已读置灰刷新列表通知Code

    public pageTitle: string = '全部课程';
    private reqParam: string = '';//快捷方式上REQUEST_PARAM属性值,没有传''

    public courseTypeLs: Array<CourseTypeVo> = [];
    public selectFormId: number = -1;

    private pageNum: number = 1;
    private pageSize: number = 10;
    public canLoadMore: boolean = false;

    public courseList: Array<CourseMiniVo> = [];

    constructor(injector: Injector,
                private dbUtils: DBUtils,
                private platform: Platform,
                private events: Events) {
        super(injector);
        this.pageTitle = this.navParams.get('pageTitle') || '全部课程';
        this.reqParam = this.navParams.get('reqParam') || '';
        this.showLoading();
        this.getCourseType();
        this.events.subscribe(EventsConstants.REFRESH_COURSE_LIST, (date) => {
            if (date && date.length > 0) {
                if (date[0].refreshCode == this.REFRESH_CODE) {
                    this.courseList[date[0].index].isRead = true;
                }
            }
        });
    }

    //获取课程形式列表
    getCourseType() {
        let url = this.apiUrls.getUrlCourseFormLs();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            reqParam: this.reqParam
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                this.courseTypeLs = res.result;
                if (this.courseTypeLs.length > 0) {
                    this.selectFormId = this.courseTypeLs[0].formId;
                    this.getTypeCourseList();
                }
            }, fail: (err) => {
                this.toast(err.msg);
                this.dismissLoading();
            }
        })
    }

    toTop() {
        this.MoreCourseContent.scrollToTop();
    }

    //获取形式课程
    getTypeCourseList(refresher?: any) {
        let url = this.apiUrls.getUrlCourseLsByFormId();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            personGrpId: this.storageUtil.getPersonGrpId(),
            formId: this.selectFormId,
            pageNum: this.pageNum,
            pageSize: this.pageSize
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
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
        })
    }

    getCategoryCss(categoryName: string) {
        return CategoryUtils.getCategoryCss(categoryName);
    }

    //切换课程形式
    selectCourseType(formId: number) {
        if (this.selectFormId == formId) {
            return;
        }
        this.selectFormId = formId;
        this.pageNum = 1;
        this.showLoading();
        this.getTypeCourseList();
    }

    //跳转到课程详情
    toCourseDetail(index: number) {
        this.navController.push(CourseDetailPage, {courseId: this.courseList[index].courseId, courseListIndex: index, refreshCode: this.REFRESH_CODE});
    }

    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.showLoading();
            this.pageNum = 1;
        } else {
            this.pageNum = this.pageNum + 1;
        }
        this.getTypeCourseList(refresher);
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
