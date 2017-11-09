import {TaskListVo} from '../../../models/task/TaskListVo';
/**
 * Created by zxh on 2016/12/13.
 */
import {Component, Injector, ViewChild} from "@angular/core";
import {CourseSearchPage} from "../course-search/course-search";
import {StudyBannerVo} from "../../../models/study/StudyBannerVo";
import {ColumnThemeVo} from "../../../models/study/ColumnThemeVo";
import {CourseMiniVo} from "../../../models/study/CourseMiniVo";
import {CourseDetailPage} from "../course-detail/course-detail";
import {MoreCoursePage} from "../more-course/more-course";
import {ColumnCoursePage} from "../column-course/column-course";
import {ThemeCoursePage} from "../theme-course/theme-course";
import {BasePage} from "../../../core/base-page/BasePage";
import {CourseRankPage} from "../course-rank/course-rank";
import {PublicCoursePage} from "../public-course/public-course";
import {ThemeColumnDetail} from "../theme-detail/theme-detail";
import {MoreRecommendPage} from "../more-recommend/more-recommend";
import {ShowHtmlPage} from "../show-html/show-html";
import {ShowImagePage} from "../show-image/show-image";
import {CategoryUtils} from "../CategoryUtils";
import {ClassBarcodePage} from "../../enterprise/class/class-barcode/class-barcode";
import {GameMorePage} from "../../game/game-more/game-more";
import {FamousTeacherPage} from "../famous-teacher/famous-teacher";
import {ConfigKey} from "../../../core/storage/ConfigKey";
import {DBUtils} from "../../../core/db/DBUtils";
import {DBTableName} from "../../../core/db/DBTableName";
import {Platform, Events} from "ionic-angular";
import {MemberRankPage} from "../../user-center/member-rank/member-rank";
import {MemberStatisticsPage} from "../../user-center/member-statistics/member-statistics";
import {EventsConstants} from "../../../core/EventsConstants";

@Component({
    selector: 'page-study-home',
    templateUrl: 'study-home.html'
})

//学习首页
export class StudyHomePage extends BasePage {

    @ViewChild('StudyHomeContent') StudyHomeContent;

    public pageTitle: string = '课程';

    private REFRESH_CODE = 'StudyHomePage';//已读置灰刷新列表通知Code

    private studyModuleConfig: any;

    public studyBanners: Array<StudyBannerVo> = [];
    public columnThemes: Array<ColumnThemeVo> = [];
    public courseList: Array<CourseMiniVo> = [];
    public taskItems: Array<TaskListVo> = [];

    private pageNum: number = 1;
    private pageSize: number = 10;
    public canLoadMore: boolean = false;

    //模块配置标识位
    public studyTop: boolean = false;
    public courseSearch: boolean = false;
    public scan: boolean = false;
    public banner: boolean = false;
    public shortcuts: any = [];//快捷方式
    public studyTask: boolean = false;
    public recommend: boolean = false;
    public newCourse: boolean = false;
    public hasMoreRecommend: boolean = false;
    public hasMoreCourse: boolean = false;

    public studyTaskName: string = '学习任务';//任务栏名称
    public recommendName: string = '推荐栏目主题';//推荐栏目主题标题名
    public newCourseName: string = '最新课程';//最新课程标题名

    public static TASK_UNFINISHED = 1;//待办任务
    studyBannerSlides = {
        autoplay: 3000,
        initialSlides: 0,
        loop: true,
        speed: 1000,
        pager: true,
        autoplayDisableOnInteraction: false
    }
    taskSlides = {
        autoplay: 3000,
        pager: false,
        loop: true,
        direction: 'vertical',
        autoplayDisableOnInteraction: false
    }

    constructor(injector: Injector,
                private dbUtils: DBUtils,
                private platform: Platform,
                private events: Events) {
        super(injector);
        this.showLoading();
        this.getStudyModuleConfig();
        this.initPage();
        this.events.subscribe(EventsConstants.REFRESH_COURSE_LIST, (date) => {
            // alert(JSON.stringify(date));
            if (date && date.length > 0) {
                if (date[0].refreshCode == this.REFRESH_CODE) {
                    this.courseList[date[0].index].isRead = true;
                }
            }
        });
    }

    ionViewDidEnter(){
        this._app.setTitle(this.pageTitle);
    }

    //回到顶部
    toTop() {
        this.StudyHomeContent.scrollToTop();
    }

