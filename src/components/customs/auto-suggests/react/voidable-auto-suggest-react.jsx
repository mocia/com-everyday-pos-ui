import React from 'react';
import AutoSuggestReact from '../../../form/basic/react/auto-suggest-react.jsx';

import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api"

import { LocalStorage } from '../../../../utils/storage';

const serviceUri = "sales-docs/voidable"
const empty = {
    code: '',
    name: '',
    toString: function () {
        return '';
    }
}

'use strict';

export default class VoidableAutoSuggestReact extends AutoSuggestReact {
    constructor(props) {
        super(props);
    }

    init(props) {
        var options = Object.assign({}, VoidableAutoSuggestReact.defaultProps.options, props.options);
        var initialValue = Object.assign({}, empty, props.value);
        initialValue.toString = function () {
            return [this.code, this.name]
                .filter((item, index) => {
                    return item && item.toString().trim().length > 0;
                }).join(" - ");
        };
        this.setState({ value: initialValue, label: initialValue.toString(), options: options, suggestions: [initialValue] });
    }
}

VoidableAutoSuggestReact.propTypes = {
    options: React.PropTypes.shape({
        readOnly: React.PropTypes.bool,
        suggestions: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.func
        ])
    })
};

VoidableAutoSuggestReact.defaultProps = {
    options: {
        readOnly: false,
        suggestions:
        function (keyword, filter) {
            var localStorage = Container.instance.get(LocalStorage);
            var config = Container.instance.get(Config);
            var endpoint = config.getEndpoint("pos");
            var requestHeader = new Headers();
            //var uri = serviceUri + "/" + localStorage.store._id + "/sales/docs/salesvoids/voidables";
            var uri = serviceUri + "/" + localStorage.store.code ;
            requestHeader.append('Authorization', `JWT ${localStorage.token}`);

            return endpoint.find(uri, { keyword: keyword, filter: JSON.stringify(filter), size: 10 }).then(result => {
                return result.data.map(voidable => {
                    voidable.toString = function () {
                        return [this.code, this.name]
                            .filter((item, index) => {
                                return item && item.toString().trim().length > 0;
                            }).join(" - ");
                    }
                    return voidable;
                })
            })
        }
    }
};
