/**
 * Created by zxh on 2017/1/17.
 */
import {Component, Injector} from "@angular/core";
import {BasePage} from "../../../core/base-page/BasePage";
import {TeacherDetail} from "../teacher-detail/teacher-detail";
import {Constants} from "../../../core/Constants";
@Component({
    selector: 'teacher-search-page',
    templateUrl: 'teacher-search.html'
})
//名师搜索
export class TeacherSearchPage extends BasePage{

    private searchKey: string;

    private pageNum: number = 1;
    private pageSize: number = 10;
    public totalCount: number = 0;
    public canRefresh: boolean = false;
    public canLoadMore: boolean = false;

    public teacherList: any = [];
    public labels: any = [[]];

    constructor(injector: Injector){
        super(injector);
    }

    searchTeacher(searchKey: string){
        if(!searchKey && searchKey == ''){
            this.toast('请输入搜索关键字');
            return;
        }
        this.searchKey = searchKey;
        this.showLoading();
        this.getTeachers();
    }

    //获取名师列表
    getTeachers(refresher?: any) {
        let url = this.apiUrls.getUrlFamousTeachers();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            searchText: this.searchKey,
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
                    this.totalCount = this.teacherList.length;
                    return;
                }
                for (let i = (this.pageNum - 1) * this.pageSize; i < ((this.pageNum - 1) * this.pageSize + res.result.length); i++) {
                    if (res.result[i - (this.pageNum - 1) * this.pageSize].label) {
                        this.labels[i] = res.result[i - (this.pageNum - 1) * this.pageSize].label.split(',');
                    }
                }
                this.teacherList = this.teacherList.concat(res.result);
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

    //前往名师详情
    toTeacherDetail(teacher: any){
        this.navController.push(TeacherDetail, {teacher: teacher,fromWhere: Constants.TEACHER_FROM_FAMOUS})
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
