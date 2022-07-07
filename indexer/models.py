from dataclasses import dataclass
from typing import Any

@dataclass(order=True)
class Att:
    prefix: str
    value: Any
    name: str = None

    @property
    def key(self):
        return '_'.join([s for s in (self.prefix, self.name) if s])

    @property
    def as_dict(self):
        return {'prefix': self.prefix or '',
                'value': self.value,
                'name': self.name or '',
                }
