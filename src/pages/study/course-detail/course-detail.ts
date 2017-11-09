/**
 * Created by zxh on 2016/12/15.
 */
import { Component, Injector, ViewChild } from "@angular/core";
import { CourseDetailVo } from "../../../models/study/CourseDetailVo";
import { CourseTypeCommentVo } from "../../../models/core/comment/CourseTypeCommentVo";
import { BasePage } from "../../../core/base-page/BasePage";
import { ShowImagePage } from "../show-image/show-image";
import { ShowPPTPage } from "../show-ppt/show-ppt";
import { ShowHtmlPage } from "../show-html/show-html";
import { CategoryUtils } from "../CategoryUtils";
import { CommentView } from "../../../components/comment-view/comment-view";
import { EmojiUtils } from "../../../core/EmojiUtils";
import { Constants } from '../../../core/Constants';
import { ActionSheetController, Platform, Events } from "ionic-angular";
import { ConfigKey } from "../../../core/storage/ConfigKey";
import { ShowH5Page } from "../show-h5/show-h5";
import { FileUtils } from "../../../core/FileUtils";
import { DBUtils } from "../../../core/db/DBUtils";
import { DBTableName } from "../../../core/db/DBTableName";
import { DownloadService } from "../../../core/DownloadService";
import { EventsConstants } from "../../../core/EventsConstants";
declare var Wechat: any;
@Component({
    selector: 'page-course-detail',
    templateUrl: 'course-detail.html'
})
//课程详情
export class CourseDetailPage extends BasePage {

    private videos: any;
    private videoPlayer: HTMLVideoElement;//视频播放
    @ViewChild('CommentView') commentView: CommentView;//评论控件

    public isShowUp: boolean = true;//是否显示点赞
    public isShowCollect: boolean = true;//是否显示收藏
    public isShowDownload: boolean = true;//是否显示下载
    public interactionCss: string = 'action-4';//交互区样式
    private commentMax: number = 200;//评论的最大字数限制
    private replyMax: number = 200;//回复的最大字数限制

    private courseId: number = 0;
    public courseDetail: CourseDetailVo;
    public totalCount: number = 0;//课程评论数
    public courseComments: Array<CourseTypeCommentVo> = [];
    private pageNum: number = 1;
    private pageSize: number = 10;
    private commentType: number = 2;//1,最新 2,最热
    public canLoadMore: boolean = false;

    public lookImg: string = 'assets/images/learn_icon02.png';//查看图标

    public audioResUrl: string;//音频资源地址
    public isAudioCourse: boolean = false;//是否为音频课程
    private isFirstPlay: boolean = true;//是否是进入第一次播放

    public videoResUrl: string;//视频资源地址
    public playVideo: boolean = false;//是否播放视频

    public videoFull: boolean = false;
    public videoCss: string = 'video-normal';

    private parentId: number = 0;//上级评论ID

    private COURSE_READ_TIME: number = 15000;//15s记录阅读记录
    private markReadID: number = 0;//记录已读timer的ID
    private videoID: number = 0;//获取视频时长的ID

    private prompt;//提示框
    private alertIsShow: boolean = false;//提示框是否显示
    private backFunction: Function;//物理返回按钮监听注销使用

    private fromWhere: number = 0;//来自 0:课程列表(默认) 1:闯关 2:任务 3:班级 4:圈子话题 5:活动

    public isShowHeader: boolean = true;//是否显示头部
    public isShowInteraction: boolean = true;//是否显示交互区
    public isShowRecommendCourse: boolean = true;//是否显示相关推荐
    public isShowCommentView: boolean = true;//是否显示评论控件

    public courseItemId: number;//班级阶段项id
    public classCourseState: number;//课程学习状态
    constructor(injector: Injector,
        private emojiUtils: EmojiUtils,
        private actionSheetCtrl: ActionSheetController,
        private platform: Platform,
        private fileUtils: FileUtils,
        private dbUtils: DBUtils,
        private events: Events,
        private downloadService: DownloadService) {
        super(injector);
        this.initConfig();
        this.courseId = this.navParams.get('courseId');
        if (this.courseId) {
            if (this.fromWhere != Constants.FROM_OFFLINE_DOWNLOAD) {
                this.showLoading();
                this.getCourseInfo();
            } else {
                this.initCoursePage();
            }
            if (this.fromWhere != Constants.FROM_PASS) {
                this.initBackButton();
            }
        } else {
            this.toast('课程ID为空')
        }
    }

