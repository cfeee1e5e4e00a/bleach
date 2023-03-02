from faker import Faker
import random

fake = Faker('ru_RU')
Faker.seed(random.randint(0, 255))

def luna(num_str):
    if len(num_str) != 16:
            return False
    mod = []
    control = int(num_str[-1])
    for i in range(len(num_str) - 1):
        mod += [int(num_str[i])*2] if i%2 == 0 else [int(num_str[i])]
        if mod[i] > 9:
            mod[i] -= 9
    return (sum(mod) + control) % 10 == 0

def zfill(ch):
  if len(ch) == 1:
    ch = '0' + ch
  return ch

def generate_passport():
  #условно разделен на 3 группы - 2 + 2 + 6
  first = zfill(str(random.randint(1, 99)))
  second = zfill(str(random.choice([random.randint(91, 99), random.randint(0, 23)])))
  third = str(random.randint(111111, 999999))
  return first + second + " " + third

def anonimize_unknown(val):
    anon_val = ""
    ru_alph='абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
    ru_alph_up = ru_alph.upper()
    en_alph = 'abcdefghijklmnopqrstuvwxyz'
    en_alph_up = en_alph.upper()
    digits = '0123456789'
    alphs = [ru_alph, ru_alph_up, en_alph, en_alph_up, digits]
    for c in val:
        found = False
        for a in alphs:
            if c in a:
                new_char = random.choice(a)
                found = True
                continue
        if not found:
            new_char = c
        anon_val += new_char
    return anon_val

def anonimize_cell(cell_type, val):
    anon_val = ""
    if cell_type == 'passport':
        anon_val = generate_passport()
    elif cell_type == 'email':
        anon_val = fake.free_email()
    elif cell_type == 'phone':
        anon_val = fake.phone_number()
    elif cell_type == 'bank card':
        anon_val = fake.credit_card_number()
    #+ security code, expire date, card provider
    elif cell_type == 'birth date':
        date = str(fake.date_of_birth(minimum_age=abs(2023 - int(val[-4:]) - 10), 
                                maximum_age=2023 - int(val[-4:]) + 10))
        anon_val = date[-2:] + '.' + date[5:7] + "." + date[:4]
    elif cell_type == 'fio':
        anon_val = fake.name()
    elif cell_type == 'ipv4':
        anon_val = fake.ipv4()
    elif cell_type == 'ipv6':
        anon_val = fake.ipv6()
    elif cell_type == 'mac':
        anon_val = fake.mac_address()
    elif cell_type == 'inn':
        anon_val = fake.individuals_inn()
    elif cell_type == 'index':
        anon_val = fake.postcode()
    elif cell_type == 'region':
        anon_val = fake.region()
    elif cell_type == 'expire date':
        anon_val = fake.credit_card_expire()
    elif cell_type == 'flipflop':
        anon_val = anonimize_unknown(val)

    if cell_type == 'flipflop' and anon_val == val:
        return anonimize_cell(cell_type, val)

    return anon_val
