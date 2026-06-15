import fitz

pdf_path = r"C:\Users\Raghavendra s\.gemini\antigravity\brain\f96d0456-e9a2-4424-98b3-661c8b09ae4c\media__1781536941713.pdf"
doc = fitz.open(pdf_path)

# Let's inspect fonts and positions on Page 1
page = doc[0]
for text_block in page.get_text("blocks"):
    x0, y0, x1, y1, text, block_no, block_type = text_block
    print(f"Block {block_no} ({x0:.1f}, {y0:.1f}) -> ({x1:.1f}, {y1:.1f}):")
    print(repr(text))
    print("-" * 20)
