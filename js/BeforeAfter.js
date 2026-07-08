(function () {
    'use strict';

    function initBeforeAfterSliders() {
        document.querySelectorAll('[data-before-after]').forEach(function (container) {
            var range = container.querySelector('.before-after__range');
            if (!range) return;

            var updatePosition = function (value) {
                container.style.setProperty('--position', value + '%');
            };

            updatePosition(range.value);

            range.addEventListener('input', function (e) {
                updatePosition(e.target.value);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBeforeAfterSliders);
    } else {
        initBeforeAfterSliders();
    }
})();
