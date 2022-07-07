from dataclasses import dataclass


@dataclass(order=True)
class Att:
    prefix: str
    value: str
