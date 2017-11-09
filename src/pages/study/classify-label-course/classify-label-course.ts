/**
 * Created by zxh on 2016/12/20.
 */
//能力分类标签课程
import {Component, Injector, ViewChild} from "@angular/core";
import {ClassifyLabelVo} from "../../../models/study/ClassifyLabelVo";
import {CourseMiniVo} from "../../../models/study/CourseMiniVo";
import {CourseDetailPage} from "../course-detail/course-detail";
import {BasePage} from "../../../core/base-page/BasePage";
import {CategoryUtils} from "../CategoryUtils";
import {Events, Platform} from "ionic-angular";
import {CommentView} from "../../../components/comment-view/comment-view";
import {DBTableName} from "../../../core/db/DBTableName";
import {DBUtils} from "../../../core/db/DBUtils";
import {EventsConstants} from "../../../core/EventsConstants";

@Component({
    selector: 'page-classify-label-course',
    templateUrl: 'classify-label-course.html'
})

export class ClassifyLabelCoursePage extends BasePage {

    @ViewChild('LabelCourseContent') LabelCourseContent;

    private REFRESH_CODE = 'LabelCoursePage';//已读置灰刷新列表通知Code

    public classifyLabel: ClassifyLabelVo;
    public selectCompetencyId: number;
    private competencyLevel: string = 'first';//标签层级 first 一级 second 二级
    private pageNum: number = 1;
    private pageSize: number = 10;

    public courseList: Array<CourseMiniVo> = [];
    public canLoadMore: boolean = true;

    public isSelectCourse: boolean = false;//是否是选择课程的操作
    private selectCourseNum: number = 0;//已选课程数量
    private selectedCourse: Array<CourseMiniVo> = [];//已选课程

    constructor(injector: Injector,
                public events: Events,
                private dbUtils: DBUtils,
                private platform: Platform) {
        super(injector);
        this.classifyLabel = this.navParams.get('classifyLabel');
        this.selectCompetencyId = this.navParams.get('competencyId');
        this.isSelectCourse = this.navParams.get('isSelectCourse') || false;
        this.selectedCourse = this.navParams.get('selectedCourse') || [];
        this.selectCourseNum = this.selectedCourse.length;
        if (this.classifyLabel.competencyId == this.selectCompetencyId) {
            this.competencyLevel = 'first';
        } else {
            this.competencyLevel = 'second';
        }
        this.showLoading();
        this.getClassifyLabelCourse();
        this.events.subscribe(EventsConstants.REFRESH_COURSE_LIST, (date) => {
            if (date && date.length > 0) {
                if(date[0].refreshCode == this.REFRESH_CODE) {
                    this.courseList[date[0].index].isRead = true;
                }
            }
        });
    }

    toTop(){
        this.LabelCourseContent.scrollToTop();
    }

    //获取能力分类标签课程
    getClassifyLabelCourse(refresher?: any) {
        let url = this.apiUrls.getUrlCourseLsByCompetency();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            personGrpId: this.storageUtil.getPersonGrpId(),
            competencyLevel: this.competencyLevel,
            competencyId: this.selectCompetencyId,
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
                this.courseList = this.courseList.concat(this.tagSelectedCourse(res.result));
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

    //切换标签
    selectClassifyLabel(competencyId: number) {
        if (this.selectCompetencyId == competencyId) {
            return;
        }
        this.showLoading();
        this.selectCompetencyId = competencyId;
        this.pageNum = 1;
        if (this.classifyLabel.competencyId == this.selectCompetencyId) {
            this.competencyLevel = 'first';
        } else {
            this.competencyLevel = 'second';
        }
        this.getClassifyLabelCourse();
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
        console.log(this.selectCourseNum);
    }

    //选择课程完成
    selectCourseComplete() {
        // let selectCourseList: Array<CourseMiniVo> = [];
        // for (let i = 0; i < this.courseList.length; i++) {
        //     if (this.courseList[i].isSelecter == true) {
        //         selectCourseList = selectCourseList.concat(this.courseList[i]);
        //     }
        // }
        this.events.publish(EventsConstants.SELECT_COURSE, this.selectedCourse);
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
        this.getClassifyLabelCourse(refresher);
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
