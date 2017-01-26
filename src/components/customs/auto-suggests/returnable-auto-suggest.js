import React from 'react';
import ReactDOM from 'react-dom';
import {customElement, inject, bindable, bindingMode, noView} from 'aurelia-framework';

import ReturnableAutoSuggestReact from './react/returnable-auto-suggest-react.jsx';
import BaseAutoSuggest from '../../form/basic/base-auto-suggest';

@noView()
@inject(Element)
@customElement('returnable-auto-suggest')
export class ReturnableAutoSuggest extends BaseAutoSuggest{

    @bindable({ defaultBindingMode: bindingMode.twoWay }) label;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) value;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) error;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) readOnly;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) options;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) filter;

    constructor(element) {
        super(element);
        this.control = ReturnableAutoSuggestReact;
    }
}
