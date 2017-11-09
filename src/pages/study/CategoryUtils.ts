/**
 * Created by zxh on 2016/12/27.
 */
//根据分类获取Css样式
export class CategoryUtils {

    constructor(){

    }

    static getCategoryCss(categoryName: string){
        switch (categoryName){
            case '漫画秀':
                return 'course-tag';
            case '故事汇':
                return 'course-tag1';
            case '百宝箱':
                return 'course-tag2';
            case '悦读慧':
                return 'course-tag3';
            case '映像馆':
                return 'course-tag4';
            case '公开课':
                return 'course-tag5';
            default:
                return 'course-tag5';
        }
    }
}
