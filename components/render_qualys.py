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
