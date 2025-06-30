import json
import os

directory = "."
replacements = {
    "identifying information (yes/no/not given)": "Identifying Writer's Views/Claims (Yes/No/Not Given)",
    "yes/no/not given": "Identifying Writer's Views/Claims (Yes/No/Not Given)",
    "true/false/not given": "Identifying Information (True/False/Not Given)",
    "matching": "Matching Headings",
    "short answer": "Short-answer Questions"
}

for i in range(1, 11):
    file_name = f"reading_test_{i}.json"
    file_path = os.path.join(directory, file_name)
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        changed = False
        for passage in data.get("passages", []):
            for question in passage.get("questions", []):
                current_type = question.get("question_type", "").strip().lower()
                if current_type in replacements:
                    question["question_type"] = replacements[current_type]
                    changed = True
        if changed:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            print(f"✅ Updated {file_name}")
        else:
            print(f"ℹ️ No changes needed for {file_name}")
    except FileNotFoundError:
        print(f"❌ File {file_name} not found")
    except json.JSONDecodeError:
        print(f"❌ Invalid JSON in {file_name}")
    except Exception as e:
        print(f"❌ Error processing {file_name}: {str(e)}")

print("Done processing all files.")