    //获取学习页配置
    getStudyModuleConfig() {
        let moduleConfig = this.storageUtil.getModuleConfig();
        for (let i in moduleConfig) {
            let itemConfig = moduleConfig[i];
            if (itemConfig.moduleCode == 'MODEL_CONFIG_STUDY') {
                let modulePageConfigs: any = itemConfig.modulePageConfgs;
                //功能模块配置
                for (let j in modulePageConfigs) {
                    let modulePageItem = modulePageConfigs[j];
                    if (modulePageItem.pageCode == 'MODEL_CONFIG_STUDY_COURSE_PAGE') {
                        this.studyModuleConfig = modulePageItem;
                        this.pageTitle = modulePageItem.pageName || this.pageTitle;
                    }
                }
                //属性信息配置
                for (let k in itemConfig.attributes) {
                    let attribute = itemConfig.attributes[k];
                    if (attribute.attrCode == 'COMMENT_MAX_LENGTH') {//课程评论字数限制
                        if (attribute.attrValue) {
                            this.storageUtil.setStorageValue(ConfigKey.COURSE_COMMENT_MAX, attribute.attrValue as number);
                        } else {
                            this.storageUtil.setStorageValue(ConfigKey.COURSE_COMMENT_MAX, 200);
                        }
                    } else if (attribute.attrCode == 'COMMENT_REPLY_MAX_LENGTH') {//课程评论回复字数限制
                        if (attribute.attrValue) {
                            this.storageUtil.setStorageValue(ConfigKey.COURSE_COMMENT_REPLY_MAX, attribute.attrValue as number);
                        } else {
                            this.storageUtil.setStorageValue(ConfigKey.COURSE_COMMENT_REPLY_MAX, 200);
                        }
                    }
                }
            }
        }
    }

    //根据配置初始化页面
    initPage() {
        if (this.studyModuleConfig) {
            //功能配置
            for (let k in this.studyModuleConfig.modulePageItemConfgs) {
                let pageItem = this.studyModuleConfig.modulePageItemConfgs[k];
                switch (pageItem.itemCode) {
                    case 'FUN_STUDY_COURSE_PAGE_TOP'://课程Top区
                        this.studyTop = true;
                        for (let n in pageItem.subPageItemConfigs) {
                            let subPageItem = pageItem.subPageItemConfigs[n];
                            if (subPageItem.itemCode == 'FUN_STUDY_COURSE_PAGE_TOP_QY') {//查询功能
                                this.courseSearch = true;
                            } else if (subPageItem.itemCode == 'FUN_STUDY_COURSE_PAGE_TOP_QR') {//扫描功能
                                this.scan = true;
                            }
                        }
                        break;
                    case 'FUN_STUDY_COURSE_PAGE_BANNER'://课程BANNER
                        this.banner = true;
                        this.getBanner();
                        break;
                    case 'FUN_STUDY_COURSE_PAGE_SHOTCUT'://课程快捷区
                        for (let n in pageItem.subPageItemConfigs) {
                            let subPageItem = pageItem.subPageItemConfigs[n];
                            let shortcut = {'itemCode': '', 'itemName': '', 'imgUrl': '', 'requestCode': ''};
                            shortcut.itemCode = subPageItem.itemCode;
                            shortcut.itemName = subPageItem.itemName;
                            for (let m in subPageItem.attributes) {
                                let attribute = subPageItem.attributes[m];
                                if (attribute.attrCode == 'STUDY_COURSE_PAGE_SHOTCUT_ICON') {
                                    shortcut.imgUrl = attribute.attrValue;
                                } else if (attribute.attrCode == 'REQUEST_PARAM') {
                                    shortcut.requestCode = attribute.attrValue;
                                }
                            }
                            this.shortcuts[n] = shortcut;
                        }
                        break;
                    case 'FUN_STUDY_COURSE_PAGE_MY_TASK'://学习任务
                        this.studyTask = true;
                        this.studyTaskName = pageItem.itemName || this.studyTaskName;
                        this.getTask();
                        break;
                    case 'FUN_STUDY_COURSE_PAGE_SUGGEST'://精华推荐区
                        this.recommend = true;
                        this.recommendName = pageItem.itemName || this.recommendName;
                        this.getRecommend();
                        break;
                    case 'FUN_STUDY_COURSE_PAGE_NEW'://最新课程
                        this.newCourse = true;
                        this.newCourseName = pageItem.itemName || this.newCourseName;
                        this.getCourseList();
                        break;
                }
            }

            //属性信息配置
            for (let j in this.studyModuleConfig.attributes) {
                let attribute = this.studyModuleConfig.attributes[j];
                if (attribute.attrCode == 'STUDY_COURSE_COLLECT_BUTTON') {//课程详情收藏按钮
                    if (attribute.attrValue == 'N') {
                        this.storageUtil.setStorageValue(ConfigKey.STUDY_COURSE_COLLECT, false);
                    } else {
                        this.storageUtil.setStorageValue(ConfigKey.STUDY_COURSE_COLLECT, true);
                    }
                } else if (attribute.attrCode == 'STUDY_COURSE_APPRAISE_BUTTON') {//课程详情点赞按钮
                    if (attribute.attrValue == 'N') {
                        this.storageUtil.setStorageValue(ConfigKey.STUDY_COURSE_APPRAISE, false);
                    } else {
                        this.storageUtil.setStorageValue(ConfigKey.STUDY_COURSE_APPRAISE, true);
                    }
                } else if (attribute.attrCode == 'STUDY_COURSE_DOWNLOAD_BUTTON') {//课程详情下载按钮
                    if (attribute.attrValue == 'N') {
                        this.storageUtil.setStorageValue(ConfigKey.STUDY_COURSE_DOWNLOAD, false);
                    } else {
                        this.storageUtil.setStorageValue(ConfigKey.STUDY_COURSE_DOWNLOAD, true);
                    }
                }
            }
        }
        if (this.newCourse == false) {
            this.dismissLoading();
        }
    }

