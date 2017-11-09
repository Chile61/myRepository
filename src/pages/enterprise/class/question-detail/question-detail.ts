import { FileUtils } from '../../../../core/FileUtils';
import { BasePage } from '../../../../core/base-page/BasePage';
import { Component, Injector, ViewChild } from '@angular/core';
import { DiscussSubjectMiniVo } from '../../../../models/circle/DiscussSubjectMiniVo';
import { EmojiUtils } from '../../../../core/EmojiUtils';
import { ShowBigImgPage } from '../../../../core/show-bigimg-page/show-bigimg-page';
import { Constants } from '../../../../core/Constants';
import { CommentView } from '../../../../components/comment-view/comment-view';
@Component({
    selector: 'page-question-detail',
    templateUrl: 'question-detail.html'
})
export class ClassQuestionDetailPage extends BasePage {
    public discussSubjectMiniVo: DiscussSubjectMiniVo;
    public subjectId: number;//问答id
    public classId: number;//班级id
    public pageNum: number = 1;//评论的页码
    public pageSize: number = 10;//评论每页获取的条数
    public COMMENT_TYPE: string = '02';//默认00：先按热排，后按时间倒序；01:最新； 02：最热
    public canLoadMore: boolean = false;
    public classCommentList = [];
    private parentId: number = 0;//上级评论ID
    private commentMax: number = 200;//评论的最大字数限制
    private replyMax: number = 200;//回复的最大字数限制
    private commentImages: any = [];//评论图片本地地址
    private uploadImageNum = 0;//上传成功的图片数量
    private commentContent: string;//评论的内容
    public imgUrls: Array<string>;//评论图片地址
    @ViewChild('CommentView') commentView: CommentView;//评论控件
    constructor(injector: Injector, public emojiUtils: EmojiUtils, public fileUtils: FileUtils) {
        super(injector);
        this.subjectId = this.navParams.get('subjectId');
        this.classId = this.navParams.get('classId');
        this.getClassQuestionDetail();
        this.getCommentsOfSubject();
    }
    //获取班级问答详情
    getClassQuestionDetail() {
        this.showLoading();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            subjectId: this.subjectId
        };
        this.httpUtil.get({
            url: this.apiUrls.getClassQuestionDetail(),
            param: params,
            success: (res) => {
                this.discussSubjectMiniVo = res.result;
            },
            fail: (res) => {
                this.toast(res.msg);
            },
            finish: () => {
                this.dismissLoading();
            }
        });
    }
    //获取评论列表
    getCommentsOfSubject(refresher?: any) {
        this.showLoading();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            subjectId: this.subjectId,
            orderType: this.COMMENT_TYPE,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
        };
        this.httpUtil.get({
            url: this.apiUrls.getClassCommentList(),
            param: params,
            success: (res) => {
                if (this.pageNum == 1) {
                    this.classCommentList = [];
                }
                if (res.result == null || res.result == '') {
                    this.canLoadMore = false;
                    return;
                }
                this.classCommentList = this.classCommentList.concat(res.result);
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
    //话题评论点赞
    clickCommentAppraised(i: number) {
        if (this.classCommentList[i].hasAppraised == 'true') {
            this.toast('你已经点过赞啦');
            return;
        }
        this.showLoading();
        let url = this.apiUrls.getUrlUserAppraise() + '/'
            + this.storageUtil.getOrgId() + '/'
            + this.storageUtil.getUserId() + '/'
            + Constants.TOPIC_COMMENT_UP + '/' + this.classCommentList[i].commentId;
        this.httpUtil.post({
            url: url, success: (res) => {
                this.classCommentList[i].hasAppraised = 'true';
                this.classCommentList[i].awesomeCount++;
            }, fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
                this.dismissLoading();
            }
        });
    }
    //切换最新最热评论
    selectCommentType(commentType: any) {
        if (this.COMMENT_TYPE == commentType) {
            return;
        }
        this.COMMENT_TYPE = commentType;
        this.pageNum = 1;
        this.showLoading();
        this.getCommentsOfSubject();
    }
    //检查评论
    checkComment(content: any) {
        this.commentImages = content.imageUrls;
        this.commentContent = content.commentContent;
        if (this.commentContent.length < 5) {
            this.toast('亲，写的太简单了。要写够5个字才能正常发表评论。');
            return;
        }
        if (this.parentId == 0 && this.commentContent.length > this.commentMax) {
            this.toast('评论字数最多为' + this.commentMax + '个');
            return;
        }
        if (this.parentId != 0 && this.commentContent.length > this.replyMax) {
            this.toast('回复字数最多为' + this.replyMax + '个');
            return;
        }
        if (this.commentImages != null && this.commentImages.length > 0) {
            this.postCommentImages();
        }else{
            this.postComment();  
        }
    }
    //发送评论
    postComment() {
        this.showLoading();
        let url = this.apiUrls.postClassQuestionComment() + '/'
            + this.storageUtil.getOrgId() + '/'
            + this.storageUtil.getUserId() + '/'
            + this.classId + '/'
            + this.subjectId
        let params = {
            subjectId: this.subjectId,
            targetCommendId: this.parentId,
            comment: this.commentContent,
            imgURLs: this.imgUrls
        };
        this.httpUtil.post({
            url: url,
            param: params,
            success: (res) => {
                this.COMMENT_TYPE = '01';
                this.pageNum = 1;
                this.showLoading();
                this.getCommentsOfSubject();
                this.commentView.closeCommentInput();
                this.parentId = 0;
            }, fail: (res) => {
                this.toast(res.msg);
            }, finish: () => {
                this.dismissLoading();
            }
        });
    }
    //上传图片
    postCommentImages() {
        for (let i = 0; i < this.commentImages.length; i++) {
            this.fileUtils.upload({
                url: this.apiUrls.getBasePath() + '/sysOssUpload/uploadFile/' + this.storageUtil.getOrgId() + '/' + this.storageUtil.getUserId(),
                localPath: this.commentImages[i],
                success: (response) => {
                    this.uploadImageNum++;
                    if (response && response.code == 0) {
                        this.imgUrls[i] = response.result;
                    }
                    if (this.uploadImageNum == this.commentImages.length) {
                        this.postComment();
                    }
                },
                error: () => {
                    this.uploadImageNum++;
                    if (this.uploadImageNum == this.commentImages.length) {
                        this.postComment();
                    }
                }
            });
        }
    }
    //评论回复
    replyInput(parentId: number) {
        this.commentView.showInput(false, false, false);
        this.parentId = parentId;
    }
    //刷新评论列表
    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.showLoading();
            this.pageNum = 1;
        } else {
            this.pageNum = this.pageNum + 1;
        }
        this.getCommentsOfSubject(refresher);
    }
    //表情标签转图片
    transSmiles(commentContent: string) {
        return this.emojiUtils.transSmiles(commentContent);
    }
    //查看大图
    showBigPicture(index: any) {
        this.navController.push(ShowBigImgPage, { 'imgUrls': this.discussSubjectMiniVo.imgURLs, 'selectImgNum': index });
    }
    //取消发送评论
    cancelInputComment() {
        this.parentId = 0;
    }
}