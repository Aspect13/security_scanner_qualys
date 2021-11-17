from pylon.core.tools import log  # pylint: disable=E0611,E0401


def make_dusty_config(context, test_params, scanner_params):
    """ Prepare dusty config for this scanner """
    #
    log.info("Test params: %s", test_params)
    log.info("Scanner params: %s", scanner_params)
    #
    integration = context.rpc_manager.call.integrations_get_by_id(scanner_params['id'])
    #
    log.info("Integrations: %s", integration)
    #
    qualys_scanner_type = scanner_params.get("scanner_type")
    if qualys_scanner_type:
        qualys_scanner_type = qualys_scanner_type.upper()
    result = {
        "target": test_params["urls_to_scan"][0],
        "qualys_api_server": str(integration.settings["url"]),
        "qualys_login": integration.settings["login"],
        "qualys_password": integration.settings["passwd"],
        "qualys_option_profile_id": scanner_params.get("option_profile_id"),
        "qualys_report_template_id": scanner_params.get("report_template_id"),
        "qualys_scanner_type": qualys_scanner_type,
    }
    #
    log.info("Result: %s", result)
    #
    return result
