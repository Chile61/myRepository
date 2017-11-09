/**
 * Created by zxh on 2017/2/14.
 */
import {Component, Injector} from "@angular/core";
import {BasePage} from "../../../core/base-page/BasePage";
import {CircleFriendVo} from "../../../models/circle/CircleFriendVo";
import {Events} from "ionic-angular";
import {EventsConstants} from "../../../core/EventsConstants";

@Component({
    selector: 'select-circle-friend-page',
    templateUrl: 'select-circle-friend.html'
})

export class SelectCircleFriendPage extends BasePage {

    private groupId;

    public searchKey: string = '';

    public friendList: Array<CircleFriendVo> = [];//好友列表
    public selectFriendList: Array<CircleFriendVo> = [];//已选好友列表
    private maxSelectCount: number = 3;//最多选择好友个数
    public selectCount = 0;//已选好友数

    public showFriendList: Array<CircleFriendVo> = [];//符合搜索条件的好友列表

    constructor(injector: Injector,
                private events: Events) {
        super(injector);
        this.groupId = this.navParams.get('groupId');

        //防止指针相同会同时修改数据，重新赋值
        let selectFriends = this.navParams.get('selectFriends');
        for (let i = 0; i < selectFriends.length; i++) {
            this.selectFriendList.push(selectFriends[i]);
        }

        this.selectCount = this.selectFriendList.length;
        this.showLoading();
        this.getCircleFriend();
    }

    //获取圈子好友
    getCircleFriend() {
        let url = this.apiUrls.getUrlCircleFriend();
        let params = {
            orgId: this.storageUtil.getOrgId(),
            userId: this.storageUtil.getUserId(),
            groupId: this.groupId
        }
        this.httpUtil.get({
            url: url, param: params, success: (res) => {
                this.friendList = this.friendList.concat(res.result);
                this.tagSelectFriend();
                this.showFriendList = this.showFriendList.concat(res.result);
            }, fail: (err) => {
                this.toast(err.message);
            }, finish: () => {
                this.dismissLoading();
            }
        });
    }

    //标记已选好友
    tagSelectFriend() {
        for (let i = 0; i < this.selectFriendList.length; i++) {
            for (let j = 0; j < this.friendList.length; j++) {
                if (this.selectFriendList[i].userId == this.friendList[j].userId) {
                    this.friendList[j] = this.selectFriendList[i];
                    break;
                }
            }
        }
    }

    //选择好友
    selectFriend(index: number) {
        if (!this.showFriendList[index].isSelect && this.selectCount >= this.maxSelectCount) {
            this.toast('最多只能@' + this.maxSelectCount + '个成员');
            return;
        }
        this.showFriendList[index].isSelect = !this.showFriendList[index].isSelect;
        if (this.showFriendList[index].isSelect) {
            this.selectCount++;
            this.selectFriendList.push(this.showFriendList[index]);
        } else {
            this.selectCount--;
            for (let i = 0; i < this.selectFriendList.length; i++) {
                if (this.selectFriendList[i].userId == this.showFriendList[index].userId) {
                    this.selectFriendList.splice(i, 1);
                    break;
                }
            }
        }
        for (let i = 0; i < this.friendList.length; i++) {
            if (this.friendList[i].userId == this.showFriendList[index].userId) {
                this.friendList[i].isSelect = this.showFriendList[index].isSelect;
                break;
            }
        }
    }

    searchFriend(searchKey: string) {
        this.showFriendList = [];
        for (let i = 0; i < this.friendList.length; i++) {
            if (this.friendList[i].nickName.indexOf(searchKey) > -1) {
                this.showFriendList.push(this.friendList[i]);
            }
        }
    }

    //完成
    completeSelectFriend() {
        this.events.publish(EventsConstants.SELECT_FRIEND, this.selectFriendList);
        this.goBack();
    }

    goBack() {
        this.navController.pop();
    }

}
