import os
from dotenv import load_dotenv
from flask import Flask, request, render_template
from flask_cors import CORS


app = Flask(
    __name__,
    template_folder="../front/build",
    static_folder="../front/build/static",
)

load_dotenv()
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


# get article


# get style


if __name__ == "__main__":
    app.run(host="localhost", port=5000, debug=True)
