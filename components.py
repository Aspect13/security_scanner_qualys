from queue import Empty

from flask import render_template


def render_integration_create_modal(context, slot, payload):
    return render_template(
        'security_scanner_qualys:qualys_integration.html',
        config=payload
    )


def render_integration_card(context, slot, payload):
    return render_template(
        'security_scanner_qualys:qualys_integration_card.html',
        config=payload
    )


def render_reporter_toggle(context, slot, payload):
    try:
        integrations = context.rpc_manager.call.integrations_get_project_integrations_by_name(
            payload['id'],
            'security_scanner_qualys'
        )
    except Empty:
        integrations = []
    payload['project_integrations'] = integrations
    return render_template(
        'security_scanner_qualys:qualys_reporter_toggle.html',
        config=payload
    )
