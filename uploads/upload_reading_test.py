import json
from datetime import datetime
from supabase import create_client

# Supabase config
SUPABASE_URL = "https://xypbinamxunmwkhlvefd.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5cGJpbmFteHVubXdraGx2ZWZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTI1NDI2MSwiZXhwIjoyMDY0ODMwMjYxfQ.pgHLdaFCRhbE5dm4e0yITpLqQeqsvGn3Sb9iXjEWsbI"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Load your test data
with open("Reading_test_1.json", "r") as f:
    test_data = json.load(f)

# --- Allowed question types as per your DB enum ---
ALLOWED_TYPES = [
    "Matching Information",
    "Matching Headings",
    "Matching Features",
    "Identifying Information (True/False/Not Given)",
    "Identifying Writer's Views/Claims (Yes/No/Not Given)",
    "Multiple Choice",
    "Short-answer Questions",
    "Sentence Completion",
    "Summary Completion",
    "Note Completion",
    "Table Completion",
    "Flow-chart Completion",
    "Diagram Label Completion",
    "Matching Sentence Endings"
]

def validate_question(q, passage_num):
    errors = []
    if "question_number" not in q:
        errors.append(f"Passage {passage_num}: question missing 'question_number'")
    if "question_type" not in q or q["question_type"] not in ALLOWED_TYPES:
        errors.append(f"Passage {passage_num} Q{q.get('question_number')}: invalid or missing 'question_type': {q.get('question_type')}")
    if "text" not in q or not q["text"]:
        errors.append(f"Passage {passage_num} Q{q.get('question_number')}: missing or empty 'text'")
    if "answer" not in q or not q["answer"]:
        errors.append(f"Passage {passage_num} Q{q.get('question_number')}: missing or empty 'answer'")
    # Validate options for those that require it
    if q.get("question_type") in [
        "Multiple Choice", "Matching Headings", "Matching Features", "Matching Sentence Endings"
    ]:
        if "options" not in q or not isinstance(q["options"], list) or not q["options"]:
            errors.append(f"Passage {passage_num} Q{q.get('question_number')}: missing or empty 'options'")
    return errors

# --- Validate all questions before uploading ---
validation_errors = []
for passage in test_data.get("passages", []):
    pnum = passage.get("passage_number")
    for q in passage.get("questions", []):
        validation_errors.extend(validate_question(q, pnum))

if validation_errors:
    print("❌ Validation errors found!")
    for err in validation_errors:
        print(" -", err)
    exit(1)

print("✅ All questions validated. Proceeding to upload...")

# --- Insert paper, get paper_id ---
paper_insert = {
    "title": test_data["title"],
    "type": test_data["type"],
    "status": test_data.get("status", "draft"),
    "created_at": test_data.get("created_at", datetime.utcnow().isoformat())
}
paper_result = supabase.table("reading_papers").insert(paper_insert).execute()
paper_id = paper_result.data[0]["id"]

# --- Insert passages & questions ---
for passage in test_data["passages"]:
    passage_insert = {
        "paper_id": paper_id,
        "passage_number": passage["passage_number"],
        "title": passage.get("title"),
        "body": passage["body"],
        "section_instruction": passage.get("section_instruction"),
        "status": passage.get("status", "draft"),
        "created_at": passage.get("created_at", datetime.utcnow().isoformat())
    }
    passage_result = supabase.table("reading_passages").insert(passage_insert).execute()
    passage_id = passage_result.data[0]["id"]

    for q in passage["questions"]:
        # Ensure answer is JSON (wrap as array for MCQ/etc; as string for T/F/NG; this matches your design)
        answer = q["answer"]
        # Store as JSON: if it's already list or dict, fine; if string, store as string (Supabase jsonb can take both)
        if isinstance(answer, str):
            try:
                # If string but looks like a quoted JSON string, strip quotes
                answer_json = json.loads(answer)
                answer = answer_json
            except Exception:
                pass

        question_insert = {
            "paper_id": paper_id,
            "passage_id": passage_id,
            "question_number": q["question_number"],
            "question_type": q["question_type"],
            "text": q["text"],
            "instruction": q.get("instruction"),
            "options": q.get("options"),
            "answer": answer,
            "status": q.get("status", "draft"),
            "created_at": q.get("created_at", datetime.utcnow().isoformat())
        }
        supabase.table("reading_questions").insert(question_insert).execute()

# --- Log the import (optional) ---
supabase.table("reading_import_logs").insert({
    "imported_at": datetime.utcnow().isoformat(),
    "summary": {
        "paper_title": test_data["title"],
        "num_passages": len(test_data["passages"]),
        "num_questions": sum(len(p["questions"]) for p in test_data["passages"])
    },
    "affected_paper_ids": [paper_id]
}).execute()

print("✅ Upload complete: IELTS Academic Reading Test uploaded successfully (IDs auto-generated by Supabase).")
