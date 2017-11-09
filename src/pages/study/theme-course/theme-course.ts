/**
 * Created by zxh on 2016/12/21.
 */
import {Component, Injector} from "@angular/core";
import {ColumnThemeVo} from "../../../models/study/ColumnThemeVo";
import {TopicSeriesVo} from "../../../models/study/TopicSeriesVo";
import {ThemeColumnDetail} from "../theme-detail/theme-detail";
import {ThemeColumnSearchPage} from "../theme-column-search/theme-column-search";
import {BasePage} from "../../../core/base-page/BasePage";

@Component({
    selector: 'page-theme-course',
    templateUrl: 'theme-course.html'
})

//主题课程
export class ThemeCoursePage extends BasePage{

    public pageTitle: string = '主题';
    private reqParam: string = '';
    public hasClassifyLs: boolean = true;//是否含有分类
    public themeClassifyLs: any = [];
    public contentFlag: string = '';
    public selectClassifyId: string = '';

    private pageNum: number = 1;
    private classifyPageSize: number = 5;
    private seriesPageSize: number = 10;
    public canLoadMore: boolean = true;

    public themeClassifyList: Array<TopicSeriesVo> = [];
    public themeSeriesList: Array<ColumnThemeVo> = [];

    constructor(injector: Injector) {
        super(injector);
        this.pageTitle = this.navParams.get('pageTitle') || this.pageTitle;
        this.reqParam = this.navParams.get('reqParam');
        this.showLoading();
        this.getThemeType();
    }

    //获取主题分类
    getThemeType() {
        let url = this.apiUrls.getUrlClassOrSeriesLs();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            personGrpId: this.storageUtil.getPersonGrpId(),
            topicalColumnType: 1,
            reqParam: this.reqParam
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                this.themeClassifyLs = res.result.contentInfo;
                this.contentFlag = res.result.contentFlag;
                if (this.themeClassifyLs != null && this.themeClassifyLs.length > 0) {
                    this.hasClassifyLs = true;
                    this.selectClassifyId = this.themeClassifyLs[0].seriesId;
                    if (this.contentFlag == 'CLASS') {//分类
                        this.getClassifyTheme();
                    } else if (this.contentFlag == 'SERIES') {//系列
                        this.getSeriesTheme();
                    } else {
                        this.dismissLoading();
                    }
                } else {
                    this.hasClassifyLs = false;
                    this.dismissLoading();
                }
            }, fail: (err) => {
                this.toast(err.msg);
                this.dismissLoading();
            }
        })
    }

    //获取分类主题
    getClassifyTheme(refresher?: any) {
        let url = this.apiUrls.getUrlSeriesLsWithTopicVoLs();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            personGrpId: this.storageUtil.getPersonGrpId(),
            seriesParentId: this.selectClassifyId,
            pageNum: this.pageNum,
            pageSize: this.classifyPageSize
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                if (this.pageNum == 1) {
                    this.themeClassifyList = [];
                    this.themeSeriesList = [];
                }
                if(res == null || res == ''){
                    this.canLoadMore = false;
                    return;
                }
                this.themeClassifyList = this.themeClassifyList.concat(res.result);
                if (res.result.length >= this.classifyPageSize) {
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

    //获取系列主题
    getSeriesTheme(refresher?: any) {
        let url = this.apiUrls.getUrlSeriesTopicVoLs();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            personGrpId: this.storageUtil.getPersonGrpId(),
            seriesId: this.selectClassifyId,
            pageNum: this.pageNum,
            pageSize: this.seriesPageSize
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                if (this.pageNum == 1) {
                    this.themeClassifyList = [];
                    this.themeSeriesList = [];
                }
                if(res.result == null || res.result == ''){
                    this.canLoadMore = false;
                    return;
                }
                this.themeSeriesList = this.themeSeriesList.concat(res.result);
                let topicSeriesVo = new TopicSeriesVo();
                topicSeriesVo.studyTopicVoLs = this.themeSeriesList;
                this.themeClassifyList[0] = topicSeriesVo;
                if (res.result.length >= this.seriesPageSize) {
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

    //选择分类
    selectClassify(classifyId: string) {
        if (this.selectClassifyId == classifyId) {
            return;
        }
        this.selectClassifyId = classifyId;
        this.pageNum = 1;
        if (this.contentFlag == 'CLASS') {//分类
            this.showLoading();
            this.getClassifyTheme();
        } else if (this.contentFlag == 'SERIES') {//系列
            this.showLoading();
            this.getSeriesTheme();
        }
    }

    //到主题详情
    toThemeDetail(studyTopic: ColumnThemeVo) {
        this.navController.push(ThemeColumnDetail, {studyTopic: studyTopic});
    }

    //栏目主题
    searchTheme(searchKey: string){
        if (searchKey == null || searchKey == '') {
            this.toast('请输入搜索关键字');
            return;
        }
        this.navController.push(ThemeColumnSearchPage, {searchKey: searchKey,searchType: 1});
    }

    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.showLoading();
            this.pageNum = 1;
        } else {
            this.pageNum = this.pageNum + 1;
        }
        if (this.contentFlag == 'CLASS') {//分类
            this.getClassifyTheme(refresher);
        } else if (this.contentFlag == 'SERIES') {//系列
            this.getSeriesTheme(refresher);
        }
    }

}
