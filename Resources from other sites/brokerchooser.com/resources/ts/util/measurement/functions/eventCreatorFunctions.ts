import {
    AffiliateAuxClickEvent,
    AffiliateClickEvent,
    AffiliateElementEventDataArgs,
    AffiliateImpressionEvent,
    CheckboxSelectEvent,
    CheckboxSelectEventDataArgs,
    CloseTabEvent,
    CloseTabEventDataArgs,
    DropdownItemSelectEvent,
    DropdownItemSelectEventDataArgs,
    GeneralClickEvent,
    GeneralElementEventDataArgs,
    GeneralImpressionEvent,
    GenericEvent,
    HoverEvent,
    RadioButtonSelectEvent,
    RadioButtonSelectEventDataArgs,
    SearchEvent,
    SearchEventDataArgs,
} from '../eventTypes';

export const getGeneralElementImpressionEventData = (
    args: GeneralElementEventDataArgs,
): GeneralImpressionEvent => ({
    ...args,
    eventName: 'impression',
    elementType: args.elementType || 'general',
});

export const getGeneralElementClickEventData = (
    args: GeneralElementEventDataArgs,
): GeneralClickEvent => ({
    ...args,
    eventName: 'click',
    elementType: args.elementType || 'general',
});

export const getAffiliateElementImpressionEventData = (
    args: AffiliateElementEventDataArgs,
): AffiliateImpressionEvent => ({
    ...args,
    eventName: 'impression',
    elementType: 'affiliate',
});

export const getAffiliateElementClickEventData = (
    args: AffiliateElementEventDataArgs,
): AffiliateClickEvent => ({
    ...args,
    eventName: 'click',
    elementType: 'affiliate',
    mouseButtonType: 'primary', // left mouse button
});

export const getAffiliateElementAuxClickEventData = (
    args: AffiliateElementEventDataArgs,
): AffiliateAuxClickEvent => ({
    ...args,
    eventName: 'click',
    elementType: 'affiliate',
    mouseButtonType: 'non_primary', // other than left mouse buttons (right, wheeler etc...)
});

export const getDropdownItemSelectEventData = (
    args: DropdownItemSelectEventDataArgs,
): DropdownItemSelectEvent => ({
    ...args,
    eventName: 'select',
    elementType: 'dropdown_item',
});

export const getSearchEventData = (args: SearchEventDataArgs): SearchEvent => ({
    ...args,
    eventName: 'search',
    elementType: 'general',
});

export const getCheckboxSelectEventData = (
    args: CheckboxSelectEventDataArgs,
): CheckboxSelectEvent => ({
    ...args,
    eventName: 'select',
    eventType: 'checkbox',
});

export const getRadioButtonSelectEventData = (
    args: RadioButtonSelectEventDataArgs,
): RadioButtonSelectEvent => ({
    ...args,
    eventName: 'select',
    elementType: 'radio_button',
});

export const getHoverEventData = (
    args: GeneralElementEventDataArgs,
): HoverEvent => ({
    ...args,
    eventName: 'hover',
    elementType: args.elementType || 'general',
});

export const getCloseTabEventData = (
    args: CloseTabEventDataArgs,
): CloseTabEvent => ({
    ...args,
    eventName: 'close_tab',
});

export const getGenericEventData = (
    args: GeneralElementEventDataArgs,
): GenericEvent => ({ ...args, eventName: 'generic' });
