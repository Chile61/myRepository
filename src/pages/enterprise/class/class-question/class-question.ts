import { HttpUtil } from '../../../../core/http/HttpUtil';
import { StorageUtil } from '../../../../core/storage/StorageUtil';
import { Http } from '@angular/http';
import { BasePage } from '../../../../core/base-page/BasePage';
import { Injector, Component } from '@angular/core';
import { ShowBigImgPage } from '../../../../core/show-bigimg-page/show-bigimg-page';
import { EmojiUtils } from '../../../../core/EmojiUtils';
import { ClassQuestionDetailPage } from '../question-detail/question-detail';
import { DiscussSubjectMiniVo } from '../../../../models/circle/DiscussSubjectMiniVo';
import { ClassPostQuestionPage } from '../question-post/question-post';
import { Events } from 'ionic-angular';
import { EventsConstants } from '../../../../core/EventsConstants';


@Component({
    selector: 'page-class-question',
    templateUrl: 'class-question.html'
})

export class ClassQuestionPage extends BasePage {
    public classId: number = 0;
    public pageNum: number = 1;
    public pageSize: number = 10;
    public classQuestionList: Array<DiscussSubjectMiniVo> = [];
    public canLoadMore: boolean = false;
    constructor(injector: Injector, public emojiUtils: EmojiUtils, private events: Events) {
        super(injector);
        this.classId = this.navParams.data.id;
        this.getClassQuestionList();
    }
    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.pageNum = 1;
        } else {
            this.pageNum = this.pageNum + 1;
        }
        this.getClassQuestionList(refresher);
    }
    //获取问答列表
    getClassQuestionList(refresher?: any) {
        this.showLoading();
        let urls = this.apiUrls.getClassesQnaList();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            classId: this.classId,
            pageNum: this.pageNum,
            pageSize: this.pageSize
        };
        this.httpUtil.get({
            url: urls, param: params,
            success: (res) => {
                if (this.pageNum == 1) {
                    this.classQuestionList = [];
                }
                if (res.result == null || res.result == '') {
                    this.canLoadMore = false;
                    return;
                }
                this.classQuestionList = this.classQuestionList.concat(res.result);
                if (res.result.length >= this.pageSize) {
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
    //去问答详情
    goClassQuestionDetail(classId: number, subjectId: number) {
        this.navController.push(ClassQuestionDetailPage, { classId: classId, subjectId: subjectId });
    }
    //查看大图
    showBigPicture(selectedImg: any, index: any) {
        this._app.getRootNav().push(ShowBigImgPage, { 'imgUrls': selectedImg, 'selectImgNum': index });
    }
    //表情标签转图片
    transSmiles(commentContent: string) {
        return this.emojiUtils.transSmiles(commentContent);
    }
    //班级提问
    postQuestion() {
        this.navController.push(ClassPostQuestionPage, { classId: this.classId });
    }
    ionViewWillEnter() {
        this.events.subscribe(EventsConstants.POST_CLASS_QUESTION, () => {
            this.getClassQuestionList();
        });
    }
    ionViewWillUnload() {
        this.events.unsubscribe(EventsConstants.POST_CLASS_QUESTION);
    }
}