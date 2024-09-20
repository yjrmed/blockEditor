from urllib.parse import urlparse
import os
import hashlib
import urllib.parse


def GetAbsolutePath(_path, _baseUrl):

    if _path.startswith("http"):
        return _path

    parsed_url = urlparse(_path)
    base_url = urlparse(_baseUrl)
    path = parsed_url.path
    if path.startswith("."):
        dirs = os.path.dirname(base_url.path).strip("/").split("/")
        while path.startswith("."):
            if path.startswith("./"):
                path = path[2:]
            elif path.startswith("../"):
                path = path[3:]
                dirs.pop()
        return (
            base_url.scheme
            + "://"
            + base_url.netloc
            + "/"
            + "/".join(dirs)
            + "/"
            + path
        )
    else:
        return base_url.scheme + "://" + base_url.netloc + path


def GetShortHash(text, length=8):
    text_bytes = text.encode("utf-8")
    sha256 = hashlib.sha256()
    sha256.update(text_bytes)
    return sha256.hexdigest()[:length]


def CreateFilename(text, length=8):
    hash_value = GetShortHash(text, length)
    encoded_hash = urllib.parse.quote(hash_value)
    return encoded_hash


def StripDomain(_path) -> str:

    if not _path.startswith("http"):
        return _path

    parsed_url = urllib.parse.urlparse(_path)
    stripped_url = urllib.parse.urlunparse(('', '', parsed_url.path, parsed_url.params, parsed_url.query, parsed_url.fragment))
    return stripped_url



