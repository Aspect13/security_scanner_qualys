import requests
from pydantic import BaseModel, AnyUrl


class IntegrationModel(BaseModel):
    url: AnyUrl
    login: str
    password: str

    def check_connection(self) -> bool:
        print('checking', self.url, requests.get(self.url))
        try:
            response = requests.get(self.url)
            return response.ok
        except requests.exceptions.ConnectionError:
            return False
