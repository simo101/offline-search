import { Component, createElement } from "react";
import { findDOMNode } from "react-dom";

import { SearchBar, SearchBarProps } from "./components/SearchBar";
import { ValidateConfigs } from "./components/ValidateConfigs";
import { CommonProps, OfflineSearchProps, OfflineSearchState, parseStyle } from "./utils/ContainerUtils";

declare function require(name: string): string;
type VisibilityMap = {
    [ P in keyof SearchBarProps ]: boolean;
};

// tslint:disable-next-line class-name
export class preview extends Component<OfflineSearchProps, OfflineSearchState> {
    constructor(props: OfflineSearchProps) {
        super(props);

        this.state = { findingWidget: true };
    }

    render() {
        return createElement("div", { className: "widget-offline-search" },
            createElement(ValidateConfigs, {
                ...this.props as OfflineSearchProps,
                inWebModeler: true,
                queryNode: this.state.targetNode,
                targetGrid: this.state.targetGrid,
                validate: !this.state.findingWidget
            }),
            createElement(SearchBar, {
                ...this.props as CommonProps,
                onTextChangeAction: () => { return; },
                showSearchBar: true,
                style: parseStyle(this.props.style)
            })
        );
    }

    componentDidMount() {
        this.validateConfigs(this.props);
    }

    componentWillReceiveProps(newProps: OfflineSearchProps) {
        this.validateConfigs(newProps);
    }

    private validateConfigs(props: OfflineSearchProps) {
        const routeNode = findDOMNode(this) as HTMLElement;
        const targetNode = ValidateConfigs.findTargetNode(props, routeNode);

        if (targetNode) {
            this.setState({ targetNode });
        }
        this.setState({ findingWidget: true });
    }
}

export function getVisibleProperties(valueMap: SearchBarProps, visibilityMap: VisibilityMap) {
    valueMap.showSearchBar = visibilityMap.showSearchBar = false;

    return visibilityMap;
}

export function getPreviewCss() {
    return require("./ui/OfflineSearch.css");
}
