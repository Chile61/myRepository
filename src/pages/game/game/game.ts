import {Component,Injector} from '@angular/core';
import 'rxjs/add/operator/map';

//关卡详情
import {GameDetailsPage} from '../game-details/game-details'
import {StorageUtil} from '../../../core/storage/StorageUtil';
import {BasePage} from "../../../core/base-page/BasePage";

@Component({
    selector: 'page-game',
    templateUrl: 'game.html'
})
export class GamePage extends BasePage{
    gameName:string;
    passQuestedNum:number;
    rank:any;
    totalScore:number;
    games:any;
    private gameId:number;   //游戏ID
    constructor(injector:Injector) {
        super(injector);
        this.showLoading();
        this.gameId = this.navParams.get('gameId');
        this.getDefaultGame();
    }


    //每次进入
    ionViewWillEnter() {
        this.getDefaultGame();
    }

    //获取闯关详情
    getDefaultGame(refresher?: any) {

        this.httpUtil.get({
            url: this.apiUrls.getGameDetail(),
            param: {
                'userId': this.storageUtil.getUserId(),
                'orgId': this.storageUtil.getOrgId(),
                'gameId': this.gameId
            },
            success: (data) => {
                this.log('获取闯关详情')
                this.log(data);
                let result = data.result;
                this.gameName = result.gameName;
                this.games = result.bigQuestVoLs;
                //已通关
                if (result.passQuestedNum == null) {
                    this.passQuestedNum = 0;
                } else {
                    this.passQuestedNum = result.passQuestedNum;
                }
                //排名
                if (result.rank == null) {
                    this.rank = '-- ';
                } else {
                    this.rank = result.rank;
                }
                //已获分数
                if (result.totalScore == null) {
                    this.totalScore = 0;
                } else {
                    this.totalScore = result.totalScore;
                }
            },
            fail: (data) => {
                console.log(data)
            }, finish: () => {
                if (refresher != null) {
                    refresher.complete();
                }
                this.dismissLoading();
            }
        });
    }

    //跳转关卡详情
    openGameDetails(lockFlag, questId) {
        if (lockFlag == false) {
            this.navController.push(GameDetailsPage, {
                questId: questId,
                gameId: this.gameId
            });
        } else {
            this.toast('前面的关卡还没有通过，不能跳过该关卡');
        }
    }

    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.showLoading();
            this.getDefaultGame(refresher);

        }
    }
}
