const TOP_5_BOX_POSITION_TOP_SM = 'top-5-box-position-top-sm';
const TOP_5_BOX_POSITION_TOP_MD = 'top-5-box-position-top-md';
const TOP_5_BOX_POSITION_TOP_LG = 'top-5-box-position-top-lg';

export const closeBrokerOfTheMonthPromoBar = () => {
    const elementsTopLg = document.querySelectorAll(
        `.${TOP_5_BOX_POSITION_TOP_LG}`,
    );
    const elementsTopMd = document.querySelectorAll(
        `.${TOP_5_BOX_POSITION_TOP_MD}`,
    );

    elementsTopLg.forEach((element) => {
        element.classList.remove(TOP_5_BOX_POSITION_TOP_LG);
        element.classList.add(TOP_5_BOX_POSITION_TOP_MD);
    });

    elementsTopMd.forEach((element) => {
        element.classList.remove(TOP_5_BOX_POSITION_TOP_MD);
        element.classList.add(TOP_5_BOX_POSITION_TOP_SM);
    });
};
