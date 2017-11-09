/**
 * Created by zxh on 2016/12/21.
 */
import {Component, Injector} from "@angular/core";
import {ColumnThemeVo} from "../../../models/study/ColumnThemeVo";
import {CourseDetailPage} from "../course-detail/course-detail";
import {BasePage} from "../../../core/base-page/BasePage";
import {CategoryUtils} from "../CategoryUtils";
import {TeacherDetail} from "../teacher-detail/teacher-detail";
import {Constants} from "../../../core/Constants";

@Component({
    selector: 'page-theme-detail',
    templateUrl: 'theme-detail.html'
})

//主题栏目课程
export class ThemeColumnDetail extends BasePage {

    public studyTopic: ColumnThemeVo;
    private topicalId: number;
    private topicalColumnType: number;
    public pageTitle: string = '主题详情';

    public studyTopicDetail: any;

    public stageShow: any = [];//阶段显示标识

    constructor(injector: Injector) {
        super(injector);
        this.studyTopic = this.navParams.get('studyTopic');
        this.topicalId = this.studyTopic.topicalId;
        this.topicalColumnType = this.studyTopic.topicalColumnType;
        if (this.topicalColumnType == 2) {
            this.pageTitle = '栏目详情';
        }
        this.showLoading();
        this.getThemeDetail();
    }

    getThemeDetail(refresher?: any) {
        let url = this.apiUrls.getUrlStudyTopicDetail();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            topicalColumnType: this.topicalColumnType,
            topicalId: this.topicalId
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                this.studyTopicDetail = res.result;
                if (this.studyTopicDetail.topicStageVoLs && this.studyTopicDetail.topicStageVoLs.length > 0) {
                    this.stageShow[0] = true;
                    for (let i = 1; i < this.studyTopicDetail.topicStageVoLs.length; i++) {
                        this.stageShow[i] = false;
                    }
                }
            }, fail: (res) => {
                this.toast(res.msg);
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

    //是否显示new标识
    getNewTagShow(pubTime: number) {
        let nowTime = new Date().getTime();
        if ((pubTime + 7 * 24 * 60 * 60 * 1000) > nowTime) {
            return true;
        } else {
            return false;
        }
    }

    //前往版主详情
    toModeratorDetail(teacherId) {
        this.getTeacherDetail(teacherId);
    }

    showStage(index: number) {
        this.stageShow[index] = !this.stageShow[index];
    }

    getTeacherDetail(teacherId) {
        this.showLoading();
        let url = this.apiUrls.getUrlTeacherDetail();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            teacherId: teacherId
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                this.navController.push(TeacherDetail, {teacher: res.result, fromWhere: Constants.TEACHER_FROM_THEME})
            }, fail: (err) => {
                this.toast(err.message);
            }, finish: () => {
                this.dismissLoading();
            }
        })
    }

    //跳转到课程详情
    toCourseDetail(courseId: number) {
        this.navController.push(CourseDetailPage, {courseId: courseId});
    }

    doRefresh(refresher) {
        this.showLoading();
        this.getThemeDetail(refresher);
    }

}