    //快捷方式点击事件
    shortcutClick(shortcut: any) {
        switch (shortcut.itemCode) {
            case 'FUN_STUDY_COURSE_PAGE_SHOTCUT_LM':      // 栏目
                this.navController.push(ColumnCoursePage, {pageTitle: shortcut.itemName, reqParam: shortcut.requestCode});
                break;
            case 'FUN_STUDY_COURSE_PAGE_SHOTCUT_ZT':      //主题
                this.navController.push(ThemeCoursePage, {pageTitle: shortcut.itemName, reqParam: shortcut.requestCode});
                break;
            case 'FUN_STUDY_COURSE_PAGE_SHOTCUT_KCXS':    //课程形式
                this.navController.push(MoreCoursePage, {pageTitle: shortcut.itemName, reqParam: shortcut.requestCode});
                break;
            case 'FUN_STUDY_COURSE_PAGE_SHOTCUT_KCPH':    // 课程排行
                this.navController.push(CourseRankPage);
                break;
            case 'MODEL_CONFIG_COMPANY_JOB_PAGE':         // 任务

                break;
            case 'MODEL_CONFIG_COMPANY_CLASS_PAGE':       //班级

                break;
            case 'FUN_MINE_PAGE_STUDY_RANK':              // 学习排行
                this.navController.push(MemberRankPage);
                break;
            case 'FUN_MINE_PAGE_STUDY_STATISTICS':        // 学习统计
                this.navController.push(MemberStatisticsPage);
                break;
            case 'FUN_STUDY_COURSE_PAGE_SHOTCUT_CP':      // 测评

                break;
            case 'FUN_STUDY_COURSE_PAGE_SHOTCUT_TAG':     // 课程标签
                this.navController.push(CourseSearchPage, {reqParam: shortcut.requestCode});
                break;
            case 'FUN_STUDY_COURSE_PAGE_SHOTCUT_COMMUNITY'://圈子

                break;
            case 'FUN_STUDY_COURSE_PAGE_SHOTCUT_GAME':    // 闯关
                this.navController.push(GameMorePage);
                break;
            case 'MODEL_CONFIG_COMPANY_MESSAGE_PAGE':     // 资讯

                break;
            case 'FUN_STUDY_COURSE_PAGE_SHOTCUT_GKK':     //公开课
                this.navController.push(PublicCoursePage, {
                    pageTitle: shortcut.itemName,
                    reqParam: shortcut.requestCode
                });
                break;
            case 'FUN_STUDY_COURSE_PAGE_SHOTCUT_TSG':     //图书馆

                break;
            case 'FUN_STUDY_COURSE_PAGE_SHOTCUT_MSB':     //名师榜
                this.navController.push(FamousTeacherPage, {
                    pageTitle: shortcut.itemName,
                });
                break;
            case 'FUN_STUDY_COURSE_PAGE_SHOTCUT_ZXHD':    //在线活动

                break;
            case 'FUN_STUDY_COURSE_PAGE_SHOTCUT_CELEBRITY'://草根明星

                break;
        }
    }

