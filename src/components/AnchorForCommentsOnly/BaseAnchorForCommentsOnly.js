import _ from 'underscore';
import React from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import lodashGet from 'lodash/get';
import Str from 'expensify-common/lib/str';
import Text from '../Text';
import PressableWithSecondaryInteraction from '../PressableWithSecondaryInteraction';
import * as ReportActionContextMenu from '../../pages/home/report/ContextMenu/ReportActionContextMenu';
import * as ContextMenuActions from '../../pages/home/report/ContextMenu/ContextMenuActions';
import Tooltip from '../Tooltip';
import * as DeviceCapabilities from '../../libs/DeviceCapabilities';
import styles from '../../styles/styles';
import * as StyleUtils from '../../styles/StyleUtils';
import withWindowDimensions, {windowDimensionsPropTypes} from '../withWindowDimensions';
import {propTypes as anchorForCommentsOnlyPropTypes, defaultProps as anchorForCommentsOnlyDefaultProps} from './anchorForCommentsOnlyPropTypes';

const propTypes = {
    /** Press in handler for the link */
    onPressIn: PropTypes.func,

    /** Press out handler for the link */
    onPressOut: PropTypes.func,

    // eslint-disable-next-line react/forbid-prop-types
    containerStyles: PropTypes.arrayOf(PropTypes.object),

    ...anchorForCommentsOnlyPropTypes,
    ...windowDimensionsPropTypes,
};

const defaultProps = {
    onPressIn: undefined,
    onPressOut: undefined,
    containerStyles: [],
    ...anchorForCommentsOnlyDefaultProps,
};

/*
 * This is a default anchor component for regular links.
 */
function BaseAnchorForCommentsOnly(props) {
    let linkRef;
    const rest = _.omit(props, _.keys(propTypes));
    const linkProps = {};
    if (_.isFunction(props.onPress)) {
        linkProps.onPress = props.onPress;
    } else {
        linkProps.href = props.href;
    }
    const defaultTextStyle = DeviceCapabilities.canUseTouchScreen() || props.isSmallScreenWidth ? {} : {...styles.userSelectText, ...styles.cursorPointer};
    const isEmail = Str.isValidEmailMarkdown(props.href.replace(/mailto:/i, ''));

    return (
        <PressableWithSecondaryInteraction
            inline
            style={[styles.cursorDefault, StyleUtils.getFontSizeStyle(props.style.fontSize)]}
            onSecondaryInteraction={(event) => {
                ReportActionContextMenu.showContextMenu(
                    isEmail ? ContextMenuActions.CONTEXT_MENU_TYPES.EMAIL : ContextMenuActions.CONTEXT_MENU_TYPES.LINK,
                    event,
                    props.href,
                    lodashGet(linkRef, 'current'),
                );
            }}
            onPress={linkProps.onPress}
            onPressIn={props.onPressIn}
            onPressOut={props.onPressOut}
        >
            <Tooltip text={props.href}>
                <Text
                    ref={(el) => (linkRef = el)}
                    style={StyleSheet.flatten([props.style, defaultTextStyle])}
                    accessibilityRole="link"
                    hrefAttrs={{
                        rel: props.rel,
                        target: isEmail ? '_self' : props.target,
                    }}
                    href={linkProps.href}
                    // Add testID so it gets selected as an anchor tag by SelectionScraper
                    testID="a"
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...rest}
                >
                    {props.children}
                </Text>
            </Tooltip>
        </PressableWithSecondaryInteraction>
    );
}

BaseAnchorForCommentsOnly.propTypes = propTypes;
BaseAnchorForCommentsOnly.defaultProps = defaultProps;
BaseAnchorForCommentsOnly.displayName = 'BaseAnchorForCommentsOnly';

export default withWindowDimensions(BaseAnchorForCommentsOnly);
