import {Component, Injector} from "@angular/core";
import {CourseDetailPage} from "../course-detail/course-detail";
import {CourseMiniVo} from "../../../models/study/CourseMiniVo";
import {BasePage} from "../../../core/base-page/BasePage";
import {CategoryUtils} from "../CategoryUtils";
import {CommentView} from "../../../components/comment-view/comment-view";
import {Events, Platform} from "ionic-angular";
import {DBUtils} from "../../../core/db/DBUtils";
import {DBTableName} from "../../../core/db/DBTableName";
import {EventsConstants} from "../../../core/EventsConstants";
/**
 * Created by zxh on 2016/12/19.
 */
@Component({
    selector: 'page-course-search-result',
    templateUrl: 'course-search-result.html'
})

//课程搜索结果
export class CourseSearchResultPage extends BasePage {

    private REFRESH_CODE = 'CourseSearchResultPage';//已读置灰刷新列表通知Code

    public courseList: Array<CourseMiniVo> = [];
    public totalCount: number = 0;
    private pageNum: number = 1;
    private pageSize: number = 10;
    public canLoadMore: boolean = false;
    public searchKey: string = '';

    public isSelectCourse: boolean = false;//是否是选择课程的操作
    private selectCourseNum: number = 0;//已选课程数量
    private selectedCourse: Array<CourseMiniVo> = [];//已选课程

    constructor(injector: Injector,
                public events: Events,
                private dbUtils: DBUtils,
                private platform: Platform) {
        super(injector);
        this.searchKey = this.navParams.get('searchKey');
        this.isSelectCourse = this.navParams.get('isSelectCourse') || false;
        this.selectedCourse = this.navParams.get('selectedCourse') || [];
        this.selectCourseNum = this.selectedCourse.length;
        this.showLoading();
        this.searchCourseList();
        this.events.subscribe(EventsConstants.REFRESH_COURSE_LIST, (date) => {
            if (date && date.length > 0) {
                if(date[0].refreshCode == this.REFRESH_CODE) {
                    this.courseList[date[0].index].isRead = true;
                }
            }
        });
    }

    //获取搜索课程列表
    searchCourseList(refresher?: any) {
        let url = this.apiUrls.getUrlSearchCourseLs();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            personGrpId: this.storageUtil.getPersonGrpId(),
            titleLike: this.searchKey,
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
                    this.totalCount = this.courseList.length;
                    return;
                }
                this.courseList = this.courseList.concat(this.tagSelectedCourse(res.result));
                for (let i = (this.pageNum - 1) * this.pageSize; i < this.courseList.length; i++) {
                    this.getCourseReadState(i);
                }
                this.totalCount = res.totalCount;
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

    //标记已选课程
    tagSelectedCourse(courses: Array<CourseMiniVo>) {
        if (this.selectedCourse.length > 0) {
            for (let i = 0; i < courses.length; i++) {
                for (let j = 0; j < this.selectedCourse.length; j++) {
                    if (courses[i].courseId == this.selectedCourse[j].courseId) {
                        courses[i].isSelecter = true;
                    }
                }
            }
        }
        return courses;
    }

    getCategoryCss(categoryName: string) {
        return CategoryUtils.getCategoryCss(categoryName);
    }

    //搜索课程点击事件
    clickSearch(searchKey: string) {
        if (searchKey == null || searchKey == '') {
            this.toast('请输入搜索关键字');
            return;
        }
        this.searchKey = searchKey;
        this.showLoading();
        this.pageNum = 1;
        this.searchCourseList();
    }

    //跳转到课程详情
    toCourseDetail(index: number) {
        this.navController.push(CourseDetailPage, {courseId: this.courseList[index].courseId, courseListIndex: index, refreshCode: this.REFRESH_CODE});
    }

    //选择课程
    selectCourse(index: number) {
        if (!this.courseList[index].isSelecter && this.selectCourseNum >= CommentView.SELECT_MAX_COURSE) {
            this.toast('最多可选择' + CommentView.SELECT_MAX_COURSE + '门课程');
            return;
        }
        this.courseList[index].isSelecter = !this.courseList[index].isSelecter;
        if (this.courseList[index].isSelecter == true) {
            this.selectCourseNum++;
            this.selectedCourse = this.selectedCourse.concat(this.courseList[index]);
        } else {
            this.selectCourseNum--;
            for (let i = 0; i < this.selectedCourse.length; i++) {
                if(this.selectedCourse[i].courseId == this.courseList[index].courseId){
                    this.selectedCourse.splice(i);
                    break;
                }
            }
        }
    }

    //选择课程完成
    selectCourseComplete() {
        this.events.publish(EventsConstants.SELECT_COURSE,this.selectedCourse);
        this.events.publish(EventsConstants.CLOSE_SEARCHPAGE);
        this.navController.pop();
    }

    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.showLoading();
            this.pageNum = 1;
        } else {
            this.pageNum = this.pageNum + 1;
        }
        this.searchCourseList(refresher);
    }

    //获取课程已读状态
    getCourseReadState(index: number) {
        if(this.platform.is('mobile')){
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