    //获取活动页
    getBanner() {
        let url = this.apiUrls.getUrlStudyBannerLs();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            pageNum: 1,
            pageSize: 20
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                if (res == null || res == '') {
                    this.banner = false;
                    return;
                }
                this.studyBanners = res.result;
            }, fail: (err) => {
                this.toast(err.msg);
                this.banner = false;
            }
        });
    }

    //得到待办任务
    getTask() {
        let param = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            page: 1,
            pageSize: 10,
            state: 1 //待办任务
        }
        this.httpUtil.get({
            url: this.apiUrls.getTaskList(),
            param: param,
            success: data => {
                console.log(data);

                this.taskItems = data.result;
            },
            fail: error => {
                this.toast(error.msg);
            }
        });
    }

    //获取推荐栏目主题
    getRecommend() {
        let url = this.apiUrls.getUrlRecommendLs();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            personGrpId: this.storageUtil.getPersonGrpId(),
            pageNum: 1,
            pageSize: 4
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                if (res == null || res == '') {
                    this.recommend = false;
                    this.hasMoreRecommend = false;
                    return;
                }
                this.columnThemes = res.result;
                if (this.columnThemes.length >= 4) {
                    this.hasMoreRecommend = true;
                } else {
                    this.hasMoreRecommend = false;
                }
            }, fail: (err) => {
                this.toast(err.msg);
                this.recommend = false;
                this.hasMoreRecommend = false;
            }
        });
    }

    //获取课程列表
    getCourseList(refresher?: any) {
        let url = this.apiUrls.getUrlCourseLs();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            personGrpId: this.storageUtil.getPersonGrpId(),
            pageNum: this.pageNum,
            pageSize: this.pageSize
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                if (this.pageNum == 1) {
                    this.courseList = [];
                }
                if (res.result == null || res.result == '') {
                    this.canLoadMore = false;
                    this.hasMoreCourse = false;
                    return;
                }
                this.courseList = this.courseList.concat(res.result);
                for (let i = (this.pageNum - 1) * this.pageSize; i < this.courseList.length; i++) {
                    this.getCourseReadState(i);
                }
                if (res.result.length >= this.pageSize) {
                    this.canLoadMore = true;
                    this.hasMoreCourse = true;
                } else {
                    this.canLoadMore = false;
                    this.hasMoreCourse = false;
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

    getCategoryCss(categoryName: string) {
        return CategoryUtils.getCategoryCss(categoryName);
    }

    //点击Banner
    clickBanner(studyBannerVo: StudyBannerVo) {
        switch (studyBannerVo.objType) {
            case 1://链接
                this.navController.push(ShowHtmlPage, {url: studyBannerVo.activityUrl, pageTitle: studyBannerVo.title});
                break;
            case 2://课程
                this.navController.push(CourseDetailPage, {courseId: studyBannerVo.objId});
                break;
            case 3://图片
                this.navController.push(ShowImagePage, {url: studyBannerVo.bigIcon, pageTitle: studyBannerVo.title});
                break;
            case 4://活动

                break;
        }
    }

    //跳转课程搜索
    toCourseSearch() {
        this.navController.push(CourseSearchPage);
    }

    //跳转到课程详情
    toCourseDetail(index: number) {
        this.navController.push(CourseDetailPage, {
            courseId: this.courseList[index].courseId,
            courseListIndex: index,
            refreshCode: this.REFRESH_CODE
        });
    }

    //跳转到栏目主题详情
    toColumnOrThemeDetail(studyTopic: ColumnThemeVo) {
        this.navController.push(ThemeColumnDetail, {studyTopic: studyTopic});
    }

    //跳转到更多推荐栏目主题
    toMoreRecommend() {
        this.navController.push(MoreRecommendPage, {pageTitle: this.recommendName});
    }

    //跳转更多课程
    toMoreCourse() {
        this.navController.push(MoreCoursePage, {pageTitle: '全部课程'});
    }

    doRefresh(refresher, isRefresh: boolean) {
        if (this.newCourse == true) {
            if (isRefresh) {
                this.showLoading();
                this.pageNum = 1;
            } else {
                this.pageNum = this.pageNum + 1;
            }
            this.getCourseList(refresher);
        } else {
            refresher.complete();
        }
    }

    //扫描二维码
    goBarcodeScanner() {
        this.navController.push(ClassBarcodePage, {fromType: 1});
    }

    //获取课程已读状态
    getCourseReadState(index: number) {
        this.platform.ready().then(() => {
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
        });
    }

    //界面销毁
    ionViewWillUnload() {
        this.events.unsubscribe(EventsConstants.REFRESH_COURSE_LIST);
    }
}
