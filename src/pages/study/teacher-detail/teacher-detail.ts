/**
 * Created by zxh on 2017/1/16.
 */
import {Component, Injector, ViewChild} from "@angular/core";
import {BasePage} from "../../../core/base-page/BasePage";
import {Slides, Platform, Events} from "ionic-angular";
import {CourseMiniVo} from "../../../models/study/CourseMiniVo";
import {CategoryUtils} from "../CategoryUtils";
import {CourseDetailPage} from "../course-detail/course-detail";
import {EmojiUtils} from "../../../core/EmojiUtils";
import {ColumnThemeVo} from "../../../models/study/ColumnThemeVo";
import {ThemeColumnDetail} from "../theme-detail/theme-detail";
import {Constants} from "../../../core/Constants";
import {CommentView} from "../../../components/comment-view/comment-view";
import {ShowBigImgPage} from "../../../core/show-bigimg-page/show-bigimg-page";
import {DBTableName} from "../../../core/db/DBTableName";
import {DBUtils} from "../../../core/db/DBUtils";
import {FileUtils} from "../../../core/FileUtils";
import {EventsConstants} from "../../../core/EventsConstants";
@Component({
    selector: 'teacher-detail-page',
    templateUrl: 'teacher-detail.html'
})
//名师详情
export class TeacherDetail extends BasePage {

    @ViewChild('Slides') slider: Slides;
    @ViewChild('CommentView') commentView: CommentView;//评论控件

    private REFRESH_CODE = 'TeacherDetail';//已读置灰刷新列表通知Code

    public pageTitle: string = '名师详情';

    public fromWhere: number = Constants.TEACHER_FROM_FAMOUS;//来自哪，标识

    public isShowColumn: boolean = false;//是否显示专栏

    public teacherDetail: any;
    public labels: any = [];

    public selectTabNum = 0;//0,基本信息 1,课程 3,专栏 4,留言

    public courseList: Array<CourseMiniVo> = [];//课程列表
    private coursePageNum: number = 1;//课程页码
    private coursePageSize: number = 10;//课程每页个数
    public courseCanLoadMore: boolean = false;//课程是否可加载更多
    public courseTotalCount: number = 0;//课程总数

    public columnList: any = [];//专栏列表
    private columnPageNum: number = 1;//专栏页码
    private columnPageSize: number = 10;//专栏每页个数
    public columnCanLoadMore: boolean = false;//专栏是否可加载更多
    public columnTotalCount: number = 0;//专栏总数

    public messageList: any = [];//留言列表
    private messagePageNum: number = 1;//留言页码
    private messagePageSize: number = 10;//留言每页个数
    public messageCanLoadMore: boolean = false;//留言是否可加载更多
    public messageTotalCount: number = 0;//留言总数

    public canRefresh: boolean = false;//是否允许刷新
    public canLoadMore: boolean = false;//是否可加载更多

    private parentId: string = '';//留言对象ID（回复的对象，默认第一级留言可以不填该参数）
    private commentImgs: any = [];//评论图片本地地址
    private imgUrls: any = [];//上传成功图片服务器地址

    constructor(injector: Injector,
                private emojiUtils: EmojiUtils,
                private dbUtils: DBUtils,
                private platform: Platform,
                private fileUtils: FileUtils,
                private events: Events) {
        super(injector);
        this.teacherDetail = this.navParams.get('teacher');
        this.fromWhere = this.navParams.get('fromWhere') || this.fromWhere;
        if (this.fromWhere == Constants.TEACHER_FROM_THEME) {
            this.isShowColumn = true;
            this.pageTitle = '版主详情';
        }
        if (this.teacherDetail.label) {
            this.labels = this.teacherDetail.label.split(',');
        }
        this.events.subscribe(EventsConstants.REFRESH_COURSE_LIST, (date) => {
            if (date && date.length > 0) {
                if (date[0].refreshCode == this.REFRESH_CODE) {
                    this.courseList[date[0].index].isRead = true;
                }
            }
        });
    }

