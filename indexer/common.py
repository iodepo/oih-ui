from collections.abc import Iterable

def flatten(l):
    for item in l:
        if isinstance(item, Iterable) and not isinstance(item, str):
            for subitem in item:
                yield subitem
            continue
        yield item
