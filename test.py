import pandas as pd
from splinter import Browser
import time
import csv
import openpyxl
import json
import urllib.request
import os
import re
import sys
import traceback
import socks
import socket
import http.cookiejar
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
options = webdriver.ChromeOptions() 
options.add_argument('--proxy-server="socks5://127.0.0.1:9050" --host-resolver-rules="MAP * 0.0.0.0 , EXCLUDE myproxy" --headless --disable-gpu')
driver = webdriver.Chrome(chrome_options=options)
driver.get('https://check.torproject.org/?lang=th')
driver.save_screenshot("screenshot1.png")
os.system('curl --upload-file screenshot1.png https://transfer.sh/screenshot1.png')