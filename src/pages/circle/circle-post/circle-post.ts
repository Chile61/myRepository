import { NormalHeaderComponent } from '../../../components/normal-header/normal-header';
import { BasePage } from '../../../core/base-page/BasePage';
import { Component, Injector, ViewChild } from '@angular/core';
import { ImagePicker, Camera } from 'ionic-native';
import { ShowBigImgPage } from '../../../core/show-bigimg-page/show-bigimg-page';
import { ActionSheetController, Events } from 'ionic-angular';
import { SelectCirclePage } from '../circle-select/circle-select';
import { ShowPicturePage } from '../circle-showPicture/circle-showPicture';
import { EventsConstants } from '../../../core/EventsConstants';
import { CourseSearchPage } from '../../study/course-search/course-search';
import { CourseCollectionPage } from '../../study/course-collection/course-collection';
import { CourseMiniVo } from '../../../models/study/CourseMiniVo';
import { FileUtils } from '../../../core/FileUtils';
import { SelectCircleFriendPage } from "../select-circle-friend/select-circle-friend";
import { ConfigKey } from '../../../core/storage/ConfigKey';
import { DiscussSubjectMiniVo } from '../../../models/circle/DiscussSubjectMiniVo';
import { DisAttachCourseVo } from '../../../models/circle/DisAttachCourseVo';
import { UserInfo3rdVo } from '../../../models/circle/UserInfo3rdVo';
import { EmojiUtils } from '../../../core/EmojiUtils';

@Component({
    selector: 'page-circle-post',
    templateUrl: 'circle-post.html'
})
export class CirclePostPage extends BasePage {
    @ViewChild('NormalHeaderComponent') normalHeader: NormalHeaderComponent;
    public myCircleList = [];//已加入的圈子

    public SELECT_MAX_IMAGE = 6;//最多选图数量
    public selectImageNum: number = 0;//已选图片的数量
    public imageUrls: any = [];//上传成功图片服务器地址
    public selectedImg: any = [];//已选图片
    public selectFriend: any = [];//已选好友
    private uploadImageNum = 0;

    public isHasAnonymous: boolean = false;//是否有匿名功能
    public isShowEmoji: boolean = false;//是否显示表情
    public isSelectCourse: boolean = false;//是否显示选择课程
    public isAnonymous: boolean = false;//是否显示匿名
    public isShowFriend: boolean = false;//是否显示@好友
    public inviteeUsers: Array<UserInfo3rdVo>;

    public emojiList: any = [];//表情
    public emojiTextList: any = [];//表情文字

    public circleTitle: string = '';//圈子标题
    public circleContent: string = '';//圈子内容
    public circleName: string = '';//圈子的名称
    public circleId: number;//圈子id

    public SELECT_MAX_COURSE = 3;//最多选择课程的熟练
    public selectCourseNum: number = 0;//已选课程的数量
    public courseList: Array<CourseMiniVo> = [];
    private selectedCourse: Array<CourseMiniVo> = [];//已选课程

    public isEdit: boolean = false;//是否可编辑话题
    public discussSubjectMiniVo: DiscussSubjectMiniVo;//编辑话题的内容
    public isShowMyCircle: boolean = true;//是否显示选择圈子
    public postTitle: string = '发送话题';//发送话题or编辑话题
    public editContent: string = '';//编辑话题的内容
    emojiSlides = {
        initialSlides: 0,
        pager: true
    }

