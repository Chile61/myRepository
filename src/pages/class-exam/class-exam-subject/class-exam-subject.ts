import {Component, Injector} from '@angular/core';
import {BasePage} from "../../../core/base-page/BasePage";
import {DomSanitizer} from '@angular/platform-browser';
import {ClassExamResultPage} from "../class-exam-result/class-exam-result";
@Component({
    selector: 'page-class-exam-subject',
    templateUrl: 'class-exam-subject.html'
})
export class ClassExamSubjectPage extends BasePage {
    private objId;
    public questionsVos: any;
    private passScore;
    private totalScore;
    constructor(injector: Injector,
                public sanitize: DomSanitizer) {
        super(injector);
        this.objId = this.navParams.get('objId');
        this.passScore=this.navParams.get('passScore');     //及格分数
        this.totalScore=this.navParams.get('totalScore');   //总分数
        // console.log('进入考试页面');
        // console.log(this.objId);
        this.getStartNewExamFun();
    }

    //开始新的考试(先创建考试结果对象,再获取试题列表)[POST]
    getStartNewExamFun() {
        this.httpUtil.post({
            url: this.apiUrls.getstartNewExam() + '/' + this.storageUtil.getOrgId() + '/' + this.storageUtil.getUserId() + '/1/' + this.objId,
            param: {
                'userId': this.storageUtil.getUserId(),
                'orgId': this.storageUtil.getOrgId(),
                'objId': this.objId,
                'objType': 1
            },
            success: (data) => {
                console.log('开始新的考试(先创建考试结果对象,再获取试题列表)[POST]');
                console.log(data);
                let result = data.result;
                this.questionsVos = result;

                //将所有选项加一select属性为false
                for (let i = 0; i < this.questionsVos.length; i++) {
                    for (let j = 0; j < this.questionsVos[i].examQuestionVo.examQuestionOptionVos.length; j++) {
                        this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select = false;
                    }
                    this.questionsVos[i].examQuestionVo.userScore = 0;
                    //当不存在用户作答结果，附值为空
                    this.questionsVos[i].examQuestionVo.probResult = ''
                }


            },
            fail: (data) => {
                console.log(data)
            }
        });
    }

    //当填空题的时候需要转换
    isFill(str, i) {
        let j = 0;
        for (j; j < str.indexOf("$spaces$"); j++) {
            str = str.replace(/\$spaces\$/, '<input id=' + (i + 1) + "-" + (j + 1) + ' class="game-input" type="text" value="">');
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

    //单选,判断
    getRadion(probId, id) {
        //选中的加上一个属性select=true
        for (let i = 0; i < this.questionsVos.length; i++) {
            if (this.questionsVos[i].probId == probId) {
                for (let j = 0; j < this.questionsVos[i].examQuestionVo.examQuestionOptionVos.length; j++) {
                    this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select = false;
                    if (this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].id == id) {
                        this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select = true;
                    }
                }
            }
        }
        console.log(this.questionsVos)
    }

    //多选
    getCheckbox(probId, id) {
        for (let i = 0; i < this.questionsVos.length; i++) {
            if (this.questionsVos[i].probId == probId) {
                for (let j = 0; j < this.questionsVos[i].examQuestionVo.examQuestionOptionVos.length; j++) {
                    if (this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].id == id) {
                        if (this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select == true) {
                            this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select = false;
                        } else {
                            this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select = true;
                        }
                    }
                }
            }
        }
    }

    //问答题
    getTextareaKeyupFun(event: any, id: number) {
        // console.log(event.target.value+'---------'+id);
        for (let i = 0; i < this.questionsVos.length; i++) {
            if (this.questionsVos[i].examQuestionVo.id == id) {
                this.questionsVos[i].examQuestionVo.probResult = event.target.value;
            }
        }
    }