    selectTab(selectTabNum: number) {
        if (selectTabNum == this.selectTabNum) {
            return;
        }
        this.selectTabNum = selectTabNum;
        // if (this.isShowColumn == false && selectTabNum == 3) {
        //     selectTabNum--;
        // }
        // this.slider.slideTo(selectTabNum);
        switch (selectTabNum) {
            case 0:
                this.canRefresh = false;
                this.canLoadMore = false;
                break;
            case 1:
                this.canRefresh = true;
                this.canLoadMore = this.courseCanLoadMore;
                if (this.courseList.length < 1) {
                    this.showLoading();
                    this.getCourseList();
                }
                break;
            case 2:
                this.canRefresh = true;
                this.canLoadMore = this.columnCanLoadMore;
                if (this.columnList.length < 1) {
                    this.showLoading();
                    this.getTeacherColumn();
                }
                break;
            case 3:
                this.canRefresh = true;
                this.canLoadMore = this.messageCanLoadMore;
                if (this.messageList.length < 1) {
                    this.showLoading();
                    this.getTeacherMessage();
                }
                break;
        }
    }

    onSlideChanged() {
        this.selectTabNum = this.slider.getActiveIndex();
        if (this.isShowColumn == false && this.selectTabNum == 2) {
            this.selectTabNum++;
        }
        switch (this.selectTabNum) {
            case 0:
                this.canRefresh = false;
                this.canLoadMore = false;
                break;
            case 1:
                this.canRefresh = true;
                this.canLoadMore = this.courseCanLoadMore;
                if (this.courseList.length < 1) {
                    this.showLoading();
                    this.getCourseList();
                }
                break;
            case 2:
                this.canRefresh = true;
                this.canLoadMore = this.columnCanLoadMore;
                if (this.columnList.length < 1) {
                    this.showLoading();
                    this.getTeacherColumn();
                }
                break;
            case 3:
                this.canRefresh = true;
                this.canLoadMore = this.messageCanLoadMore;
                if (this.messageList.length < 1) {
                    this.showLoading();
                    this.getTeacherMessage();
                }
                break;
        }
    }

