import json

json_string = '''
{
    "name": "John",
    "age": 30,
    "city": "New York",
    "hasPets": false,
    "pets": null,
    "hobbies": ["reading", "travelling"],
    "address": {
        "street": "123 Main St",
        "zipcode": "10001"
    }
}
'''
data = json.loads(json_string)

name = data["name"]
age = data["age"]
city = data["city"]
has_pets = data["hasPets"]
pets = data["pets"]
hobbies = data["hobbies"]
address = data["address"]
street = address["street"]
zipcode = address["zipcode"]

print(f"Name: {name}")
print(f"Age: {age}")
print(f"City: {city}")
print(f"Has Pets: {has_pets}")
print(f"Pets: {pets}")
print(f"Hobbies: {', '.join(hobbies)}")
print(f"Address: {street}, {zipcode}")
