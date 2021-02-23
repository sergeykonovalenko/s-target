import '@fancyapps/fancybox/dist/jquery.fancybox.min';
import 'focus-visible';
import Inputmask from "inputmask";
import './google-maps';
import './svg-sprite';

$(document).ready(function () {
    'use strict';

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

}); // end ready
