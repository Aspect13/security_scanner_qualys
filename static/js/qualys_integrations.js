const apiPath = '/api/v1/integrations/qualys/'

const preFetch = () => {
    clearErrors()
    $('#qualys_test_connection').addClass('updating')
    $('#qualys_submit').addClass('updating')
}

const postFetch = () => {
    $('#qualys_test_connection').removeClass('updating')
    $('#qualys_submit').removeClass('updating')
}

const handleError = response => {
    $('#qualys_test_connection').removeClass('btn-success').removeClass('btn-secondary').addClass('btn-warning')
        response.json().then(errorData => {
            console.log(errorData)
            errorData.forEach(item => {
                const errorId = `error_qualys_${item.loc[0]}`
                console.log(errorId)
                $(`#qualys_${item.loc[0]}`).addClass('is-invalid')
                $(`#error_qualys_${item.loc[0]}`).text(item.msg).show()
            })
            // errorData[0].loc[0]
        })
}

const qualysSubmit = (data) => {
    preFetch()
    fetch(apiPath, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(response => {
        console.log(response)
        postFetch()
        if (response.ok) {
            $('#qualys_submit').removeClass('disabled')
            $('#qualys_test_connection').removeClass('btn-warning').addClass('btn-success').removeClass('btn-secondary')
            data.save_action === true && $('#qualys_integration').modal('hide')
            data.save_action === true && location.reload()
        } else {
            handleError(response)
        }
    })
}

const qualysCreate = () => {
    const url = $('#qualys_url').val()
    const login = $('#qualys_login').val()
    const password = $('#qualys_password').val()
    // console.log(JSON.stringify({url, login, password, project_id: getSelectedProjectId(), save_action: true}))
    qualysSubmit({url, login, password, project_id: getSelectedProjectId(), save_action: true})
}

const qualysTestConnection = () => {
    const url = $('#qualys_url').val()
    const login = $('#qualys_login').val()
    const password = $('#qualys_password').val()
    // console.log(JSON.stringify({url, login, password}))
    qualysSubmit({url, login, password})
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
    $('#qualys_password').val('').prop('readonly', false).attr('placeholder', 'Password')
    $('#qualys_test_connection').removeClass('updating')
    $('#qualys_submit').removeClass('updating')
}


const qualysUpdate = (cardData) => {
    console.log('UPDATE', cardData)
    const url = $('#qualys_url').val()
    const login = $('#qualys_login').val()
    const password = $('#qualys_password').prop('readonly') ? null :$('#qualys_password').val()
    // qualysSubmit({url, login, password, project_id: getSelectedProjectId(), save_action: true})
    preFetch()
    fetch(apiPath + cardData.id, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({url, login, password})
    }).then(response => {
        console.log(response)
        postFetch()
        if (response.ok) {
            $('#qualys_submit').removeClass('disabled')
            $('#qualys_test_connection').removeClass('btn-warning').addClass('btn-success').removeClass('btn-secondary')
            $('#qualys_integration').modal('hide')
            location.reload()
        } else {
            handleError(response)
        }
    })
}

const editIntegration = data => {
    console.log('editIntegration', data)
    const {settings: {url, login}} = data;
    $('#qualys_url').val(url)
    $('#qualys_login').val(login)
    const pass = $('#qualys_password')
    pass.prop('readonly', true).attr('placeholder', 'Click to change')
    pass.on('click', () => pass.prop('readonly', false))
    $('#qualys_integration').modal('show')
    $('#qualys_submit').on('click', qualysUpdate.bind(null, data))
}


$(document).ready(function () {
    $('#create_integration_qualys').on('click', () => $('#qualys_submit').on('click', qualysCreate));
    $('#qualys_test_connection').on('click', qualysTestConnection);
    $('#qualys_url').on('change', () => $('#qualys_submit').addClass('disabled'))
    $('#qualys_login').on('change', () => $('#qualys_submit').addClass('disabled'))
    $('#qualys_password').on('change', () => $('#qualys_submit').addClass('disabled'))
    // $('#qualys_close').on('click', () => {clearErrors(); clearForm()})
    $('#qualys_integration').on('show.bs.modal', e => {
        $('#qualys_submit').addClass('disabled')
    })
    $('#qualys_integration').on('hidden.bs.modal', e => {
      clearErrors();
      clearForm();
      $('#qualys_submit').prop("onclick", null).off("click");
    })
});