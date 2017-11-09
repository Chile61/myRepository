/**
 * Created by zxh on 2017/1/16.
 */
import {Component, Injector} from "@angular/core";
import {BasePage} from "../../../core/base-page/BasePage";
import {TeacherDetail} from "../teacher-detail/teacher-detail";
import {TeacherSearchPage} from "../teacher-search/teacher-search";
import {Constants} from "../../../core/Constants";
@Component({
    selector: 'famous-teacher-page',
    templateUrl: 'famous-teacher.html'
})
//名师榜
export class FamousTeacherPage extends BasePage {

    public pageTitle: string = '名师榜';

    private pageNum: number = 1;
    private pageSize: number = 10;
    public canLoadMore: boolean = false;

    public teacherList: any = [];
    public labels: any = [[]];

    constructor(injector: Injector) {
        super(injector);
        this.pageTitle = this.navParams.get('pageTitle');
        this.showLoading();
        this.getTeachers();
    }

    //获取名师列表
    getTeachers(refresher?: any) {
        let url = this.apiUrls.getUrlFamousTeachers();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            pageNum: this.pageNum,
            pageSize: this.pageSize
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                if (this.pageNum == 1) {
                    this.teacherList = [];
                }
                if (res.result == null || res.result == '') {
                    this.canLoadMore = false;
                    return;
                }
                for (let i = (this.pageNum - 1) * this.pageSize; i < ((this.pageNum - 1) * this.pageSize + res.result.length); i++) {
                    if (res.result[i - (this.pageNum - 1) * this.pageSize].label) {
                        this.labels[i] = res.result[i - (this.pageNum - 1) * this.pageSize].label.split(',');
                    }
                }
                this.teacherList = this.teacherList.concat(res.result);
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

    //前往名师详情
    toTeacherDetail(teacher: any){
        this.navController.push(TeacherDetail, {teacher: teacher,fromWhere: Constants.TEACHER_FROM_FAMOUS})
    }

    //前往名师搜索
    toTeacherSearch(){
        this.navController.push(TeacherSearchPage);
    }

    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.showLoading();
            this.pageNum = 1;
        } else {
            this.pageNum = this.pageNum + 1;
        }
        this.getTeachers(refresher);
    }

}
