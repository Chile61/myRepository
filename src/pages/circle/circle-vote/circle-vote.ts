import {Component, Injector} from '@angular/core';
import {BasePage} from "../../../core/base-page/BasePage";
import {Camera} from "ionic-native";
import {CircleNewTopicPage} from "../circle-new-topic/circle-new-topic";
@Component({
    selector: 'page-circle-vote',
    templateUrl: 'circle-vote.html'
})
export class CircleVotePage extends BasePage {
    public theme: string;
    public Options: Array<string>;
    // public iconURLArr: any = [];
    // public isSelectIcon:boolean=false;
    public Groups: any;
    public groupId: number;
    public selectOptions;
    public myDate;

    constructor(injector: Injector) {
        super(injector);
        this.Options = ['1', '2'];
        this.showLoading();
        this.getMyAllGroups();
    }

    //增加选项
    AddOptions() {
        let add = ['1'];
        this.Options = this.Options.concat(add);
    }

    //删除选项
    DeleteOptions() {
        this.Options.pop()
    }

    //选中圈子(配图)
    SelectIconFun(j) {
        for (let i = 0; i < this.Groups.length; i++) {
            this.Groups[i].select = false;
        }
        this.Groups[j].select = true;
        this.groupId = this.Groups[j].groupId;
    }

    //页列出我的圈子[GET]
    getMyAllGroups() {
        this.httpUtil.get({
            url: this.apiUrls.getMyAllGroups(),
            param: {
                'userId': this.storageUtil.getUserId(),
                'orgId': this.storageUtil.getOrgId(),
                'pageNum': 1,
                'pageSize': 0
            },
            success: (data) => {
                console.log('分页列出我的圈子[GET]');
                console.log(data);
                this.Groups = data.result;

                for (let i = 0; i < this.Groups.length; i++) {
                    if(i==0){
                        this.Groups[0].select = true;
                    }else {
                        this.Groups[i].select = false;
                    }

                }
                this.dismissLoading();
            },
            fail: (data) => {
                console.log(data)
            }
        });
    }

    //发起投票
    postVoteSubjectFun() {
        console.log(Date.parse(this.myDate))
        console.log(this.selectOptions);

        if (!this.theme) {
            this.toast('主题内容不能为空');
            return;
        }

        let voteItems = [];
        for (let i = 0; i < this.Options.length; i++) {
            if ((document.getElementById('options' + i) as HTMLInputElement).value) {
                voteItems.push((document.getElementById('options' + i) as HTMLInputElement).value);
            } else {
                this.toast('选项值不能为空');
                return;
            }
        }
        if (!this.selectOptions) {
            this.toast('投票类型不能为空');
            return;
        }
        if (!this.myDate) {
            this.toast('结束时间不能为空');
            return;
        }
        this.httpUtil.post({
            url: this.apiUrls.postVoteSubject() + '/' + this.storageUtil.getOrgId() + '/' + this.storageUtil.getUserId() + '/' + this.groupId,
            param: {
                "voteItems": voteItems,
                "imgURL": null,
                "title": this.theme,
                "voteType": this.selectOptions == 1 ? 1 : 2,
                "endTime": Date.parse(this.myDate),
                "voteNum": this.selectOptions > 1 ? this.selectOptions : 1
            },
            success: (data) => {
                console.log('发起投票');
                console.log(data);

                this.navController.pop();
            },
            fail: (data) => {
                console.log(data)
            }
        });
    }


    // //从相机拍照
    // selectImageInCamera() {
    //     let options = {
    //         //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
    //         quality: 100,                                            //相片质量0-100
    //         destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
    //         sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照CAMERA=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
    //         allowEdit: false,                                        //在选择之前允许修改截图
    //         encodingType: Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
    //         targetWidth: 1000,                                        //照片宽度
    //         targetHeight: 1000,                                       //照片高度
    //         mediaType: 0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
    //         cameraDirection: 0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
    //         saveToPhotoAlbum: true,                                   //保存进手机相册
    //     };
    //     Camera.getPicture(options).then((imageData) => {
    //
    //     }, (err) => {
    //         console.log(err);
    //     });
    // }
}
