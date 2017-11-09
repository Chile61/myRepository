import { BasePage } from '../../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { ClassesNoticeVo } from '../../../../models/class/ClassesNoticeVo';

@Component({
    selector: 'page-class-notice',
    templateUrl: 'class-notice.html'
})
export class ClassNoticePage extends BasePage {
    public pageNum: number = 1;
    public pageNums: number = 10;
    public classId: Number = 0;
    public classNoticeList: Array<ClassesNoticeVo> = [];
    public canLoadMore: boolean = false;
    constructor(injector: Injector) {
        super(injector);
        this.classId = this.navParams.data.id;
        this.getClassNoticeList();
    }
    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.pageNum = 1;
        } else {
            this.pageNum = this.pageNum + 1;
        }
        this.getClassNoticeList(refresher);
    }

    getClassNoticeList(refresher?: any) {
        this.showLoading();
        let urls = this.apiUrls.getClassesNoticeList();
        let params = {
            classId: this.classId,
            userId: this.storageUtil.getUserId(),
            pageNum: this.pageNum,
            orgId: this.storageUtil.getOrgId(),
            pageSize: this.pageNums
        };
        this.httpUtil.get({
            url: urls, param: params,
            success: (res) => {
                if (this.pageNum == 1) {
                    this.classNoticeList = [];
                }
                if (res.result == null || res.result == '') {
                    this.canLoadMore = false;
                    return;
                }
                this.classNoticeList = this.classNoticeList.concat(res.result);
                if (res.result.length >= this.pageNums) {
                    this.canLoadMore = true;
                } else {
                    this.canLoadMore = false;
                }
            },
            fail: (res) => {
                this.toast(res.msg);
            },
            finish: () => {
                if (refresher != null) {
                    refresher.complete();
                }
                this.dismissLoading();
            }
        });
    }

}