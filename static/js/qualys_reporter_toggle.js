window['scanners_qualys'] = {
    get_data: () => {
        if ($('#integration_checkbox_qualys').prop('checked')) {
            return {
                id: $('#selector_qualys .selectpicker').val(),
            }
        }
    },
    set_data: data => {
        $('#integration_checkbox_qualys').prop('checked', true)
        $('#selector_qualys .selectpicker').val(data.id).selectpicker('refresh')
        $('#selector_qualys').collapse('show')
    },
    clear_data: () => {
        const selector = $('#selector_qualys .selectpicker')
        selector[0]?.options.forEach(item =>
            $(item).attr('data-is_default') && $(selector[0]).val($(item).val()).selectpicker('refresh')
        )
        $('#integration_checkbox_qualys').prop('checked', false)
        $('#selector_qualys').collapse('hide')
    }
}