import { TrainingClassVo } from '../../../../models/class/TrainingClassVo';
import { BasePage } from '../../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { ClassStudentsPage } from '../class-students/class-students';
import { TeacherVo } from '../../../../models/class/TeacherVo';

@Component({
    selector: 'page-class-introduction',
    templateUrl: 'class-introduction.html'
})

export class ClassIntroductionPage extends BasePage {
    public classInfo: any;
    public classDetail: TrainingClassVo = null;
    public teacherLabel: any = [[]];
    constructor(injector: Injector) {
        super(injector);
        this.classInfo = this.navParams.get('classInfo');
        this.getClassIntroduction();
    }
    getClassIntroduction() {
        this.showLoading();
        let urls = this.apiUrls.getClassesDetail();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            classId: this.classInfo.id
        };
        this.httpUtil.get({
            url: urls, param: params, success: (res) => {
                this.classDetail = res.result;
                this.getTeacherLabel();
            }, fail: (res) => {
                this.toast(res.msg);
            }, finish: (res) => {
                this.dismissLoading();
            }
        });

    }
    //获取讲师标签
    getTeacherLabel() {
        if (this.classDetail.teacherList && this.classDetail.teacherList.length > 0) {
            let teacherLists: Array<TeacherVo> = this.classDetail.teacherList;
            for (let i = 0; i < teacherLists.length; i++) {
                if (teacherLists[i].label) {
                    this.teacherLabel[i] = teacherLists[i].label.split(',');
                }
            }
        }
    }
    joinClass() {
        if (this.classDetail.joinStatus == 0) {
            let urls: string = this.apiUrls.postJoinClass() + '/' + this.storageUtil.getOrgId() + '/' + this.storageUtil.getUserId() + '/' + this.classInfo.id;
            this.httpUtil.post({
                url: urls, param: null, success: (res) => {
                    this.toast(res.msg);
                    this.getClassIntroduction();
                }, fail: (res) => {
                    this.toast(res.msg);
                }
            });
        }
    }

    goStudyList() {
        this.navController.push(ClassStudentsPage, { classId: this.classInfo.id });
    }
    //加入班级按钮
    bindJoinClass() {
        let background;
        if (this.classDetail.joinStatus == 0) {
            background = 'unJoinState';
        } else if (this.classDetail.joinStatus == 1) {
            background = 'reviewState';
        }
        return background;
    }

}