import { NormalHeaderComponent } from '../../../components/normal-header/normal-header';
import { ConfigKey } from '../../../core/storage/ConfigKey';
import { Component, Injector, ViewChild } from '@angular/core';
import { BasePage } from '../../../core/base-page/BasePage';
import { DiscussSubjectMiniVo } from '../../../models/circle/DiscussSubjectMiniVo';
import { CircleDetailPage } from '../circle-detail/circle-detail';
import { Constants } from '../../../core/Constants';
import { DiscussCommentVo } from '../../../models/circle/DiscussCommentVo';
import { EmojiUtils } from '../../../core/EmojiUtils';
import { CommentView } from '../../../components/comment-view/comment-view';
import { CourseMiniVo } from '../../../models/study/CourseMiniVo';
import { DisAttachCourseVo } from '../../../models/circle/DisAttachCourseVo';
import { CourseDetailPage } from '../../study/course-detail/course-detail';
import { ShowPicturePage } from '../circle-showPicture/circle-showPicture';
import { ShowBigImgPage } from '../../../core/show-bigimg-page/show-bigimg-page';
import { ActionSheetController, Events } from 'ionic-angular';
import { EventsConstants } from '../../../core/EventsConstants';
import { CirclePostPage } from '../circle-post/circle-post';
import { FileUtils } from '../../../core/FileUtils';

@Component({
    selector: 'page-topic-detail',
    templateUrl: 'topic-detail.html'
})
export class TopicDetailPage extends BasePage {
    @ViewChild('CommentView') commentView: CommentView;//评论控件
    @ViewChild('NormalHeaderComponent') normalHeader: NormalHeaderComponent;
    public tabBarElement: any;
    public subjectId: number;//主题id
    public discussSubjectMiniVo: DiscussSubjectMiniVo;

    public pageNum: number = 1;//评论的页码
    public pageSize: number = 10;//评论每页获取的条数

    public circleComments: Array<DiscussCommentVo> = [];//圈子评论列表
    public canLoadMore: boolean = false;
    public COMMENT_TYPE: string = '02';//按最热排序

    private parentId: number = 0;//上级评论ID
    private commentContent: string;//评论的内容
    private commentMax: number = 200;//评论的最大字数限制
    private replyMax: number = 200;//回复的最大字数限制
    private commentImages: any = [];//评论图片本地地址
    private imgUrls: any = [];//评论图片上传成功后的地址
    private uploadImageNum: number = 0;//上传成功的图片数量
    public isShowAnonymous: boolean = false;//是否显示评论匿名功能

    private selectedCourse: Array<CourseMiniVo> = [];//已选课程
    public attachCourses: Array<DisAttachCourseVo>;//发送选择的课程
    public anonymousFlag: number = 0;//是否匿名发表，0=非匿名发表，大于0匿名发表；默认是0；

