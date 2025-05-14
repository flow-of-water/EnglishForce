import json

def add_prefix_to_tags(intents, prefix):
    for intent in intents:
        intent['tag'] = f"{prefix}_{intent['tag']}"
    return intents

def add_suffix_to_tags(intents, suffix):
    for intent in intents:
        intent['tag'] = f"{intent['tag']}_{suffix}"
    return intents

with open('Intents/intents_en.json', 'r', encoding='utf-8') as f:
    data_en = json.load(f)

with open('Intents/intents_vi.json', 'r', encoding='utf-8') as f:
    data_vi = json.load(f)

with open('Intents/interactive_en.json', 'r', encoding='utf-8') as f:
    interactive_en = json.load(f)

with open('Intents/interactive_vi.json', 'r', encoding='utf-8') as f:
    interactive_vi = json.load(f)    

# Gắn hậu tố tag
intents_en = add_suffix_to_tags(data_en['intents'], 'en')
intents_vi = add_suffix_to_tags(data_vi['intents'], 'vi')
# Gắn tiền tố vào các tag của intents
intents_en2 = add_prefix_to_tags(interactive_en['intents'], '#en') 
intents_vi2 = add_prefix_to_tags(interactive_vi['intents'], '#vi')

# Gộp lại
merged_intents = {
    "intents": intents_en + intents_vi + intents_en2 + intents_vi2
}

# Ghi ra file mới
with open('intents.json', 'w', encoding='utf-8') as f:
    json.dump(merged_intents, f, ensure_ascii=False, indent=4)

print("✅ Đã gộp các file JSON thành công vào 'intents_merged.json'")
