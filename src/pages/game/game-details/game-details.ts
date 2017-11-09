import {Component,Injector} from '@angular/core';
import 'rxjs/add/operator/map';

//开始闯关
import {GameCoursePage} from '../game-course/game-course';
import {GameCommentPage} from '../game-comment/game-comment';
import {GameResultPage} from "../game-result/game-result";
import {BasePage} from "../../../core/base-page/BasePage";

@Component({
    selector: 'page-game-details',
    templateUrl: 'game-details.html'
})
export class GameDetailsPage extends BasePage{
    questName;
    questImage;
    questDesc;
    questTarget;
    questCourseLss;
    objType;
    private questId:number; //关卡ID
    private gameId:number;  //游戏ID
    questPassFlag:boolean;
    constructor(injector:Injector) {
        super(injector);
        this.showLoading();
        this.gameId = this.navParams.get('gameId');
        this.questId = this.navParams.get('questId');
        this.getGameDetail();
        this.getCommentsNum();
    }

    //获取关卡详情
    getGameDetail() {
        this.httpUtil.get({
            url: this.apiUrls.getGameQuestDetail(),
            param: {
                'userId': this.storageUtil.getUserId(),
                'orgId': this.storageUtil.getOrgId(),
                'questId': this.questId
            },
            success: (data) => {
                this.log('获取关卡详情');
                this.log(data);
                let result = data.result;
                this.questName = result.questName;
                this.questImage = result.questImage;
                this.questDesc = result.questDesc;
                this.questTarget = result.questTarget;
                this.questCourseLss = result.questCourseLs;
                this.questPassFlag=result.questPassFlag;    //关卡是否通过
                this.dismissLoading();
            },
            fail: (data) => {
                console.log(data)
            }
        });
    }

    //获取关卡评论数量
    getCommentsNum() {
        this.httpUtil.get({
            url: this.apiUrls.getCommentsNum(),
            param: {
                'userId': this.storageUtil.getUserId(),
                'orgId': this.storageUtil.getOrgId(),
                'objId': this.navParams.get('questId'),
                'objType': 5   //评论类型 关卡
            },
            success: (data) => {
                this.log('获取关卡评论数量')
                this.log(data);
                this.objType = data.result;
            },
            fail: (data) => {
                console.log(data)
            }
        });
    }

    //跳转开始闯关
    openGameCourse() {
        this.navController.push(GameCoursePage, {
            gameId: this.gameId,
            questId: this.questId
        });
    }

    //跳转关卡讨论
    openGameComment() {
        this.navController.push(GameCommentPage,{
            questId: this.questId,
            questName:this.questName,
            questDesc:this.questDesc
        });
    }

    //结果查询
    openGameResult(){
        this.navController.push(GameResultPage,{
            gameId: this.gameId,
            questId:this.questId,
            pass:true
        });
    }
}
