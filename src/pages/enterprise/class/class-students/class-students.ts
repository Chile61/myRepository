import { Component, Injector } from '@angular/core';
import { BasePage } from '../../../../core/base-page/BasePage';

@Component({
    selector: 'page-class-students',
    templateUrl: 'class-students.html'
})
export class ClassStudentsPage extends BasePage {
    public pageNum: number = 1;
    public pageSize: number = 10;
    public canLoadMore: boolean = false;
    public classId: number;
    public studentList = [];
    constructor(injector: Injector) {
        super(injector);
        this.classId = this.navParams.data.classId;
        this.getClassStudentList();
    }
    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.pageNum = 1;
        } else {
            this.pageNum = this.pageNum + 1;
        }
        this.getClassStudentList(refresher);
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
    getClassStudentList(refresher?: any) {
        this.showLoading();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            classId: this.classId,
            pageNum: this.pageNum,
            pageSize: this.pageSize
        };
        this.httpUtil.get({
            url: this.apiUrls.getClassStudents(), param: params,
            success: (res) => {
                if (this.pageNum == 1) {
                    this.studentList = [];
                }
                if (res.result == null || res.result == '') {
                    this.canLoadMore = false;
                    return;
                }
                this.studentList = this.studentList.concat(res.result);
                if (res.result.length >= this.pageSize) {
                    this.canLoadMore = true;
                } else {
                    this.canLoadMore = false;
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

}