    ionViewDidEnter() {
        this._app.setTitle('课程详情');
    }

    //初始化物理按钮监听
    initBackButton() {
        this.platform.ready().then(() => {
            this.backFunction = this.platform.registerBackButtonAction(() => {
                this.goBack();
            }, 100);
        });
    }

    //返回
    goBack() {
        if (this.courseDetail) {
            if ((new Date().getTime() - this.storageUtil.getStorageValue(ConfigKey.STUDY_READ_COURSE_HINT, 0)) < 24 * 60 * 60 * 1000) {
                this.navController.pop();
                return;
            }
            if (this.prompt && this.alertIsShow == true) {
                this.prompt.dismiss();
                this.alertIsShow = false;
                return;
            }
            if (this.courseDetail.hasReaded == false) {
                this.prompt = this.alertCtrl.create({
                    title: '温馨提示',
                    message: '掐指一算你还没学完，确定退出？',
                    inputs: [{
                        type: 'checkbox',
                        label: '暂不提醒',
                        value: 'true'
                    }],
                    buttons: [
                        {
                            text: '取消',
                            handler: () => {
                                this.alertIsShow = false;
                            }
                        },
                        {
                            text: '确定',
                            handler: (data) => {
                                this.alertIsShow = false;
                                this.navController.pop();
                                if (data && data.length > 0) {//暂不提醒处理
                                    if (data[0] == 'true') {
                                        this.storageUtil.setStorageValue(ConfigKey.STUDY_READ_COURSE_HINT, new Date().getTime());
                                    }
                                }
                            }
                        }
                    ]
                });
                this.prompt.present();
                this.alertIsShow = true;
            } else {
                this.navController.pop();
            }
        } else {
            this.navController.pop();
        }
    }

    playAudio() {
        console.log('playAudio');
    }

    //初始化配置信息
    initConfig() {
        this.isShowUp = this.storageUtil.getStorageValue(ConfigKey.STUDY_COURSE_APPRAISE, 'true') == 'true' ? true : false;
        this.isShowCollect = this.storageUtil.getStorageValue(ConfigKey.STUDY_COURSE_COLLECT, 'true') == 'true' ? true : false;
        this.isShowDownload = this.storageUtil.getStorageValue(ConfigKey.STUDY_COURSE_DOWNLOAD, 'true') == 'true' ? true : false;
        this.commentMax = this.storageUtil.getStorageValue(ConfigKey.COURSE_COMMENT_MAX, 200);
        this.replyMax = this.storageUtil.getStorageValue(ConfigKey.COURSE_COMMENT_REPLY_MAX, 200);

        if (this.navParams.get('fromWhere')) {
            this.fromWhere = this.navParams.get('fromWhere');
            switch (this.fromWhere) {
                case Constants.COURSE_LIST://课程列表

                    break;
                case Constants.FROM_PASS://闯关
                    this.isShowHeader = false;
                    this.isShowRecommendCourse = false;
                    this.isShowCommentView = false;
                    break;
                case Constants.FROM_TASK://任务

                    break;
                case Constants.FROM_CLASS://班级
                    this.courseItemId = this.navParams.get('courseItemId');
                    this.classCourseState = this.navParams.get('classCourseState');
                    
                    break;
                case Constants.FROM_TOPIC://圈子话题

                    break;
                case Constants.FROM_ACTIVITY://活动

                    break;
                case Constants.FROM_OFFLINE_DOWNLOAD://离线下载
                    this.courseDetail = this.navParams.get('courseDetail');
                    this.isShowInteraction = false;
                    this.isShowRecommendCourse = false;
                    this.isShowCommentView = false;
                    break;
            }
        }
    }

