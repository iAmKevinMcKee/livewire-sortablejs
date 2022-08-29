import Sortable from 'sortablejs';

window.Sortablee = Sortable;

if (typeof window.Livewire === 'undefined') {
    throw 'Livewire Sortable.js Plugin: window.Livewire is undefined. Make sure @livewireScripts is placed above this script include';
}

window.Livewire.directive('sortablee', (el, directive, component) => {
    // Only fire this handler on the "root" directive.
    if (directive.modifiers.length > 0) {
        return;
    }

    let options = {};

    if (el.hasAttribute('wire:sortablee.options')) {
        options = (new Function(`return ${el.getAttribute('wire:sortablee.options')};`))();
    }

    el.livewire_sortablee = window.Sortablee.create(el, {
        ...options,
        draggable: '[wire\\:sortablee\\.item]',
        handle: el.querySelector('[wire\\:sortablee\\.handle]') ? '[wire\\:sortablee\\.handle]' : null,
        sort: true,
        dataIdAttr: 'wire:sortablee.item',
        group: {
            name: el.getAttribute('wire:sortablee'),
            pull: false,
            put: false,
        },
        store: {
            set: function (sortablee) {
                let items = sortablee.toArray().map((value, index) => {
                    return {
                        order: index + 1,
                        value: value,
                    };
                });

                component.call(directive.method, items);
            },
        },
    });
});

window.Livewire.directive('sortablee-group', (el, directive, component) => {
    // Only fire this handler on the "root" group directive.
    if (! directive.modifiers.includes('item-group')) {
        return;
    }

    let options = {};

    if (el.hasAttribute('wire:sortablee-group.options')) {
        options = (new Function(`return ${el.getAttribute('wire:sortablee-group.options')};`))();
    }

    el.livewire_sortablee = window.Sortablee.create(el, {
        ...options,
        draggable: '[wire\\:sortablee-group\\.item]',
        handle: el.querySelector('[wire\\:sortablee-group\\.handle]') ? '[wire\\:sortablee-group\\.handle]' : null,
        sort: true,
        dataIdAttr: 'wire:sortablee-group.item',
        group: {
            name: el.closest('[wire\\:sortablee-group]').getAttribute('wire:sortablee-group'),
            pull: true,
            put: true,
        },
        onSort: () => {
            let masterEl = el.closest('[wire\\:sortablee-group]');

            let groups = Array.from(masterEl.querySelectorAll('[wire\\:sortablee-group\\.item-group]')).map((el, index) => {
                return {
                    order: index + 1,
                    value: el.getAttribute('wire:sortablee-group.item-group'),
                    items:  el.livewire_sortablee.toArray().map((value, index) => {
                        return {
                            order: index + 1,
                            value: value
                        };
                    }),
                };
            });

            component.call(masterEl.getAttribute('wire:sortablee-group'), groups);
        },
    });
});
