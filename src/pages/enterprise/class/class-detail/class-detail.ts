/**
 * Created by wh on 2016/12/14.
 */
import { Component, Injector } from '@angular/core';

import { CourseVo } from '../../../../models/class/CourseVo';
import { BasePage } from '../../../../core/base-page/BasePage';
import { ClassNoticePage } from '../class-notice/class-notice';
import { ClassIntroductionPage } from '../class-introduction/class-introduction';
import { ClassBarcodePage } from '../class-barcode/class-barcode';
import { CourseDetailPage } from '../../../study/course-detail/course-detail';
import { Constants } from '../../../../core/Constants';
import { ClassExamPage } from '../../../class-exam/class-exam/class-exam';
import { CourseItemVo } from '../../../../models/class/CourseItemVo';
import { ClassStatisticsPage } from '../class-statistics/class-statistics';
import { ClassQuestionPage } from '../class-question/class-question';
import { Events } from 'ionic-angular';
import { EventsConstants } from '../../../../core/EventsConstants';

@Component({
    selector: 'page-class-detail',
    templateUrl: 'class-detail.html'
})


export class ClassDetailPage extends BasePage {
    public classInfo: Object;
    public classId: number = 0;
    public courseInfo: Array<CourseVo>;
    public answerCount: number = 0;
    public noticeCount: number = 0;
    public openState = [];
    public stateLength: any = 0;
    constructor(injector: Injector, private events: Events) {
        super(injector);
        this.classId = this.navParams.data.id;
        this.getMyClassListData();
    }

    doRefresh(refresher) {
        this.getMyClassListData();
    }

    //获取班级详情
    getMyClassListData(refresher?: any) {
        this.showLoading();
        let urls = this.apiUrls.getClassesInfo();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            classId: this.classId
        };
        this.httpUtil.get({
            url: urls, param: params, success: (res) => {
                this.classInfo = res.result;
                this.courseInfo = res.result.stages;
                this.stateLength = this.courseInfo.length;
                this.noticeCount = res.result.noticeCount;
                this.answerCount = res.result.answerCount;
                this.showStagesState(this.courseInfo);
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
    //阶段学习展开栏状态
    showStagesState(courseInfo: Array<CourseVo>) {
        if (courseInfo.length > 0) {
            this.openState[0] = true;
            for (let i = 1; i < courseInfo.length; i++) {
                this.openState[i] = false;
            }
        }
    }
    //改变阶段学习展开栏状态
    changState(i: number, flag: any) {
        this.openState[i] = !flag;
    }
    //去班级统计
    goStatistics() {
        this.navController.push(ClassStatisticsPage, { id: this.classId });
    }

    //去班级签到
    goToSign() {
        this.navController.push(ClassBarcodePage, { id: this.classId, fromType: 2 });
    }

    //去班级通知
    goToNotice() {
        this.navController.push(ClassNoticePage, { id: this.classId });
    }

    //去班级问答
    goToQuestion() {
        this.navController.push(ClassQuestionPage, { id: this.classId });
    }

    //去班级介绍
    goToIntroduction() {
        this.navController.push(ClassIntroductionPage, { id: this.classId });
    }

    //班级各个阶段学习
    goDetail(groupPos: number, courseItem: CourseItemVo) {
        let state = this.getClassState(courseItem.startTime, courseItem.endTime);
        if (state == 3) {
            let alert = this.alertCtrl.create({
                title: '温馨提示',
                message: '此阶段' + new Date(courseItem.startTime).toTimeString() + '才开始哦，到时再看吧',
                buttons: [
                    {
                        text: '确认',
                        handler: () => {
                            alert.dismiss();
                        }
                    },
                ]
            });
            alert.present();
            return;
        }
        if (!this.getLastStageFlag(groupPos)) {
            return;
        }
        switch (courseItem.resourceType) {
            case Constants.COURSE_COMMENT://课程
                this.navController.push(CourseDetailPage, { courseId: courseItem.resourceId, fromWhere: Constants.FROM_CLASS, courseItemId: courseItem.id, classCourseState: courseItem.state });
                break;
            case 2:// 考试
            case 3:// 练习
            case 4:// 调研
            case 5: this.navController.push(ClassExamPage, { objId: courseItem.resourceId, objType: courseItem.resourceType });// 投票
                break;
            case 8://闯关
                break;
            default:
                break;


        }
    }
    //判断此阶段是否已经开始可以学习
    getClassState(startTime: number, endTime: number) {
        let state = 0;
        let curTime = new Date().getTime();
        if (curTime < startTime) {
            // 未开始
            state = 3;
        } else if (curTime >= startTime && curTime < endTime) {
            // 上课中
            state = 4;
        } else if (curTime >= endTime) {
            // 已过期
            state = 5;
        }

        return state;
    }
    //判断上阶段学习是否已经结束
    getLastStageFlag(curGroupPos: number) {
        let curTime = this.courseInfo[curGroupPos].startTime;
        for (let i = 0; i < this.courseInfo.length; i++) {
            if (this.courseInfo[i].startTime < curTime) {
                let courseItems = this.courseInfo[i].courseItems;
                if (courseItems != null && courseItems.length > 0) {
                    for (let i = 0; i < courseItems.length; i++) {
                        if (courseItems[i].isCompulsory != null && courseItems[i].isCompulsory != '' && courseItems[i].isCompulsory == 'Y') {
                            if (courseItems[i].state != 2) {
                                this.toast('您前面还有未完成的必修课，请先完成再继续');
                                return false;
                            }
                        }
                    }
                }
            }
        }
        return true;
    }
    //绑定课程类型颜色
    bindType(type) {
        let color;
        switch (type) {
            case 1:
                color = 'type_blue';
                break;
            case 2:
                color = 'type_red';
                break;
            case 3:
                color = 'type_deepBlue';
                break;
            case 4:
                color = 'type_green';
                break;
            case 5:
                color = 'type_yellow';
                break;
            case 12:
                color = 'type_brown';
                break;
            case 13:
                color = 'type_deepBrown';
                break;
        }
        return color;
    }
    //已学课程置灰
    bindLearnCourse(state: number) {
        let color;
        if (state == 2) {
            color = 'course_has_learn';
        } else {
            color = 'course_not_learn';
        }
        return color;
    }
    ionViewWillEnter() {
        this.events.subscribe(EventsConstants.CLASS_STUDY_GREY, () => {
            this.getMyClassListData();
        });
    }
    ionViewWillUnload() {
        this.events.unsubscribe(EventsConstants.CLASS_STUDY_GREY);
    }
}
