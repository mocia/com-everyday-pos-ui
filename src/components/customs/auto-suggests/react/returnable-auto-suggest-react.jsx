import React from 'react';
import AutoSuggestReact from '../../../form/basic/react/auto-suggest-react.jsx';

import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api"

import { LocalStorage } from '../../../../utils/storage';

const serviceUri = 'sales-docs/returnable';
const empty = {
    code: '',
    name: '',
    toString: function () {
        return '';
    }
}

'use strict';

export default class ReturnableAutoSuggestReact extends AutoSuggestReact {
    constructor(props) {
        super(props);
    }

    init(props) {
        var options = Object.assign({}, ReturnableAutoSuggestReact.defaultProps.options, props.options);
        var initialValue = Object.assign({}, empty, props.value);
        initialValue.toString = function () {
            return [this.code, this.name]
                .filter((item, index) => {
                    return item && item.toString().trim().length > 0;
                }).join(" - ");
        };
        this.setState({ value: initialValue,label: initialValue.toString(), options: options ,suggestions: [initialValue]});
    }
}

ReturnableAutoSuggestReact.propTypes = {
    options: React.PropTypes.shape({
        readOnly: React.PropTypes.bool,
        suggestions: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.func
        ])
    })
};

ReturnableAutoSuggestReact.defaultProps = {
    options: {
        readOnly: false,
        suggestions:
        function (keyword, filter) {

            var localStorage = Container.instance.get(LocalStorage);
            var config = Container.instance.get(Config);
            
            var endpoint = config.getEndpoint("pos");

            var requestHeader = new Headers();
            
            //var uri = serviceUri + "/" + localStorage.store._id + "/sales/docs/salesreturns/returnables";
            var uri = serviceUri + "/" + localStorage.store.code ;
            requestHeader.append('Authorization', `JWT ${localStorage.token}`);

            return endpoint.find(uri, { keyword: keyword, filter: JSON.stringify(filter) }).then(results => {
                return results.data.map(sales => {
                    sales.toString = function () {
                        return [this.code, this.name]
                            .filter((item, index) => {
                                return item && item.toString().trim().length > 0;
                            }).join(" - ");
                    }
                    return sales;
                })
            })
        }
    }
};
