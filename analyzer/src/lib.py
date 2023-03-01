import re

phone = '^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$'
email = '[a-zA-Z1-9\-\._]+@[a-z1-9]+(.[a-z1-9]+){1,}'
passport = '\d{4}\s\d{6}'
date = '(0?[1-9]|[12][0-9]|3[01])([/]|.| )(0?[1-9]|1[012])([/]|.| )((19|20)\d\d)'
# bank_card = '(\d{4}([-]| |)\d{4}([-]| |)\d{4}([-]| |)\d{4})'
fio = '([А-ЯЁ][а-яё]+[\-\s]?){3,}'
inn = '^(([0-9]{12})|([0-9]{10}))?$'
ipv4 = '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
ipv6 = '''^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|
            ^::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$|
            ^[0-9a-fA-F]{1,4}::(?:[0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}$|
            ^[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}::(?:[0-9a-fA-F]{1,4}:){0,4}[0-9a-fA-F]{1,4}$|
            ^(?:[0-9a-fA-F]{1,4}:){0,2}[0-9a-fA-F]{1,4}::(?:[0-9a-fA-F]{1,4}:){0,3}[0-9a-fA-F]{1,4}$|
            ^(?:[0-9a-fA-F]{1,4}:){0,3}[0-9a-fA-F]{1,4}::(?:[0-9a-fA-F]{1,4}:){0,2}[0-9a-fA-F]{1,4}$|
            ^(?:[0-9a-fA-F]{1,4}:){0,4}[0-9a-fA-F]{1,4}::(?:[0-9a-fA-F]{1,4}:)?[0-9a-fA-F]{1,4}$|
            ^(?:[0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}::[0-9a-fA-F]{1,4}$|
            ^(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}::$'''
mac = '^[a-fA-F0-9]{2}(:[a-fA-F0-9]{2}){5}$'
index = '^[0-9]{6}$'
region = '(?:респ.|республика| ао|ао |автономный округ|край|область|обл |обл.)'
ts = ['/^[ABEKMHOPCTYX]\d{3}(?<!000)[ABEKMHOPCTYX]{2}\d{2,3}$/ui',
      '/^[ABEKMHOPCTYX]{2}\d{3}(?<!000)\d{2,3}$/ui',
      '/^[ABEKMHOPCTYX]{2}\d{4}(?<!0000)\d{2,3}$/ui',
      '/^\d{4}(?<!0000)[ABEKMHOPCTYX]{2}\d{2,3}$/ui',
      '/^[ABEKMHOPCTYX]{2}\d{3}(?<!000)[ABEKMHOPCTYX]\d{2,3}$/ui',
      '/^Т[ABEKMHOPCTYX]{2}\d{3}(?<!000)\d{2,3}$/ui']

def luna(num_str):
    if len(num_str) != 16:
        return False
    mod = []
    control = int(num_str[-1])
    for i in range(len(num_str) - 1):
        mod += [int(num_str[i]) * 2] if i % 2 == 0 else [int(num_str[i])]
        if mod[i] > 9:
            mod[i] -= 9
    return (sum(mod) + control) % 10 == 0

def data_type_analyzer(text):
    try:
        if re.match(passport, text):
            return 'passport'
        elif re.match(email, text):
            return 'email'
        elif re.match(phone, text):
            return 'phone'
        elif re.match(date, text):
            return 'birth date'
        elif re.match(fio, text):
            return 'fio'
        elif re.match(ipv4, text):
            return 'ipv4'
        elif re.match(ipv6, text):
            return 'ipv6'
        elif re.match(mac, text):
            return 'mac'
        elif re.match(inn, text):
            return 'inn'
        elif re.match(index, text):
            return 'index'
        elif re.search(region, text.lower(), flags=re.I):
            return 'region'
        elif re.match(ts[0], text) or re.match(ts[1], text) or re.match(ts[2], text) or re.match(ts[3], text) or re.match(
                ts[4], text) or re.match(ts[5], text):
            return 'ts'
        elif luna(text.replace(' ', '').replace('-', '')):
            return 'bank card'
        else:
            return 'UNKNOWN'
    except:
        return 'UNKNOWN'
