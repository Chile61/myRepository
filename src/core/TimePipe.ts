import { Pipe, PipeTransform, enableProdMode} from '@angular/core';
/**
 * Created by zxh on 2017/1/11.
 */
enableProdMode();
@Pipe({
    name: 'timePipe'
})
//格式化时间Pipe
export class TimePipe implements PipeTransform{

    transform(value: any, ...args: any[]): any {
        let data = new Date();
        let nowTime = data.getTime();
        let interval = nowTime - value;
        if (interval < 60 * 1000) {
            let seconds = interval / 1000;
            return (seconds <= 0 ? 1 : seconds).toFixed(0) + '秒前';
            // return '刚刚';
        }
        if (interval < 60 * 60 * 1000) {
            let minutes = interval / 1000 / 60;
            return this.numberToFixed(minutes <= 0 ? 1 : minutes) + '分钟前';
        }
        if (interval < 24 * 60 * 60 * 1000) {
            let hours = interval / 1000 / 60 / 60;
            return this.numberToFixed(hours <= 0 ? 1 : hours) + '小时前';
        }
        if (interval < 30 * 24 * 60 * 60 * 1000) {
            let days = interval / 1000 / 60 / 60 / 24;
            return this.numberToFixed(days <= 0 ? 1 : days) + '天前';
        }
        if (interval < 12 * 30 * 24 * 60 * 60 * 1000) {
            let months = interval / 1000 / 60 / 60 / 24 / 30;
            return this.numberToFixed(months <= 0 ? 1 : months) + '个月前';
        } else {
            let years = interval / 1000 / 60 / 60 / 24 / 365;
            return this.numberToFixed(years <= 0 ? 1 : years) + '年前';
        }
    }

    //不要四舍五入的数字取整
    numberToFixed(num: number){
        return num.toString().split('.')[0];
    }

}
