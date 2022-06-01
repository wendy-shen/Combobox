/* ====================================
 * bootstrap-combobox 
 * ====================================
 * Author: Wendy
 * Dependency: jQuery、Bootstrap 3.3.7
 * ==================================== */

(function ($) {
    var sizeStr = { lg: 'lg', md: 'md', sm: 'sm', xs: 'xs' };
    var sizeClass = {
        lg: 'combobox-lg',
        md: 'combobox-md',
        sm: 'combobox-sm',
        xs: 'combobox-xs'
    };

    var defaultOption = {
        menu: '<ul class="dropdown-menu" role="menu"></ul>',
        item: '<li><a href="#" class="dropdown-item"></a></li>',
        option: [],
        caretIcon: 'caret',
        size: sizeStr.md,
        containerClass: [],
        inputClass: [],
        inputName: 'combobox',
        inputId: 'combobox',
        inputEvent: {},
        placeholder: '',
        disabled: false,
        dropdownMaxHeight: '150px',
        dropdownMinHeight: '',
        beforeShow: function (combo, event) { },
        shown: function (combo, event) { },
        beforeHide: function (combo, event) { },
        hidden: function (combo, event) { },
        filter: true,
        value: ''
    };

    var Combobox = function (element, options) {
        let data = $(element).data();

        if (typeof data.option === 'string')
            data.option = $.parseJSON(data.option.replace(/\'/g, '"'));

        this.options = $.extend({}, $.fn.Combobox.defaults, data, options);
        this.template = this.options.template || this.template;
        this.$el = $(element);
        this.$container = this.setup();
        this.$input = this.$container.find('input:text');
        this.$button = this.$container.find('.dropdown-toggle');
        this.$menu = this.$container.find('ul.dropdown-menu');
        this.$dropdown = this.$menu.data('bs.dropdown');
        this.eventIni();
    };

    Combobox.prototype = {
        constructor: Combobox,

        setup: function () {
            let $combobox = $(this.template());

            this.$container = $combobox;
            this.$input = this.$container.find('input:text');
            this.$button = this.$container.find('.dropdown-toggle');
            this.$menu = this.$container.find('ul.dropdown-menu');
            this.dropdown = this.$button.dropdown();

            this.$el.html($combobox);

            this.setOptions(this.options);

            return $combobox;
        },

        template: function () {
            return '<div class="input-group combobox">\n' +
                '   <input type="text" class="form-control" autocomplete="off" />\n' +
                '   ' + this.options.menu + '\n' +
                '   <a class="input-group-addon dropdown-toggle" data-toggle="dropdown">\n' +
                '       <span class="' + this.options.caretIcon + '"></span>\n' +
                '   </a>\n' +
                '</div>';
        },

        setOptions: function (options) {

            this.options = $.extend({}, this.options, options);

            this.setInputID(this.options.inputId);
            this.setInputName(this.options.inputName);
            this.setInputValue(this.options.value);
            this.setInputEvent(this.options.inputEvent);
            this.setSize(this.options.size);
            this.setContainerClass(this.options.containerClass);
            this.setInputClass(this.options.inputClass);
            this.setMenuHeight(this.options.dropdownMaxHeight, this.options.dropdownMinHeight);
            this.setPlaceHolder(this.options.placeholder);

            if (this.options.disabled)
                this.disable();
            else
                this.enable();

            this.buildMenu();


        },

        setInputID: function (id) {
            if (this.options.inputId !== id)
                this.options.inputId = id;

            this.$input.attr('id', id).prop('id', id);
        },

        setInputName: function (name) {
            if (this.options.inputName !== name)
                this.options.inputName = name;

            this.$input.attr('name', name).prop('name', name);
        },

        setInputValue: function (value) {
            if (this.options.value !== value)
                this.options.value = value;

            this.$input.val(value).attr('value', value);
        },

        setInputEvent: function (event) {
            if (this.options.inputEvent !== event)
                this.options.inputEvent = event;

            for (let key of Object.keys(event)) {
                this.$input.attr(key, event[key].replace(/\"/g, "'"));
            }
        },

        setPlaceHolder: function (desc) {
            this.$input.attr('placeholder', desc).prop('placeholder', desc);
        },

        setSize: function (size) {
            this.$container.removeClass(sizeClass[this.options.size]).addClass(sizeClass[size]);

            if (this.options.size !== size)
                this.options.size = size;

            this.$menu.css('min-width', this.$container.width() + 'px');
        },

        setContainerClass: function (css) {
            this.$container.removeClass(this.options.containerClass).addClass(css);

            if (this.options.containerClass !== css)
                this.options.containerClass = css;
        },

        setInputClass: function (css) {
            this.$input.removeClass(this.options.inputClass).addClass(css);

            if (this.options.inputClass !== css)
                this.options.inputClass = css;
        },

        setMenuHeight: function (maxHeight, minHeight) {
            if (this.options.dropdownMaxHeight !== maxHeight)
                this.options.dropdownMaxHeight = maxHeight;

            if (this.options.dropdownMinHeight !== minHeight)
                this.options.dropdownMinHeight = minHeight;

            this.$menu.css('max-height', maxHeight);
            this.$menu.css('min-height', minHeight);
        },

        disable: function () {
            if (this.options.disabled !== true)
                this.options.disabled = true;

            this.$input.prop('disabled', true);
            this.$button.removeAttr('data-toggle');
        },

        enable: function () {
            if (this.options.disabled !== false)
                this.options.disabled = false;

            this.$input.prop('disabled', false);
            this.$button.attr('data-toggle', 'dropdown');
        },

        addItems: function (items) {
            if (Array.isArray(items)) {

                this.options.option = $.merge(this.options.option, items);

                this.buildMenu();
            }
        },

        addItem: function (item) {

            if (this.options.option.indexOf(item) === -1)
                this.options.option.push(item);

            this.buildMenu();
        },

        buildMenu: function () {
            this.$menu.html('');

            this.options.option = [...(new Set(this.options.option))];

            this.options.option.forEach((opt, idx) => {
                let $item = $(this.options.item);

                $item.find('.dropdown-item').text(opt);

                this.$menu.append($item);
            });
        },

        focus: function () {
            this.$input.focus();
        },

        blur: function () {
            this.$input.blur();
        },

        filter: function () {
            let combobox = this;
            let value = combobox.$input.val();

            combobox.$menu.find('li').filter(function () {
                $(this).toggle($(this).find('.dropdown-item').text().toLowerCase().indexOf(value) > -1);
            });
        },

        trigger: function (eventName) {
            this.$container.trigger(eventName);
        },

        on: function (eventName, action) {
            this.$container.on(eventName, action);
        },

        off: function (eventName) {
            this.$container.off(eventName);
        },

        show: function (e) {

            this.trigger('show.bs.dropdown');

            if (e.isDefaultPrevented()) return;

            this.$container.addClass('open');

            this.trigger('shown.bs.dropdown');
        },

        hide: function (e) {

            this.trigger('hide.bs.dropdown');

            if (e.isDefaultPrevented()) return;

            this.$container.removeClass('open');

            this.trigger('hidden.bs.dropdown');
        },

        toggle: function (e) {
            if (this.isShow())
                this.hide(e);
            else
                this.show(e);
        },

        isShow: function () {
            return this.$container.hasClass('open');
        },

        select: function (e) {
            this.$input.val($(e.target).text());
            this.blur();
        },

        eventIni: function () {
            let combobox = this;

            combobox.$input
                .keyup(function (event) {
                    if (combobox.options.filter)
                        combobox.filter();
                })
                .focusin(function (event) {
                    if (!combobox.options.disabled)
                        combobox.show(event);
                });

            if (combobox.options.beforeShow !== undefined && typeof combobox.options.beforeShow === 'function')
                combobox.on('show.bs.dropdown', function (e) {
                    if (combobox.options.filter)
                        combobox.filter();

                    combobox.options.beforeShow(combobox, e);
                });

            if (combobox.options.shown !== undefined && typeof combobox.options.shown === 'function')
                combobox.on('shown.bs.dropdown', function (e) {
                    combobox.options.shown(combobox, e);
                });

            if (combobox.options.beforeHide !== undefined && typeof combobox.options.beforeHide === 'function')
                combobox.on('hide.bs.dropdown', function (e) {
                    combobox.options.beforeHide(combobox, e);
                });

            if (combobox.options.hidden !== undefined && typeof combobox.options.hidden === 'function')
                combobox.on('hidden.bs.dropdown', function (e) {
                    combobox.options.hidden(combobox, e);
                });

            combobox.$menu.on('click', '.dropdown-item', function (event) {
                combobox.select(event);
            });
        }
    };

    $.fn.Combobox = function (option) {
        let combo = [];

        this.each(function () {
            let $this = $(this);
            let data = $this.data('combobox');
            let options = typeof option === 'object' && option;

            if (!data) { $this.data('combobox', (data = new Combobox(this, options))); }
            if (typeof option === 'string') { data[option](); }

            combo.push(data);
        });

        return combo;
    };

    $.fn.Combobox.defaults = defaultOption;

    $.fn.Combobox.Constructor = Combobox;

}(window.jQuery));