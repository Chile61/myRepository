import {Component, Injector} from '@angular/core';
import {GameDetailsPage} from "../game-details/game-details";
import {BasePage} from "../../../core/base-page/BasePage";
import {GameAnalysisPage} from "../game-analysis/game-analysis";

@Component({
    selector: 'page-game-result',
    templateUrl: 'game-result.html'
})
export class GameResultPage extends BasePage {
    currScore: number;
    bestScore: number;
    currCorrectNum: number;
    bestCorrectNum: number;
    bigQuestName: string;
    private smallQuestName: string;
    isPass: boolean;
    private starNum: number;
    private gameId: string;    //游戏ID
    private questId: string;
    public answerAnalysisList: any = [];
    public GameExamResult: any;
    public showHead: boolean = false;  //控制头部显示那个
    private pass:boolean;
    constructor(injector: Injector) {
        super(injector);
        this.showLoading();
        //判断是否是查询结果
        this.pass = this.navParams.get('pass');
        this.gameId = this.navParams.get('gameId');
        this.questId = this.navParams.get('questId');
        this.GameExamResult = this.navParams.get('GameExamResult');
        // console.log('GameExamResult');
        // console.log(this.GameExamResult)
        if (this.pass) {
            //结果查询
            this.getLastPassQuestResultFun();
        } else {
            //正常考试
            this.showHead = true;
            this.getQuestResultFun();
        }
    }

    //获取本次闯关结果[不提供答案解析信息]
    getQuestResultFun() {
        this.httpUtil.get({
            url: this.apiUrls.getQuestResult(),
            param: {
                'userId': this.storageUtil.getUserId(),
                'orgId': this.storageUtil.getOrgId(),
                'questId': this.questId,
                'gameInstId': sessionStorage.getItem('gameInstId'),
                'questInstId': sessionStorage.getItem('questInstId')
            },
            success: (data) => {
                console.log('获取本次闯关结果[不提供答案解析信息]')
                console.log(data);
                let result = data.result;
                this.currScore = result.currScore;
                this.bestScore = result.bestScore;
                this.currCorrectNum = result.currCorrectNum;
                this.bestCorrectNum = result.bestCorrectNum;
                this.bigQuestName = result.bigQuestName;
                this.smallQuestName = result.smallQuestName;
                this.isPass = result.isPass;
                this.starNum = result.starNum;

                let answerAnalysisListAll = JSON.parse(window.localStorage.getItem('arr'));
                //循环LocaStorage中得到的考试题
                for (let i in answerAnalysisListAll) {
                    this.answerAnalysisList.push(answerAnalysisListAll[i].examActyQuestionsVo)
                }
                this.dismissLoading();
            },
            fail: (data) => {
                console.log(data)
            }
        })
    }

    //获取上一次通过闯关结果
    getLastPassQuestResultFun() {
        this.httpUtil.get({
            url: this.apiUrls.getLastPassQuestResult(),
            param: {
                'userId': this.storageUtil.getUserId(),
                'orgId': this.storageUtil.getOrgId(),
                'gameId': this.gameId,
                'questId': this.questId
            },
            success: (data) => {
                console.log('获取上一次通过闯关结果')
                console.log(data);
                let result = data.result;

                this.currScore = result.questResultVo.currScore;
                this.bestScore = result.questResultVo.bestScore;
                this.currCorrectNum = result.questResultVo.currCorrectNum;
                this.bestCorrectNum = result.questResultVo.bestCorrectNum;
                this.bigQuestName = result.questResultVo.bigQuestName;
                this.smallQuestName = result.questResultVosmallQuestName;
                this.isPass = result.questResultVo.isPass;
                this.starNum = result.questResultVo.starNum;

                this.answerAnalysisList = result.answerAnalysisList;
                this.dismissLoading();
            },
            fail: (data) => {
                console.log(data)
            }
        })
    }

    //重新闯关(获取上一次通过闯关结果)
    openGameDetails() {
        //当前第几页
        // let time = this.navController.length();
        // console.log(time)
        if(this.pass){
            this.navController.pop();
        }else {
            this.navController.remove(4, 2);
        }
    }

    //下一关接口
    getNextQuestFun() {
        this.httpUtil.get({
            url: this.apiUrls.getNextQuest(),
            param: {
                'userId': this.storageUtil.getUserId(),
                'orgId': this.storageUtil.getOrgId(),
                'gameId': this.gameId,
                'questId': this.questId
            },
            success: (data) => {
                this.log('下一关接口')
                this.log(data);
                let result = data.result;
                // console.log(result.nextQuestDetail.gameId+"///"+result.nextQuestDetail.result)
                switch (result.nextFlag) {
                    case 0:
                        this.toast("请期待下期闯关");
                        break;
                    case 1:
                        this.navController.push(GameDetailsPage, {
                            gameId: result.nextQuestDetail.gameId,
                            questId: result.nextQuestDetail.questId
                        });
                        break;
                    case -1:
                        this.toast("闯关已经锁");
                        break;
                }
            },
            fail: (data) => {
                console.log(data)
            }
        })
    }

    //答案解析
    openGameAnalysisFun(j) {
        if(this.isPass==true){
            this.navController.push(GameAnalysisPage, {
                answerAnalysisList: this.answerAnalysisList,
                j: j
            })
        }else{
            this.toast('需要通过一星后才能查看答案解析哦');
        }
    }

    //页面离开时执行(清除arr)
    ngOnDestroy() {
        window.localStorage.removeItem('arr');
    }
}
