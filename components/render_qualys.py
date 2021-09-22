from flask import request, render_template
import os


def render_qualys_card(context, slot, payload):
    return render_template(
        f"qualys_template.html",
        config=payload
    )


def render_qualys_integration_create_modal(context, slot, payload):
    return render_template(
        'integration_create.html',
        config=payload
    )
