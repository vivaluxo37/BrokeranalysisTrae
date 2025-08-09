import 'photoswipe/dist/photoswipe.css';
// eslint-disable-next-line import/no-unresolved
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import { getGeneralElementClickEventData } from '../../util/measurement/functions/eventCreatorFunctions';
import { sendGA4Event } from '../../util/measurement/functions/sendGA4Event';

export const initPhotoGallery = (
    gallerySelector: string = '.bc_body',
    childrenSelector: string = '[gallery-item]',
    measurementListId?: string,
) => {
    const lightbox = new PhotoSwipeLightbox({
        gallery: gallerySelector, // Will search for all the DOM elements inside the gallery
        children: childrenSelector, // which have this attribute
        pswpModule: () => import('photoswipe'),
    });
    lightbox.on('afterInit', () => {
        if (!measurementListId) {
            return;
        }
        const eventData = getGeneralElementClickEventData({
            measurementListId,
        });
        sendGA4Event(eventData);
    });
    lightbox.on('uiRegister', () => {
        lightbox.pswp?.ui?.registerElement({
            name: 'custom-caption',
            order: 9,
            isButton: false,
            appendTo: 'root',
            html: 'Caption text',
            onInit: (el, pswp) => {
                pswp.on('change', () => {
                    const currSlideElement = pswp.currSlide?.data.element;
                    const captionHTML = currSlideElement
                        ?.querySelector('img')
                        ?.getAttribute('alt');
                    el.innerHTML = captionHTML || '';
                    el.className =
                        'backdrop-blur-md bg-black/40 text-white w-full font-bold absolute bottom-0 p-4';
                });
            },
        });
    });
    lightbox.init();
    return lightbox;
};
