const apiPath = '/api/v1/integrations/qualys/'

const preFetch = () => {
    clearErrors()
    $('#qualys_test_connection').addClass('updating').addClass('disabled')
    $('#qualys_submit').addClass('updating').addClass('disabled')
}

const postFetch = () => {
    $('#qualys_test_connection').removeClass('updating').removeClass('disabled')
    $('#qualys_submit').removeClass('updating').removeClass('disabled')
}

const handleError = response => response.json().then(
    errorData => {
        console.log(errorData)
        errorData.forEach(item => {
            const errorId = `error_qualys_${item.loc[0]}`
            console.log(errorId)
            $(`#qualys_${item.loc[0]}`).addClass('is-invalid')
            $(`#error_qualys_${item.loc[0]}`).text(item.msg).show()
        })
    }
)


const qualysCreate = () => {
    const url = $('#qualys_url').val()
    const login = $('#qualys_login').val()
    const password = $('#qualys_password').val()
    const description = $('#qualys_description').val()
    const is_default = $('#qualys_default').prop('checked')
    const project_id = getSelectedProjectId()
    preFetch()
    fetch(apiPath, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({url, login, password, project_id, description, is_default})
    }).then(response => {
        console.log(response)
        postFetch()
        if (response.ok) {
            // $('#qualys_submit').removeClass('disabled')
            // $('#qualys_test_connection').removeClass('btn-warning').addClass('btn-success').removeClass('btn-secondary')
            $('#qualys_integration').modal('hide')
            location.reload()
        } else {
            handleError(response)
        }
    })
}

const qualysTestConnection = () => {
    const url = $('#qualys_url').val()
    const login = $('#qualys_login').val()
    const password = $('#qualys_password').val()
    preFetch()
    $('#qualys_test_connection').removeClass('btn-success').addClass('btn-secondary')
    fetch(apiPath + 'check_settings', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({url, login, password})
    }).then(response => {
        console.log(response)
        postFetch()
        if (response.ok) {
            // $('#qualys_submit').removeClass('disabled')
            $('#qualys_test_connection').removeClass('btn-warning').removeClass('btn-secondary').addClass('btn-success')
            // $('#qualys_integration').modal('hide')
            // location.reload()
        } else {
            $('#qualys_test_connection').removeClass('btn-success').removeClass('btn-secondary').addClass('btn-warning')
            handleError(response)
        }
    })
}

const clearErrors = () => {
    $('#qualys_url').removeClass('is-invalid')
    $('#qualys_login').removeClass('is-invalid')
    $('#qualys_password').removeClass('is-invalid')
    $('#error_qualys_url').hide()
    $('#error_login_url').hide()
    $('#error_password_url').hide()
    $('#error_qualys_check_connection').hide()
    $('#qualys_test_connection').removeClass('btn-warning').removeClass('btn-success').addClass('btn-secondary').removeClass('updating')
    $('#qualys_submit').removeClass('updating')
}

const clearForm = () => {
    $('#qualys_url').val('')
    $('#qualys_login').val('')
    $('#qualys_description').val('Qualys default')
    $('#qualys_default').prop('checked', false)
    $('#qualys_password').val('').prop('readonly', false).attr('placeholder', 'Password')
    $('#qualys_test_connection').removeClass('updating')
    $('#qualys_submit').removeClass('updating')
}


const qualysUpdate = (cardData) => {
    console.log('UPDATE', cardData)
    const url = $('#qualys_url').val()
    const login = $('#qualys_login').val()
    const password = $('#qualys_password').prop('readonly') ? null : $('#qualys_password').val()
    const description = $('#qualys_description').val()
    const is_default = $('#qualys_default').prop('checked')
    preFetch()
    fetch(apiPath + cardData.id, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({url, login, password, is_default, description})
    }).then(response => {
        console.log(response)
        postFetch()
        if (response.ok) {
            // $('#qualys_submit').removeClass('disabled')
            // $('#qualys_test_connection').removeClass('btn-warning').addClass('btn-success').removeClass('btn-secondary')
            // $('#qualys_integration').modal('hide')
            location.reload()
        } else {
            handleError(response)
        }
    })
}

const editIntegration = data => {
    console.log('editIntegration', data)
    const {settings: {url, login}, description, is_default} = data;
    $('#qualys_url').val(url)
    $('#qualys_login').val(login)
    const pass = $('#qualys_password')
    pass.prop('readonly', true).attr('placeholder', 'Click to change')
    pass.on('click', () => pass.prop('readonly', false))
    $('#qualys_description').val(description)
    $('#qualys_default').prop('checked', is_default)

    $('#qualys_submit').on('click', qualysUpdate.bind(null, data))
    $('#qualys_integration').modal('show')
}

const deleteIntegration = id => {
    console.log('deleteIntegration', id)
    fetch(apiPath + id, {
        method: 'DELETE',
    }).then(response => {
        console.log(response)
        postFetch()
        if (response.ok) {
            location.reload()
        } else {
            handleError(response)
        }
    })
}


$(document).ready(function () {
    $('#create_integration_qualys').on('click', () => $('#qualys_submit').on('click', qualysCreate));
    $('#qualys_test_connection').on('click', qualysTestConnection);
    // $('#qualys_url').on('change', () => $('#qualys_submit').addClass('disabled'))
    // $('#qualys_login').on('change', () => $('#qualys_submit').addClass('disabled'))
    // $('#qualys_password').on('change', () => $('#qualys_submit').addClass('disabled'))
    // $('#qualys_integration').on('show.bs.modal', e => {
    //     $('#qualys_submit').addClass('disabled')
    // })
    $('#qualys_integration').on('hidden.bs.modal', e => {
        clearErrors();
        clearForm();
        $('#qualys_submit').prop("onclick", null).off("click");
        console.log('clearing click')
    })
});