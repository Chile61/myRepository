/**
 * Created by zxh on 2016/12/23.
 */
import {Component, Injector} from "@angular/core";
import {BasePage} from "../../../core/base-page/BasePage";
import {ColumnThemeVo} from "../../../models/study/ColumnThemeVo";
import {ThemeColumnDetail} from "../theme-detail/theme-detail";

@Component({
    selector: 'page-more-recommend',
    templateUrl: 'more-recommend.html'
})

//更多推荐栏目主题
export class MoreRecommendPage extends BasePage {

    public pageTitle: string = '推荐栏目主题';

    public columnThemes: Array<ColumnThemeVo> = [];

    private pageNum: number = 1;
    private pageSize: number = 10;
    public canLoadMore: boolean = false;
    public totalCount: number = 0;

    constructor(injector: Injector) {
        super(injector);
        this.pageTitle = this.navParams.get('pageTitle')
        this.showLoading();
        this.getRecommend();
    }

    //获取推荐栏目主题
    getRecommend(refresher?: any) {
        let url = this.apiUrls.getUrlRecommendLs();
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
                    this.columnThemes = [];
                }
                if (res == null || res == '') {
                    this.canLoadMore = false;
                    return;
                }
                this.columnThemes = this.columnThemes.concat(res.result);
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

    //到栏目获或主题详情
    toColumnOrThemeDetail(studyTopic: ColumnThemeVo) {
        this.navController.push(ThemeColumnDetail, {studyTopic: studyTopic});
    }

    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.showLoading();
            this.pageNum = 1;
        } else {
            this.pageNum = this.pageNum + 1;
        }
        this.getRecommend(refresher);
    }
}
