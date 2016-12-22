
export function configure(config) {
    config.globalResources(
        './pagination',

        './basic/checkbox',
        './basic/datepicker',
        './basic/dropdown',
        './basic/multiline',
        './basic/numeric',
        './basic/radiobutton',
        './basic/textbox',

        './auto-suggests/auto-suggest',
        './auto-suggests/store-auto-suggest',
        './auto-suggests/sales-auto-suggest',
        './auto-suggests/voidable-auto-suggest',
        './auto-suggests/returnable-auto-suggest'
    );
}
