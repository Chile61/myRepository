import {Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy} from "@angular/core";
import {ActionSheetController, NavController, Events, Keyboard} from "ionic-angular";
import {CourseMiniVo} from "../../models/study/CourseMiniVo";
import {ImagePicker, Camera} from "ionic-native";
import {CourseSearchPage} from "../../pages/study/course-search/course-search";
import {ShowBigImgPage} from "../../core/show-bigimg-page/show-bigimg-page";
import {CourseCollectionPage} from "../../pages/study/course-collection/course-collection";
import {EmojiUtils} from "../../core/EmojiUtils";
import {EventsConstants} from "../../core/EventsConstants";
/**
 * Created by zxh on 2017/1/3.
 */

@Component({
    selector: 'comment-view',
    templateUrl: 'comment-view.html'
})
//评论控件
export class CommentView implements AfterViewInit,OnDestroy {

    private initialIsShowAnonymous: boolean = false;//初始值是否显示匿名
    private initialIsShowShowImage: boolean = false;//初始值是否显示选择图片
    private initialIsShowCourse: boolean = false;//初始值是否显示选择课程

    @Input() isShowAnonymous?: boolean = false;//是否显示匿名
    @Input() isShowImage?: boolean = false;//是否显示选择图片
    @Input() isShowCourse?: boolean = false;//是否显示选择课程

    @Output() postComment? = new EventEmitter();
    @Output() cancelInputComment? = new EventEmitter();

    public isInput: boolean = false;
    public emojiList: any = [];//表情
    public emojiTextList: any = [];//表情文字

    public sheetCtrl: any;

    public isShowEmoji: boolean = false;
    public isSelectImage: boolean = false;
    public isSelectCourse: boolean = false;
    public isAnonymous: boolean = false;

    public commentContent: string = '';

    private SELECT_MAX_IMAGE = 5;//最多选图数量
    public selectImageNum: number = 0;//已选图片的数量
    public imageUrls: any = [];
    private selectedImg: any = [];//已选图片

    public static SELECT_MAX_COURSE = 3;//最多选择课程的熟练
    public selectCourseNum: number = 0;//已选课程的数量
    public courseList: Array<CourseMiniVo> = [];
    private selectedCourse: Array<CourseMiniVo> = [];//已选课程

    emojiSlides = {
        initialSlides: 0,
        pager: true
    }

    constructor(private actionSheetCtrl: ActionSheetController,
                private navController: NavController,
                private events: Events,
                private emojiUtils: EmojiUtils,
                public keyboard: Keyboard) {
        this.initAddIcon();
        this.initEmoji();
        this.initEvents();
    }

    //组件初始化完成时
    ngAfterViewInit() {
        this.initData();
    }

    private initData() {
        this.initialIsShowShowImage = this.isShowImage;
        this.initialIsShowCourse = this.isShowCourse;
        this.initialIsShowAnonymous = this.isShowAnonymous;
    }

    //初始化图片、课程添加
    private initAddIcon() {
        this.imageUrls = ['assets/images/icon_addpic_unfocused.png'];
        this.selectImageNum = 0;
        this.selectedImg = [];
        let addCourse = new CourseMiniVo();
        addCourse.smallIcon = 'assets/images/icon_addpic_unfocused.png';
        this.selectCourseNum = 0;
        this.courseList = [addCourse];
        this.selectedCourse = [];
    }

    //初始化选择课程通知
    private initEvents() {
        this.events.subscribe(EventsConstants.SELECT_COURSE, (date) => {
            if (date.length > 0) {
                console.log(date[0]);
                this.showSelectCourse(date[0]);
            }
        });
    }

    //查看大图
    checkBigImg(index: number) {
        this.navController.push(ShowBigImgPage, {'imgUrls': this.selectedImg, 'selectImgNum': index});
    }

    //显示评论输入框
    showInput(isShowImage: boolean, isShowCourse: boolean, isShowAnonymous: boolean) {
        this.isShowImage = isShowImage;
        this.isShowCourse = isShowCourse;
        this.isShowAnonymous = isShowAnonymous;
        this.isInput = true;
    }

