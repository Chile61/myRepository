import { BasePage } from '../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { CircleDetailPage } from '../circle-detail/circle-detail';
import { DiscussGroupVo } from '../../../models/circle/DiscussGroupVo';
import { EventsConstants } from '../../../core/EventsConstants';
import { Events } from 'ionic-angular';

@Component({
    selector: 'page-circle-circles',
    templateUrl: 'circle-circles.html'
})
export class CirclePage extends BasePage {
    public myCirclePageNum: number = 1;
    public allCirclePageNum: number = 1;
    public pageSize: number = 10;
    public myCircleList: Array<DiscussGroupVo> = [];
    public allCircleList: Array<DiscussGroupVo> = [];
    public section = 'myCircle';
    public canLoadMore: boolean;
    constructor(injector: Injector, public events: Events) {
        super(injector);
        this.getMyAllGroups();
        this.getAllGroups();
    }
    doRefreshMyCircle(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.myCirclePageNum = 1;
        } else {
            this.myCirclePageNum = this.myCirclePageNum + 1;
        }
        this.getMyAllGroups(refresher);
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
    doRefreshAllCircle(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.allCirclePageNum = 1;
        } else {
            this.allCirclePageNum = this.allCirclePageNum + 1;
        }
        this.getAllGroups(refresher);
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
    //获取我的圈子列表
    getMyAllGroups(refresher?: any) {
        this.showLoading();
        let params = {
            userId: this.storageUtil.getUserId(),
            orgId: this.storageUtil.getOrgId(),
            pageNum: this.myCirclePageNum,
            pageSize: this.pageSize
        };
        this.httpUtil.get({
            url: this.apiUrls.getMyAllGroups(), param: params, success: (res) => {
                if (this.myCirclePageNum == 1) {
                    this.myCircleList = [];
                }
                if (res.result == null || res.result == '') {
                    this.canLoadMore = false;
                    return;
                }
                this.myCircleList = this.myCircleList.concat(res.result);
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
    //获取所有圈子列表
    getAllGroups(refresher?: any) {
        this.showLoading();
        let params = {
            userId: this.storageUtil.getUserId(),
            orgId: this.storageUtil.getOrgId(),
            pageNum: this.allCirclePageNum,
            pageSize: this.pageSize
        };
        this.httpUtil.get({
            url: this.apiUrls.getQueryQvailableGroups(), param: params, success: (res) => {
                if (this.allCirclePageNum == 1) {
                    this.allCircleList = [];
                }
                if (res.result == null || res.result == '') {
                    this.canLoadMore = false;
                    return;
                }
                this.allCircleList = this.allCircleList.concat(res.result);
                if (res.result >= this.pageSize) {
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
        })
    }
    //去圈子详情
    gotoCircleDetail(myCircle: DiscussGroupVo) {
        this._app.getRootNav().push(CircleDetailPage, { myCircle: myCircle });
    }
    //加入圈子
    joinCircle(allCircle: DiscussGroupVo) {
        this.showLoading();
        let urls = this.apiUrls.postJoinCircle() + "/" + this.storageUtil.getOrgId() + "/" + this.storageUtil.getUserId() + "/" + allCircle.groupId;
        this.httpUtil.post({
            url: urls,
            param: null,
            success: (res) => {
                this.getMyAllGroups();
                this.getAllGroups();
            },
            fail: (res) => {
                this.toast(res.msg);
            },
            finish: () => {
                this.dismissLoading();
            }
        });
    }
    ionViewWillEnter() {
        this.events.subscribe(EventsConstants.OPERATE_CIRCLE, () => {
            this.getMyAllGroups();
            this.getAllGroups();
        });
    }
    ionViewWillUnload() {
        this.events.unsubscribe(EventsConstants.OPERATE_CIRCLE);
    }

}