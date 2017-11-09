import { BasePage } from '../../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';

@Component({
    selector: 'page-class-signUserList',
    templateUrl: 'class-signUserList.html'
})
export class ClassSignUserListPage extends BasePage {
    public classId: number;
    public signDefineId: number;
    public pageNum: number = 1;
    public pageSize: number = 10;
    public classSignUserList = [];
    public classUnSignUserList = [];
    public section = 'sign';
    public canLoadMore: boolean = false;
    public signRate: number = 0;
    public unSignRate: number = 0;
    public signCount: number = 0;
    public unSignCount: number = 0;
    constructor(injector: Injector) {
        super(injector);
        this.classId = this.navParams.data.classId;
        this.signDefineId = this.navParams.data.signDefineId;
        this.signRate = this.navParams.data.signRate;
        this.unSignRate = this.navParams.data.unSignRate;
        this.getClassSignUserList();
        this.getClassUnSignUserList();
    }

    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.pageNum = 1;
        } else {
            this.pageNum = this.pageNum + 1;
        }
        this.getClassSignUserList(refresher);
        this.getClassUnSignUserList(refresher);
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
    //获取已签列表
    getClassSignUserList(refresher?: any) {
        this.showLoading();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getOrgId(),
            classId: this.classId,
            signDefineId: this.signDefineId,
            state: 1,
            pageNum: this.pageNum,
            pageSize: this.pageSize
        }
        this.httpUtil.get({
            url: this.apiUrls.getClassStatisticsSignUserList(), param: params,
            success: (res) => {
                if (this.pageNum == 1) {
                    this.classSignUserList = [];
                }
                if (res.result == null || res.result == '') {
                    this.canLoadMore = false;
                    return;
                }
                this.classSignUserList = this.classSignUserList.concat(res.result);
                this.signCount=res.totalCount;
                if (res.result.length >= this.pageSize) {
                    this.canLoadMore = true;
                } else {
                    this.canLoadMore = false;
                }
            }, fail: (res) => {
                this.toast(res.mag);
                this.canLoadMore = false;
            }, finish: () => {
                if (refresher != null) {
                    refresher.complete();
                }
                this.dismissLoading();
            }
        });
    }
    //获取未签列表
    getClassUnSignUserList(refresher?: any) {
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getOrgId(),
            classId: this.classId,
            signDefineId: this.signDefineId,
            state: 2,
            pageNum: this.pageNum,
            pageSize: this.pageSize
        }
        this.httpUtil.get({
            url: this.apiUrls.getClassStatisticsSignUserList(), param: params,
            success: (res) => {
                if (this.pageNum == 1) {
                    this.classUnSignUserList = []
                }
                if (res.result == null || res.result == '') {
                    this.canLoadMore = false;
                    return;
                }
                if (res.result >= this.pageSize) {
                    this.canLoadMore = true;
                } else {
                    this.canLoadMore = false;
                }
                this.classUnSignUserList = this.classUnSignUserList.concat(res.result);
                this.unSignCount=res.totalCount;
            }, fail: (res) => {
                this.toast(res.result);
                this.canLoadMore = false;
            }, finish: () => {

            }
        });
    }

}