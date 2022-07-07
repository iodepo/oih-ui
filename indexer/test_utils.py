

GENERATE_TESTS = True

import hashlib
import json
import os
from pathlib import Path
from functools import wraps, partial

def test_generation(func=None, post=None):
    if not post:
        post = lambda x:x.as_dict

    if func is None:
        return partial(test_generation, post=post)

    @wraps(func)
    def inner(*args):
        result = func(*args)

        if not GENERATE_TESTS:
            return result

        _type, data = tuple(args)

        print ("Generating test %s" %( _type))
        src = json.dumps(data)
        base_path = Path(os.path.dirname(__file__)) / 'test' / _type
        if not base_path.exists():
            os.mkdir(base_path)
            os.mkdir(base_path / 'src')
            os.mkdir(base_path / 'dest')

        file_hash = hashlib.md5(src.encode('utf-8')).hexdigest()[:10]
        with (base_path / 'src' / ('%s.json' %file_hash)).open('w') as f:
            f.write(src)

        with (base_path / 'dest' / ('%s.json' %file_hash)).open('w') as f:
            json.dump(post(result),f)

        print ("Generated test %s for %s" %(file_hash, _type))

        return result

    return inner
