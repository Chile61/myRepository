import {Component, Injector, ViewChild} from '@angular/core';
import 'rxjs/add/operator/map';
import {BasePage} from "../../../core/base-page/BasePage";
import {Constants} from "../../../core/Constants";
import {EmojiUtils} from "../../../core/EmojiUtils";
import {CommentView} from "../../../components/comment-view/comment-view";

@Component({
    selector: 'page-game-comment',
    templateUrl: 'game-comment.html'
})
export class GameCommentPage extends BasePage {
    private questionId: number = 0;
    private pageNum: number = 1;
    private pageSize: number = 10;
    questName: string;
    questDesc: string;
    public gameComments: any = [];
    public canLoadMore: boolean = false;
    @ViewChild('CommentView') commentView: CommentView;//评论控件

    private parentId: number = 0;

    constructor(injector: Injector,
                private emojiUtils: EmojiUtils) {
        super(injector);
        this.questName = this.navParams.get('questName');
        this.questDesc = this.navParams.get('questDesc');
        this.questionId = this.navParams.get('questId');

        this.showLoading();
        this.getGameComment();
    }

    //获取关卡评论
    getGameComment(refresher?: any) {
        let url = this.apiUrls.getUrlCourseTypeComment();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            objId: this.questionId,
            objType: Constants.PASS_COMMENT,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            commentType: 1
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                if (this.pageNum == 1) {
                    this.gameComments = [];
                }
                if (res.result == null || res.result == '') {
                    this.canLoadMore = false;
                    return;
                }
                this.gameComments = this.gameComments.concat(res.result);
                if (res.result.length >= this.pageSize) {
                    this.canLoadMore = true;
                } else {
                    this.canLoadMore = false;
                }
            }, fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
                if (refresher != null) {
                    refresher.complete();
                }
                this.dismissLoading();
            }
        });
    }

    //表情标签转图片
    transSmils(commentContent: string) {
        return this.emojiUtils.transSmiles(commentContent);
    }

    //课程评论点赞
    thumbUpCourseComment(index: number) {
        if (this.gameComments[index].hasAppraised == true) {
            this.toast('你已经点过赞啦');
            return;
        }
        this.showLoading();
        let url = this.apiUrls.getUrlUserAppraise() + '/'
            + this.storageUtil.getOrgId() + '/'
            + this.storageUtil.getUserId() + '/'
            + Constants.COURSE_COMMENT_UP + '/' + this.gameComments[index].commentId;
        this.httpUtil.post({
            url: url, success: (res) => {
                this.gameComments[index].hasAppraised = true;
                this.gameComments[index].awesomeCount++;
            }, fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
                this.dismissLoading();
            }
        });
    }

    //评论回复
    replyInput(parentId: number) {
        this.commentView.showInput(false, false, false);
        this.parentId = parentId;
    }

    //发送评论
    postComment(Content: any) {
        this.showLoading();
        let url = this.apiUrls.getUrlPostStudyComment() + '/'
            + this.storageUtil.getOrgId() + '/'
            + this.storageUtil.getUserId() + '/'
            + Constants.PASS_COMMENT + '/'
            + this.questionId;
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            objId: this.questionId,
            objType: Constants.PASS_COMMENT,
            remark: Content.commentContent,
            parentId: this.parentId
        };
        this.httpUtil.post({
            url: url, param: params, success: (res) => {
                this.pageNum = 1;
                this.showLoading();
                this.getGameComment();
                this.commentView.closeCommentInput();
                this.parentId = 0;
            }, fail: (err) => {
                this.toast(err);
            }, finish: () => {
                this.dismissLoading();
            }
        });
    }

    //取消发送评论
    cancelInputComment() {
        this.parentId = 0;
    }

    //上拉更新，下拉加载
    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.showLoading();
            this.pageNum = 1;
        } else {
            this.pageNum = this.pageNum + 1;
        }
        this.getGameComment(refresher);
    }
}
