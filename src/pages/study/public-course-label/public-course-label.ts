/**
 * Created by zxh on 2016/12/22.
 */
import {Component, Injector} from "@angular/core";
import {BasePage} from "../../../core/base-page/BasePage";
import {ClassifyLabelVo} from "../../../models/study/ClassifyLabelVo";
import {ClassifyLabelCoursePage} from "../classify-label-course/classify-label-course";

@Component({
    selector: 'page-public-course-label',
    templateUrl: 'public-course-label.html'
})

//公开课分类标签
export class PublicLabelPage extends BasePage {

    public classifyLabels: Array<ClassifyLabelVo> = [];
    private classifyId: number;
    public pageTitle: string;

    constructor(injector: Injector) {
        super(injector);
        this.classifyId = this.navParams.get('classifyId');
        this.pageTitle = this.navParams.get('pageTitle');
        this.showLoading();
        this.getClassifyLabel();
    }

    //获取能力分类标签
    getClassifyLabel() {
        let url = this.apiUrls.getUrlClassifyLabel();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            personGrpId: this.storageUtil.getPersonGrpId(),
            compcyClassId: this.classifyId
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

    //点击能力分类标签
    clickClassifyLabel(classifyLabel: ClassifyLabelVo, competencyId: number) {
        this.navController.push(ClassifyLabelCoursePage, {classifyLabel: classifyLabel, competencyId: competencyId});
    }
}
