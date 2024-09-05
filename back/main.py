import os
from dotenv import load_dotenv
from flask import Flask, request, render_template
from flask_cors import CORS
from api import getPost, getStyle

load_dotenv()

app = Flask(
    __name__,
    template_folder=os.environ["REACT_PUBLIC_PATH"],
    static_folder=os.environ["REACT_PUBLIC_STATIC_PATH"],
)


if "DEBUG_REACT_URI" in os.environ:
    origins = [os.environ["DEBUG_REACT_URI"]]

CORS(
    app,
    supports_credentials=True,
    origins=origins,
)


@app.route("/")
def home():
    return render_template("index.html"), 200


@app.route("/getPost/", methods=["GET"])
def get_post():
    return getPost.GetPost(request.args)


@app.route("/getStyle/", methods=["GET"])
def get_style():
    return getStyle.GetStyle(request.args, os.environ["REACT_PUBLIC_PATH"])


if __name__ == "__main__":
    app.run(host="localhost", port=5000, debug=True)
