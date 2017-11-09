/**
 * Created by zxh on 2016/12/22.
 */
import {Component, Injector, ViewChild} from "@angular/core";
import {BasePage} from "../../../core/base-page/BasePage";
import {ClassifyVo} from "../../../models/study/ClassifyVo";
import {CourseMiniVo} from "../../../models/study/CourseMiniVo";
import {CourseDetailPage} from "../course-detail/course-detail";
import {PublicLabelPage} from "../public-course-label/public-course-label";
import {CategoryUtils} from "../CategoryUtils";
import {Platform, Events} from "ionic-angular";
import {DBUtils} from "../../../core/db/DBUtils";
import {DBTableName} from "../../../core/db/DBTableName";
import {EventsConstants} from "../../../core/EventsConstants";

@Component({
    selector: 'page-public-course',
    templateUrl: 'public-course.html'
})

//公开课
export class PublicCoursePage extends BasePage {

    @ViewChild('PublicCourseContent') PublicCourseContent;

    private REFRESH_CODE = 'PublicCoursePage';//已读置灰刷新列表通知Code

    private reqParam: string = '';//快捷方式上的REQUEST_PARAM属性值,没有传""
    public pageTitle: string = '公开课';

    public classifyList: Array<ClassifyVo> = [];
    public classifyId: number = 0;
    private classifyName: string;

    public courseList: Array<CourseMiniVo> = [];

    private pageNum: number = 1;
    private pageSize: number = 10;
    public canLoadMore: boolean = false;

    constructor(injector: Injector,
                private dbUtils: DBUtils,
                private platform: Platform,
                private events: Events) {
        super(injector);
        this.reqParam = this.navParams.get('reqParam') || '';
        this.pageTitle = this.navParams.get('pageTitle') || this.pageTitle;
        this.showLoading();
        this.getClassify();
        this.events.subscribe(EventsConstants.REFRESH_COURSE_LIST, (date) => {
            if (date && date.length > 0) {
                if(date[0].refreshCode == this.REFRESH_CODE) {
                    this.courseList[date[0].index].isRead = true;
                }
            }
        });
    }

    ionViewDidEnter(){
        this._app.setTitle(this.pageTitle);
    }

    toTop(){
        this.PublicCourseContent.scrollToTop();
    }

    //获取能力分类
    getClassify() {
        let url = this.apiUrls.getUrlCompetencyClassLs();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            personGrpId: this.storageUtil.getPersonGrpId(),
            reqParam: this.reqParam
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                this.classifyList = res.result;
                if (this.classifyList.length > 0) {
                    this.classifyId = this.classifyList[0].compcyClassId;
                    this.classifyName = this.classifyList[0].compcyClassName;
                    this.getClassifyCourse();
                } else {
                    this.dismissLoading();
                }
            }, fail: (err) => {
                this.toast(err.msg);
                this.dismissLoading();
            }
        });
    }

    //获取能力分类课程
    getClassifyCourse(refresher?: any) {
        let url = this.apiUrls.getUrlCompyClassCourseLs();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            personGrpId: this.storageUtil.getPersonGrpId(),
            compyClassId: this.classifyId,
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
        });
    }

    getCategoryCss(categoryName: string) {
        return CategoryUtils.getCategoryCss(categoryName);
    }

    //切换能力分类
    selectClassify(classifyId: number, classifyName: string) {
        if (this.classifyId == classifyId) {
            return;
        }
        this.showLoading();
        this.classifyId = classifyId;
        this.classifyName = classifyName;
        this.pageNum = 1;
        this.getClassifyCourse();
    }

    //筛选
    screenCourse() {
        console.log(this.classifyName);
        this.navController.push(PublicLabelPage, {classifyId: this.classifyId, pageTitle: this.classifyName})
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
        this.getClassifyCourse(refresher);
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

    //返回
    goBack() {
        this.navController.pop();
    }
}
