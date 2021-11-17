const Qualys = {
    edit: data => {
        console.log('editIntegration', data)
        const {description, is_default, id, settings} = data
        qualysVm.load({...settings, description, is_default, id})
        qualysVm.modal.modal('show')
    },
    delete: id => {
        qualysVm.load({id})
        qualysVm.delete()
    },
    initialState: () => ({
        url: '',
        login: '',
        password: '',

        description: '',
        is_default: false,
        is_fetching: false,
        error: {},
        test_connection_status: 0,
        id: null,

        pluginName: 'qualys',
        modal: $('#qualys_integration'),
    })
}

const qualysApp = Vue.createApp({
        delimiters: ['[[', ']]'],

        data() {
            return Qualys.initialState()

        },

        mounted() {
            console.log('mounted', this.$el)
            this.modal.on('hidden.bs.modal', e => {
                this.clear()
            })
        },

        computed: {
            apiPath() {
                return `/api/v1/integrations/${this.pluginName}/`
            },
            project_id() {
                return getSelectedProjectId()
            },
            body_data() {
                const {url, login, password: passwd, description, is_default, project_id} = this
                return {url, login, passwd, description, is_default, project_id}
            },
            test_connection_class() {
                if (200 <= this.test_connection_status && this.test_connection_status < 300) {
                    return 'btn-success'
                } else if (this.test_connection_status > 0) {
                    return 'btn-warning'
                } else {
                    return 'btn-secondary'
                }
            }
        },
        watch: {
            is_fetching(newState, oldState) {
                if (newState) {
                    this.test_connection_status = 0
                }
            }
        },
        methods: {
            test_connection() {
                console.log('TEST CONN', this.$data)
                this.is_fetching = true
                $('#qualys_test_connection').removeClass('btn-success').addClass('btn-secondary')
                fetch(this.apiPath + 'check_settings', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(this.body_data)
                }).then(response => {
                    console.log(response)
                    this.is_fetching = false
                    this.test_connection_status = response.status
                    if (!response.ok) {
                        this.handleError(response)
                    }
                })
            },
            clear() {
                Object.assign(this.$data, {
                    ...this.$data,
                    ...Qualys.initialState(),
                })
            },
            load(stateData) {
                Object.assign(this.$data, {
                    ...this.$data,
                    ...stateData
                })
            },
            create() {
                this.is_fetching = true
                fetch(this.apiPath, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(this.body_data)
                }).then(response => {
                    console.log(response)
                    this.is_fetching = false
                    if (response.ok) {
                        this.modal.modal('hide')
                        alertMain.add('Qualys integration created!', 'success-overlay')
                        setTimeout(() => location.reload(), 2000)
                    } else {
                        this.handleError(response)
                    }
                })
            },
            handleError(response) {
                try {
                    response.json().then(
                        errorData => {
                            console.log(errorData)
                            errorData.forEach(item => {
                                console.log('item error', item)
                                this.error = {[item.loc[0]]: item.msg}
                            })
                        }
                    )
                } catch (e) {
                    alertMain.add(e, 'danger-overlay')
                }

            },
            update() {
                console.log('update')
                this.is_fetching = true
                fetch(this.apiPath + this.id, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(this.body_data)
                }).then(response => {
                    console.log(response)
                    this.is_fetching = false
                    if (response.ok) {
                        this.modal.modal('hide')
                        alertMain.add('Qualys integration updated!', 'success-overlay')
                        setTimeout(() => location.reload(), 2000)
                    } else {
                        this.handleError(response)
                    }
                })
            },
            delete() {
                console.log('deleteIntegration')
                this.is_fetching = true
                fetch(this.apiPath + this.id, {
                    method: 'DELETE',
                }).then(response => {
                    console.log(response)
                    this.is_fetching = false
                    if (response.ok) {
                        alertMain.add('Qualys integration deleted')
                        setTimeout(() => location.reload(), 2000)
                    } else {
                        this.handleError(response)
                        alertMain.add(`Deletion error. <button class="btn btn-primary" @click="modal.modal('show')">Open modal<button>`)
                    }
                })
            }
        }

    })

qualysApp.config.compilerOptions.isCustomElement = tag => ['h9', 'h13'].includes(tag)

qualysVm = qualysApp.mount('#qualys_integration')
