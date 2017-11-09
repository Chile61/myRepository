import { CategoryVo } from './CategoryVo';
import { UserInfo3rdVo } from './UserInfo3rdVo';


export class DiscussGroupVo{
    public groupId:number;//讨论组id
    public name:string;//讨论组名称
    public desc:string;//讨论组描述
    public remark:string;//讨论组公告
    public createDate:number;//创建时间(Unix Timestamp)
    public iconURL:string;//讨论组ICON URL
    public groupType:string;//圈子类型
    public category:CategoryVo;//归类信息
    public user:UserInfo3rdVo;//创建者信息
    public joinStatus:number;//当前用户的加入讨论组的状态 0：还没有加入；1：审核中；2：已加入； 3：审核不通过
    public membersCount:number;//人数
    public subjectsCount:number;//帖数
    public publishType:string;//圈子发布类型
}