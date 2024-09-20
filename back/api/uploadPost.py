from bs4 import BeautifulSoup
import requests
from utils.web import StripDomain
import pysftp
import os
import uuid


def UploadPost(args):
    try:
        print()

        url = args["orgUrl"]
        response = requests.get(url)
        content_type = response.headers.get("Content-Type", "")
        encoding = "utf-8"

        if "charset=" in content_type:
            encoding = content_type.split("charset=")[-1]

        txtHtml = response.content.decode(encoding)
        if not txtHtml:
            raise Exception("Error: get request")

        orgSoup = BeautifulSoup(txtHtml, "html.parser")

        articleSoup = BeautifulSoup(args["article"], "html.parser")

        fp = readyFile(orgSoup, articleSoup)
        uploadFile(fp, url)

        return {"message": "success"}, 200
    except Exception as e:
        # print(e)
        return {"message": str(e)}, 500


def readyFile(orgSoup, articleSoup) -> str:

    for img in articleSoup.find_all("img"):
        img["src"] = StripDomain(img["src"])

    for a in articleSoup.find_all("a"):
        a["href"] = StripDomain(a["href"])

    for script in articleSoup.find_all("script"):
        del script["disabled"]

    _articleDom = articleSoup.find("article")

    articleDom = orgSoup.find("article")
    articleDom.replace_with(_articleDom)

    folder_path = "upload-temp"
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    file_path = os.path.join(folder_path, f"{uuid.uuid4().hex}.html")
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(orgSoup.prettify())

    return file_path


def uploadFile(fp, url):

    sftp = ClsSftp(
        os.environ["TARGET_HOST"],
        os.environ["TARGET_USERNAME"],
        os.environ["TARGET_PASSWORD"],
        int(os.environ["TARGET_PORT"]) if os.environ["TARGET_PORT"] else None,
    )

    try:
        if os.path.isfile(fp):
            sftp.connect()
            sftp.upload(fp, os.environ["TARGET_PASS"].rstrip("/") + StripDomain(url))

    except Exception as e:
        print(e)
        raise Exception(e)
    finally:
        sftp.disconnect()


class ClsSftp:

    def __init__(self, hostname, username, password, port=22) -> None:
        self.connection = None
        self.hostname = hostname
        self.username = username
        self.password = password
        self.port = port

    def connect(self):
        try:
            cnopts = pysftp.CnOpts()
            cnopts.hostkeys = None
            self.connection = pysftp.Connection(
                host=self.hostname,
                username=self.username,
                password=self.password,
                port=self.port,
                cnopts=cnopts,
            )

        except Exception as e:
            raise Exception(e)
        finally:
            print(f"Connected to {self.hostname} as {self.username}.")

    def disconnect(self):
        self.connection.close()
        print(f"Disconnected from host {self.hostname}")

    def stat(self, remote_path):
        return self.connection.stat(remote_path)

    def listdir(self, remote_path):
        """lists all the files and directories in the specified path and returns them"""
        for obj in self.connection.listdir(remote_path):
            yield obj

    def listdir_attr(self, remote_path):
        """lists all the files and directories (with their attributes) in the specified path and returns them"""
        for attr in self.connection.listdir_attr(remote_path):
            yield attr

    def download(self, remote_path, target_local_path):
        """
        Downloads the file from remote sftp server to local.
        Also, by default extracts the file to the specified target_local_path
        """

        try:
            print(
                f"downloading from {self.hostname} as {self.username} [(remote path : {remote_path});(local path: {target_local_path})]"
            )
            path, _ = os.path.split(target_local_path)
            if not os.path.isdir(path):
                try:
                    os.makedirs(path)
                except Exception as err:
                    raise Exception(err)

            # Download from remote sftp server to local
            self.connection.get(remote_path, target_local_path)
            print("download completed")

        except Exception as err:
            raise Exception(err)

    def upload(self, source_local_path, remote_path):
        """
        Uploads the source files from local to the sftp server.
        """

        try:
            print(
                f"uploading to {self.hostname} as {self.username} [(remote path: {remote_path});(source local path: {source_local_path})]"
            )

            # Upload file from SFTP
            self.connection.put(source_local_path, remote_path)
            print("upload completed")

        except Exception as err:
            raise Exception(err)


if __name__ == "__main__":
    print("...")
