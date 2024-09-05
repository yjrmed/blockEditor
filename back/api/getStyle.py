import requests
import os
from utils.web import CreateFilename


def GetStyle(args, public_path):

    rootFolderPath = "/static/postCss"

    try:
        url = args["target"]
        response = requests.get(url)
        content_type = response.headers.get("Content-Type", "")
        encoding = "utf-8"

        if "charset=" in content_type:
            encoding = content_type.split("charset=")[-1]

        txtCss = response.content.decode(encoding)
        txtCss = "@scope (#" + args["scopeID"] + ") {\n" + txtCss + "\n}"
        folder_path = public_path + rootFolderPath

        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
            print(f"{folder_path} create folder")

        fp = f"{CreateFilename(url)}.css"

        with open(folder_path + "/" + fp, "w", encoding="utf-8") as file:
            file.write(txtCss)

        return {"org": url, "href": f"{rootFolderPath}/{fp}"}, 200

    except Exception as e:
        print(e)
        return {"message": str(e)}, 500
