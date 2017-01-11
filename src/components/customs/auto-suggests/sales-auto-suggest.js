import React from 'react';
import ReactDOM from 'react-dom';
import {customElement, inject, bindable, bindingMode, noView} from 'aurelia-framework';

import SalesAutoSuggestReact from './react/sales-auto-suggest-react.jsx';
import BaseAutoSuggest from '../../form/basic/base-auto-suggest';

@noView()
@inject(Element)
@customElement('sales-auto-suggest')
export class SalesAutoSuggest extends BaseAutoSuggest{

    @bindable({ defaultBindingMode: bindingMode.twoWay }) label;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) value;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) error;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) readOnly;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) options;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) filter;

    constructor(element) {
        super(element);
        this.control = SalesAutoSuggestReact
    }
}
