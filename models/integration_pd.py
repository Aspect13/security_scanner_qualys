import requests
from pydantic import BaseModel, AnyUrl, SecretStr


class IntegrationModel(BaseModel):
    url: AnyUrl
    login: str
    password: str
    # password: SecretStr

    def check_connection(self):
        try:
            response = requests.get(self.url)
            return response.ok
        except requests.exceptions.ConnectionError:
            return False
