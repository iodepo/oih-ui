import hashlib
import json
import os
from pathlib import Path
from functools import wraps, partial

GENERATE_TESTS = False


def test_generation(func=None, post=None):

    def dictize(x):
        if isinstance(x, list):
            return [elt.as_dict for elt in x]
        else:
            return x.as_dict

    if not post:
        post = dictize

    if func is None:
        return partial(test_generation, post=post)

    @wraps(func)
    def inner(*args):
        result = func(*args)

        if not GENERATE_TESTS:
            return result

        _type, data = tuple(args)[:2]

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

def dump_exception(elt, err=None):
    try:
        if isinstance(elt, str):
            src = elt
        else:
            src = json.dumps(elt)
        filehash = hashlib.md5(src.encode('utf-8')).hexdigest()[:10]
        with open(os.path.join(os.path.dirname(__file__), 'exceptions', '%s.json' % filehash), 'w') as f:
            f.write(src)
        if err:
            with open(os.path.join(os.path.dirname(__file__), 'exceptions', '%s.err.txt' % filehash), 'w') as f:
                f.write(err)

    except Exception as msg:
        print ("Exception dumping exception: %s")
