import { Injectable } from "@angular/core";
/**
 * Created by zxh on 2017/1/10.
 */
@Injectable()
export class EmojiUtils {

    public emoji001 = "[微笑]";
    public emoji002 = "[撇嘴]";
    public emoji003 = "[色]";
    public emoji004 = "[发呆]";
    public emoji005 = "[得意]";
    public emoji006 = "[流泪]";
    public emoji007 = "[害羞]";
    public emoji008 = "[闭嘴]";
    public emoji009 = "[睡]";
    public emoji010 = "[大哭]";
    public emoji011 = "[尴尬]";
    public emoji012 = "[发怒]";
    public emoji013 = "[调皮]";
    public emoji014 = "[呲牙]";
    public emoji015 = "[惊讶]";
    public emoji016 = "[难过]";
    public emoji017 = "[酷]";
    public emoji018 = "[冷汗]";
    public emoji019 = "[抓狂]";
    public emoji020 = "[吐]";
    public emoji021 = "[偷笑]";
    public emoji022 = "[愉快]";
    public emoji023 = "[白眼]";
    public emoji024 = "[傲慢]";
    public emoji025 = "[饥饿]";
    public emoji026 = "[困]";
    public emoji027 = "[惊恐]";
    public emoji028 = "[流汗]";
    public emoji029 = "[憨笑]";
    public emoji030 = "[悠闲]";
    public emoji031 = "[奋斗]";
    public emoji032 = "[咒骂]";
    public emoji033 = "[疑问]";
    public emoji034 = "[嘘]";
    public emoji035 = "[晕]";
    public emoji036 = "[疯了]";
    public emoji037 = "[衰]";
    public emoji038 = "[骷髅]";
    public emoji039 = "[敲打]";
    public emoji040 = "[再见]";
    public emoji041 = "[擦汗]";
    public emoji042 = "[抠鼻]";
    public emoji043 = "[鼓掌]";
    public emoji044 = "[糗大了]";
    public emoji045 = "[坏笑]";
    public emoji046 = "[左哼哼]";
    public emoji047 = "[右哼哼]";
    public emoji048 = "[哈欠]";
    public emoji049 = "[鄙视]";
    public emoji050 = "[委屈]";
    public emoji051 = "[快哭了]";
    public emoji052 = "[阴险]";
    public emoji053 = "[亲亲]";
    public emoji054 = "[吓]";
    public emoji055 = "[可怜]";
    public emoji056 = "[菜刀]";
    public emoji057 = "[西瓜]";
    public emoji058 = "[啤酒]";
    public emoji059 = "[篮球]";
    public emoji060 = "[乒乓]";
    public emoji061 = "[咖啡]";
    public emoji062 = "[饭]";
    public emoji063 = "[猪头]";
    public emoji064 = "[玫瑰]";
    public emoji065 = "[凋谢]";
    public emoji066 = "[嘴唇]";
    public emoji067 = "[爱心]";
    public emoji068 = "[心碎]";
    public emoji069 = "[蛋糕]";
    public emoji070 = "[闪电]";
    public emoji071 = "[炸弹]";
    public emoji072 = "[刀]";
    public emoji073 = "[足球]";
    public emoji074 = "[瓢虫]";
    public emoji075 = "[便便]";
    public emoji076 = "[月亮]";
    public emoji077 = "[太阳]";
    public emoji078 = "[礼物]";
    public emoji079 = "[拥抱]";
    public emoji080 = "[强]";
    public emoji081 = "[弱]";
    public emoji082 = "[握手]";
    public emoji083 = "[胜利]";
    public emoji084 = "[抱拳]";
    public emoji085 = "[勾引]";
    public emoji086 = "[拳头]";
    public emoji087 = "[差劲]";
    public emoji088 = "[爱你]";
    public emoji089 = "[NO]";
    public emoji090 = "[OK]";
    public emoji091 = "[双喜]";
    public emoji092 = "[鞭炮]";
    public emoji093 = "[灯笼]";
    public emoji094 = "[发财]";
    public emoji095 = "[K歌]";
    public emoji096 = "[购物]";
    public emoji097 = "[邮件]";
    public emoji098 = "[帅]";
    public emoji099 = "[喝彩]";
    public emoji100 = "[祈祷]";
    public emoji101 = "[爆筋]";
    public emoji102 = "[棒棒糖]";
    public emoji103 = "[喝奶]";
    public emoji104 = "[下面]";
    public emoji105 = "[香蕉]";
    public emoji106 = "[飞机]";
    public emoji107 = "[开车]";
    public emoji108 = "[高铁左车头]";
    public emoji109 = "[车厢]";
    public emoji110 = "[高铁右车头]";
    public emoji111 = "[多云]";
    public emoji112 = "[下雨]";
    public emoji113 = "[钞票]";
    public emoji114 = "[熊猫]";
    public emoji115 = "[灯泡]";
    public emoji116 = "[风车]";
    public emoji117 = "[闹钟]";
    public emoji118 = "[打伞]";
    public emoji119 = "[气球]";
    public emoji120 = "[戒指]";
    public emoji121 = "[沙发]";
    public emoji122 = "[纸巾]";
    public emoji123 = "[药]";
    public emoji124 = "[手枪]";
    public emoji125 = "[青蛙]";

