from pylon.core.tools import log  # pylint: disable=E0611,E0401


def make_dusty_config(context, test_params, scanner_params):
    """ Prepare dusty config for this scanner """
    #
    log.info("Test params: %s", test_params)
    log.info("Scanner params: %s", scanner_params)
    #
    project_id = context.rpc_manager.call.get_project_id()
    log.info("Project ID: %s", project_id)
    #
    integrations = \
        context.rpc_manager.call.integrations_get_project_integrations_by_name(
            project_id, "qualys"
        )
    #
    log.info("Integrations: %s", integrations)
    #
    result = {
        "target": test_params["urls_to_scan"][0],
        "qualys_api_server": str(integrations[0].settings["url"]),
        "qualys_login": integrations[0].settings["login"],
        "qualys_password": integrations[0].settings["passwd"],
        "qualys_option_profile_id": scanner_params["option_profile_id"],
        "qualys_report_template_id": scanner_params["report_template_id"],
        "qualys_scanner_type": scanner_params["scanner_type"].upper(),
    }
    #
    log.info("Result: %s", result)
    #
    return result