    constructor(injector: Injector, public actionSheetCtrl: ActionSheetController, private emojiUtils: EmojiUtils, public events: Events, private fileUtils: FileUtils, ) {
        super(injector);
        this.initEmoji();
    }
    ionViewWillEnter() {
        this.circleId = this.storageUtil.getStorageValue("circleId", -1);
        this.isEdit = this.navParams.get('isEdit') || false;
        let anonymousFlag = this.storageUtil.getStorageValue(ConfigKey.CIRCLE_ALLOW_ANONYMOUS_FLAG, 'N');
        if (anonymousFlag == 'Y') {
            this.isHasAnonymous = true;
        } else {
            this.isHasAnonymous = false;
        }
        if (this.isEdit) {
            this.initEdit();
        } else {
            this.postTitle = '发送话题';
            this.isShowMyCircle = true;
            this.initAddIcon();
            this.getMyCircleGroups();
        }
        this.normalHeader.initComponent(true, false, this.postTitle, false, false, true, '发送');
        this.events.subscribe(EventsConstants.SELECT_FRIEND, (data) => {
            if (data && data.length > 0) {
                this.selectFriend = data[0];
            }
        });
        this.events.subscribe(EventsConstants.SELECT_COURSE, (data) => {
            if (data.length > 0) {
                this.showSelectCourse(data[0]);
            }
        });
        this.events.subscribe(EventsConstants.DELETE_PICTURE, (data) => {
            if (data.length > 0) {
                this.selectedImg = data[0];
                this.selectImageNum = this.selectedImg.length;
            } else {
                this.selectedImg = [];
            }

        });
    }
    //初始化编辑话题
    initEdit() {
        this.discussSubjectMiniVo = this.navParams.get('discussSubjectMiniVo');
        this.postTitle = '编辑话题';
        this.isShowMyCircle = false;
        this.circleId = this.discussSubjectMiniVo.groupId;
        this.circleTitle = this.discussSubjectMiniVo.title;
        this.circleContent = this.discussSubjectMiniVo.content;
        this.editContent = this.circleContent;
        this.imageUrls = this.discussSubjectMiniVo.imgURLs;
        this.selectedCourse = this.discussSubjectMiniVo.attachCourses;
        this.selectFriend = this.discussSubjectMiniVo.inviteeUsers;

        if (this.selectedCourse.length < this.SELECT_MAX_IMAGE) {
            let addCourse = new CourseMiniVo();
            addCourse.smallIcon = 'assets/images/icon_addpic_unfocused.png';
            this.courseList = this.selectedCourse.concat(addCourse);
        }

        this.selectCourseNum = this.selectedCourse.length;
        if (this.discussSubjectMiniVo.anonymousFlag == 1) {
            this.isAnonymous = true;
        } else if (this.discussSubjectMiniVo.anonymousFlag == 0) {
            this.isAnonymous = false;
        }
    }
    //检查话题
    checkTopic() {
        this.getCommentContent();
        if ((this.circleTitle == null || this.circleTitle == '') && (this.circleContent == null || this.circleContent == '')) {
            this.toast('请输入标题或者内容');
            return;
        }
        if ((this.circleTitle != null && this.circleTitle != '' && this.circleTitle.length < 5)) {
            this.toast('亲，标题至少需要5个字哦');
            return;
        }
        if ((this.circleContent != null && this.circleContent != '' && this.circleContent.length < 15)) {
            this.toast('亲，发表的内容至少需要15个字哦');
            return;
        }
        if (this.circleId == null || this.circleId < 0) {
            this.toast('亲，请选择圈子');
            return;
        }
        if (this.selectedImg && this.selectedImg.length > 0) {
            this.showLoading();
            this.upLoadFile();
        } else {
            if (this.isEdit) {
                this.postEditTopic();
            } else {
                this.postTopic();
            }
        }

    }
    //发送修改话题
    postEditTopic() {
        let userIds = [];//@好友ID
        if (this.selectFriend) {
            for (let i = 0; i < this.selectFriend.length; i++) {
                userIds.push(this.selectFriend[i].userId);
            }
        }
        this.showLoading();
        let urls = this.apiUrls.postUpdateSubject() + '/' + this.storageUtil.getOrgId() + '/' + this.storageUtil.getUserId() + '/' + this.discussSubjectMiniVo.subjectId;
        let discussSubjectVo = {
            title: this.circleTitle,
            content: this.circleContent,
            categoryId: this.storageUtil.getStorageValue("categoryId", '0'),
            attachCourses: this.selectedCourse,
            imgURLs: this.imageUrls,
            inviteeUserIds: userIds,
            anonymousFlag: this.isAnonymous ? 1 : 0
        }
        this.httpUtil.post({
            url: urls,
            param: discussSubjectVo,
            success: (res) => {
                this.events.publish(EventsConstants.EDIT_TOPIC);
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
    //发送话题
    postTopic() {
        let userIds = [];//@好友ID
        for (let i = 0; i < this.selectFriend.length; i++) {
            userIds.push(this.selectFriend[i].userId);
        }
        this.showLoading();
        let discussSubjectVo = {
            title: this.circleTitle,
            content: this.circleContent,
            categoryId: this.storageUtil.getStorageValue("categoryId", '0'),
            attachCourses: this.selectedCourse,
            imgURLs: this.imageUrls,
            inviteeUserIds: userIds,
            anonymousFlag: this.isAnonymous ? 1 : 0
        };
        this.httpUtil.post({
            url: this.apiUrls.postSubject() + '/' + this.storageUtil.getOrgId() + '/' + this.storageUtil.getUserId() + '/' + this.circleId,
            param: discussSubjectVo,
            success: (res) => {
                //保存上一次发送圈子的id
                this.storageUtil.setStorageValue('circleId', this.circleId);
                this.events.publish(EventsConstants.POST_TOPIC);
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

    //初始化表情
    initEmoji() {
        this.emojiList = this.emojiUtils.getEmojiList();
        this.emojiTextList = this.emojiUtils.getEmojiTextList();
    }
    //表情标签转图片
    transSmiles(commentContent: string) {
        return this.emojiUtils.transSmiles(commentContent);
    }
    //初始化课程添加
    private initAddIcon() {
        this.selectImageNum = 0;
        this.selectedImg = [];
        let addCourse = new CourseMiniVo();
        addCourse.smallIcon = 'assets/images/icon_addpic_unfocused.png';
        this.selectCourseNum = 0;
        this.courseList = [addCourse];
        this.selectedCourse = [];
    }

    //选择表情
    selectEmoji(index1: number, index2: number) {
        if (this.emojiTextList[index1][index2] == 'delete_btn') {//删除
            let nodes = document.getElementById('commentInput').childNodes;
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

    //获取已加入的圈子列表
    getMyCircleGroups() {
        this.showLoading();
        let params = {
            userId: this.storageUtil.getUserId(),
            orgId: this.storageUtil.getOrgId(),
            pageNum: 1,
            pageSize: 0
        };
        this.httpUtil.get({
            url: this.apiUrls.getMyAllGroups(), param: params, success: (res) => {
                if (res.result == null || res.result == '') {
                    this.myCircleList = null;
                    return;
                }
                this.myCircleList = res.result;
            }, fail: (res) => {
                this.toast(res.msg);
            }, finish: () => {
                this.dismissLoading();
            }
        });
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

    //上传图片
    upLoadFile() {
        for (let i = 0; i < this.selectedImg.length; i++) {
            let urls = this.apiUrls.postUploadFile() + "/" + this.storageUtil.getOrgId() + "/" + this.storageUtil.getUserId();
            this.fileUtils.upload({
                url: urls,
                localPath: this.selectedImg[i],
                success: (response) => {
                    this.uploadImageNum++;
                    if (response && response.code == 0) {
                        this.imageUrls[i] = response.result;
                    }
                    if (this.uploadImageNum == this.selectedImg.length) {
                        this.dismissLoading();
                        if (this.isEdit) {
                            this.postEditTopic();
                        } else {
                            this.postTopic();
                        }
                    }
                },
                error: () => {
                    this.uploadImageNum++;
                    if (this.uploadImageNum == this.selectedImg.length) {
                        this.dismissLoading();
                        if (this.isEdit) {
                            this.postEditTopic();
                        } else {
                            this.postTopic();
                        }
                    }
                    this.toast('图片发送失败');
                },
            });
        }
        //       }
    }

    //查看大图
    checkBigImg(index: number) {
        this.navController.push(ShowBigImgPage, { 'imgUrls': this.selectedImg, 'selectImgNum': index });
    }

    //显示、隐藏表情
    showEmoji() {
        this.isSelectCourse = false;
        this.isShowFriend = false;
        this.isAnonymous = false;
        this.isShowEmoji = !this.isShowEmoji;
    }

    //控制选中圈子图标
    SelectIconFun(groupId: number) {
        this.circleId = groupId;

    }

    ionViewWillUnload() {
        this.events.unsubscribe(EventsConstants.SELECT_COURSE);
        this.events.unsubscribe(EventsConstants.SELECT_FRIEND);
        this.events.unsubscribe(EventsConstants.DELETE_PICTURE);
    }

    //编辑图片
    editPicture(selectedImg: any) {
        this.navController.push(ShowBigImgPage, { imgUrls: selectedImg, isDelete: true });
    }

    //获取内容框中的内容
    getCommentContent() {
        this.circleContent = '';
        let nodes = document.getElementById('commentInput').childNodes;
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeName == '#text') {
                this.circleContent += nodes[i].textContent;
            } else if (nodes[i].nodeName == 'IMG') {
                this.circleContent += nodes[i].attributes.getNamedItem('img_code').value;
            }
        }
    }

    //选择课程
    selectCourse(imageUrl: string) {
        if (imageUrl != 'assets/images/icon_addpic_unfocused.png') {
            return;
        }
        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: '从课程库选择',
                    handler: () => {
                        this.selectCourseInWare();
                    }
                }, {
                    text: '从我的收藏选择',
                    handler: () => {
                        this.selectCourseInCollection();
                    }
                }, {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                    }
                }
            ]
        });
        actionSheet.present();
    }

    //从课程库选择课程
    selectCourseInWare() {
        this.navController.push(CourseSearchPage, { isSelectCourse: true, selectedCourse: this.selectedCourse });
    }

    //从我的收藏选择课程
    selectCourseInCollection() {
        this.navController.push(CourseCollectionPage, { isSelectCourse: true, selectedCourse: this.selectedCourse });
    }

    //删除课程
    deleteCourse(course: CourseMiniVo) {
        for (let i = 0; i < this.selectedCourse.length; i++) {
            if (this.selectedCourse[i].courseId == course.courseId) {
                this.selectedCourse = this.selectedCourse.slice(0, i).concat(this.selectedCourse.slice(i + 1, this.selectedCourse.length));
                // this.selectedCourse.splice(i,1);
                this.courseList = this.courseList.slice(0, i).concat(this.courseList.slice(i + 1, this.courseList.length));
                if (this.selectCourseNum == this.SELECT_MAX_COURSE) {
                    let addCourse = new CourseMiniVo();
                    addCourse.smallIcon = 'assets/images/icon_addpic_unfocused.png';
                    this.courseList = this.courseList.concat(addCourse);
                }
                // this.courseList.splice(i,1);
                this.selectCourseNum = this.selectedCourse.length;
                break;
            }
        }
    }

    //显示选择的课程
    showSelectCourse(selectCourseList: Array<CourseMiniVo>) {
        if (selectCourseList && selectCourseList.length > 0) {
            this.courseList.splice(this.courseList.length - 1 > 0 ? this.courseList.length - 1 : 0);
            this.courseList = selectCourseList;
            this.selectedCourse = this.courseList;
            this.selectCourseNum = this.selectedCourse.length;
            if (this.courseList.length < this.SELECT_MAX_COURSE) {
                let addCourse = new CourseMiniVo();
                addCourse.smallIcon = 'assets/images/icon_addpic_unfocused.png';
                this.courseList = this.courseList.concat(addCourse);
            }
        }
    }

    //显示、隐藏课程
    showCourse() {
        this.isShowEmoji = false;
        this.isShowFriend = false;
        this.isAnonymous = false;
        this.isSelectCourse = !this.isSelectCourse;
    }

    //显示或隐藏@好友界面
    showSelectFriend() {
        this.isShowEmoji = false;
        this.isSelectCourse = false;
        this.isAnonymous = false;
        this.isShowFriend = !this.isShowFriend;
    }

    //显示或者隐藏匿名
    showAnonymous() {
        this.isShowEmoji = false;
        this.isSelectCourse = false;
        this.isShowFriend = false;
        this.isAnonymous = !this.isAnonymous;
    }

    //删除@的好友
    deleteSelectFriend() {
        if (this.selectFriend.length < 1) {
            return;
        }
        let prompt = this.alertCtrl.create({
            title: '提示',
            message: '确定要清除邀请好友列表吗?',
            buttons: [
                {
                    text: '取消',
                    handler: () => {

                    }
                },
                {
                    text: '确定',
                    handler: () => {
                        this.selectFriend = [];
                    }
                }
            ]
        });
        prompt.present();
    }

    //前往选择好友界面
    toSelectFriend() {
        if (this.circleId) {
            this.navController.push(SelectCircleFriendPage, { groupId: this.circleId, selectFriends: this.selectFriend });
        } else {
            this.toast('请先选择圈子');
        }
    }
    goBackClick() {
        this.navController.pop();
    }
}
