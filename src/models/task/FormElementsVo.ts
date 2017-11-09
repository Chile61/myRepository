//表单元素
export class FormElementsVo {
    id: string;
    label: string;
    type: string;
    required: string;
    readonly: string;
    items: Array<string>;
    selectedItems: Array<string>;//被选中
    defaultValue: string;
    searchable: string;
    remarks: string;
}