    //输入评论
    inputComment() {
        //恢复初始值
        this.isShowImage = this.initialIsShowShowImage;
        this.isShowCourse = this.initialIsShowCourse;
        this.isShowAnonymous = this.initialIsShowAnonymous;
        //显示输入框
        this.isInput = true;
        //显示出输入框马上获取焦点
        let inputID = setInterval(() => {
            if (document.getElementById('commentInput')) {
                document.getElementById('commentInput').focus();
                clearInterval(inputID);
            }
        }, 200);
    }

    //点击输入框隐藏图片、课程输入
    clickInput() {
        // this.isShowEmoji = false;
        this.isSelectImage = false;
        this.isSelectCourse = false;
    }

    //取消输入
    cancelInput() {
        this.isInput = false;
        this.isShowEmoji = false;
        this.isSelectImage = false;
        this.isSelectCourse = false;
        this.isAnonymous = false;
        this.commentContent = '';
        this.initAddIcon();
        this.cancelInputComment.emit();
    }

    //发送
    postCommentInput() {
        this.getCommentContent();
        this.postComment.emit({
            'commentContent': this.commentContent,
            'isAnonymous': this.isAnonymous,
            'imageUrls': this.selectedImg,
            'courseList': this.selectedCourse
        });
    }

    //关闭输入(发送成功后调用)
    closeCommentInput() {
        this.cancelInput();
    }

    //显示、隐藏表情
    showEmoji() {
        // if (this.keyboard.isOpen() == true) {
        //     this.keyboard.close();
        // }
        this.isSelectImage = false;
        this.isSelectCourse = false;
        this.isShowEmoji = !this.isShowEmoji;
    }

    //显示、隐藏图片
    showImage() {
        if (this.keyboard.isOpen() == true) {
            this.keyboard.close();
        }
        this.isShowEmoji = false;
        this.isSelectCourse = false;
        this.isSelectImage = !this.isSelectImage;
    }

    //显示、隐藏课程
    showCourse() {
        if (this.keyboard.isOpen() == true) {
            this.keyboard.close();
        }
        this.isShowEmoji = false;
        this.isSelectImage = false;
        this.isSelectCourse = !this.isSelectCourse;
    }

