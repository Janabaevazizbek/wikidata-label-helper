/**
 * Wikidata Label Helper (Versiya 1.3)
 * Shortdesc helper interfeysi menen pikseline shekem birdey qılıp tayarlanǵan versiyası.
 */
mw.loader.using(['mediawiki.util', 'mediawiki.ForeignApi', 'mediawiki.notification']).then(function () {
    $(function () {
        var allowedNamespaces = [0, 10, 14];

        if (mw.config.get('wgAction') !== 'view' || allowedNamespaces.indexOf(mw.config.get('wgNamespaceNumber')) === -1) {
            return;
        }

        var itemId = mw.config.get('wgWikibaseItemId');
        if (!itemId) {
            return;
        }

        var lang = mw.config.get('wgContentLanguage'); 
        var api = new mw.ForeignApi('https://www.wikidata.org/w/api.php');

        api.get({
            action: 'wbgetentities',
            ids: itemId,
            props: 'labels',
            languages: lang,
            format: 'json'
        }).done(function (data) {
            var currentLabel = '';
            var entity = data.entities[itemId];
            if (entity && entity.labels && entity.labels[lang]) {
                currentLabel = entity.labels[lang].value;
            }
            initUI(currentLabel);
        });

        function initUI(currentLabel) {
            var $container = $('<div>').attr('id', 'wd-label-helper').css({
                'font-size': '85%',
                'margin-bottom': '0.4em',
                'color': '#54595d',
                'display': 'block',
                'line-height': '1.5em'
            });

            var $displaySpan = $('<span>');
            var $actionLink = $('<a>').attr('href', '#').css('margin-left', '0.4em');

            // Shortdesc helper stilindegi tekst formatı
            if (currentLabel) {
                $displaySpan.text('Wikimaǵlıwmat ataması: ' + currentLabel);
                $actionLink.text('(redaktorlaw)');
            } else {
                $displaySpan.text('Wikimaǵlıwmat ataması ');
                var $missingSpan = $('<span>').text('joq').css({
                    'color': '#ba3c26',
                    'font-weight': 'bold'
                });
                $displaySpan.append($missingSpan);
                $actionLink.text('(Qosıw)');
            }

            $container.append($displaySpan).append($actionLink);
            
            if ($('#contentSub').length) {
                $('#contentSub').before($container);
            } else if ($('#siteSub').length) {
                $('#siteSub').after($container);
            } else {
                $('#firstHeading').after($container);
            }

            $actionLink.on('click', function (e) {
                e.preventDefault();
                showEditForm($container, $displaySpan, $actionLink, currentLabel);
            });
        }

        function showEditForm($container, $displaySpan, $actionLink, currentLabel) {
            $displaySpan.hide();
            $actionLink.hide();

            // 1. Birlesken kiyirtiw paneli (Input + Counter + Saqlaw)
            var $inputWrapper = $('<span>').css({
                'display': 'inline-flex',
                'align-items': 'center',
                'background': '#fff',
                'border': '1px solid #a2a9b1',
                'border-radius': '2px',
                'height': '32px',
                'vertical-align': 'middle',
                'box-sizing': 'border-box'
            });

            var $input = $('<input>').attr({
                type: 'text',
                placeholder: 'Wikimaǵlıwmat ataması...'
            }).val(currentLabel).css({
                'border': 'none',
                'padding': '0 8px',
                'height': '100%',
                'width': '250px',
                'outline': 'none',
                'font-size': '14px',
                'box-sizing': 'border-box'
            });

            // Simvollar sanın esaplaǵısh (Counter)
            var $charCount = $('<span>').text(currentLabel.length).css({
                'color': '#72777d',
                'font-size': '12px',
                'padding': '0 8px',
                'border-right': '1px solid #a2a9b1',
                'height': '100%',
                'display': 'inline-flex',
                'align-items': 'center',
                'background': '#f8f9fa',
                'user-select': 'none'
            });

            var $saveBtn = $('<button>').text('Saqlaw').css({
                'background': '#36c',
                'color': '#fff',
                'border': 'none',
                'font-weight': 'bold',
                'padding': '0 16px',
                'height': '100%',
                'cursor': 'pointer',
                'font-size': '14px',
                'border-radius': '0 2px 2px 0'
            });

            $inputWrapper.append($input).append($charCount).append($saveBtn);

            // 2. Redaktorlaw túsindirmesi (Edit Summary Input)
            var $summaryInput = $('<input>').attr({
                type: 'text',
                placeholder: 'Redaktorlaw túsindirmesi'
            }).css({
                'border': '1px solid #a2a9b1',
                'border-radius': '2px',
                'padding': '0 8px',
                'height': '32px',
                'width': '200px',
                'margin-left': '8px',
                'vertical-align': 'middle',
                'box-sizing': 'border-box',
                'outline': 'none',
                'font-size': '14px'
            });

            // 3. Biykarlaw túymesi (Cancel Button)
            var $cancelBtn = $('<button>').text('Biykarlaw').css({
                'background': '#fff',
                'color': '#d33',
                'border': '1px solid #d33',
                'border-radius': '2px',
                'padding': '0 12px',
                'height': '32px',
                'margin-left': '8px',
                'vertical-align': 'middle',
                'cursor': 'pointer',
                'font-weight': 'bold',
                'font-size': '14px'
            });

            var $form = $('<span>').append($inputWrapper).append($summaryInput).append($cancelBtn);
            $container.append($form);

            $input.focus();

            // Dinamikalıq simvol esaplaw logikası
            $input.on('input', function () {
                $charCount.text($input.val().length);
            });

            $input.on('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    $saveBtn.click();
                }
            });

            $summaryInput.on('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    $saveBtn.click();
                }
            });

            $cancelBtn.on('click', function (e) {
                e.preventDefault();
                $form.remove();
                $displaySpan.show();
                $actionLink.show();
            });

            $saveBtn.on('click', function (e) {
                e.preventDefault();
                var newLabel = $input.val().trim();
                var summaryText = $summaryInput.val().trim();
                
                if (newLabel === currentLabel) {
                    $cancelBtn.click();
                    return;
                }

                $input.prop('disabled', true);
                $saveBtn.prop('disabled', true);
                $summaryInput.prop('disabled', true);

                // Paydalanıwshı túsindirme jazǵan bolsa sonı qosadı, bolmasa standart tekst qáledı
                var finalSummary = summaryText ? summaryText + ' ([[w:kaa:Wikipedia:Label helper|Label helper]])' : 'Label updated via Label Helper gadget';

                api.postWithToken('csrf', {
                    action: 'wbsetlabel',
                    id: itemId,
                    language: lang,
                    value: newLabel,
                    summary: finalSummary,
                    format: 'json'
                }).done(function (data) {
                    if (data.success) {
                        mw.notify('Wikimaǵlıwmat ataması tabıslı saqlandı!', { type: 'success' });
                        $form.remove();
                        currentLabel = newLabel;
                        
                        // Kórinisti jańalaw
                        $displaySpan.empty().text('Wikimaǵlıwmat ataması: ' + newLabel);
                        $actionLink.text('(redaktorlaw)').show();
                        $displaySpan.show();
                    } else {
                        mw.notify('Qátelik: Wikidataǵa saqlanbadı.', { type: 'error' });
                        $input.prop('disabled', false);
                        $saveBtn.prop('disabled', false);
                        $summaryInput.prop('disabled', false);
                    }
                }).fail(function (error) {
                    mw.notify('API qáteligi: ' + error, { type: 'error' });
                    $input.prop('disabled', false);
                    $saveBtn.prop('disabled', false);
                    $summaryInput.prop('disabled', false);
                });
            });
        }
    });
});
