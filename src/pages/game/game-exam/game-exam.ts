import {Component, Injector} from '@angular/core';
import {Events} from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';
import {BasePage} from "../../../core/base-page/BasePage";
import {GameResultPage} from "../game-result/game-result";
@Component({
    selector: 'page-game-exam',
    templateUrl: 'game-exam.html'
})
export class GameExamPage extends BasePage {
    questionsVos: any;
    private examActivityVo: any;
    private GameExamResult: any;
    private gameId;
    private questId;
    private nav;
    private lastPage;
    public num: number;
    constructor(injector: Injector,
                public events: Events,
                public sanitize: DomSanitizer) {
        super(injector);
        this.GameExamResult = this.navParams.get("GameExamResult");
        this.questionsVos = this.GameExamResult.examActyQuestionsVo.questionsVos;
        this.examActivityVo = this.GameExamResult.examActyQuestionsVo.examActivityVo;

        //将所有选项加一select属性为false
        for (let i = 0; i < this.questionsVos.length; i++) {
            for (let j = 0; j < this.questionsVos[i].examQuestionVo.examQuestionOptionVos.length; j++) {
                this.questionsVos[i].examQuestionVo.examQuestionOptionVos[j].select = false;
            }
            this.questionsVos[i].examQuestionVo.userScore = 0;
            //当不存在用户作答结果，附值为空
            this.questionsVos[i].examQuestionVo.probResult = ''
        }

        //从父页面执行这个方法法(消除事件) 下一页
        this.events.unsubscribe('sub-result');
        this.events.subscribe('sub-result', (data) => {
            this.gameId = data[0].gameId;
            this.questId = data[0].questId;
            this.nav = data[0].nav;
            this.lastPage = data[0].lastPage;
            this.num = data[0].num;
            this.totalScoreFun();
        })

        //从父页面执行这个方法(消除事件) 提交试卷
        this.events.unsubscribe('sub-result-all');
        this.events.subscribe('sub-result-all', (data) => {
            this.gameId = data[0].gameId;
            this.questId = data[0].questId;
            this.nav = data[0].nav;
            this.lastPage = data[0].lastPage;
            this.num = data[0].num;
            this.totalScoreFun();
        })
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
        // console.log(this.totalScoreNow);  //考试所得分数
        let totalScore = this.examActivityVo.totalScore; //设置的试卷总分
        let scoreAll: number = 0;      //试卷总分
        for (let i = 0; i < this.questionsVos.length; i++) {
            scoreAll += this.questionsVos[i].examQuestionVo.score;
        }
        //实际所得分数(本次闯关成绩)
        let currScore: number = (totalScoreNow * totalScore) / scoreAll;

        // console.log("设置的试卷总分" + totalScore);
        // console.log("实际所得分数=" + currScore);
        // console.log("答对题目数量=" + currCorrectNum);   //本次闯关答对题目数量

        //保存闯关内容结果
        let questContentId = this.GameExamResult.questContentId;  //关卡内容ID
        let questContentInstId = this.GameExamResult.questContentInstId;   //关卡内容实例ID
        let examResultId = this.questionsVos[0].examResultId;    //考试结果ID

        let examActivityVoId = this.examActivityVo.id;

        //保存闯关内容结果
        this.httpUtil.post({
                url: this.apiUrls.saveQuestContentResult() + this.storageUtil.getOrgId() + '/' + this.storageUtil.getUserId() + '/' + questContentId + '',
                param: {
                    'userId': this.storageUtil.getUserId(),
                    'orgId': this.storageUtil.getOrgId(),
                    'questContentInstId': parseInt(questContentInstId),
                    'totalScore': (totalScore).toFixed(0),            //不必填
                    'currScore': (currScore).toFixed(0),
                    'currCorrectNum': parseInt(currCorrectNum),
                    'examResultId': parseInt(examResultId),
                    'examActivityId': examActivityVoId,
                    'operType':1,
                    'examQuestionParams': {"examQuestionParams": examQuestionParams}
                },
                success: (data) => {
                    let result = data.result;
                    //set用户答案到localStorage
                    let arr: any = {};
                    if (window.localStorage.getItem('arr')) {
                        arr = JSON.parse(window.localStorage.getItem('arr'));
                    }
                    arr[this.num] = this.GameExamResult;
                    window.localStorage.setItem('arr', JSON.stringify(arr))

                    //判断是否最后一页，是的话就跳转页面
                    if (this.lastPage == true) {
                        this.nav.push(GameResultPage, {
                            gameId: this.gameId,
                            questId: this.questId,
                            GameExamResult: arr
                        });
                    }

                },
                fail: (data) => {
                    console.log(data)
                }
            }
        );
    }

// //静态方法，从game-courser页面执行
// static aa() {
//     console.log("111")
// }

}
