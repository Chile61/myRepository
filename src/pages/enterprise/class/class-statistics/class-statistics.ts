import { BasePage } from '../../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { SignDefineVo } from '../../../../models/class/SignDefineVo';
import { ClassSignUserListPage } from '../class-signUserList/class-signUserList';



@Component({
    selector: 'page-class-statistics',
    templateUrl: 'class-statistics.html'
})

export class ClassStatisticsPage extends BasePage {
    public classId: number;
    public classStages = [];
    public classSigns: Array<SignDefineVo> = [];
    public signRate: number = 0;
    public unSignRate: number = 0;
    constructor(injector: Injector) {
        super(injector);
        this.classId = this.navParams.data.id;
        this.getClassStatisticsSignList();
        this.getClassStatisticsStageList();
    }

    //获取签到统计列表
    getClassStatisticsSignList() {
        let urls = this.apiUrls.getClassStatisticsSignList();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            classId: this.classId
        };
        this.httpUtil.get({
            url: urls, param: params, success: (res) => {
                this.classSigns = res.result;
            }, fail: (res) => {
                this.toast(res.msg);
            }, finish: () => {

            }
        });

    }
    //绑定已签的数据
    bindSignStytle(signCount: number, unSignCount: number) {
        this.signRate = (signCount / (signCount + unSignCount)) * 100;
        let rate = {
            'width': this.signRate + "%"
        }
        return rate;
    }
    //绑定未签的数据
    bindUnSignStytle(signCount: number, unSignCount: number) {
        this.unSignRate = (unSignCount / (signCount + unSignCount)) * 100;
        let rate = {
            'width': this.unSignRate + "%"
        }
        return rate;
    }
    //获取阶段统计列表
    getClassStatisticsStageList() {
        let urls = this.apiUrls.getClassStatisticsStageList();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            classId: this.classId
        };
        this.httpUtil.get({
            url: urls, param: params, success: (res) => {
                console.log(res);
                this.classStages = res.result;
            }, fail: (res) => {
                this.toast(res.msg);
            }, finish: () => {

            }

        });
    }

    //班级统计的详情页
    goSignStatistics(signDefineId) {
        this.navController.push(ClassSignUserListPage, { signDefineId: signDefineId, classId: this.classId, signRate: this.signRate, unSignRate: this.unSignRate });
    }

    //绑定完成的百分比
    bindCirclePercents(val) {
        let v = val * 100;
        let perCentClass = 'p' + v.toFixed(0);
        return perCentClass;
    }

    //绑定圆的颜色
    bindCircleColor(val) {
        let flag = true;
        if (val == 0) {
            flag = false;
        }
        // let color = {
        //     green: flag,
        // }
        return true;
    }

    //绑定圆形填充比率
    bindCircle(val) {
        let rotationMultiplier = 3.6;
        let rotationDegrees = rotationMultiplier * val * 100;
        let circle = {
            '-webkit-transform': 'rotate(' + rotationDegrees + 'deg)',
            '-moz-transform': 'rotate(' + rotationDegrees + 'deg)',
            '-ms-transform': 'rotate(' + rotationDegrees + 'deg)',
            '-o-transform': 'rotate(' + rotationDegrees + 'deg)',
            'transform': 'rotate(' + rotationDegrees + 'deg)'
        }
        return circle;
    }

}