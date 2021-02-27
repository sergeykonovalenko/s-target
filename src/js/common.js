import '@fancyapps/fancybox/dist/jquery.fancybox.min';
import 'waypoints/lib/noframework.waypoints.min';
import 'jquery-validation';
import 'focus-visible';
import './google-maps';
import './svg-sprite';
import Inputmask from 'inputmask';
import Swiper, { Navigation, Pagination, Thumbs, Autoplay } from 'swiper/core';

$(document).ready(function () {
    'use strict';

    // START STICKY HEADER
    ////////////////////////////////////////////////////////////////////////////
    let header = document.querySelector('.header');
    let headerWr = document.querySelector('.header__wr');
    let waypointOffset = 0;

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
            }
            headerWr.classList.remove('header__wr--hide');
        } else {
            // SCROLL DOWN
            if (headerWr.classList.contains('header__wr--start-sticky')) {
                headerWr.classList.add('header__wr--hide');
            }
            headerWr.classList.remove('header__wr--show');
        }

        scrollPos = document.body.getBoundingClientRect().top;
    }, {passive: true});
    // END STICKY HEADER
    ////////////////////////////////////////////////////////////////////////////

    // START INIT SWIPER
    ////////////////////////////////////////////////////////////////////////////
    Swiper.use([Navigation, Pagination, Thumbs, Autoplay]);

    // advantages slider
    let advantagesSlider = new Swiper('.advantages-slider', {
        slidesPerView: 4,
        spaceBetween: 30,
        speed: 1000,
        watchOverflow: true,
        pagination: {
            el: '.advantages-slider__pagination',
            clickable: true,
        },
    });
    // END INIT SWIPER
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
    // END FORM VALIDATION
    ////////////////////////////////////////////////////////////////////////////
}); // end ready