    //获取课程详情
    getCourseInfo() {
        let url = this.apiUrls.getUrlCourseDetail();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            courseId: this.courseId
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                if (res.result == null || res.result == '') {
                    this.toast('课程内容为空');
                    this.dismissLoading();
                    return;
                }
                this.courseDetail = res.result;
                this.getCourseDownloadState();
                this.initCoursePage();
                if (this.fromWhere != Constants.FROM_PASS) {
                    this.getCourseComment();
                } else {
                    this.dismissLoading();
                }
            }, fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
            }
        });
    }

    //获取课程评论
    getCourseComment(refresher?: any) {
        let url = this.apiUrls.getUrlCourseTypeComment();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            objId: this.courseId,
            objType: Constants.COURSE_COMMENT,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            commentType: this.commentType
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                if (this.pageNum == 1) {
                    this.courseComments = [];
                }
                if (res.result == null || res.result == '') {
                    this.canLoadMore = false;
                    return;
                }
                this.courseComments = this.courseComments.concat(res.result);
                this.totalCount = res.totalCount;
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

    //初始化课程页面
    initCoursePage() {
        // 进行相应课程的判断
        switch (this.courseDetail.resTypeId) {
            case 1:// 视频
                this.lookImg = 'assets/images/learn_icon01.png';
                break;
            case 2:// 图片

                break;
            case 3:// PPT

                break;
            case 4:// PDF

                break;
            case 5:// Word

                break;
            case 6:// URL

                break;
            case 7:// TEXT
                this.lookImg = '';
                this.markReadID = setTimeout(() => {
                    this.submitCourseRead();
                }, this.COURSE_READ_TIME);
                break;
            case 8:// Html5

                break;
            case 9:// 音频
                this.lookImg = '';
                this.audioResUrl = this.courseDetail.resUrl;
                this.isAudioCourse = true;
                this.COURSE_READ_TIME = this.courseDetail.audioTime * 1000 / 2;
                let audioID = setInterval(() => {
                    let courseAudio = document.getElementById('courseAudio' + this.courseDetail.courseId) as HTMLAudioElement;
                    if (courseAudio) {
                        courseAudio.addEventListener('playing', () => {
                            if (this.isFirstPlay == true) {
                                this.markReadID = setTimeout(() => {
                                    this.submitCourseRead();
                                }, this.COURSE_READ_TIME);
                                this.isFirstPlay = false;
                            }
                        });
                        clearInterval(audioID);
                    }
                }, 200);
                break;
            default:
                this.lookImg = '';
                break;
        }

        if (this.isShowInteraction) {
            //初始化交互区样式
            let interactionNum = 0;
            if (this.isShowUp != false) {
                interactionNum++;
            }
            if (this.isShowCollect != false) {
                interactionNum++;
            }
            if (this.courseDetail.shareUrl) {
                interactionNum++;
            }
            if (this.isShowDownload != false && this.courseDetail.downloadUrl) {
                interactionNum++;
            }
            switch (interactionNum) {
                case 1:
                    this.interactionCss = 'action-1';
                    break;
                case 2:
                    this.interactionCss = 'action-2';
                    break;
                case 3:
                    this.interactionCss = 'action-3';
                    break;
                case 4:
                    this.interactionCss = 'action-4';
                    break;
            }
        }
    }

    //获取课程的下载状态
    getCourseDownloadState() {
        if (this.platform.is('mobile')) {
            this.dbUtils.selectByWhere({
                tableName: DBTableName.DOWNLOAD_COURSE_TABLE,
                where: 'userId="' + this.storageUtil.getUserId() + '" AND courseId=' + this.courseDetail.courseId,
                success: (result) => {
                    if (result && result.length > 0) {
                        this.courseDetail.downloadState = result[0].downloadState || 0;
                        if (result[0].downloadLocalPath) {
                            this.courseDetail.resUrl = result[0].downloadLocalPath;
                        }
                    } else {
                        this.courseDetail.downloadState = 0;
                    }
                }, error: () => {
                    this.courseDetail.downloadState = 0;
                }
            });
        }
    }

    fullScreen() {
        if (this.videoFull == false) {
            this.videoCss = 'video-full';
            document.getElementById("video").style.height = screen.availWidth + 'px';
            document.getElementById("video").style.width = screen.availHeight + 'px';
            document.getElementById("video").style.marginLeft = -(screen.availHeight - screen.availWidth) / 2 + 'px';
            document.getElementById("video").style.top = (screen.availHeight - screen.availWidth) / 2 + 'px';
            this.videoFull = true;
        } else {
            document.getElementById("video").style.height = '';
            document.getElementById("video").style.width = '';
            document.getElementById("video").style.marginLeft = '';
            document.getElementById("video").style.top = '';
            this.videoCss = 'video-normal';
            this.videoFull = false;
        }
    }

    //获取能力标签Css样式
    getCategoryCss(categoryName: string) {
        return CategoryUtils.getCategoryCss(categoryName);
    }

    //表情标签转图片
    transSmiles(commentContent: string) {
        return this.emojiUtils.transSmiles(commentContent);
    }

    //点击查看
    clickLook() {
        let rootNav = this._app.getRootNav();
        // 进行相应课程的判断
        switch (this.courseDetail.resTypeId) {
            case 1:// 视频
                this.playVideo = true;
                this.videoResUrl = this.courseDetail.resUrl;
                // this.videos = document.getElementsByTagName('video');
                this.videoID = setInterval(() => {
                    let courseVideo = document.getElementById('courseVideo' + this.courseDetail.courseId) as HTMLVideoElement;
                    // this.videoPlayer = this.videos[0];
                    // 这里注意, 必须判断视频的 readyState。
                    // 因为有可能没加载完，则获取到的视频时长信息是不正确的。
                    if (courseVideo && courseVideo.readyState > 0 && courseVideo.duration > 0) {
                        this.COURSE_READ_TIME = courseVideo.duration * 1000 / 2 < this.COURSE_READ_TIME ? this.COURSE_READ_TIME : courseVideo.duration * 1000 / 2;
                        // alert(this.videoPlayer.readyState + '--:--' + this.videoPlayer.duration);
                        this.markReadID = setTimeout(() => {
                            this.submitCourseRead();
                        }, this.COURSE_READ_TIME);
                        clearInterval(this.videoID);
                    }
                }, 200);
                break;
            case 2:// 图片
                rootNav.push(ShowImagePage, {
                    url: this.courseDetail.resUrl,
                    pageTitle: this.courseDetail.title
                });
                this.markReadID = setTimeout(() => {
                    this.submitCourseRead();
                }, this.COURSE_READ_TIME);
                break;
            case 3:// PPT
            // this.navController.push(ShowPPTPage, {course: this.courseDetail});
            // break;
            case 4:// PDF
                rootNav.push(ShowPPTPage, {
                    url: this.courseDetail.resUrl,
                    pages: this.courseDetail.pages,
                    pageTitle: this.courseDetail.title
                });
                this.markReadID = setTimeout(() => {
                    this.submitCourseRead();
                }, this.COURSE_READ_TIME);
                break;
            case 5:// Word
                rootNav.push(ShowHtmlPage, {
                    url: this.courseDetail.resUrl + '/' + this.courseDetail.resName + '.html',
                    pageTitle: this.courseDetail.title
                });
                this.markReadID = setTimeout(() => {
                    this.submitCourseRead();
                }, this.COURSE_READ_TIME);
                break;
            case 6:// URL
                rootNav.push(ShowHtmlPage, {
                    url: this.courseDetail.resUrl,
                    pageTitle: this.courseDetail.title
                });
                this.markReadID = setTimeout(() => {
                    this.submitCourseRead();
                }, this.COURSE_READ_TIME);
                break;
            case 7:// TEXT

                break;
            case 8:// Html5
                rootNav.push(ShowH5Page, {
                    contents: this.courseDetail.contents,
                    pageTitle: this.courseDetail.title
                });
                this.markReadID = setTimeout(() => {
                    this.submitCourseRead();
                }, this.COURSE_READ_TIME);
                break;
            case 9:// 音频
                this.markReadID = setTimeout(() => {
                    this.submitCourseRead();
                }, this.COURSE_READ_TIME);
                break;
            default:

                break;
        }
    }

    //课程点赞
    thumbUpCourse() {
        if (this.courseDetail.hasAppraised == true) {
            this.toast('你已经点过赞啦');
            return;
        }
        this.showLoading();
        let url = this.apiUrls.getUrlUserAppraise() + '/'
            + this.storageUtil.getOrgId() + '/'
            + this.storageUtil.getUserId() + '/'
            + Constants.COURSE_UP + '/' + this.courseDetail.courseId;
        this.httpUtil.post({
            url: url, success: (res) => {
                this.courseDetail.hasAppraised = true;
                this.courseDetail.appraiseNum++;
            }, fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
                this.dismissLoading();
            }
        });
    }

    //课程评论点赞
    thumbUpCourseComment(index: number) {
        if (this.courseComments[index].hasAppraised == true) {
            this.toast('你已经点过赞啦');
            return;
        }
        this.showLoading();
        let url = this.apiUrls.getUrlUserAppraise() + '/'
            + this.storageUtil.getOrgId() + '/'
            + this.storageUtil.getUserId() + '/'
            + Constants.COURSE_COMMENT_UP + '/' + this.courseComments[index].commentId;
        this.httpUtil.post({
            url: url, success: (res) => {
                this.courseComments[index].hasAppraised = true;
                this.courseComments[index].awesomeCount++;
            }, fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
                this.dismissLoading();
            }
        });
    }

    //收藏或者取消收藏课程
    collectionCourse() {
        this.showLoading();
        if (this.courseDetail.hasFavrited == true) {//取消收藏
            let url = this.apiUrls.getUrlCancelCollect();
            let params = {
                orgId: this.storageUtil.getOrgId(),
                userId: this.storageUtil.getUserId(),
                objId: this.courseDetail.courseId,
                objType: Constants.COURSE_COLLECTION
            };
            this.httpUtil.get({
                url: url, param: params, success: (res) => {
                    this.courseDetail.hasFavrited = false;
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
                objId: this.courseDetail.courseId,
                objType: Constants.COURSE_COLLECTION
            };
            this.httpUtil.get({
                url: url, param: params, success: (res) => {
                    this.courseDetail.hasFavrited = true;
                }, fail: (err) => {
                    this.toast(err.msg);
                }, finish: () => {
                    this.dismissLoading();
                }
            });
        }
    }

    //切换最新最热评论
    selectCommentType(commentType: number) {
        if (this.commentType == commentType) {
            return;
        }
        this.commentType = commentType;
        this.pageNum = 1;
        this.showLoading();
        this.getCourseComment();
    }

    //评论回复
    replyInput(parentId: number) {
        this.commentView.showInput(false, false, false);
        this.parentId = parentId;
    }

    //跳转到课程详情
    toCourseDetail(courseId: number) {
        this.navController.push(CourseDetailPage, { courseId: courseId });
    }

    //发送评论
    postComment(Content: any) {
        if (Content.commentContent.length < 5) {
            this.toast('亲，写的太简单了。要写够5个字才能正常发表评论。');
            return;
        }
        if (this.parentId == 0 && Content.commentContent.length > this.commentMax) {
            this.toast('评论字数最多为' + this.commentMax + '个');
            return;
        }
        if (this.parentId != 0 && Content.commentContent.length > this.replyMax) {
            this.toast('回复字数最多为' + this.replyMax + '个');
            return;
        }
        this.showLoading('发表中...');
        let url = this.apiUrls.getUrlPostStudyComment() + '/'
            + this.storageUtil.getOrgId() + '/'
            + this.storageUtil.getUserId() + '/'
            + Constants.COURSE_COMMENT + '/'
            + this.courseDetail.courseId;
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            objId: this.courseDetail.courseId,
            objType: Constants.COURSE_COMMENT,
            remark: Content.commentContent,
            parentId: this.parentId
        };
        this.httpUtil.post({
            url: url, param: params, success: (res) => {
                this.commentType = 1;
                this.pageNum = 1;
                this.courseComments = [];
                this.getCourseComment();
                this.commentView.closeCommentInput();
                this.parentId = 0;
            }, fail: (err) => {
                this.toast(err);
                this.dismissLoading();
            }, finish: () => {
            }
        });
    }

    //取消发送评论
    cancelInputComment() {
        this.parentId = 0;
    }

    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.showLoading();
            this.pageNum = 1;
        } else {
            this.pageNum = this.pageNum + 1;
        }
        this.getCourseComment(refresher);
    }

    //提交课程阅读记录
    submitCourseRead() {
        if(this.fromWhere==Constants.FROM_CLASS){
            this.submitClassCourseRead();
        }
        let url = this.apiUrls.getUrlOnLineCourseRead() + '/'
            + this.storageUtil.getOrgId() + '/'
            + this.storageUtil.getUserId() + '/'
            + this.courseDetail.courseId;
        this.httpUtil.post({
            url: url, success: (res) => {
                this.courseDetail.hasReaded = true;
                this.updateReadCourse();
            }, fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {

            }
        });
    }
    //提交班级学习记录
    submitClassCourseRead(){
      if(!this.courseDetail.hasReaded){
         if(this.classCourseState!=2){
             let urls=this.apiUrls.postWriteUserCourseHistory()+'/'+this.storageUtil.getOrgId()+'/'+this.storageUtil.getUserId()+'/'+this.courseItemId+'/'+this.classCourseState;
             let userCourseHistoryPVo={
                 courseItemId:this.courseItemId,
                 resourceId:this.courseId,
                 state:this.classCourseState
             };
             this.httpUtil.post({
                 url:urls,
                 param:userCourseHistoryPVo,
                 success:(res)=>{
                    this.courseDetail.hasReaded=true;
                    this.events.publish(EventsConstants.CLASS_STUDY_GREY);
                 },
                 fail:(res)=>{
                    this.toast(res.msg);
                 }});
         }
      } 
    }
    //更新数据库阅读记录
    updateReadCourse() {
        if (this.platform.is('mobile')) {
            this.dbUtils.selectByWhere({
                tableName: DBTableName.READ_COURSE_TABLE,
                where: 'courseId=' + this.courseDetail.courseId,
                success: (result) => {
                    if (result && result.length > 0) {

                    } else {
                        this.dbUtils.insert({
                            tableName: DBTableName.READ_COURSE_TABLE,
                            data: {
                                courseId: this.courseDetail.courseId
                            }, success: () => {
                                //通知列表页刷新数据
                                if (this.navParams.get('courseListIndex')) {
                                    this.events.publish(EventsConstants.REFRESH_COURSE_LIST, {
                                        refreshCode: this.navParams.get('refreshCode'),
                                        index: this.navParams.get('courseListIndex')
                                    });
                                }
                            }, error: (err) => {

                            }
                        });

                    }
                }, error: (err) => {
                }
            });
        }
    }

    //微信分享
    CourseShare() {
        let that = this;
        let sheetCtrl = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: '分享给好友',
                    handler: () => {
                        Wechat.share({
                            message: {
                                title: this.courseDetail.title,
                                description: this.courseDetail.description,
                                thumb: this.courseDetail.middleIcon,
                                media: {
                                    type: Wechat.Type.WEBPAGE,//分享链接
                                    webpageUrl: this.courseDetail.shareUrl
                                }
                            },
                            scene: Wechat.Scene.SESSION
                        }, function () {
                            that.toast('分享成功');
                            // let toast = that.toastController.create({
                            //     message: '分享成功',
                            //     duration: 2 * 1000
                            // });
                            // toast.present();
                        }, function (reason) {
                            that.toast(reason);
                            // let toast = that.toastController.create({
                            //     message: reason,
                            //     duration: 2 * 1000
                            // });
                            // toast.present();
                            // alert("Failed: " + reason);
                        });
                        console.log('分享给好友');
                    }
                }, {
                    text: '分享到朋友圈',
                    handler: () => {
                        Wechat.share({
                            message: {
                                title: this.courseDetail.title,
                                description: this.courseDetail.description,
                                thumb: this.courseDetail.middleIcon,
                                media: {
                                    type: Wechat.Type.WEBPAGE,//分享链接
                                    webpageUrl: this.courseDetail.shareUrl
                                }
                            },
                            scene: Wechat.Scene.TIMELINE
                        }, function () {
                            that.toast('分享成功');
                            // let toast = that.toastController.create({
                            //     message: '分享成功',
                            //     duration: 2 * 1000
                            // });
                            // toast.present();
                        }, function (reason) {
                            that.toast(reason);
                            // let toast = that.toastController.create({
                            //     message: reason,
                            //     duration: 2 * 1000
                            // });
                            // toast.present();
                            // alert("Failed: " + reason);
                        });
                        console.log('分享到朋友圈');
                    }
                }, {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel');
                    }
                }
            ]
        });
        sheetCtrl.present();
    }

    //下载课程
    downloadCourse() {
        if (this.courseDetail.downloadState == 0) {
            if (this.platform.is('mobile')) {
                this.courseDetail.downloadState = 1;
                let localPath = '';
                let fileName = this.courseDetail.downloadUrl.split('/')[this.courseDetail.downloadUrl.split('/').length - 1];
                if (this.platform.is('android')) {
                    localPath = this.fileUtils.getFileRootDirectory() + 'Android/data/com.ionicframework.schohybridsaas364607/download/' + fileName;
                } else if (this.platform.is('ios')) {
                    localPath = this.fileUtils.getFileDataDirectory() + fileName;
                }

                this.dbUtils.insert({
                    tableName: DBTableName.DOWNLOAD_COURSE_TABLE,
                    data: {
                        userId: this.storageUtil.getUserId(),
                        courseId: this.courseDetail.courseId,
                        downloadState: 1,
                        downloadLocalPath: localPath,
                        courseDetail: JSON.stringify(this.courseDetail)
                    },
                    success: () => {
                        this.fileUtils.download({
                            url: this.courseDetail.downloadUrl, localPath: localPath, success: () => {
                                this.courseDetail.downloadState = 2;
                                this.courseDetail.resUrl = localPath;
                                this.dbUtils.update({
                                    tableName: DBTableName.DOWNLOAD_COURSE_TABLE,
                                    data: {
                                        userId: this.storageUtil.getUserId(),
                                        courseId: this.courseDetail.courseId,
                                        downloadState: 2,
                                        downloadLocalPath: localPath,
                                        courseDetail: JSON.stringify(this.courseDetail)
                                    },
                                    where: 'userId="' + this.storageUtil.getUserId() + '" AND courseId=' + this.courseDetail.courseId,
                                    success: () => {
                                        //更新界面
                                        this.toast('课程' + '"' + this.courseDetail.title + '"下载完成');
                                    }
                                });
                            }, error: (err) => {
                                this.courseDetail.downloadState = 0;
                                this.dbUtils.delete({
                                    tableName: DBTableName.DOWNLOAD_COURSE_TABLE,
                                    where: 'userId="' + this.storageUtil.getUserId() + '" AND courseId=' + this.courseDetail.courseId
                                });
                                this.toast('下载失败,请重试');
                            }, progress: (progress) => {
                                if (progress.loaded / progress.total == 1) {
                                    this.courseDetail.downloadState = 2;
                                    this.courseDetail.resUrl = localPath;
                                }
                                this.downloadService.addCourseDownloadTask(this.courseDetail, progress);
                            }
                        });
                    }, error: (err) => {
                        this.courseDetail.downloadState = 0;
                    }
                });
            } else {
                this.toast('仅支持移动端下载...');
            }
        }
    }

    //离开视图前
    ionViewWillLeave() {
        //暂停音视频播放
        let videos = document.getElementsByTagName('video');
        if (videos && videos.length > 0) {
            for (let i = 0; i < videos.length; i++) {
                if (videos[i].paused == false) {
                    videos[i].pause();
                }
            }
        }
        let audios = document.getElementsByTagName('audio');
        if (audios && audios.length > 0) {
            for (let i = 0; i < audios.length; i++) {
                if (audios[i].paused == false) {
                    audios[i].pause();
                }
            }
        }
        // if (document.getElementById('courseAudio')) {
        //     let courseAudio = document.getElementById('courseAudio') as HTMLAudioElement;
        //     if (courseAudio.paused == false) {
        //         courseAudio.pause();
        //     }
        // }
    }

    //界面销毁
    ionViewWillUnload() {
        clearTimeout(this.markReadID);
        if (this.backFunction) {
            this.backFunction();
        }
    }
}
