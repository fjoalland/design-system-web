#
# AUTOMATIC JS GENERATION
# 
# This script opens a list of assets and download it to the local project as a unique file.

import requests
import os
import pathlib
import re

websites = {
    'www' : 'https://www.loire-atlantique.fr/',
}

for website_code, website_url in websites.items():
    print("Generate asset for {}".format(website_url))
    with open("../assets/js/" + website_code + '.js', "wb+") as website_js_handle:
        with open('generate_js.csv') as assets:
            for cnt, line in enumerate(assets):
                asset = line.replace("\n", "")
                response = requests.get(website_url + asset, stream=True)
                if response.status_code == 200: 
                    # CSS Header
                    website_js_handle.write("/* {} */\n\n".format(asset).encode('UTF-8'))
                    # CSS Data
                    for data in response.iter_lines():
                        website_js_handle.write(data)
                        website_js_handle.write("\n".encode('UTF-8'))
                else:
                    print("{} unsed in {}".format(asset, website_url))