import {Component, Injector} from '@angular/core';
import {BasePage} from "../../../core/base-page/BasePage";
import {ClassExamAnalysisPage} from "../class-exam-analysis/class-exam-analysis";
import {ClassPracticeAnalysisPage} from "../class-practice-analysis/class-practice-analysis";

@Component({
    selector: 'page-class-exam-result',
    templateUrl: 'class-exam-result.html'
})
export class ClassExamResultPage extends BasePage {
    public currScore:number;
    public passScore:number;
    // private examQuestionParams:any;
    public isPass:boolean=false;
    public objId:number;
    public objType:number;
    public startBtn:string;
    public finishedUserCount;
    public TitleName:string;
    constructor(injector: Injector) {
        super(injector);
        this.currScore = this.navParams.get('currScore');
        this.passScore=this.navParams.get('passScore');
        this.objType=this.navParams.get('objType');
        this.objId=this.navParams.get('objId');
        this.finishedUserCount=this.navParams.get('finishedUserCount');

        //任务类型（1课程，2考试，3练习，4调研，5投票，6测评 7内容包 8闯关 9圈子 10主题 11栏目 12反馈  13混合(自定义表单)，999综合）
        switch (this.objType){
            case 1:
                break;
            case 2:
                this.TitleName='得分结果';
                this.startBtn='重新考试';
                break;
            case 3:
                this.TitleName='得分结果';
                this.startBtn='再来一次';
                break;
            case 4:
                this.TitleName='调研详情';
                this.startBtn='查看报告';
                break;
            case 5:
                this.TitleName='投票详情';
                this.startBtn='查看报告';
                break;
        }

        //判断是否合格
        if(this.currScore>=this.passScore){
            this.isPass=true;
        }
    }

    //返回开始考试页面 class-exam
    openClassExam(){
        this.navController.remove(3, 2);
    }

    //答案解析
    openClassExamAnalysis(){
        this.navController.push(ClassExamAnalysisPage,{
            'objId':this.objId
            // 'examQuestionParams':this.examQuestionParams
        })
    }

    //调研，投票跳转页面
    openPracticeAnalysis(){
        this.navController.push(ClassPracticeAnalysisPage,{
            'objId':this.objId,
            'objType':this.objType,
            'finishedUserCount':this.finishedUserCount
        })
    }
}
