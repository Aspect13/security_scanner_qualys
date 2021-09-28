from flask import request, render_template, url_for
import os


def render_qualys_card(context, slot, payload):
    return render_template(
        f"qualys_template.html",
        config=payload
    )


def render_qualys_integration_create_modal(context, slot, payload):
    # print(url_for('qualys.static', filename='integration_create.html'))
    return render_template(
        'qualys_integration.html',
        config=payload
    )

def render_qualys_integration_card(context, slot, payload):
    return render_template(
        'qualys_integration_card.html',
        config=payload
    )

def render_qualys_reporter_toggle(context, slot, payload):
    print('99'*88)
    print(payload)
    print('99'*88)
    integrations = context.rpc_manager.timeout(5).integrations_get_project_integrations_by_name(payload['id'], 'qualys')
    payload['project_integrations'] = integrations
    return render_template(
        'qualys_reporter_toggle.html',
        config=payload
    )
