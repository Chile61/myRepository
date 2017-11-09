/**
 * Created by zxh on 2016/12/20.
 */
import {Component, Injector} from "@angular/core";
import {ColumnThemeVo} from "../../../models/study/ColumnThemeVo";
import {ThemeColumnDetail} from "../theme-detail/theme-detail";
import {ThemeColumnSearchPage} from "../theme-column-search/theme-column-search";
import {BasePage} from "../../../core/base-page/BasePage";

@Component({
    selector: 'page-column-course',
    templateUrl: 'column-course.html'
})

//栏目课程
export class ColumnCoursePage extends BasePage{

    public pageTitle: string = '栏目';
    public showTitle: boolean = false;
    private reqParam: string = '';
    public suggestTopicBanners: Array<ColumnThemeVo> = [];
    public columnClassifyLs: any = [];
    public selectClassifyId: string = '';
    public columnList: Array<ColumnThemeVo> = [];

    private pageNum: number = 1;
    private pageSize: number = 10;
    public canLoadMore: boolean = true;

    bannerSlides = {
        autoplay: 3000,
        initialSlides: 0,
        loop: true,
        speed: 1000,
        pager: true,
        autoplayDisableOnInteraction: false
    }

    constructor(injector: Injector) {
        super(injector);
        this.pageTitle = this.navParams.get('pageTitle') || this.pageTitle;
        this.reqParam = this.navParams.get('reqParam');
        this.showLoading();
        this.getColumnBanner();
        this.getColumnType();
    }

    //获取栏目Banner
    getColumnBanner() {
        let url = this.apiUrls.getUrlRecommendLs();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            personGrpId: this.storageUtil.getPersonGrpId(),
            topicalColumnType: 2,
            pageNum: 1,
            pageSize: 10
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                this.suggestTopicBanners = res.result;
            }, fail: (err) => {
                this.toast(err.msg);
                this.dismissLoading();
            }
        });
    }

    //获取栏目分类
    getColumnType() {
        let url = this.apiUrls.getUrlClassOrSeriesLs();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            personGrpId: this.storageUtil.getPersonGrpId(),
            topicalColumnType: 2,
            reqParam: this.reqParam
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                if (res.result != null && res.result != '') {
                    if (res.result.contentInfo != null && res.result.contentInfo.length > 0) {
                        this.showTitle = false;
                        this.columnClassifyLs = res.result.contentInfo;
                        this.selectClassifyId = this.columnClassifyLs[0].seriesId;
                    } else {
                        this.showTitle = true;
                    }
                    this.getColumnList();
                }
            }, fail: (err) => {
                this.toast(err.msg);
                this.dismissLoading();
            }
        })
    }

    //获取栏目列表
    getColumnList(refresher?: any) {
        let url = this.apiUrls.getUrlNewestColumnLs();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            personGrpId: this.storageUtil.getPersonGrpId(),
            seriesParentId: this.selectClassifyId,
            pageNum: this.pageNum,
            pageSize: this.pageSize
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                if (this.pageNum == 1) {
                    this.columnList = [];
                }
                if(res.result == null || res.result == ''){
                    this.canLoadMore = false;
                    return;
                }
                this.columnList = this.columnList.concat(res.result);
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
        })
    }

    //选择分类
    selectClassify(classifyId: string) {
        if (this.selectClassifyId == classifyId) {
            return;
        }
        this.selectClassifyId = classifyId;
        this.showLoading();
        this.pageNum = 1;
        this.getColumnList();
    }

    //到栏目详情
    toColumnDetail(studyTopic: ColumnThemeVo) {
        this.navController.push(ThemeColumnDetail, {studyTopic: studyTopic});
    }

    //搜索栏目
    searchColumn(searchKey: string){
        if (searchKey == null || searchKey == '') {
            this.toast('请输入搜索关键字');
            return;
        }
        this.navController.push(ThemeColumnSearchPage, {searchKey: searchKey,searchType: 2});
    }

    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.showLoading();
            this.pageNum = 1;
        } else {
            this.pageNum = this.pageNum + 1;
        }
        this.getColumnList(refresher);
    }

}
