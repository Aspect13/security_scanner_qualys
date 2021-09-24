const apiPath = '/api/v1/integrations/qualys/'

const qualysSubmit = data => {
    clearErrors()
    $('#qualys_test_connection').addClass('updating')
    $('#qualys_submit').addClass('updating')
    fetch(apiPath, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(response => {
        console.log(response)
        $('#qualys_test_connection').removeClass('updating')
        $('#qualys_submit').removeClass('updating')
        if (response.ok) {
            $('#qualys_submit').removeClass('disabled')
            $('#qualys_test_connection').removeClass('btn-warning').addClass('btn-success').removeClass('btn-secondary')
        } else {
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
    $('#qualys_password').val('')
    $('#qualys_test_connection').removeClass('updating')
    $('#qualys_submit').removeClass('updating')
}

$(document).ready(function () {
    $('#qualys_submit').on('click', qualysCreate);
    $('#qualys_test_connection').on('click', qualysTestConnection);
    $('#qualys_url').on('change', () => $('#qualys_submit').addClass('disabled'))
    $('#qualys_login').on('change', () => $('#qualys_submit').addClass('disabled'))
    $('#qualys_password').on('change', () => $('#qualys_submit').addClass('disabled'))
    $('#qualys_close').on('click', () => {clearErrors(); clearForm()})
});