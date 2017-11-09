/**
 * Created by zxh on 2017/2/14.
 */
export class CircleFriendVo {
    userId: number;
    realName: string;
    nickName: string;
    sex: number;
    indexKey: string;
    nickIndexKey: string;
    avasterURL: string;

    isSelect: boolean = false;//是否被选中,@好友时使用
    isShow: boolean = true;//是否显示,@好友时使用

}
