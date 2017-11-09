import { BasePage } from '../../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { ClassDetailPage } from '../class-detail/class-detail';
import { ClassIntroductionPage } from '../class-introduction/class-introduction';

@Component({
    selector: 'page-class-list',
    templateUrl: 'class-list.html'
})

export class ClassListPage extends BasePage {
    public section = 'myclass';
    public myClassList = [];
    public allClassList = [];
    public myClassPageNum: number = 1;
    public allClassPageNum: number = 1;
    public pageSize: number = 10;

    public canLoadMore: boolean = false;
    
    constructor(injector: Injector) {
        super(injector);
        this.getMyClassListData();
        this.getAllClassListData();
    };

    doRefreshMyClass(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.myClassPageNum = 1;
        } else {
            this.myClassPageNum = this.myClassPageNum + 1;
        }
        this.getMyClassListData(refresher);
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }

    doRefreshAllClass(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.allClassPageNum = 1;
        } else {
            this.allClassPageNum = this.allClassPageNum + 1;
        }
        this.getAllClassListData(refresher);
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }

    //获取已经报名参加的班级
    getMyClassListData(refresher?: any) {
        this.showLoading();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            pageNum: this.myClassPageNum,
            pageSize: this.pageSize

        };
        this.httpUtil.get({
            url: this.apiUrls.getClassesListJoined(), param: params, success: (res) => {
                if (this.myClassPageNum == 1) {
                    this.myClassList = [];
                }
                if (res.result == null || res.result == '') {
                    this.canLoadMore = false;
                    return;
                }
                this.myClassList = this.myClassList.concat(res.result);
                if (res.result.length >= this.pageSize) {
                    this.canLoadMore = true;
                } else {
                    this.canLoadMore = false;
                }
            },
            fail: (res) => {
                this.toast(res.msg);
            }, finish: (res) => {
                if (refresher != null) {
                    refresher.complete();
                }
                this.dismissLoading();
            }
        });
    }

    //获取未报名的班级列表
    getAllClassListData(refresher?: any) {
        this.showLoading();
            let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            pageNum: this.allClassPageNum,
            pageSize: this.pageSize
        };
        this.httpUtil.get({
            url: this.apiUrls.getClassesListCanBeJion(), param: params, success: (res) => {
                if (this.allClassPageNum == 1) {
                    this.allClassList = [];
                }
                if (res.result == null || res.result == '') {
                    this.canLoadMore = false;
                    return;
                }
                this.allClassList = this.allClassList.concat(res.result);
                if (res.result.length >= this.pageSize) {
                    this.canLoadMore = true;
                } else {
                    this.canLoadMore = false;
                }
            },
            fail: (res) => {
                this.toast(res.msg);
            }, finish: (res) => {
                if (refresher != null) {
                    refresher.complete();
                }
                this.dismissLoading();
            }
        });
    }

    //去班级详情
    goClassDetail(classInfo: any) {
        switch (classInfo.joinStatus) {
            case 0:
            case 1: this._app.getRootNav().push(ClassIntroductionPage, { classInfo: classInfo });
                break;
            case 2: this._app.getRootNav().push(ClassDetailPage, { id: classInfo.id });
                break;
        }
    }
}