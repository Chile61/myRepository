import { BasePage } from '../../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';


@Component({
    selector: 'page-class-attenhistory',
    templateUrl: 'class-attenhistory.html'
})

export class AttenHistoryPage extends BasePage {
    public classId: number;
    public pageNum: number = 1;
    public pageSize: number = 10;
    public userSignList = [];
    public canLoadMore: boolean = false;
    constructor(injector: Injector) {
        super(injector);
        this.classId = this.navParams.data.id;
        this.getClassAttenHistory();
    }

    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.pageNum = 1;
        } else {
            this.pageNum = this.pageNum + 1;
        }
        this.getClassAttenHistory(refresher);
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }

    getClassAttenHistory(refresher?: any) {
        this.showLoading();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            classId: this.classId,
            pageNum: this.pageNum,
            pageSize: this.pageSize
        }
        this.httpUtil.get({
            url: this.apiUrls.getClassSignHistory(), param: params, success: (res) => {
                if (this.pageNum == 1) {
                    this.userSignList = [];
                }
                if (res.result == null || res.result == '') {
                    this.canLoadMore = false;
                    return;
                }
                this.userSignList = this.userSignList.concat(res.result);
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