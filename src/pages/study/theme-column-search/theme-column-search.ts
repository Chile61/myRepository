/**
 * Created by zxh on 2016/12/21.
 */
import {Component, Injector} from "@angular/core";
import {ColumnThemeVo} from "../../../models/study/ColumnThemeVo";
import {ThemeColumnDetail} from "../theme-detail/theme-detail";
import {BasePage} from "../../../core/base-page/BasePage";
@Component({
    selector: 'page-theme-column-search',
    templateUrl: 'theme-column-search.html'
})

//栏目主题搜索
export class ThemeColumnSearchPage extends BasePage{

    public pageTitle: string = '主题搜索';
    private searchType: number;//搜索类型1、主题2、栏目
    public searchKey: string = '';
    private pageNum: number = 1;
    private pageSize: number = 10;
    public canRefresh: boolean = false;
    public canLoadMore: boolean = false;

    public studyTopics: Array<ColumnThemeVo> = [];
    public totalCount: number = 0;

    constructor(injector: Injector) {
        super(injector);
        this.searchType = this.navParams.get('searchType');
        this.searchKey = this.navParams.get('searchKey');
        if(this.searchType == 2){
            this.pageTitle = '栏目搜索';
        }
        this.showLoading();
        this.searchThemeOrColumn();
    }

    //搜索主题或者栏目
    searchThemeOrColumn(refresher?: any) {
        let url = this.apiUrls.getUrlSearchTopicalLs();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            personGrpId: this.storageUtil.getPersonGrpId(),
            topicalColumnType: this.searchType,
            topicalNameLike: this.searchKey,
            pageNum: this.pageNum,
            pageSize: this.pageSize
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                if (this.pageNum == 1) {
                    this.studyTopics = [];
                }
                if(res.result == null || res.result == ''){
                    this.canLoadMore = false;
                    this.totalCount = this.studyTopics.length;
                    return;
                }
                this.studyTopics = this.studyTopics.concat(res.result);
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
                this.canRefresh = true;
            }
        });
    }

    //搜索
    clickSearch(searchKey: string){
        if (searchKey == null || searchKey == '') {
            this.toast('请输入搜索关键字');
            return;
        }
        this.searchKey = searchKey;
        this.showLoading();
        this.pageNum = 1;
        this.searchThemeOrColumn();
    }

    //到主题栏目详情
    toDetail(studyTopic: ColumnThemeVo) {
        this.navController.push(ThemeColumnDetail, {studyTopic: studyTopic});
    }

    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.showLoading();
            this.pageNum = 1;
        } else {
            this.pageNum = this.pageNum + 1;
        }
        this.searchThemeOrColumn(refresher);
    }

}
