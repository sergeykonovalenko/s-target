$(document).ready(function () {
    let maxDiscount = +auction.maxDiscount;
    let operatorAvatarWebpURL = auction.operatorAvatarWebpURL;
    let operatorAvatarJpgURL = auction.operatorAvatarJpgURL;
    let clientAvatarWebpURL = auction.clientAvatarWebpURL;
    let clientAvatarJpgURL = auction.clientAvatarJpgURL;
    let reMore = 0;

    $(document).on('click', '.js-get-discount', function () {
        let $messages = $(this).closest('.messages');
        let $wantedDiscount = $messages.find('.js-wanted-discount');
        let $discountField = $wantedDiscount.find('.actions-message-body__field');
        let discount = parseInt($discountField.val());

        if (!discount) {
            $discountField.addClass('error').focus();
            return;
        }

        if (discount > maxDiscount) reMore++;

        $wantedDiscount.html(`
                <div class="message-body__txt content">
                    <p>Моя скидка <strong>${discount}%</strong></p>
                </div>
            `).removeClass('js-wanted-discount');

        // dialog answer
        let dialogAnswer = `
            <li class="messages__item message-item message-item--replies js-dialog-answer" style="display: none">
                <picture>
                    <source srcset="${operatorAvatarWebpURL}" type="image/webp">
                    <img class="messages-item__avatar" src="${operatorAvatarJpgURL}" width="55" height="55" alt="">
                </picture>
                <div class="message-item__body message-body">
                    <div class="message-body__txt content">`;
        if (discount < maxDiscount) {
            dialogAnswer += `<p>Серьезно? А я могу предложить <strong>${maxDiscount}%</strong></p>`;
        }
        if (discount === maxDiscount) {
            dialogAnswer += `<p>По рукам! Для хорошего человека ничего не жалко!</p>`;
        }
        if (discount > maxDiscount && reMore === 1) {
            dialogAnswer += `<p>Это не серьезно. Могу предложить <strong>${maxDiscount - 4}%</strong></p>`;
        }
        if (discount > maxDiscount && reMore === 2) {
            dialogAnswer += `<p>Хорошая скидка, но давай договоримся на <strong>${maxDiscount}%</strong></p>`;
        }
        dialogAnswer += `
                    </div>
                </div><!-- / .message-body -->
            </li>`;

        // dialog client
        let dialogClient = `
            <li class="messages__item message-item message-item--sent js-dialog-client" style="display: none">
                <div class="message-item__body message-body">
                    <div class="message-body__actions actions-message-body">`;
        if (discount <= maxDiscount) {
            dialogClient += `
                        <div class="actions-message-body__row">
                            <p class="actions-message-body__txt">По рукам!</p>
                            <a class="actions-message-body__button button btn-modal-call js-take-discount" href="#js-modal-take-discount">Беру <strong>${maxDiscount}%</strong></a>
                        </div>`;
        }
        if (discount > maxDiscount && reMore === 1) {
            dialogClient += `
                        <div class="actions-message-body__row">
                            <p class="actions-message-body__txt">Твоя взяла!</p>
                            <a class="actions-message-body__button button btn-modal-call js-take-discount" href="#js-modal-take-discount">Беру <strong>${maxDiscount - 4}%</strong></a>
                        </div>
                        <button class="actions-message-body__btn-link link link--color--gray js-continue-auction" type="button"><span>Нет, поторгуюсь еще</span></button>`;
        }
        if (discount > maxDiscount && reMore === 2) {
            dialogClient += `
                        <div class="actions-message-body__row">
                            <p class="actions-message-body__txt">Твоя взяла!</p>
                            <a class="actions-message-body__button button btn-modal-call js-take-discount" href="#js-modal-take-discount">Беру <strong>${maxDiscount}%</strong></a>
                        </div>
                        <a class="actions-message-body__btn-link link link--color--gray btn-modal-call js-wants-more" href="#js-modal-wants-more"><span>Хочу больше</span></a>`;
        }
        dialogClient += `
                    </div><!-- / .actions-message-body -->
                </div><!-- / .message-body -->
                <picture>
                    <source srcset="${clientAvatarWebpURL}" type="image/webp">
                    <img class="messages-item__avatar" src="${clientAvatarJpgURL}" width="55" height="55" alt="">
                </picture>
            </li>`;

        $messages.append(dialogAnswer);
        $messages.find('.js-dialog-answer').fadeIn(1000, () => {
            $messages.append(dialogClient);
            $messages.find('.js-dialog-client').fadeIn(1000).removeClass('js-dialog-client');
        }).removeClass('js-dialog-answer');
    });

    // continue auction
    $(document).on('click', '.js-continue-auction', function () {
        let $messages = $(this).closest('.messages');
        let dialogClient = `
            <li class="messages__item message-item message-item--sent js-dialog-client" style="display: none">
                <div class="message-item__body message-body js-wanted-discount">
                    <div class="message-body__actions actions-message-body">
                        <div class="actions-message-body__row">
                            <label class="actions-message-body__label">
                                <input class="actions-message-body__field" type="number" name="discount" min="1" inputmode="numeric">
                                <span class="visually-hidden">Скидка</span>
                            </label>
                            <button class="actions-message-body__button button js-get-discount" type="button">Хочу такую скидку</button>
                        </div>
                    </div><!-- / .actions-message-body -->
                </div><!-- / .message-body -->
                <picture>
                    <source srcset="${clientAvatarWebpURL}" type="image/webp">
                    <img class="messages-item__avatar" src="${clientAvatarJpgURL}" width="55" height="55" alt="">
                </picture>
            </li>`;

        $(this).closest('.messages__item').fadeOut(1000, function () {
            $(this).remove();
            $messages.append(dialogClient);
            $messages.find('.js-dialog-client')
                    .fadeIn(1000)
                    .removeClass('js-dialog-client')
                    .find('.actions-message-body__field')
                    .focus();
        });
    });

    // validation
    $(document).on('input', '.actions-message-body__field', function () {
        validation($(this));
    });

    // $(document).on('blur', '.actions-message-body__field', function () {
    //     validation($(this));
    // });

    function validation($field) {
        let discount = +$field.val();

        if (discount) {
            $field.removeClass('error');
        } else {
            $field.addClass('error');
        }
    }

    $(document).on('keypress', '.actions-message-body__field', function (e) {
        if (isNaN(e.key)) e.preventDefault();
    });

    // show rules
    $(document).on('click', '.chat__btn-show-rules', function () {
        $('.chat__rules').fadeToggle(300);
    });

    // substitution of quiz data into the form
    $(document).on('click', '.js-take-discount', function () {
        let $modalTakeDiscount = $('.modal-take-discount');
        let currentDiscount = parseInt($(this).find('strong').text());

        $modalTakeDiscount.find('input[name=max-discount]').val(maxDiscount);
        $modalTakeDiscount.find('input[name=current-discount]').val(currentDiscount);
    });

    $(document).on('click', '.js-wants-more', function () {
        let $modalWantsMore = $('.modal-wants-more');
        $modalWantsMore.find('input[name=max-discount]').val(maxDiscount);
    });
}); // end ready
