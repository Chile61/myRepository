import { CourseItemVo } from './CourseItemVo';

export class CourseVo {
    public startTime: number;
    public endTime: number;
    public courseStageName: string;
    public courseItemsCount: number;
    public courseItems: Array<CourseItemVo>;
}