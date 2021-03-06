import Swiper, { Navigation, Pagination, Thumbs, Autoplay } from 'swiper/core';
import '@fancyapps/fancybox/dist/jquery.fancybox.min';
import autosize from 'autosize/dist/autosize.min';
import 'waypoints/lib/noframework.waypoints.min';
import 'jquery-ui/ui/widgets/tabs';
import Inputmask from 'inputmask';
import tippy from 'tippy.js';
import './icons-for-sprite';
import 'jquery-validation';
import 'focus-visible';
import './google-maps';

$(document).ready(function () {
    'use strict';

    const page = document.documentElement;

    // START INIT FANCY-BOX
    ////////////////////////////////////////////////////////////////////////////
    $(document).on('afterShow.fb', function(e, instance, slide) {
        // enable autofocus if there is a field
        let modal = instance.current.$content[0];
        let input = modal.querySelector('input:not([type=hidden])');

        if (input && !$.fancybox.isMobile) {
            input.focus();
        }
    });

    $('.btn-modal').fancybox({
        touch : false,
        backFocus : false,
        autoFocus: false,
        btnTpl: {
            smallBtn: `
                    <button class="modal__close fancybox-button fancybox-close-small" type="button" data-fancybox-close title="Закрыть">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#252728" xmlns="http://www.w3.org/2000/svg"><path d="M16.192 6.344l-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242-1.414-1.414z"/></svg>
                    </button>`
        },
    });

    $(document).on('click', '.btn-modal-call', function () {
        let src = $(this).attr('href');

        $.fancybox.open({
            src  : src,
            type : 'inline',
            touch : false,
            backFocus : false,
            autoFocus: false,
            btnTpl: {
                smallBtn: `
                    <button class="modal__close fancybox-button fancybox-close-small" type="button" data-fancybox-close title="Закрыть">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#252728" xmlns="http://www.w3.org/2000/svg"><path d="M16.192 6.344l-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242-1.414-1.414z"/></svg>
                    </button>`
            },
        });
    });
    // END INIT FANCY-BOX
    ////////////////////////////////////////////////////////////////////////////

    // START STICKY HEADER
    ////////////////////////////////////////////////////////////////////////////
    let header = document.querySelector('.header');
    let headerWr = document.querySelector('.header__wr');
    let waypointOffset = 0;

    if (header) {
        // start sticky header
        let waypoint = new Waypoint({
            element: header,
            handler: function (direction) {
                if (direction === 'down') {
                    header.style.height = `${headerWr.offsetHeight}px`;
                    headerWr.classList.add('header__wr--start-sticky');
                    headerWr.classList.remove('header__wr--end-sticky');
                }
            },
            offset: function() {
                return -(this.element.clientHeight + waypointOffset);
            }
        });

        // end sticky header
        let waypointMainNavTop = new Waypoint({
            element: header,
            handler: function (direction) {
                if (direction === 'up') {
                    header.style.height = 'auto';
                    headerWr.classList.remove('header__wr--start-sticky');
                }
            },
            offset: -1,
        });

        // show/hide header when scrolling
        let scrollPos = 0;

        window.addEventListener('scroll', () => {
            if (document.body.getBoundingClientRect().top > scrollPos) {
                // SCROLL UP
                if (headerWr.classList.contains('header__wr--start-sticky')) {
                    headerWr.classList.add('header__wr--show');
                    page.classList.add('header-show');
                }
                headerWr.classList.remove('header__wr--hide');
            } else {
                // SCROLL DOWN
                if (headerWr.classList.contains('header__wr--start-sticky')) {
                    headerWr.classList.add('header__wr--hide');
                    page.classList.remove('header-show');
                }
                headerWr.classList.remove('header__wr--show');
            }

            scrollPos = document.body.getBoundingClientRect().top;
        }, {passive: true});
    }
    // END STICKY HEADER
    ////////////////////////////////////////////////////////////////////////////

    // START SHOW/HIDE MENU
    ////////////////////////////////////////////////////////////////////////////
    let hamburger = document.querySelector('.header__hamburger');
    let sideNavClose = document.querySelector('.head-side-nav__close');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            if (page.classList.contains('show-menu')) {
                page.classList.remove('show-menu', 'show-overlay');
            } else {
                page.classList.add('show-menu', 'show-overlay');
            }
        }, {passive: true});
    }

    if (sideNavClose) {
        sideNavClose.addEventListener('click', () => {
            page.classList.remove('show-overlay', 'show-menu');
        }, {passive: true});
    }
    // END SHOW/HIDE MENU
    ////////////////////////////////////////////////////////////////////////////

    // START SHOW/HIDE SUB MENU
    ////////////////////////////////////////////////////////////////////////////
    let menuTriggers = document.querySelectorAll('.menu__trigger');
    menuTriggers.forEach(menuTrigger => {
        menuTrigger.addEventListener('click', function () {
            let menuItem = this.closest('.menu__item');
            let subMenu = menuItem.querySelector('.sub-menu');

            menuItem.classList.toggle('menu__item--show-sub-menu');
            $(subMenu).slideToggle(300);
        }, {passive: true});
    });
    // END SHOW/HIDE SUB MENU
    ////////////////////////////////////////////////////////////////////////////

    // START OVERLAY CLICK HANDLER
    ////////////////////////////////////////////////////////////////////////////
    let overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            page.classList.remove('show-overlay', 'show-menu');
        }, {passive: true});
    }
    // END OVERLAY CLICK HANDLER
    ////////////////////////////////////////////////////////////////////////////

    // START INIT TIPPY.JS
    ////////////////////////////////////////////////////////////////////////////
    tippy('[data-tippy-content]', {
        animation: 'shift-toward',
        interactive: true,
        // appendTo: 'parent',
        // theme: 'light',
        // hideOnClick: false,
        // trigger: 'click',
        // placement: 'right',
    });
    // END INIT TIPPY.JS
    ////////////////////////////////////////////////////////////////////////////

    // START INIT SWIPER
    ////////////////////////////////////////////////////////////////////////////
    Swiper.use([Navigation, Pagination, Thumbs, Autoplay]);

    // advantages slider
    const breakpointLessXS = window.matchMedia('(max-width:576px)');
    let advantagesSwiper;

    const breakpointChecker = () => {
        if (breakpointLessXS.matches === true) {
            return enableSwiper();
        } else if (breakpointLessXS.matches === false) {
            // clean up old instances and inline styles when available
            if (advantagesSwiper !== undefined) advantagesSwiper.destroy(true, true);
        }
    };

    const enableSwiper = () => {
        let advantagesSlider = document.querySelector('.advantages-slider');
        if (advantagesSlider) {
            advantagesSwiper = new Swiper(advantagesSlider, {
                slidesPerView: 1,
                spaceBetween: 15,
                speed: 1000,
                watchOverflow: true,
                pagination: {
                    el: '.advantages-slider__pagination',
                    clickable: true,
                },
            });
        }
    }

    breakpointLessXS.addEventListener('change', breakpointChecker);
    breakpointChecker();
    // END INIT SWIPER
    ////////////////////////////////////////////////////////////////////////////

    // init Autosize
    autosize($('.js-auto-size'));

    // START SHOW/HIDE PASSWORD
    ////////////////////////////////////////////////////////////////////////////
    let passwordSwitches = document.querySelectorAll('.switcher-password');

    passwordSwitches.forEach(passwordSwitch => {
        tippy(passwordSwitch, {content: 'Показать пароль'});

        passwordSwitch.addEventListener('click', function() {
            let fieldBox = this.closest('.field-box');
            let field = fieldBox.querySelector('.field-box__field');
            let fieldType = field.getAttribute('type');

            field.focus();

            if (fieldType === 'password') {
                field.setAttribute('type', 'text');
                this._tippy.setContent('Скрыть пароль');
            } else {
                field.setAttribute('type', 'password');
                this._tippy.setContent('Показать пароль');
            }

            this.classList.toggle('switcher-password--show');

        }, {passive: true});
    });
    // END SHOW/HIDE PASSWORD
    ////////////////////////////////////////////////////////////////////////////

    // START DETERMINING FIELD STATUS
    ////////////////////////////////////////////////////////////////////////////
    let fields = document.querySelectorAll('.field-box__field');

    fields.forEach(field => {
        settingFieldStatus(field);

        field.addEventListener('input', function () {
            settingFieldStatus(this);
        }, {passive: true});

        field.addEventListener('paste', function () {
            settingFieldStatus(this);
        } , {passive: true});

        field.onblur = function() {
            settingFieldStatus(this);
        };
    });

    function settingFieldStatus(input) {
        setTimeout(() => {
            if (input.value) {
                input.classList.add('field-box__field--entered');
            } else {
                input.classList.remove('field-box__field--entered');
            }
        }, 10);
    }
    // END DETERMINING FIELD STATUS
    ////////////////////////////////////////////////////////////////////////////

    // START INIT INPUT MASK
    ////////////////////////////////////////////////////////////////////////////
    Inputmask({
        mask: "+7 (999) 999-99-99",
        showMaskOnHover: false,
    }).mask('input[type=tel]');
    // END INIT INPUT MASK
    ////////////////////////////////////////////////////////////////////////////

    // START FORM VALIDATION
    ////////////////////////////////////////////////////////////////////////////
    let forms = document.querySelectorAll('form');

    forms.forEach( form => {

        // add a custom validation method
        $.validator.addMethod(
            'regex',
            function(value, element, regexp) {
                let re = new RegExp(regexp);
                return this.optional(element) || re.test(value);
            },
            'Это поле необходимо заполнить.'
        );

        let validator = $(form).validate({
            errorElement: 'p',
            errorPlacement: function(label, elem) {
                let parent = elem.parent();
                parent.append(label);
            },
            rules: {
                'name': 'required',
                'phone': {
                    required: true,
                    regex: '^([\+]+)*[0-9\x20\x28\x29\-]{5,20}$',
                },
                'email': {
                    required: true,
                    email: true,
                },
            },
            messages: {

            }
        });
    });

    /*
    * Translated default messages for the jQuery validation plugin.
    * Locale: RU (Russian; русский язык)
    */
    $.extend( $.validator.messages, {
        required: "Это поле необходимо заполнить.",
        remote: "Пожалуйста, введите правильное значение.",
        email: "Пожалуйста, введите корректный адрес электронной почты.",
        url: "Пожалуйста, введите корректный URL.",
        date: "Пожалуйста, введите корректную дату.",
        dateISO: "Пожалуйста, введите корректную дату в формате ISO.",
        number: "Пожалуйста, введите число.",
        digits: "Пожалуйста, вводите только цифры.",
        creditcard: "Пожалуйста, введите правильный номер кредитной карты.",
        equalTo: "Пожалуйста, введите такое же значение ещё раз.",
        extension: "Пожалуйста, выберите файл с правильным расширением.",
        maxlength: $.validator.format( "Пожалуйста, введите не больше {0} символов." ),
        minlength: $.validator.format( "Пожалуйста, введите не меньше {0} символов." ),
        rangelength: $.validator.format( "Пожалуйста, введите значение длиной от {0} до {1} символов." ),
        range: $.validator.format( "Пожалуйста, введите число от {0} до {1}." ),
        max: $.validator.format( "Пожалуйста, введите число, меньшее или равное {0}." ),
        min: $.validator.format( "Пожалуйста, введите число, большее или равное {0}." )
    } );

    // only numbers
    $(document).on('keypress', '.js-only-numbers', function (e) {
        if (isNaN(e.key)) e.preventDefault();
    });
    // END FORM VALIDATION
    ////////////////////////////////////////////////////////////////////////////

    // START ACCORDION
    ////////////////////////////////////////////////////////////////////////////
    let accordionHeaders = document.querySelectorAll('.accordion__head');

    accordionHeaders.forEach((accordionHeader) => {
        accordionHeader.addEventListener('click', function () {
            let accordionItem = this.closest('.accordion__item');
            let accordionBody = accordionItem.querySelector('.accordion__body');

            if (accordionItem.classList.contains('accordion__item--open')) {
                accordionItem.classList.remove('accordion__item--open');
            } else {
                accordionItem.classList.add('accordion__item--open');
            }

            $(accordionBody).slideToggle(300);
        }, {passive: true});
    });
    // END ACCORDION
    ////////////////////////////////////////////////////////////////////////////

    // START PASSING DATA TO CSS
    ////////////////////////////////////////////////////////////////////////////
    function passingOfCssVariables() {
        if (headerWr) page.style.setProperty('--header-wr-height', `${headerWr.clientHeight}px`);

        // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
        let vh = window.innerHeight * 0.01;
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    passingOfCssVariables();

    window.addEventListener('resize', passingOfCssVariables, {passive: true});
    // END PASSING DATA TO CSS
    ////////////////////////////////////////////////////////////////////////////

    // init tabs
    let $serviceTabs = $('.js-service-tabs');
    let $serviceTabsInitialized;

    const breakpointCheckerForTabs = () => {
        if (breakpointLessXS.matches === true) {
            $serviceTabsInitialized = $serviceTabs.tabs();
        } else if (breakpointLessXS.matches === false) {
            if ($serviceTabsInitialized) $serviceTabsInitialized.tabs('destroy');
        }
    }

    breakpointLessXS.addEventListener('change', breakpointChecker);
    breakpointCheckerForTabs();
}); // end ready
