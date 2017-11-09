import {Component, Injector} from '@angular/core';
import {BasePage} from "../../../core/base-page/BasePage";
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'page-class-practice-analysis',
    templateUrl: 'class-practice-analysis.html'
})
export class ClassPracticeAnalysisPage extends BasePage {
    public objId: string;
    public objType: number;
    public TitleName;
    public questionsVosArr: any;
    public finishedUserCount: number;

    constructor(injector: Injector,
                public sanitize: DomSanitizer) {
        super(injector);
        this.objId = this.navParams.get('objId');
        this.objType = this.navParams.get('objType');
        this.finishedUserCount = this.navParams.get('finishedUserCount');
        console.log(this.objType)
        switch (this.objType) {
            case 4:
                this.TitleName = '调研';
                break;
            case 5:
                this.TitleName = '投票';
                break;
        }
        this.getlatestQuestionsByExamId();
    }

    //根据考试ID获取用户最近考试结果[GET]
    getlatestQuestionsByExamId() {
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
                this.questionsVosArr = data.result;
            },
            fail: (data) => {
                console.log(data)
            }
        });
    }

    //当填空题的时候需要转换
    isFill(str, result) {
        let resultArr = [];
        if (result) {
            resultArr = result.split('@sc$ho@');
        }
        let j = 0;
        for (j; j < str.indexOf("$spaces$"); j++) {
            if (resultArr[j] == undefined) {
                resultArr[j] = '';
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

    //转百分比
    bindShowNumPercentage(absPercent) {
        let percent = (absPercent * 100).toFixed(0);
        let num = {
            'width': percent + '%'
        };
        return num;
    }
}
