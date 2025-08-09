import classNames from 'classnames';
import React, { FC } from 'react';

export const AwardsLogo: FC<{
    className?: string;
    withHoverEffect?: boolean;
    highlightOpacity?: number;
}> = ({ className, highlightOpacity, withHoverEffect }) => (
    <svg
        width="102"
        height="41"
        viewBox="0 0 102 41"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            d="M21.9116 37.3699C19.6477 36.3297 17.1556 35.8236 14.6453 35.8919C13.0978 35.9049 9.73942 36.8899 9.80867 37.4024C9.92334 38.253 14.299 39.4526 15.6649 39.4558C20.8898 39.4558 21.7459 37.9323 21.8855 37.4902C21.8969 37.4512 21.9071 37.41 21.9116 37.3699Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M15.7384 33.7323C13.9196 32.0669 11.7068 30.8456 9.28845 30.1727C7.79432 29.7187 4.19636 29.6309 4.07374 30.1272C3.87165 30.954 7.64104 33.3856 8.95693 33.7963C14.837 35.6308 15.7384 33.7323 15.7384 33.7323Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M11.465 28.6503C10.056 26.4571 8.11342 24.6204 5.80069 23.2973C4.38263 22.4413 0.685892 21.4184 0.416811 21.9006C-0.0271148 22.7035 3.18255 26.1948 4.42804 26.9609C9.99358 30.3829 11.465 28.6503 11.465 28.6503Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M3.06224 19.7171C7.8898 24.0873 9.6814 22.6396 9.6814 22.6396C8.71861 20.2221 7.15976 18.0614 5.13428 16.3428C3.90127 15.243 0.450912 13.5743 0.0910029 14.0023C-0.505062 14.7164 1.98138 18.7376 3.06224 19.7171Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M10.332 17.5738C10.1276 15.1281 9.29766 12.7703 7.91366 10.7093L7.91139 10.706C7.07803 9.38837 4.34068 6.95462 3.88313 7.23852C3.12244 7.71205 4.27596 11.9803 5.00259 13.1549C8.24405 18.3778 10.332 17.5738 10.332 17.5738Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M12.0441 12.2046C12.4846 10.317 12.4165 8.35244 11.8454 6.49624L11.842 6.49408C11.5184 5.30213 9.98796 2.79361 9.5622 2.88355C8.85601 3.0385 8.71068 6.50491 8.98771 7.55816C10.2275 12.2631 12.0441 12.2046 12.0441 12.2046Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M15.2912 8.38928C16.1212 7.00878 16.5662 5.44949 16.5855 3.85986L16.5833 3.85661C16.6355 2.83154 16.0871 0.437884 15.734 0.391289C15.147 0.315438 14.157 2.99191 14.1036 3.89346C13.8697 7.92766 15.2912 8.38928 15.2912 8.38928Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M24.7 37.4165C23.5579 37.7416 21.2928 39.1546 21.4586 39.5198C21.7333 40.1255 25.2393 40.1222 26.2521 39.8459C30.1191 38.7807 30.412 37.4794 30.4154 37.1239C30.4154 37.0925 30.4143 37.0611 30.4086 37.0297C28.5001 36.7208 26.5427 36.8541 24.7 37.4165Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M34.3661 37.4181C33.4762 37.7931 31.7941 39.1589 31.9675 39.4383C32.2551 39.9019 35.0935 39.5561 35.8838 39.2333C38.9005 37.9923 38.9978 36.9099 38.9624 36.6218C38.959 36.5964 38.9547 36.571 38.9468 36.5462C37.3682 36.4829 35.7977 36.7824 34.3661 37.4181Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M43.9788 35.1459C43.4737 35.6558 42.7202 37.0775 42.9268 37.2238C43.2694 37.4666 45.1414 36.4327 45.5932 35.9869C47.315 34.2794 47.0509 33.4979 46.9378 33.307C46.9276 33.2902 46.9169 33.2738 46.9037 33.2586C45.7842 33.6555 44.7816 34.303 43.9788 35.1459Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M57.7145 35.0799C58.2027 35.5728 58.9311 36.9471 58.7314 37.0885C58.4002 37.3231 56.5907 36.3238 56.154 35.8929C54.4897 34.2424 54.745 33.4869 54.8543 33.3024C54.8641 33.2862 54.8745 33.2703 54.8872 33.2557C55.9693 33.6393 56.9385 34.2651 57.7145 35.0799Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M67.6429 37.4181C68.5328 37.7931 70.215 39.1589 70.0415 39.4383C69.754 39.9019 66.9155 39.5561 66.1252 39.2333C63.1086 37.9923 63.0112 36.9099 63.0466 36.6218C63.05 36.5964 63.0543 36.571 63.0623 36.5462C64.6408 36.4829 66.2113 36.7824 67.6429 37.4181Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M87.3547 35.8919C84.8444 35.8237 82.3523 36.3308 80.0884 37.3699C80.0929 37.41 80.1031 37.4512 80.1145 37.4902C80.253 37.9323 81.1091 39.4558 86.3351 39.4558C87.701 39.4526 92.0767 38.2531 92.1913 37.4024C92.2606 36.8899 88.9022 35.9038 87.3547 35.8919Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M80.4107 35.9C81.4395 35.8978 84.7325 35.0612 84.8181 34.4681C84.8658 34.1359 82.6849 33.519 81.4417 33.427C82.215 32.9389 82.9438 32.3891 83.6182 31.7786C84.2492 31.8198 85.1869 31.731 86.5702 31.3382C87.3845 31.1065 89.7166 29.7364 89.591 29.271C89.5155 28.9917 87.2901 29.0404 86.3646 29.2959C86.1268 29.3565 85.8924 29.4247 85.6624 29.5004C85.9469 29.1075 86.2124 28.6974 86.4579 28.2698C87.1579 28.1497 88.1456 27.8034 89.5121 27.0014C90.3232 26.5252 92.413 24.3541 92.1241 23.8552C91.9497 23.5554 89.5421 24.1907 88.6189 24.7232C88.3267 24.8823 88.0434 25.0544 87.7701 25.2373C87.9578 24.6204 88.1122 23.9775 88.2278 23.3086C88.7733 23.0305 89.431 22.6019 90.2187 21.9449C90.9009 21.3756 92.4708 19.0379 92.0941 18.6223C91.8675 18.3734 89.6888 19.3431 88.9111 19.9827C88.7644 20.0975 88.6222 20.2154 88.4833 20.3366C88.4878 19.5801 88.4489 18.7955 88.3644 17.9837C88.7977 17.6028 89.2944 17.0497 89.8443 16.2445C90.3021 15.5724 91.0298 13.1297 90.5498 12.8591C90.261 12.6967 88.5367 14.0886 88.0111 14.8429L88.01 14.8451C87.9445 14.9328 87.8823 15.0226 87.8212 15.1124C87.6167 14.4457 87.3668 13.8093 87.0779 13.2C87.2668 12.8483 87.4534 12.4002 87.6234 11.8266C87.8 11.2281 87.7078 9.25613 87.2557 9.16738C86.999 9.11868 86.1158 10.3839 85.8413 11.0971C79.0886 1.60864 61.2967 1.31534 54.8039 11.6999C52.5286 10.1761 49.3533 10.149 47.0512 11.6999C40.5996 1.50907 22.8555 1.31426 16.0094 11.1739C15.7738 10.4791 14.8328 9.11759 14.5673 9.16738C14.1151 9.25504 14.0229 11.227 14.1995 11.8266C14.3817 12.4435 14.5851 12.9154 14.7884 13.2779C14.4895 13.8948 14.2351 14.5182 14.0251 15.147C13.9573 15.0453 13.8873 14.9447 13.814 14.8462L13.8129 14.844C13.2885 14.0896 11.5631 12.6967 11.2742 12.8602C10.7943 13.1307 11.522 15.5735 11.9797 16.2456C12.4952 16.9999 12.9652 17.5346 13.3785 17.9123C13.2707 18.6926 13.2229 19.473 13.2363 20.2479C13.1307 20.1581 13.023 20.0693 12.913 19.9838C12.1341 19.3453 9.95655 18.3744 9.7299 18.6234C9.35327 19.0379 10.9231 21.3767 11.6053 21.946C12.3919 22.6019 13.0496 23.0316 13.594 23.3086C13.744 23.9926 13.9384 24.6647 14.1762 25.3228C13.8651 25.1085 13.5418 24.9072 13.2052 24.7243C12.2819 24.1918 9.87434 23.5565 9.69991 23.8563C9.41104 24.3552 11.5009 26.5263 12.3119 27.0025C13.8484 27.904 14.9039 28.2287 15.6127 28.3045C15.8883 28.7558 16.1871 29.1952 16.506 29.6195C16.1649 29.495 15.8161 29.3868 15.4594 29.2959C14.5351 29.0404 12.3086 28.9907 12.233 29.271C12.1086 29.7364 14.4406 31.1065 15.2539 31.3382C16.8026 31.7776 17.7926 31.836 18.4192 31.7581C19.0602 32.3609 19.7524 32.9172 20.4923 33.4205C19.2736 33.4822 16.956 34.1261 17.006 34.4692C17.0926 35.0623 20.3857 35.8989 21.4134 35.9011C22.9921 35.9011 24.0409 35.7301 24.7375 35.505C26.1674 35.9736 27.6995 36.2669 29.3149 36.3524C42.0972 37.9044 52.8841 26.8055 48.5133 14.6784C49.9132 13.6048 51.943 13.6048 53.3429 14.6784C48.5067 31.8663 64.9464 39.1079 76.9543 35.4595C77.6476 35.7052 78.7275 35.9 80.4107 35.9ZM45.5591 23.7448C43.9748 29.7493 37.5476 33.3393 31.3603 33.1824C18.5147 33.7679 11.402 18.9708 21.1156 10.5181C31.5003 2.38357 49.5499 9.79836 45.5591 23.7448ZM70.4937 33.1824C57.7126 33.7484 50.5543 19.066 60.1901 10.583C70.7193 2.31755 88.7866 9.78429 84.6459 23.9212C83.0016 29.8478 76.6165 33.335 70.4937 33.1824Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M92.7115 30.1727C90.2931 30.8456 88.0803 32.0669 86.2615 33.7323C86.2615 33.7323 87.1618 35.6308 93.043 33.7973C94.3589 33.3867 98.1282 30.9551 97.9262 30.1283C97.8035 29.632 94.2067 29.7198 92.7115 30.1727Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M96.1992 23.2984C93.8876 24.6215 91.9439 26.4582 90.5349 28.6514C90.5349 28.6514 92.0063 30.384 97.5719 26.9631C98.8174 26.197 102.027 22.7057 101.583 21.9027C101.314 21.4195 97.6173 22.4413 96.1992 23.2984Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M92.3186 22.6385C92.3186 22.6385 94.1102 24.0873 98.9378 19.7161C100.019 18.7376 102.505 14.7153 101.909 14.0023C101.55 13.5743 98.0987 15.243 96.8657 16.3418C94.8402 18.0603 93.2814 20.221 92.3186 22.6385Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M96.9974 13.1549C97.724 11.9814 98.8775 7.7131 98.1168 7.23849C97.6593 6.95459 94.9219 9.38833 94.0886 10.706L94.0863 10.7092C92.7023 12.7702 91.8712 15.1281 91.668 17.5738C91.668 17.5738 93.7559 18.3778 96.9974 13.1549Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M93.0122 7.55816C93.2892 6.506 93.1439 3.03851 92.4377 2.88355C92.0119 2.79361 90.4826 5.30104 90.1579 6.49408L90.1545 6.49624C89.5834 8.35244 89.5164 10.3159 89.9558 12.2046C89.9569 12.2046 91.7724 12.2631 93.0122 7.55816Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M85.4155 3.85986C85.4348 5.45058 85.8799 7.00986 86.7098 8.38927C86.7098 8.38927 88.1302 7.92766 87.8963 3.89237C87.8429 2.98974 86.8529 0.31327 86.2659 0.390205C85.9128 0.437883 85.3656 2.83154 85.4167 3.85553L85.4155 3.85986Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M77.3001 37.4165C75.4574 36.8541 73.5001 36.7219 71.5915 37.0297C71.5859 37.06 71.5847 37.0925 71.5847 37.1239C71.5893 37.4794 71.881 38.7807 75.7481 39.8459C76.7597 40.1211 80.2657 40.1255 80.5416 39.5198C80.7074 39.1546 78.4434 37.7405 77.3001 37.4165Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M50.9888 34.7345C51.5962 34.7345 52.0886 34.2834 52.0886 33.7268C52.0886 33.1703 51.5962 32.7191 50.9888 32.7191C50.3813 32.7191 49.8889 33.1703 49.8889 33.7268C49.8889 34.2834 50.3813 34.7345 50.9888 34.7345Z"
            className={classNames({
                'fill-primary-500':
                    !withHoverEffect && highlightOpacity === undefined,
                'transition-color fill-slate-600 duration-300 group-hover:fill-primary-500':
                    withHoverEffect,
            })}
            fill={
                highlightOpacity ? `rgba(253, 173, 0, ${highlightOpacity})` : ''
            }
        />
        <path
            d="M30.4611 37.7839C19.761 37.7839 12 30.4537 12 20.363C12 10.2955 19.761 3 30.4611 3C41.1613 3 48.9223 10.3071 48.9223 20.363C48.898 30.4537 41.137 37.7839 30.4611 37.7839ZM30.4611 10.1215C23.8297 10.1215 20.3561 15.2712 20.3561 20.3746C20.3561 25.4895 23.8297 30.674 30.4611 30.674C37.0197 30.674 40.5662 25.3735 40.5662 20.3746C40.5662 15.2712 37.0804 10.1215 30.4611 10.1215Z"
            fill="white"
        />
        <path
            d="M70.4076 37.7839C59.7075 37.7839 51.9465 30.4537 51.9465 20.363C51.9465 10.2955 59.7075 3 70.4076 3C81.0957 3 88.8688 10.3071 88.8688 20.363C88.8566 30.4537 81.0957 37.7839 70.4076 37.7839ZM70.4076 10.1215C63.7641 10.1215 60.3026 15.2712 60.3026 20.3746C60.3026 25.4895 63.7762 30.674 70.4076 30.674C76.9662 30.674 80.5127 25.3735 80.5127 20.3746C80.5127 15.2712 77.0391 10.1215 70.4076 10.1215Z"
            fill="white"
        />
        <path
            d="M50.4162 15.2828C52.8939 15.2828 55.2987 15.654 57.5578 16.3267C59.0638 16.779 60.6548 15.8743 60.9706 14.3665C60.9706 14.3549 60.9828 14.3317 60.9828 14.3201C61.2621 13.0559 60.5941 11.7685 59.3674 11.2929C56.5982 10.2259 53.5862 9.63434 50.4284 9.63434C47.2705 9.63434 44.2706 10.2259 41.5014 11.2929C40.2747 11.7569 39.6067 13.0559 39.8861 14.3201C39.8861 14.3317 39.8982 14.3549 39.8982 14.3665C40.2261 15.8743 41.8051 16.779 43.3111 16.3267C45.5459 15.654 47.9385 15.2828 50.4162 15.2828Z"
            fill="white"
        />
    </svg>
);
