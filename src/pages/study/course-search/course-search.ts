/**
 * Created by zxh on 2016/12/14.
 */
import {Component, Injector} from "@angular/core";
import {ClassifyVo} from "../../../models/study/ClassifyVo";
import {ClassifyLabelVo} from "../../../models/study/ClassifyLabelVo";
import {CourseSearchResultPage} from "../course-search-result/course-search-result";
import {ClassifyLabelCoursePage} from "../classify-label-course/classify-label-course";
import {BasePage} from "../../../core/base-page/BasePage";
import {Events} from "ionic-angular";
import {CourseMiniVo} from "../../../models/study/CourseMiniVo";
import {EventsConstants} from "../../../core/EventsConstants";

@Component({
    selector: 'page-course-search',
    templateUrl: 'course-search.html'
})

//课程搜索
export class CourseSearchPage extends BasePage {
    public classifyList: Array<ClassifyVo> = [];
    public classifyLabels: Array<ClassifyLabelVo> = [];
    public classifyId: number = 0;
    public searchKey: string = '';
    private reqParam: string = '';//快捷方式上的REQUEST_PARAM属性值,没有传""

    private isSelectCourse: boolean = false;//是否是选择课程的操作
    private selectedCourse: Array<CourseMiniVo> = [];//已选课程

    constructor(injector: Injector,
                public events: Events) {
        super(injector);
        this.reqParam = this.navParams.get('reqParam') || '';
        this.isSelectCourse = this.navParams.get('isSelectCourse') || false;
        this.selectedCourse = this.navParams.get('selectedCourse') || [];
        this.getClassify();
        this.initEvents();
    }

    initEvents() {
        this.events.subscribe(EventsConstants.CLOSE_SEARCHPAGE, () => {
            this.navController.pop();
        });
    }

    //获取能力分类
    getClassify() {
        this.showLoading();
        let url = this.apiUrls.getUrlCompetencyClassLs();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            personGrpId: this.storageUtil.getPersonGrpId(),
            reqParam: this.reqParam
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                this.classifyList = res.result;
                if (this.classifyList.length > 0) {
                    this.classifyId = this.classifyList[0].compcyClassId;
                    this.getClassifyLabel(this.classifyList[0].compcyClassId);
                } else {
                    this.dismissLoading();
                }
            }, fail: (err) => {
                this.toast(err.msg);
                this.dismissLoading();
            }
        });
    }

    //获取能力分类标签
    getClassifyLabel(compcyClassId: number) {
        let url = this.apiUrls.getUrlClassifyLabel();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            personGrpId: this.storageUtil.getPersonGrpId(),
            compcyClassId: compcyClassId
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                this.classifyLabels = res.result;
            }, fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
                this.dismissLoading();
            }
        })
    }

    //点击能力分类标签 先判断用户对标签下的课程权限
    clickClassifyLabel(classifyLabel: ClassifyLabelVo, competencyId: number) {
        this.showLoading();
        let competencyLevel = '';
        if (classifyLabel.competencyId == competencyId) {
            competencyLevel = 'first';
        } else {
            competencyLevel = 'second';
        }
        let url = this.apiUrls.getUrlCheckLabelCourseJurisdiction();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            personGrpId: this.storageUtil.getPersonGrpId(),
            competencyLevel: competencyLevel,
            competencyId: competencyId
        };
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                this.navController.push(ClassifyLabelCoursePage, {
                    classifyLabel: classifyLabel,
                    competencyId: competencyId,
                    isSelectCourse: this.isSelectCourse,
                    selectedCourse: this.selectedCourse
                });
            }, fail: (err) => {
                this.toast(err.msg);
            }, finish: () => {
                this.dismissLoading();
            }
        });
    }

    //切换能力分类
    selectClassify(classifyId: number) {
        if (this.classifyId == classifyId) {
            return;
        }
        this.showLoading();
        this.classifyId = classifyId;
        this.getClassifyLabel(classifyId);
    }

    //前往课程搜索结果
    toCourseSearchResult(searchKey: string) {
        console.log(searchKey);
        if (searchKey == null || searchKey == '') {
            this.toast('请输入搜索关键字');
            return;
        }
        this.navController.push(CourseSearchResultPage, {
            searchKey: searchKey,
            isSelectCourse: this.isSelectCourse,
            selectedCourse: this.selectedCourse
        });
    }

    ionViewWillUnload() {
        //界面销毁
        this.events.unsubscribe(EventsConstants.CLOSE_SEARCHPAGE);
    }
}
