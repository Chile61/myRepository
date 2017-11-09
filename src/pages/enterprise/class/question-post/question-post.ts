import { FileUtils } from '../../../../core/FileUtils';
import { BasePage } from '../../../../core/base-page/BasePage';
import { Component, Injector } from '@angular/core';
import { Events, ActionSheetController } from 'ionic-angular';
import { EventsConstants } from '../../../../core/EventsConstants';
import { EmojiUtils } from '../../../../core/EmojiUtils';
import { ImagePicker, Camera } from 'ionic-native';
import { ShowBigImgPage } from '../../../../core/show-bigimg-page/show-bigimg-page';

@Component({
    selector: 'page-question-post',
    templateUrl: 'question-post.html'
})
export class ClassPostQuestionPage extends BasePage {
    private classId: number;
    public classTitle: string = '';//班级标题
    public classContent: string = '';//班级内容
    public className: string = '';//班级的名称

    public SELECT_MAX_IMAGE = 5;//最多选图数量
    public selectImageNum: number = 0;//已选图片的数量
    public imageUrls: any = [];//上传成功图片服务器地址
    public selectedImg: any = [];//已选图片
    public selectFriend: any = [];//已选好友
    private uploadImageNum = 0;

    public emojiList: any = [];//表情
    public emojiTextList: any = [];//表情文字
    public isShowEmoji: boolean = false;//是否显示表情
    emojiSlides = {
        initialSlides: 0,
        pager: true
    }
    constructor(injector: Injector, public events: Events, public fileUtils: FileUtils, public emojiUtils: EmojiUtils, public actionSheetCtrl: ActionSheetController) {
        super(injector);
        this.classId = this.navParams.get('classId');
        this.initEmoji();
    }
    //检查话题
    checkTopic() {
        this.getCommentContent();
        if ((this.classTitle == null || this.classTitle == '') || (this.classContent == null || this.classContent == '')) {
            this.toast('请输入标题和内容');
            return;
        }
        if ((this.classTitle != null && this.classTitle != '' && this.classTitle.length < 5)) {
            this.toast('亲，标题至少需要5个字哦');
            return;
        }
        if ((this.classContent != null && this.classContent != '' && this.classContent.length < 15)) {
            this.toast('亲，发表的内容至少需要15个字哦');
            return;
        }
        if (this.selectedImg.length > 0) {
            this.upLoadFile();
        } else {
            this.postClassQuestion();
        }

    }
    //获取内容框中的内容
    getCommentContent() {
        this.classContent = '';
        let nodes = document.getElementById('commentInput').childNodes;
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeName == '#text') {
                this.classContent += nodes[i].textContent;
            } else if (nodes[i].nodeName == 'IMG') {
                this.classContent += nodes[i].attributes.getNamedItem('img_code').value;
            }
        }
    }
    //发表问答
    postClassQuestion() {
        this.showLoading();
        let urls = this.apiUrls.postClassQuestion() + '/'
            + this.storageUtil.getOrgId() + '/'
            + this.storageUtil.getUserId() + '/'
            + this.classId;
        let ClassQnaPVo = {
            title: this.classTitle,
            content: this.classContent,
            imgURLs: this.imageUrls
        };
        this.httpUtil.post({
            url: urls,
            param: ClassQnaPVo,
            success: (res) => {
                this.events.publish(EventsConstants.POST_CLASS_QUESTION);
                this.navController.pop();
            },
            fail: (res) => {
                this.toast(res.msg);
            },
            finish: () => {
                this.dismissLoading();
            }
        });
    }
    //上传图片
    upLoadFile() {
        if (this.imageUrls.length > 0) {
            let i = this.imageUrls.length;
        } else {
            let i = 0;
        }
        if (this.selectedImg.length > 0) {
            for (let i; i < this.selectedImg.length; i++) {
                let urls = this.apiUrls.postUploadFile() + "/" + this.storageUtil.getOrgId() + "/" + this.storageUtil.getUserId();
                this.fileUtils.upload({
                    url: urls,
                    localPath: this.selectedImg[i],
                    success: (response) => {
                        this.uploadImageNum++;
                        if (response && response.code == 0) {
                            this.imageUrls[i] = this.imageUrls.concat(response.result);
                        }
                        if (this.uploadImageNum == this.selectedImg.length) {
                            this.postClassQuestion();
                        }
                    },
                    error: () => {
                        this.uploadImageNum++;
                        if (this.uploadImageNum == this.selectedImg.length) {
                            this.postClassQuestion();
                        }
                        this.toast('图片发送失败');
                    }

                });
            }
        }
    }
    //初始化表情
    initEmoji() {
        this.emojiList = this.emojiUtils.getEmojiList();
        this.emojiTextList = this.emojiUtils.getEmojiTextList();
    }
    //表情标签转图片
    transSmiles(commentContent: string) {
        return this.emojiUtils.transSmiles(commentContent);
    }
    //选择表情
    selectEmoji(index1: number, index2: number) {
        if (this.emojiTextList[index1][index2] == 'delete_btn') {//删除
            let nodes = document.getElementById('commentInput').childNodes;
            console.log(nodes);
            for (; nodes.length > 0;) {
                if (nodes[nodes.length - 1].nodeName == '#text' && (!nodes[nodes.length - 1].textContent || nodes[nodes.length - 1].textContent == '')) {
                    document.getElementById('commentInput').removeChild(nodes[nodes.length - 1]);
                } else if (nodes[nodes.length - 1].nodeName == 'IMG') {
                    document.getElementById('commentInput').removeChild(nodes[nodes.length - 1]);
                    break;
                } else {
                    let newNode = document.createElement('text');
                    let nodeContent = nodes[nodes.length - 1].textContent.slice(0, nodes[nodes.length - 1].textContent.length - 1);
                    newNode.textContent = nodeContent;
                    document.getElementById('commentInput').replaceChild(newNode, nodes[nodes.length - 1]);
                    break;
                }
            }
            return;
        }
        document.getElementById('commentInput').focus();
        if (window.getSelection) {
            // IE9 and non-IE
            var sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                var range = sel.getRangeAt(0);
                range.deleteContents();
                // Range.createContextualFragment() would be useful here but is
                // non-standard and not supported in all browsers (IE9, for one)
                var ss = document.createElement('div');
                ss.innerHTML = '<img src="' + this.emojiList[index1][index2] + '" img_code="' + this.emojiTextList[index1][index2] + '">';
                var frag = document.createDocumentFragment(), node, lastNode;
                while ((node = ss.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);
                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        }
    }
    //从图库选择图片
    selectPicture() {
        console.log(window.navigator.userAgent);
        if (window.navigator.userAgent.indexOf('Android') > 0 || window.navigator.userAgent.indexOf('iPhone') > 0) {
            let options1 = {
                maximumImagesCount: this.SELECT_MAX_IMAGE - this.selectImageNum,
                width: 1000,
                height: 1000,
                quality: 100
            };
            ImagePicker.getPictures(options1).then((imgUrls) => {
                if (imgUrls.length > 0) {
                    this.selectedImg = this.selectedImg.concat(imgUrls);
                    this.selectImageNum = this.selectedImg.length;
                }
            });
        } else if (window.navigator.userAgent.indexOf('Win') > 0) {
            console.log('Win');
            alert('暂不支持');
        } else if (window.navigator.userAgent.indexOf('Mac') > 0) {
            console.log('Mac');
            alert('暂不支持');
        } else {
            alert('暂不支持');
        }
    }
    //从相机拍照
    selectImageInCamera() {
        let options = {
            //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
            quality: 100,                                            //相片质量0-100
            destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
            sourceType: Camera.PictureSourceType.CAMERA,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照CAMERA=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
            allowEdit: false,                                        //在选择之前允许修改截图
            encodingType: Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
            targetWidth: 1000,                                        //照片宽度
            targetHeight: 1000,                                       //照片高度
            mediaType: 0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
            cameraDirection: 0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
            saveToPhotoAlbum: true,                                   //保存进手机相册
        };
        Camera.getPicture(options).then((imageData) => {
            this.selectedImg = this.selectedImg.concat(imageData);
            this.selectImageNum = this.selectedImg.length;
        }, (err) => {
            console.log(err);
        });
    }
    //选择图片
    addPicture() {
        let actionSheet = this.actionSheetCtrl.create({
            title: '',
            buttons: [
                {
                    text: '拍照上传',
                    handler: () => {
                        this.selectImageInCamera();
                    }
                }, {
                    text: '从图库选择',
                    handler: () => {
                        this.selectPicture();
                    }
                }, {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                        console.log('cancel');
                    }
                }
            ]
        });
        actionSheet.present();
    }
    //查看大图
    checkBigImg(index: number) {
        this.navController.push(ShowBigImgPage, { 'imgUrls': this.selectedImg, 'selectImgNum': index });
    }
    //显示、隐藏表情
    showEmoji() {
        this.isShowEmoji = !this.isShowEmoji;
    }
}