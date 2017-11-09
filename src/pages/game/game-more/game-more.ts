import {Component, Injector} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {GamePage} from '../game/game';
import {BasePage} from "../../../core/base-page/BasePage";

@Component({
    selector: 'page-game-more',
    templateUrl: 'game-more.html'
})
export class GameMorePage extends BasePage {

    GameLs:any;
    // private body: {};
    public page: number = 1;
    public pageSize: number = 10;
    public canLoadMore: boolean = false;
    constructor(injector: Injector,
                public http: Http) {
        super(injector);
        this.showLoading();
        this.getDefaultGameMore();

    }

    //获取更多闯关游戏列表
    getDefaultGameMore(refresher?) {
        let userId = this.storageUtil.getUserId();
        let orgId = this.storageUtil.getOrgId();

        this.httpUtil.get({
            url: this.apiUrls.getMyGameLs(),
            param: {
                'userId': userId,
                'orgId': orgId,
                'pageNum': this.page,
                'pageSize': this.pageSize
            },
            success: (data) => {
              this.log("获取更多闯关游戏列表");
              this.log(data);

              if (this.page == 1) {
                this.GameLs = [];
              }
              if(data.result == null || data.result == ''){
                this.canLoadMore = false;
                return;
              }

              this.GameLs = this.GameLs.concat(data.result);
              if (data.result.length >= this.pageSize) {
                this.canLoadMore = true;
              } else {
                this.canLoadMore = false;
              }
            },
            fail: (data) => {
                this.toast(data.msg);
            }, finish: () => {
             if(refresher){
                  refresher.complete();
              }
              this.dismissLoading();
            }
        });
    }
    doRefresh(refresher, isRefresh: boolean) {
        if (isRefresh) {
            this.showLoading();
            this.page = 1;
        } else {
            this.page = this.page + 1;
        }
        this.getDefaultGameMore(refresher);
    }

    // 跳转到game页面
    openGame(gameId) {
        this.navController.push(GamePage, {
            gameId: gameId
        });
    }


}
