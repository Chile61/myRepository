import {Component, Injector} from '@angular/core';
import {BasePage} from "../../../core/base-page/BasePage";
import {ClassExamSubjectPage} from "../class-exam-subject/class-exam-subject";
import {ClassPracticePage} from "../class-practice/class-practice";

@Component({
    selector: 'page-class-exam',
    templateUrl: 'class-exam.html'
})
export class ClassExamPage extends BasePage {
    public objId;
    public objType;
    public description: string;
    public name: string;
    public totalTime;
    public passScore: number;
    public totalScore: number;
    public finishedUserCount: number;
    public userJoinedCount: number;
    public TitleName:string;
    public startBtn:string;
    constructor(injector: Injector) {
        super(injector);
        this.objId = this.navParams.get('objId');
        this.objType = this.navParams.get('objType');
        switch (this.objType){
            case 1:
                this.TitleName='课程简介';
                break;
            case 2:
                this.TitleName='考试简介';
                this.startBtn='开始考试';
                break;
            case 3:
                this.TitleName='练习简介';
                this.startBtn='开始练习';
                break;
            case 4:
                this.TitleName='调研简介';
                this.startBtn='开始调研';
                break;
            case 5:
                this.TitleName='投票简介';
                this.startBtn='开始投票';
                break;
        }
        this.getExamDetailFun();
    }

    //根据考试ID获取考试基本信息[GET]
    getExamDetailFun() {
        this.httpUtil.get({
            url: this.apiUrls.getExamDetail(),
            param: {
                'userId': this.storageUtil.getUserId(),
                'orgId': this.storageUtil.getOrgId(),
                'examId': this.objId
            },
            success: (data) => {
                console.log('根据考试ID获取考试基本信息[GET]');
                console.log(data)
                let result = data.result;
                this.description = result.description;
                this.name = result.name;
                this.totalTime = this.bingTimeConver(result.totalTime);
                this.passScore = result.passScore;
                this.totalScore = result.totalScore;
                this.finishedUserCount = result.finishedUserCount;
                this.userJoinedCount = result.userJoinedCount;
            },
            fail: (data) => {
                console.log(data)
            }
        });
    }

    // 时间转换
    bingTimeConver(totalTime) {
        let remain, hour, minute, second, str;
        hour = Math.floor(totalTime / (60 * 60));
        remain = totalTime - hour * 60 * 60;
        minute = Math.floor(remain / 60);
        remain = remain - minute * 60;
        second = remain;
        let finalTime = hour * 60 + minute;
        str = '' + finalTime + '分钟';
        return str;
    }

    //跳转页面
    openClassExamSubjectFun() {
        //任务类型（1课程，2考试，3练习，4调研，5投票，6测评 7内容包 8闯关 9圈子 10主题 11栏目 12反馈  13混合(自定义表单)，999综合）
        switch (this.objType) {
            case 1:
                break;
            case 2:
                this.navController.push(ClassPracticePage, {
                    'objId': this.objId,
                    'objType':this.objType,
                    'passScore': this.passScore,
                    'totalScore': this.totalScore
                });
                break;
            case 3:
                this.navController.push(ClassPracticePage, {
                    'objId': this.objId,
                    'objType':this.objType,
                    'passScore': this.passScore,
                    'totalScore': this.totalScore
                });
                break;
            case 4:
                this.navController.push(ClassPracticePage, {
                    'objId': this.objId,
                    'objType':this.objType,
                });
                break;
            case 5:
                this.navController.push(ClassPracticePage, {
                    'objId': this.objId,
                    'objType':this.objType
                });
                break;
        }
    }
}