    //计数分数
    totalScoreFun() {
        let currCorrectNum: any = 0;  //本次闯关答对题目数量
        let totalScoreNow: number = 0;  //考试总分
        let examQuestionParams: any = [];  //所答题目
        let probResult:any;   //用户所答内容
        for (let i = 0; i < this.questionsVos.length; i++) {
            let questionTypeId = this.questionsVos[i].examQuestionVo.questionTypeId;

            let optionIds = [];
            let optionResults = [];
            //单选题计分
            if (questionTypeId == 1) {
                for (let j = 0; j < this.questionsVos[i].examQuestionVo.examQuestionOptionVos.length; j++) {
                    if (this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select == true && this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].correct == 1) {
                        totalScoreNow += this.questionsVos[i].examQuestionVo.score;
                        currCorrectNum++;
                        this.questionsVos[i].examQuestionVo.userScore = true;
                    }
                    //用户选择答案
                    if (this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select == true) {
                        optionIds.push(parseInt(this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].id));
                        optionResults.push((this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].id).toString());
                    }
                }
            }
            //多选题计分
            else if (questionTypeId == 2) {
                let AllSelect: boolean = false;
                for (let j = 0; j < this.questionsVos[i].examQuestionVo.examQuestionOptionVos.length; j++) {
                    //用户选择答案
                    if (this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select == true) {
                        optionIds.push(parseInt(this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].id));
                        optionResults.push((this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].id).toString());
                    }
                }
                for (let j = 0; j < this.questionsVos[i].examQuestionVo.examQuestionOptionVos.length; j++) {
                    if ((this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select == true && this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].correct == 1) || (this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select == false && this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].correct == 0)) {
                        AllSelect = true;
                    } else {
                        AllSelect = false;
                        break;
                    }
                }
                //都选中
                if (AllSelect) {
                    // console.log("多选加分");
                    totalScoreNow += this.questionsVos[i].examQuestionVo.score;
                    currCorrectNum++;
                    this.questionsVos[i].examQuestionVo.userScore = true;
                }
            }
            //判断题计分
            else if (questionTypeId == 3) {
                for (let j = 0; j < this.questionsVos[i].examQuestionVo.examQuestionOptionVos.length; j++) {
                    if (this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select == true && this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].correct == 1) {
                        totalScoreNow += this.questionsVos[i].examQuestionVo.score;
                        currCorrectNum++;
                        this.questionsVos[i].examQuestionVo.userScore = true;
                    }
                    //用户选择答案
                    if (this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select == true) {
                        optionIds.push(parseInt(this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].id));
                        optionResults.push((this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].id).toString());
                    }
                }
            }
            //问答题
            else if (questionTypeId == 4) {
                probResult=this.questionsVos[i].examQuestionVo.probResult;
            }
            //填空题计分
            else if (questionTypeId == 6) {
                let inputArr = [];
                for (let j = 1; ; j++) {
                    if (document.getElementById((i + 1) + '-' + j)) {
                        //用户答案
                        let InputValue = (document.getElementById((i + 1) + '-' + j) as HTMLInputElement).value; //转成HTMLInputElement类型才能获取value
                        inputArr.push(InputValue);
                    } else {
                        break;
                    }
                }

                //转换用户答案string作参数
                let inputArrStr=inputArr.join('@sc$ho@');
                probResult = inputArrStr;

                //正确答案
                let refrence = this.questionsVos[i].examQuestionVo.refrence.split('@sc$ho@');

                let eachscore = this.questionsVos[i].examQuestionVo.score / refrence.length;  //每个填空的分数
                let isAllTrue: boolean = true;
                if (this.questionsVos[i].examQuestionVo.inOrder == 1) {
                    //可不按顺序
                    for (let k = 0; k < refrence.length; k++) {
                        for (let g = 0; g < inputArr.length; g++) {
                            if (refrence[k] == inputArr[g]) {
                                refrence.splice(k, 1);
                                inputArr.splice(g, 1);
                                k--;
                                g--;
                                totalScoreNow += eachscore;
                                isAllTrue = true;
                            } else {
                                isAllTrue = false;
                            }
                        }
                    }
                    console.log(refrence)
                } else {
                    //按顺序
                    for (let k = 0; k < refrence.length; k++) {
                        if (refrence[k] == inputArr[k]) {
                            totalScoreNow += eachscore;
                            isAllTrue = true;
                        } else {
                            isAllTrue = false;
                        }
                    }
                }

                //填空题全部填空都填对，答对数量才加1
                if (isAllTrue == true) {
                    currCorrectNum++;
                    this.questionsVos[i].examQuestionVo.userScore = true;       //附值为true说明这题是对的
                }
            }

            //所答题目
            let json = {
                'examResultId': this.questionsVos[i].examResultId,                          //考试结果ID
                'groupId': this.questionsVos[i].groupId,                                    //题目组ID
                'probId': this.questionsVos[i].probId,                                      //试题ID
                'probResult':probResult,               //用户作答结果
                'optionIds': optionIds,                                                     //用户选择的选项集
                'optionResults': optionResults,                                             //用户的选项结果集(如自定义作答)
                'usedTime': 1,
                'questionTypeId': this.questionsVos[i].examQuestionVo.questionTypeId        //试题类型
            };
            examQuestionParams.push(json);

        }

        let totalScore = this.totalScore; //设置的试卷总分
        let scoreAll: number = 0;      //试卷总分
        for (let i = 0; i < this.questionsVos.length; i++) {
            scoreAll += this.questionsVos[i].examQuestionVo.score;
        }
        //实际所得分数(本次闯关成绩)
        let currScore: number = (totalScoreNow * totalScore) / scoreAll;
        // console.log(currScore);

        let examResultId = this.questionsVos[0].examResultId;    //考试结果ID


        //批量提交考试/交卷[POST]
        this.httpUtil.post({
                url: this.apiUrls.submitExamWithQuestions() +'/'+ this.storageUtil.getOrgId() + '/' + this.storageUtil.getUserId() + '/' + this.objId + '/'+examResultId+'/1',
                param: {
                    examQuestionParams
                },
                success: (data) => {
                    let result = data.result;

                    this.navController.push(ClassExamResultPage,{
                        'currScore':currScore.toFixed(0),
                        'passScore':this.passScore,
                        'objId':this.objId
                    })

                },
                fail: (data) => {
                    console.log(data)
                }
            });
    }

}
