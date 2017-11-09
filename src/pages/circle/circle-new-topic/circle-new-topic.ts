import { Component, Injector } from '@angular/core';
import { BasePage } from '../../../core/base-page/BasePage';
import { DiscussSubjectMiniVo } from '../../../models/circle/DiscussSubjectMiniVo';
import { TopicDetailPage } from '../topic-detail/topic-detail';
import { CircleVoteDetailPage } from "../circle-vote-detail/circle-vote-detail";
import { Constants } from '../../../core/Constants';
import { EventsConstants } from '../../../core/EventsConstants';
import { Events } from 'ionic-angular';
import { ShowBigImgPage } from '../../../core/show-bigimg-page/show-bigimg-page';
import { EmojiUtils } from '../../../core/EmojiUtils';

@Component({
    selector: 'page-circle-new-topic',
    templateUrl: 'circle-new-topic.html'
})
export class CircleNewTopicPage extends BasePage {
    public pageNum: number = 1;
    public pageSize: number = 10;
    public newTopicList: Array<DiscussSubjectMiniVo> = [];
    public canLoadMore: boolean = false;
    public joinStatus: number;
    public isJoin: boolean = false;//是否来自于圈子详情 
    constructor(injector: Injector, public events: Events, private emojiUtils: EmojiUtils) {
        super(injector);
        this.isJoin = this.navParams.get('isJoin');
        console.log(this.isJoin+"-----");
        this.events.subscribe(EventsConstants.POST_TOPIC, () => {
            this.getListAllNewSubjects();
        });
        this.getListAllNewSubjects();
    }

    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.pageNum = 1;
        } else {
            this.pageNum = this.pageNum + 1;
        }
        this.getListAllNewSubjects(refresher);
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
    //获取最新话题
    getListAllNewSubjects(refresher?: any) {
        this.showLoading();
        let params = {
            userId: this.storageUtil.getUserId(),
            orgId: this.storageUtil.getOrgId(),
            pageNum: this.pageNum,
            pageSize: this.pageSize
        };
        this.httpUtil.get({
            url: this.apiUrls.getListAllNewSubjects(), param: params,
            success: (res) => {
                if (this.pageNum == 1) {
                    this.newTopicList = [];
                }
                if (res.result == null || res.result == '') {
                    this.canLoadMore = false;
                    return;
                }
                this.newTopicList = this.newTopicList.concat(res.result);
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
    //话题点赞
    clickPraise(topic: any) {
        if (topic.doYouAwesomed == true) {
            this.toast('你已经点过赞啦');
            return;
        }
        this.showLoading();
        let url = this.apiUrls.getUrlUserAppraise() + '/'
            + this.storageUtil.getOrgId() + '/'
            + this.storageUtil.getUserId() + '/'
            + Constants.TOPIC_UP + '/' + topic.subjectId;
        this.httpUtil.post({
            url: url, success: (res) => {
                topic.doYouAwesomed = true;
                topic.awesomeCount++;
            }, fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
                this.dismissLoading();
            }
        });
    }
    ionViewWillEnter() {
        this.events.subscribe(EventsConstants.POST_TOPIC, () => {
            this.getListAllNewSubjects();
        });
        this.events.subscribe(EventsConstants.DELETE_TOPIC, () => {
            this.getListAllNewSubjects();
        });
    }

    ionViewWillUnload() {
        this.events.unsubscribe(EventsConstants.POST_TOPIC);
    }

    //话题详情  投票详情
    goToTopicDetail(subjectId: number, type: string) {
        if (this.isJoin) {
            if (this.joinStatus == 2) {
                if (type == 'UR01') {
                    this._app.getRootNav().push(TopicDetailPage, { 'subjectId': subjectId });
                } else {
                    this._app.getRootNav().push(CircleVoteDetailPage, { 'subjectId': subjectId });
                }
            } else {
                this.toast('亲,你还没有加入该讨论组,不能查看!');
                return;
            }
        } else {
            if (type == 'UR01') {
                this._app.getRootNav().push(TopicDetailPage, { 'subjectId': subjectId });
            } else {
                this._app.getRootNav().push(CircleVoteDetailPage, { 'subjectId': subjectId });
            }
        }
    }
    //查看大图
    showPicture(selectedImg: any, index: any) {
        this._app.getRootNav().push(ShowBigImgPage, { 'imgUrls': selectedImg, 'selectImgNum': index });
    }
    //表情标签转图片
    transSmiles(commentContent: string) {
        return this.emojiUtils.transSmiles(commentContent);
    }

}