    //初始化表情
    initEmoji() {
        this.emojiList = this.emojiUtils.getEmojiList();
        this.emojiTextList = this.emojiUtils.getEmojiTextList();
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
                    document.getElementById('commentInput').replaceChild(newNode,nodes[nodes.length - 1]);
                    break;
                }
            }
            return;
        }
        document.getElementById('commentInput').focus();
        // let act = document.activeElement.id;
        // console.log(act);
        // if(act != 'commentInput'){
        //     document.getElementById('commentInput').focus();
        // }
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

    //获取评论内容
    getCommentContent() {
        this.commentContent = '';
        let nodes = document.getElementById('commentInput').childNodes;
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeName == '#text') {
                this.commentContent += nodes[i].textContent;
            } else if (nodes[i].nodeName == 'IMG') {
                this.commentContent += nodes[i].attributes.getNamedItem('img_code').value;
            }
        }
    }

    //选择图片
    selectImage(imageUrl: string, index: number) {
        if (imageUrl != 'assets/images/icon_addpic_unfocused.png') {
            this.checkBigImg(index);
            return;
        }
        this.sheetCtrl = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: '拍照上传',
                    handler: () => {
                        this.selectImageInCamera();
                        console.log('拍照上传');
                    }
                }, {
                    text: '从图库选择',
                    handler: () => {
                        this.selectImageInPhoto();
                        console.log('从图库选择');
                    }
                }, {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel');
                    }
                }
            ]
        });
        this.sheetCtrl.present();
    }

    //删除图片
    detailImage(index: number) {
        this.selectedImg = this.selectedImg.slice(0, index).concat(this.selectedImg.slice(index + 1, this.selectedImg.length));
        this.imageUrls = this.imageUrls.slice(0, index).concat(this.imageUrls.slice(index + 1, this.imageUrls.length));
        if (this.selectImageNum == this.SELECT_MAX_IMAGE) {
            this.imageUrls = this.imageUrls.concat('assets/images/icon_addpic_unfocused.png');
        }
        this.selectImageNum = this.selectedImg.length;
    }

    //选择课程
    selectCourse(imageUrl: string) {
        if (imageUrl != 'assets/images/icon_addpic_unfocused.png') {
            return;
        }
        this.sheetCtrl = this.actionSheetCtrl.create({
            buttons: [
                {
                    text: '从课程库选择',
                    handler: () => {
                        this.selectCourseInWare();
                        console.log('从课程库选择');
                    }
                }, {
                    text: '从我的收藏选择',
                    handler: () => {
                        this.selectCourseInCollection();
                        console.log('从我的收藏选择');
                    }
                }, {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel');
                    }
                }
            ]
        });
        this.sheetCtrl.present();
    }

    //删除课程
    detailCourse(course: CourseMiniVo) {
        for (let i = 0; i < this.selectedCourse.length; i++) {
            if (this.selectedCourse[i].courseId == course.courseId) {
                this.selectedCourse = this.selectedCourse.slice(0, i).concat(this.selectedCourse.slice(i + 1, this.selectedCourse.length));
                // this.selectedCourse.splice(i,1);
                this.courseList = this.courseList.slice(0, i).concat(this.courseList.slice(i + 1, this.courseList.length));
                if (this.selectCourseNum == CommentView.SELECT_MAX_COURSE) {
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

    //是否匿名切换
    clickAnonymous() {
        this.isAnonymous = !this.isAnonymous;
    }

    //从图库选择图片
    selectImageInPhoto() {
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
                    this.imageUrls.splice(this.imageUrls.length - 1 > 0 ? this.imageUrls.length - 1 : 0);
                    this.imageUrls = this.imageUrls.concat(imgUrls);
                    this.selectImageNum = this.imageUrls.length;
                    this.selectedImg = this.imageUrls;
                    if (this.imageUrls.length < this.SELECT_MAX_IMAGE) {
                        this.imageUrls = this.imageUrls.concat('assets/images/icon_addpic_unfocused.png');
                    }
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
            this.imageUrls.splice(this.imageUrls.length - 1 > 0 ? this.imageUrls.length - 1 : 0);
            this.imageUrls = this.imageUrls.concat(imageData);
            this.selectImageNum = this.imageUrls.length;
            this.selectedImg = this.imageUrls;
            if (this.imageUrls.length < this.SELECT_MAX_IMAGE) {
                this.imageUrls = this.imageUrls.concat('assets/images/icon_addpic_unfocused.png');
            }
        }, (err) => {
            console.log(err);
        });
    }

    //从课程库选择课程
    selectCourseInWare() {
        this.navController.push(CourseSearchPage, {isSelectCourse: true, selectedCourse: this.selectedCourse});
    }

    //从我的收藏选择课程
    selectCourseInCollection() {
        this.navController.push(CourseCollectionPage, {isSelectCourse: true, selectedCourse: this.selectedCourse});
    }

    //显示选择的课程
    showSelectCourse(selectCourseList: Array<CourseMiniVo>) {
        if (selectCourseList && selectCourseList.length > 0) {
            this.courseList.splice(this.courseList.length - 1 > 0 ? this.courseList.length - 1 : 0);
            this.courseList = selectCourseList;
            this.selectedCourse = this.courseList;
            this.selectCourseNum = this.selectedCourse.length;
            if (this.courseList.length < CommentView.SELECT_MAX_COURSE) {
                let addCourse = new CourseMiniVo();
                addCourse.smallIcon = 'assets/images/icon_addpic_unfocused.png';
                this.courseList = this.courseList.concat(addCourse);
            }
        }
    }

    ngOnDestroy() {
        //界面销毁
        this.events.unsubscribe(EventsConstants.SELECT_COURSE);
    }

}
