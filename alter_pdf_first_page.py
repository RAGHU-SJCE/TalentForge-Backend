import fitz

pdf_path = r"C:\Users\Raghavendra s\.gemini\antigravity\brain\f96d0456-e9a2-4424-98b3-661c8b09ae4c\media__1781536941713.pdf"
output_path = r"C:\Users\Raghavendra s\.gemini\antigravity\brain\f96d0456-e9a2-4424-98b3-661c8b09ae4c\TalentForge_Event_Report.pdf"

doc = fitz.open(pdf_path)
page = doc[0]

rects_title = page.search_for("VEHICLE SERVICE AND MAINTANANCE TRACKER")
rects_year = page.search_for("2025-26")

# Correct API name is add_redact_annot
for rect in rects_title:
    page.add_redact_annot(rect, fill=(1, 1, 1)) # white fill

for rect in rects_year:
    page.add_redact_annot(rect, fill=(1, 1, 1)) # white fill

page.apply_redactions()

# Write the new title centered in its original spot
# Let's use Helvetica-Bold ("helvetica-bold" or simply "hebo")
title_rect = fitz.Rect(50, 390, 545, 410)
new_title = "TALENTFORGE: TALENT SHOWCASE & RECRUITMENT PLATFORM"

page.insert_textbox(
    title_rect, 
    new_title, 
    fontsize=13, 
    fontname="hebo",
    align=fitz.TEXT_ALIGN_CENTER,
    color=(0, 0, 0)
)

if rects_year:
    year_rect = rects_year[0]
    target_rect = fitz.Rect(50, year_rect.y0 - 2, 545, year_rect.y1 + 5)
    page.insert_textbox(
        target_rect,
        "2026-27",
        fontsize=14,
        fontname="hebo",
        align=fitz.TEXT_ALIGN_CENTER,
        color=(0, 0, 0)
    )

doc.save(output_path)
doc.close()
print("Altered PDF saved successfully at:", output_path)
