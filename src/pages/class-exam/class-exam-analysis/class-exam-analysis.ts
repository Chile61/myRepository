import {Component, Injector} from '@angular/core';
import {BasePage} from "../../../core/base-page/BasePage";
import {DomSanitizer} from '@angular/platform-browser';
@Component({
    selector: 'page-class-exam-analysis',
    templateUrl: 'class-exam-analysis.html'
})
export class ClassExamAnalysisPage extends BasePage {
    private objId:number;
    public questionsVosArr:any;
    constructor(injector: Injector,
                public sanitize: DomSanitizer
    ) {
        super(injector);
        this.objId=this.navParams.get('objId');

        this.getlatestQuestionsByExamId();
    }

    //根据考试ID获取用户最近考试结果[GET]
    getlatestQuestionsByExamId(){
        this.httpUtil.get({
            url: this.apiUrls.latestQuestionsByExamId(),
            param: {
                'userId': this.storageUtil.getUserId(),
                'orgId': this.storageUtil.getOrgId(),
                'examId': this.objId
            },
            success: (data) => {
                console.log('根据考试ID获取用户最近考试结果[GET]');
                console.log(data)
                this.questionsVosArr=data.result;
            },
            fail: (data) => {
                console.log(data)
            }
        });
    }

    //当填空题的时候需要转换
    isFill(str, result) {
        let resultArr=[];
        if(result){
            resultArr = result.split('@sc$ho@');
        }
        let j = 0;
        for (j; j < str.indexOf("$spaces$"); j++) {
            if(resultArr[j]==undefined){
                resultArr[j]='';
            }
            str = str.replace(/\$spaces\$/, '<input style="background: none !important;" disabled="true" class="game-input" type="text" value="' + resultArr[j] + '">');
        }
        if (j < 1) {
            return str;
        } else {
            return this.sanitize.bypassSecurityTrustHtml(str);
        }
    }

    //转成 A B C D
    conversionFun(num) {
        let numE = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
            'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
            'U', 'V', 'W', 'X', 'Y', 'Z'
        ];
        return numE[num];
    }

    //参考答案
    bindanswer(k, questionTypeId, refrence) {
        if (questionTypeId == 1 || questionTypeId == 2 || questionTypeId == 3) {
            let examQuestionOptionVos = this.questionsVosArr[k].examQuestionVo.examQuestionOptionVos;
            let conver = '';
            for (let i = 0; i < examQuestionOptionVos.length; i++) {

                if (examQuestionOptionVos[i].correct == 1) {
                    conver += this.conversionFun(i);
                }
            }
            return conver;
        } else if (questionTypeId == 6) {
            let conver = refrence.replace(/\@sc\$ho\@/g, ',');
            console.log(conver)
            return conver;
        }

    }

}
