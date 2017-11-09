

export class InformationVo {

    // 资讯id
    public id:number;
    // 资讯标题
    public title:string;
    // 图片/视频地址
    public url:string;
    // 条目的描述信息
    public content:string;
    // 1代表富文本，2代表纯文本 ，3代表超链接
    public type:number;
    // 发布时间
    public publishTime:number;
    // 评论数
    public commentCount:number;
    // 状态
    public state:number;
    // 1代表新闻 2代表公告
    public objType:number;

    constructor(){
        
    }
}