    //获取名师课程
    getCourseList(refresher?: any) {
        let url = this.apiUrls.getUrlTeacherCourseList();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            teacherId: this.teacherDetail.id,
            pageNum: this.coursePageNum,
            pageSize: this.coursePageSize
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                if (this.coursePageNum == 1) {
                    this.courseList = [];
                }
                if (res.result == null || res.result == '') {
                    this.courseCanLoadMore = false;
                    this.canLoadMore = false;
                    return;
                }
                this.courseList = this.courseList.concat(res.result);
                for (let i = (this.coursePageNum - 1) * this.coursePageSize; i < this.courseList.length; i++) {
                    this.getCourseReadState(i);
                }
                this.courseTotalCount = res.totalCount;
                if (res.result.length >= this.coursePageSize) {
                    this.courseCanLoadMore = true;
                    this.canLoadMore = true;
                } else {
                    this.courseCanLoadMore = false;
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

    //获取课程已读状态
    getCourseReadState(index: number) {
        if (this.platform.is('mobile')) {
            this.dbUtils.selectByWhere({
                tableName: DBTableName.READ_COURSE_TABLE,
                where: 'courseId = ' + this.courseList[index].courseId,
                success: (result) => {
                    if (result.length > 0) {
                        this.courseList[index].isRead = true;
                    } else {
                        this.courseList[index].isRead = false;
                    }
                }
            });
        } else {
            this.courseList[index].isRead = false;
        }
    }

    getCategoryCss(categoryName: string) {
        return CategoryUtils.getCategoryCss(categoryName);
    }

    //表情标签转图片
    transSmiles(commentContent: string) {
        return this.emojiUtils.transSmiles(commentContent);
    }

    //跳转到课程详情
    toCourseDetail(index: number) {
        this.navController.push(CourseDetailPage, {courseId: this.courseList[index].courseId, courseListIndex: index, refreshCode: this.REFRESH_CODE});
    }

    //获取名师专栏
    getTeacherColumn(refresher?: any) {
        let url = this.apiUrls.getUrlTeacherColumnList();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            teacherId: this.teacherDetail.id,
            pageNum: this.columnPageNum,
            pageSize: this.columnPageSize
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                if (this.columnPageNum == 1) {
                    this.columnList = [];
                }
                if (res.result == null || res.result == '') {
                    this.columnCanLoadMore = false;
                    this.canLoadMore = false;
                    return;
                }
                this.columnList = this.columnList.concat(res.result);
                this.columnTotalCount = res.totalCount;
                if (res.result.length >= this.columnPageSize) {
                    this.columnCanLoadMore = true;
                    this.canLoadMore = true;
                } else {
                    this.columnCanLoadMore = false;
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

    //跳转到栏目主题详情
    toColumnOrThemeDetail(studyTopic: ColumnThemeVo) {
        this.navController.push(ThemeColumnDetail, {studyTopic: studyTopic});
    }

    //获取名师留言
    getTeacherMessage(refresher?: any) {
        let url = this.apiUrls.getUrlTeacherMessgeList();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            teacherId: this.teacherDetail.id,
            orderType: '01',//01最新（默认）  02最热
            pageNum: this.messagePageNum,
            pageSize: this.messagePageSize
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                if (this.messagePageNum == 1) {
                    this.messageList = [];
                }
                if (res.result == null || res.result == '') {
                    this.messageCanLoadMore = false;
                    this.canLoadMore = false;
                    return;
                }
                this.messageList = this.messageList.concat(res.result);
                this.messageTotalCount = res.totalCount;
                if (res.result.length >= this.messagePageSize) {
                    this.messageCanLoadMore = true;
                    this.canLoadMore = true;
                } else {
                    this.messageCanLoadMore = false;
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

    //查看评论大图
    showBigImage(imgUrls: any, index: number) {
        this.navController.push(ShowBigImgPage, {imgUrls: imgUrls, selectImgNum: index});
    }

    doRefresh(refresher, isRefresh: boolean) {
        switch (this.selectTabNum) {
            case 0:

                break;
            case 1:
                if (isRefresh) {
                    this.showLoading();
                    this.coursePageNum = 1;
                } else {
                    this.coursePageNum = this.coursePageNum + 1;
                }
                this.getCourseList(refresher);
                break;
            case 2:
                if (isRefresh) {
                    this.showLoading();
                    this.columnPageNum = 1;
                } else {
                    this.columnPageNum = this.columnPageNum + 1;
                }
                this.getTeacherColumn(refresher);
                break;
            case 3:
                if (isRefresh) {
                    this.showLoading();
                    this.messagePageNum = 1;
                } else {
                    this.messagePageNum = this.messagePageNum + 1;
                }
                this.getTeacherMessage(refresher);
                break;
        }
    }

    private commentContent = '';

    postComment(content: any) {
        this.commentImgs = content.imageUrls;
        this.commentContent = content.commentContent;
        if (!this.commentContent || this.commentContent == '') {
            this.toast('请输入留言内容');
            return;
        }
        this.showLoading('发表中...');
        if (this.commentImgs && this.commentImgs.length > 0) {
            //上传图片
            this.postCommentImages();
        } else {
            this.postTeacherMessage();
        }
    }

    private uploadImageNum = 0;

    postCommentImages() {
        for (let i = 0; i < this.commentImgs.length; i++) {
            this.fileUtils.upload({
                url: this.apiUrls.getBasePath() + '/sysOssUpload/uploadFile/' + this.storageUtil.getOrgId() + '/' + this.storageUtil.getUserId(),
                localPath: this.commentImgs[i],
                success: (response) => {
                    this.uploadImageNum++;
                    if (response && response.code == 0) {
                        this.imgUrls[i] = response.result;
                    }
                    if (this.uploadImageNum == this.commentImgs.length) {
                        this.postTeacherMessage();
                    }
                },
                error: () => {
                    this.uploadImageNum++;
                    if (this.uploadImageNum == this.commentImgs.length) {
                        this.postTeacherMessage();
                    }
                }
            });
        }
    }

    cancelInputComment() {
        this.parentId = '';
    }

    //评论回复
    replyInput(parentId: string) {
        this.commentView.showInput(false, false, false);
        this.parentId = parentId;
    }

    //发送讲师留言评论
    postTeacherMessage() {
        let url = this.apiUrls.getUrlTeacherMessageComment() +
            '/' + this.storageUtil.getOrgId() +
            '/' + this.storageUtil.getUserId() +
            '/' + this.teacherDetail.id;
        let params = {
            parentId: this.parentId,
            imgURLs: this.imgUrls,
            content: this.commentContent
        };
        this.httpUtil.post({
            url: url, param: params, success: (res) => {
                this.parentId = '';
                this.commentImgs = [];
                this.commentContent = '';
                this.imgUrls = [];
                this.commentView.closeCommentInput();
                this.messagePageNum = 1;
                this.messageList = [];
                this.getTeacherMessage();
                this.toast('留言成功');
            }, fail: (err) => {
                this.toast(err.msg);
                this.dismissLoading();
            }, finish: () => {
            }
        });
    }
}