    public delete_img: string = 'assets/images/delet_btn.png';
    public delete_code: string = 'delete_btn';

    private emojiList: any = [];//表情
    private emojiTextList: any = [];//表情文字

    constructor() {
        this.initEmoji();
    }

    //初始化表情
    initEmoji() {
        for (let j = 0; j < 7; j++) {
            let emojiItem = [];
            for (let i = j * 20; i < (j + 1) * 20; i++) {
                if (i > 124) {
                    break;
                }
                let fileName;
                if (i >= 99) {
                    fileName = 'emoji' + (i + 1);
                } else if (i >= 9) {
                    fileName = 'emoji0' + (i + 1);
                } else {
                    fileName = 'emoji00' + (i + 1);
                }
                let emoji = 'assets/images/emoji/' + fileName + '.png';
                emojiItem[i - (j * 20)] = emoji;
            }
            emojiItem.push(this.delete_img);
            this.emojiList[j] = emojiItem;
        }

        this.emojiTextList[0] = [
            this.emoji001, this.emoji002, this.emoji003, this.emoji004, this.emoji005, this.emoji006, this.emoji007, this.emoji008, this.emoji009, this.emoji010,
            this.emoji011, this.emoji012, this.emoji013, this.emoji014, this.emoji015, this.emoji016, this.emoji017, this.emoji018, this.emoji019, this.emoji020,
            this.delete_code
        ];
        this.emojiTextList[1] = [
            this.emoji021, this.emoji022, this.emoji023, this.emoji024, this.emoji025, this.emoji026, this.emoji027, this.emoji028, this.emoji029, this.emoji030,
            this.emoji031, this.emoji032, this.emoji033, this.emoji034, this.emoji035, this.emoji036, this.emoji037, this.emoji038, this.emoji039, this.emoji040,
            this.delete_code
        ];
        this.emojiTextList[2] = [
            this.emoji041, this.emoji042, this.emoji043, this.emoji044, this.emoji045, this.emoji046, this.emoji047, this.emoji048, this.emoji049, this.emoji050,
            this.emoji051, this.emoji052, this.emoji053, this.emoji054, this.emoji055, this.emoji056, this.emoji057, this.emoji058, this.emoji059, this.emoji060,
            this.delete_code
        ];
        this.emojiTextList[3] = [
            this.emoji061, this.emoji062, this.emoji063, this.emoji064, this.emoji065, this.emoji066, this.emoji067, this.emoji068, this.emoji069, this.emoji070,
            this.emoji071, this.emoji072, this.emoji073, this.emoji074, this.emoji075, this.emoji076, this.emoji077, this.emoji078, this.emoji079, this.emoji080,
            this.delete_code
        ];
        this.emojiTextList[4] = [
            this.emoji081, this.emoji082, this.emoji083, this.emoji084, this.emoji085, this.emoji086, this.emoji087, this.emoji088, this.emoji089, this.emoji090,
            this.emoji091, this.emoji092, this.emoji093, this.emoji094, this.emoji095, this.emoji096, this.emoji097, this.emoji098, this.emoji099, this.emoji100,
            this.delete_code
        ];
        this.emojiTextList[5] = [
            this.emoji101, this.emoji102, this.emoji103, this.emoji104, this.emoji105, this.emoji106, this.emoji107, this.emoji108, this.emoji109, this.emoji110,
            this.emoji111, this.emoji112, this.emoji113, this.emoji114, this.emoji115, this.emoji116, this.emoji117, this.emoji118, this.emoji119, this.emoji120,
            this.delete_code
        ];
        this.emojiTextList[6] = [
            this.emoji121, this.emoji122, this.emoji123, this.emoji124, this.emoji125, this.delete_code
        ];
    }

    getEmojiList() {
        return this.emojiList;
    }

    getEmojiTextList() {
        return this.emojiTextList;
    }

    //将文字符转为图片
    transSmiles(text: string) {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < this.emojiTextList[i].length; j++) {
                let s = this.emojiTextList[i][j];
                s = s.replace('\[', '\\[');
                s = s.replace('\]', '\\]');
                text = text.replace(new RegExp(s, 'g'), '<img class="emoji-img" src="' + this.emojiList[i][j] + '"img_code="' + this.emojiTextList[i][j] + '">');
            }
        }
        return text;
    }
}
