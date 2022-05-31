from pydantic import BaseModel


class Search(BaseModel):
    text: str = None
    type: str = None
