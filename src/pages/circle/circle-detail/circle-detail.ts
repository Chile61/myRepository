import { BasePage } from '../../../core/base-page/BasePage';
import { Component, Injector, ViewChild } from '@angular/core';
import { CircleHotTopicPage } from '../circle-hot-topic/circle-hot-topic';
import { CircleNewTopicPage } from '../circle-new-topic/circle-new-topic';
import { DiscussGroupVo } from '../../../models/circle/DiscussGroupVo';
import { CircleIntroductionPage } from '../circle-introduction/circle-introduction';
import { EventsConstants } from '../../../core/EventsConstants';
import { Events } from 'ionic-angular';
import { CircleVotePage } from '../circle-vote/circle-vote';
import { CirclePostPage } from '../circle-post/circle-post';
import { NormalHeaderComponent } from '../../../components/normal-header/normal-header';

@Component({
    selector: 'page-circle-detail',
    templateUrl: 'circle-detail.html'
})
export class CircleDetailPage extends BasePage {
    @ViewChild('NormalHeaderComponent') normalHeader: NormalHeaderComponent;
    public myCircle: DiscussGroupVo;
    public tab1 = CircleHotTopicPage;
    public tab2 = CircleNewTopicPage;
    public joinStatus: number;//0 ： 状态不变，用户已经加入过或加入申请审核中；1 ： 申请接受，审核中；2 ： 申请接受，加入成功；
    public groupId: number;//话题、投票过来的
    Params = {
        isJoin: true
    };
    constructor(injector: Injector, public events: Events) {
        super(injector);
        this.groupId = this.navParams.get('groupId') || -1;
        if (this.groupId == null || this.groupId < 0) {
            this.myCircle = this.navParams.get('myCircle');
            this.joinStatus = this.myCircle.joinStatus;
            CircleHotTopicPage.prototype.joinStatus = this.joinStatus;
            CircleNewTopicPage.prototype.joinStatus = this.joinStatus;
        } else {
            this.getBriefOfGroup();
        }
    }
    ionViewWillEnter() {
        this.normalHeader.initComponent(true, false, '圈子详情', false, false, false, null);
    }
    //获取圈子简介
    getBriefOfGroup() {
        this.showLoading();
        let params = {
            userId: this.storageUtil.getUserId(),
            orgId: this.storageUtil.getOrgId(),
            groupId: this.groupId
        };
        this.httpUtil.get({
            url: this.apiUrls.getBriefOfGroup(),
            param: params,
            success: (res) => {
                this.myCircle = res.result;
                this.joinStatus = this.myCircle.joinStatus;
                CircleHotTopicPage.prototype.joinStatus = this.joinStatus;
                CircleNewTopicPage.prototype.joinStatus = this.joinStatus;
            },
            fail: (res) => {
                this.toast(res.msg);
            },
            finish: () => {
                this.dismissLoading();
            }
        });
    }
    //退出圈子
    quitCircle() {
        this.showLoading();
        let urls = this.apiUrls.postQuitCircle() + "/" + this.storageUtil.getOrgId() + "/" + this.storageUtil.getUserId() + "/" + this.myCircle.groupId;
        this.httpUtil.post({
            url: urls,
            param: null,
            success: (res) => {
                if (res.result == 0) {
                    this.events.publish(EventsConstants.OPERATE_CIRCLE);
                    this.myCircle.joinStatus = 0;
                    this.toast('成功退出该圈子了！');
                } else {
                    this.toast('退出圈子失败！');
                }
            },
            fail: (res) => {
                this.toast(res.msg);
            },
            finish: () => {
                this.dismissLoading();
            }
        });
    }
    //加入圈子
    joinCircle() {
        this.showLoading();
        let urls = this.apiUrls.postJoinCircle() + "/" + this.storageUtil.getOrgId() + "/" + this.storageUtil.getUserId() + "/" + this.myCircle.groupId;
        this.httpUtil.post({
            url: urls,
            param: null,
            success: (res) => {
                this.events.publish(EventsConstants.OPERATE_CIRCLE);
                if (res.result == 2) {
                    this.myCircle.joinStatus = 2;
                    this.toast('成功加入该圈子！');
                } else if (res.result == 1) {
                    this.myCircle.joinStatus = 1
                    this.toast('审核中');
                }
            },
            fail: (res) => {
                this.toast(res.msg);
            },
            finish: () => {
                this.dismissLoading();
            }
        });
    }
    //圈子简介
    goToCircleIntroduction() {
        this.navController.push(CircleIntroductionPage, { myCircle: this.myCircle });
    }
    //发表话题
    goPostTopic() {
        if (this.joinStatus != 2) {
            this.toast('亲,你还没有加入该讨论组,不能发帖!');
            return;
        } else {
            this._app.getRootNav().push(CirclePostPage);
        }

    }

    //进入发起投票
    openCircleVote() {
        if (this.joinStatus != 2) {
            this.toast('亲,你还没有加入该讨论组,不能发起投票!');
            return;
        } else {
            this._app.getRootNav().push(CircleVotePage);
        }

    }
    goBackClick() {
        this.navController.pop();
    }

}