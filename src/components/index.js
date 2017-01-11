
export function configure(config) {
    config.globalResources(
        './dialog/dialog',
        './form/pagination',

        './form/basic/checkbox',
        './form/basic/datepicker',
        './form/basic/dropdown',
        './form/basic/multiline',
        './form/basic/numeric',
        './form/basic/radiobutton',
        './form/basic/textbox', 
        './form/basic/auto-suggest',

        './customs/auto-suggests/voidable-auto-suggest',
        './customs/auto-suggests/returnable-auto-suggest'
    );
}
