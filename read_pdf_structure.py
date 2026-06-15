import fitz
import os

pdf_path = r"C:\Users\Raghavendra s\.gemini\antigravity\brain\f96d0456-e9a2-4424-98b3-661c8b09ae4c\media__1781536941713.pdf"
doc = fitz.open(pdf_path)

print(f"Total pages: {len(doc)}")
for i in range(min(5, len(doc))):
    page = doc[i]
    print(f"--- Page {i+1} Text ---")
    print(page.get_text()[:400])
