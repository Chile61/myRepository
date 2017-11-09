import { EmojiUtils } from '../../../core/EmojiUtils';
import { BasePage } from '../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { DiscussSubjectMiniVo } from '../../../models/circle/DiscussSubjectMiniVo';
import { TopicDetailPage } from '../topic-detail/topic-detail';
import { CircleVoteDetailPage } from "../circle-vote-detail/circle-vote-detail";
import { Constants } from '../../../core/Constants';
import { ShowBigImgPage } from '../../../core/show-bigimg-page/show-bigimg-page';
import { Events } from 'ionic-angular';
import { EventsConstants } from '../../../core/EventsConstants';

@Component({
    selector: 'page-circle-attend-topic',
    templateUrl: 'circle-attend-topic.html'
})
export class AttendTopicPage extends BasePage {
    public pageNum: number = 1;
    public pageSize: number = 10;
    public myAttendTopicList: Array<DiscussSubjectMiniVo> = [];
    public canLoadMore: boolean = false;
    public urls: string = this.apiUrls.getMyAttendedSubjects();
    public ATTEND_TYPE: number = 1;//1、我参与的 2、我发起的 3、我回复的 4、@我的
    public POST_TYPE: number = 2;
    public REPLY_TYPE: number = 3;
    public INVITE_TYPE: number = 4;
    constructor(inject: Injector, public events: Events, public emojiUtils: EmojiUtils) {
        super(inject);
        this.urls = this.apiUrls.getMyAttendedSubjects();
        this.getMyAttendTopic();
    }

    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.pageNum = 1;
        } else {
            this.pageNum = this.pageNum + 1;
        }
        this.getMyAttendTopic(refresher);
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }
    //获取我参与的话题
    getMyAttendTopic(refresher?: any) {
        this.showLoading();
        let params = {
            userId: this.storageUtil.getUserId(),
            orgId: this.storageUtil.getOrgId(),
            pageNum: this.pageNum,
            pageSize: this.pageSize
        };
        this.httpUtil.get({
            url: this.urls, param: params,
            success: (res) => {
                if (this.pageNum == 1) {
                    this.myAttendTopicList = [];
                }
                if (res.result == null || res.result == '') {
                    this.canLoadMore = false;
                    return;
                }
                this.myAttendTopicList = this.myAttendTopicList.concat(res.result);
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

    //话题详情  投票详情
    goToTopicDetail(subjectId: number, type: string) {
        if (type == 'UR01') {
            this._app.getRootNav().push(TopicDetailPage, { 'subjectId': subjectId });
        } else {
            this._app.getRootNav().push(CircleVoteDetailPage, { 'subjectId': subjectId });
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
    ionViewWillEnter() {
        this.events.subscribe(EventsConstants.FILTER_TOPIC, (data: number) => {
            if (data == this.ATTEND_TYPE) {
                this.urls = this.apiUrls.getMyAttendedSubjects();
            } else if (data == this.POST_TYPE) {
                this.urls = this.apiUrls.getMyPostedSubjects();
            } else if (data == this.REPLY_TYPE) {
                this.urls = this.apiUrls.getMyReplySubjects();
            } else if (data == this.INVITE_TYPE) {
                this.urls = this.apiUrls.getSubjectByInviteUser();
            }
            this.getMyAttendTopic();
        });
        this.events.subscribe(EventsConstants.DELETE_TOPIC, () => {
            this.getMyAttendTopic();
        });
    }
    ionViewWillUnload() {
        this.events.unsubscribe(EventsConstants.FILTER_TOPIC);
        this.events.unsubscribe(EventsConstants.DELETE_TOPIC);
    }

}

