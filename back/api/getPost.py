import requests
from utils.web import GetAbsolutePath
from bs4 import BeautifulSoup


def GetPost(args):

    try:
        url = args["target"]
        response = requests.get(url)
        content_type = response.headers.get("Content-Type", "")
        encoding = "utf-8"

        if "charset=" in content_type:
            encoding = content_type.split("charset=")[-1]

        txtHtml = response.content.decode(encoding)
        if not txtHtml:
            raise Exception("Error: get request")

        soup = BeautifulSoup(txtHtml, "html.parser")

        return parseHtml(soup, url), 200

    except Exception as e:
        print(e)
        return {"message": str(e)}, 500


def parseHtml(soup, url):

    _head = {
        "url": url,
        "title": None,
        "keywords": None,
        "description": None,
        "normalization": [],
        "og": {
            "url": None,
            "type": None,
            "title": None,
            "description": None,
            "site_name": None,
            "image": None,
        },
    }

    head = soup.head
    fnd = head.find("title")
    if fnd and fnd.string:
        _head["title"] = fnd.string.strip()

    # meta
    fnd = head.find("meta", attrs={"name": "keywords", "content": True})
    if fnd:
        _head["keywords"] = fnd.attrs["content"]

    fnd = head.find("meta", attrs={"name": "description", "content": True})
    if fnd:
        _head["description"] = fnd.attrs["content"]

    # normalization
    fnd = head.find_all("link", attrs={"rel": "canonical", "href": True})
    for link in fnd:
        if link["href"]:
            _head["normalization"].append(link.attrs)

    fnd = head.find_all("link", attrs={"rel": "alternate", "href": True})
    for link in fnd:
        if link["href"]:
            _head["normalization"].append(link.attrs)

    # ogp
    fnd = head.find("meta", attrs={"property": "og:url", "content": True})
    if fnd:
        _head["og"]["url"] = fnd.attrs["content"]

    fnd = head.find("meta", attrs={"property": "og:type", "content": True})
    if fnd:
        _head["og"]["type"] = fnd.attrs["content"]

    fnd = head.find("meta", attrs={"property": "og:title", "content": True})
    if fnd:
        _head["og"]["title"] = fnd.attrs["content"]

    fnd = head.find("meta", attrs={"property": "og:description", "content": True})
    if fnd:
        _head["og"]["description"] = fnd.attrs["content"]

    fnd = head.find("meta", attrs={"property": "og:site_name", "content": True})
    if fnd:
        _head["og"]["site_name"] = fnd.attrs["content"]

    fnd = head.find("meta", attrs={"property": "og:image", "content": True})
    if fnd:
        _head["og"]["image"] = fnd.attrs["content"]

    # style links
    links = []
    for link in soup.head.find_all("link", rel="stylesheet"):
        links.append(GetAbsolutePath(link.get("href"), url))

    for img in soup.find_all("img"):
        img["src"] = GetAbsolutePath(img.get("src"), url)

    for a in soup.find_all("a"):
        a["href"] = GetAbsolutePath(a.get("href"), url)
        a["disabled"] = "disabled"

    return {"head": _head, "body": soup.body.prettify(), "styles": links}
