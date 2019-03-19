#
# AUTOMATIC CSS GENERATION
# 
# This script opens a list of assets and download it to the local project as a unique file.

import requests
import os
import pathlib
import re

websites = {
    'www' : 'https://www.loire-atlantique.fr/',
 #   'archives' : 'https://archives.loire-atlantique.fr/',
 #   'nature' : 'https://nature.loire-atlantique.fr/',
 #   'inforoutes' : 'https://inforoutes.loire-atlantique.fr/',
 #   'observatoire' : 'https://observatoire.loire-atlantique.fr/',
 #   'gpla' : 'https://grand-patrimoine.loire-atlantique.fr/',
 #   'numerique' : 'https://numerique.loire-atlantique.fr/',
}

for website_code, website_url in websites.items():
    print("Generate asset for {}".format(website_url))
    with open("../assets/css/" + website_code + '.css', "wb+") as website_css_handle:
        with open('generate_css.csv') as assets:
            for cnt, line in enumerate(assets):
                asset = line.replace("less", "css")
                asset = asset.replace("SI.css", ".css")
                asset = asset.replace("\n", "")
                asset_parts = asset.split('/')
                response = requests.get(website_url + asset, stream=True)
                if response.status_code == 200: 
                    # CSS Header
                    website_css_handle.write("/* {} */\n\n".format(asset).encode('UTF-8'))
                    # CSS Data
                    for data in response.iter_lines():
                        data_full_url = data.decode('latin1')
                        for i in range(6, 0, -1):
                            data_full_url = data_full_url.replace('../'*i, website_url + '/'.join(asset_parts[0:-i-1]) + '/')
                        data_full_url += '\n'
                        website_css_handle.write(data_full_url.encode('latin1'))
                else:
                    print("{} unsed in {}".format(asset, website_url))