    public isShowMoreEdit: boolean = false;//是否显示可编辑
    constructor(injector: Injector,
        private emojiUtils: EmojiUtils,
        public actionSheetCtrl: ActionSheetController,
        public events: Events,
        public fileUtils: FileUtils) {
        super(injector);
    }
    ionViewWillEnter() {
        let AllowAnonymousFlag = this.storageUtil.getStorageValue(ConfigKey.CIRCLE_ALLOW_ANONYMOUS_FLAG, 'N');
        if (AllowAnonymousFlag == 'Y') {
            this.isShowAnonymous = true;
        } else {
            this.isShowAnonymous = false;
        }
        this.commentMax = this.storageUtil.getStorageValue(ConfigKey.CIRCLE_COMMENT_MAX_LENGTH, 200);
        this.replyMax = this.commentMax;
        this.subjectId = this.navParams.get('subjectId');
        this.getDiscussSubjectDetail();
        this.getCommentsOfSubject();
        this.normalHeader.initComponent(true, false, '班级详情', false, false, false, null);
        this.events.subscribe(EventsConstants.EDIT_TOPIC, () => {
            this.getDiscussSubjectDetail();
        });
    }
    //获取话题详情
    getDiscussSubjectDetail() {
        this.showLoading();
        let params = {
            userId: this.storageUtil.getUserId(),
            orgId: this.storageUtil.getOrgId(),
            subjectId: this.subjectId
        }
        this.httpUtil.get({
            url: this.apiUrls.getDiscussSubjectDetail(),
            param: params,
            success: (res) => {
                this.discussSubjectMiniVo = res.result;
                let discussSubjectUserId: any = this.discussSubjectMiniVo.author.userId;
                if (this.storageUtil.getUserId() == discussSubjectUserId) {
                    this.isShowMoreEdit = true;
                } else {
                    this.isShowMoreEdit = false;
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

    //圈子详情
    goToCircleDetail(discussSubjectMiniVo: any) {
        this.navController.push(CircleDetailPage, { 'myCircle': discussSubjectMiniVo });
    }

    //话题详情点赞
    clickAppraise() {
        if (this.discussSubjectMiniVo.doYouAwesomed) {
            this.toast('你已经点过赞啦');
            return;
        }
        this.showLoading();
        let url = this.apiUrls.getUrlUserAppraise() + '/'
            + this.storageUtil.getOrgId() + '/'
            + this.storageUtil.getUserId() + '/'
            + Constants.TOPIC_UP + '/' + this.discussSubjectMiniVo.subjectId;
        this.httpUtil.post({
            url: url, success: (res) => {
                this.discussSubjectMiniVo.doYouAwesomed = true;
                this.discussSubjectMiniVo.awesomeCount++;
            }, fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
                this.dismissLoading();
            }
        });
    }

    //话题收藏与取消
    clickFavorites() {
        this.showLoading();
        if (this.discussSubjectMiniVo.doYouFavorite == true) {//取消收藏
            let url = this.apiUrls.getUrlCancelCollect();
            let params = {
                orgId: this.storageUtil.getOrgId(),
                userId: this.storageUtil.getUserId(),
                objId: this.discussSubjectMiniVo.subjectId,
                objType: Constants.TOPIC_COLLECTION
            };
            this.httpUtil.get({
                url: url, param: params, success: (res) => {
                    this.discussSubjectMiniVo.doYouFavorite = false;
                }, fail: (err) => {
                    this.toast(err.msg);
                }, finish: () => {
                    this.dismissLoading();
                }
            });
        } else {//收藏
            let url = this.apiUrls.getUrlUserCollect();
            let params = {
                orgId: this.storageUtil.getOrgId(),
                userId: this.storageUtil.getUserId(),
                objId: this.discussSubjectMiniVo.subjectId,
                objType: Constants.TOPIC_COLLECTION
            };
            this.httpUtil.get({
                url: url, param: params, success: (res) => {
                    this.discussSubjectMiniVo.doYouFavorite = true;
                }, fail: (err) => {
                    this.toast(err.msg);
                }, finish: () => {
                    this.dismissLoading();
                }
            });
        }
    }

    //话题评论点赞
    clickCommentAppraised(i: number) {
        if (this.circleComments[i].hasAppraised == 'true') {
            this.toast('你已经点过赞啦');
            return;
        }
        this.showLoading();
        let url = this.apiUrls.getUrlUserAppraise() + '/'
            + this.storageUtil.getOrgId() + '/'
            + this.storageUtil.getUserId() + '/'
            + Constants.TOPIC_COMMENT_UP + '/' + this.circleComments[i].commentId;
        this.httpUtil.post({
            url: url, success: (res) => {
                this.circleComments[i].hasAppraised = 'true';
                this.circleComments[i].awesomeCount++;
            }, fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
                this.dismissLoading();
            }
        });
    }

    //获取评论列表
    getCommentsOfSubject(refresher?: any) {
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            subjectId: this.subjectId,
            orderType: this.COMMENT_TYPE,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
        };
        this.httpUtil.get({
            url: this.apiUrls.getCommentsOfSubject(),
            param: params,
            success: (res) => {
                if (this.pageNum == 1) {
                    this.circleComments = [];
                }
                if (res.result == null || res.result == '') {
                    this.canLoadMore = false;
                    return;
                }
                this.circleComments = this.circleComments.concat(res.result);
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
        this.commentImages = content.imageUrls;
        this.selectedCourse = content.courseList;
        if (content.isAnonymous) {
            this.anonymousFlag = 1;
        } else {
            this.anonymousFlag = 0;
        }
        if (this.commentImages && this.commentImages.length > 0) {
            this.postCommentImages();
        } else {
            this.postComment();
        }
    }
    //发送评论
    postComment() {
        this.showLoading();
        let url = this.apiUrls.postComment() + '/'
            + this.storageUtil.getOrgId() + '/'
            + this.storageUtil.getUserId() + '/'
            + this.subjectId
        let params = {
            userId: this.storageUtil.getUserId(),
            parentId: this.parentId,
            content: this.commentContent,
            attachCourses: this.selectedCourse,
            anonymousFlag: this.anonymousFlag,
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

    //评论回复
    replyInput(parentId: number) {
        this.commentView.showInput(false, false, this.isShowAnonymous);
        this.parentId = parentId;
    }

    //取消发送评论
    cancelInputComment() {
        this.parentId = 0;
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

    //去课程详情
    goCourseDetail(courseId: number) {
        this.navController.push(CourseDetailPage, { courseId: courseId });
    }

    //去圈子详情
    goCircleDetail(groupId: number) {
        this._app.getRootNav().push(CircleDetailPage, { groupId: groupId });
    }

    //查看大图
    showBigPicture(index: any) {
        this.navController.push(ShowBigImgPage, { 'imgUrls': this.discussSubjectMiniVo.imgURLs, 'selectImgNum': index });
    }
    //查看评论大图
    showCommentBigPicture(imgUrls: any, index: any) {
        this.navController.push(ShowBigImgPage, { 'imgUrls': imgUrls, 'selectImgNum': index });
    }
    //话题编辑
    moreTopic() {
        if (this.circleComments.length > 0) {
            let actionSheet = this.actionSheetCtrl.create({
                title: '',
                buttons: [
                    {
                        text: '编辑',
                        handler: () => {
                            this.editTopic();
                        }
                    }, {
                        text: '取消',
                        role: 'cancel',
                        handler: () => {
                            console.log('cancel');
                        }
                    }
                ]
            });
            actionSheet.present();

        } else {
            let actionSheet = this.actionSheetCtrl.create({
                title: '',
                buttons: [
                    {
                        text: '编辑',
                        handler: () => {
                            this.editTopic();
                        }
                    }, {
                        text: '删除',
                        handler: () => {
                            let alert = this.alertCtrl.create({
                                title: '温馨提示',
                                message: '确认删除这个话题吗？',
                                buttons: [
                                    {
                                        text: '确认',
                                        handler: () => {
                                            this.deleteTopic();
                                        }
                                    },
                                    {

                                        text: '取消',
                                        role: 'cancel',
                                        handler: () => {
                                            console.log('Cancel clicked');
                                        }
                                    }
                                ]
                            });
                            alert.present();
                        }
                    }, {
                        text: '取消',
                        role: 'cancel',
                        handler: () => {
                            console.log('cancel');
                        }
                    }
                ]
            });
            actionSheet.present();
        }
    }
    //编辑话题
    editTopic() {
        this.navController.push(CirclePostPage, { discussSubjectMiniVo: this.discussSubjectMiniVo, isEdit: true });
    }
    //删除话题
    deleteTopic() {
        this.showLoading();
        let params = {
            userId: this.storageUtil.getUserId(),
            orgId: this.storageUtil.getOrgId(),
            subjectId: this.subjectId
        }
        this.httpUtil.get({
            url: this.apiUrls.getDeleteTopic(),
            param: params,
            success: (res) => {
                this.events.publish(EventsConstants.DELETE_TOPIC);
                this.navController.pop();
            },
            fail: (res) => {
                this.toast(res.msg);
            },
            finish: () => {
                this.dismissLoading();
            }
        });
    }
    ionViewWillUnload() {
        this.events.unsubscribe(EventsConstants.EDIT_TOPIC);
    }
    //获取@好友
    getFriend() {
        let friend = '';
        if (this.discussSubjectMiniVo.inviteeUsers) {
            for (let i = 0; i < this.discussSubjectMiniVo.inviteeUsers.length; i++) {
                friend = friend + ' @' + this.discussSubjectMiniVo.inviteeUsers[i].nickName;
            }
        }
        return friend;
    }

    //上传图片
    postCommentImages() {
        this.showLoading();
        for (let i = 0; i < this.commentImages.length; i++) {
            this.fileUtils.upload({
                url: this.apiUrls.postUploadFile() + '/' + this.storageUtil.getOrgId() + '/' + this.storageUtil.getUserId(),
                localPath: this.commentImages[i],
                success: (response) => {
                    this.uploadImageNum++;
                    if (response && response.code == 0) {
                        this.imgUrls[i] = response.result;
                    }
                    if (this.uploadImageNum == this.commentImages.length) {
                        this.dismissLoading();
                        this.postComment();
                    }
                },
                error: () => {
                    this.uploadImageNum++;
                    if (this.uploadImageNum == this.commentImages.length) {
                        this.dismissLoading();
                        this.postComment();
                    }
                }
            });
        }
    }
    goBackClick() {
        this.navController.pop();
    }
}



