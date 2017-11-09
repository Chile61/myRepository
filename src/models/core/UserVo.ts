/**
 * Created by zxh on 2016/12/17.
 */
//用户信息
export class UserVo {
    public static SEX_UNKNOWN:number = 0;    // 未知
    public static SEX_MALE:number = 1;       // 男
    public static SEX_FEMALE:number = 2;     // 女

    userId: number;
    nickName: string;
    realName: string;
    avatarUrl: string;
    titleCode: string;
    titleName: string;
    level: string;
    remark: string;
    indexKey: string;
    nickIndexKey: string;
    sex: number;
    orgId: number;
}
