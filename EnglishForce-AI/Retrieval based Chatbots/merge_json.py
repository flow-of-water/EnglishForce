import json

def add_suffix_to_tags(intents, suffix):
    for intent in intents:
        intent['tag'] = f"{intent['tag']}_{suffix}"
    return intents

with open('intents_en.json', 'r', encoding='utf-8') as f:
    data_en = json.load(f)

with open('intents_vi.json', 'r', encoding='utf-8') as f:
    data_vi = json.load(f)

# Gắn hậu tố tag
intents_en = add_suffix_to_tags(data_en['intents'], 'en')
intents_vi = add_suffix_to_tags(data_vi['intents'], 'vi')

# Gộp lại
merged_intents = {
    "intents": intents_en + intents_vi
}

# Ghi ra file mới
with open('intents.json', 'w', encoding='utf-8') as f:
    json.dump(merged_intents, f, ensure_ascii=False, indent=4)

print("✅ Đã gộp 2 file JSON thành công vào 'intents_merged.json'")
