import os
import fitz  # PyMuPDF
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def draw_page_border(canvas, doc):
    canvas.saveState()
    width, height = letter
    margin = 36
    canvas.setStrokeColor(colors.HexColor('#000000'))
    canvas.setLineWidth(1.5)
    canvas.rect(margin, margin, width - 2 * margin, height - 2 * margin)
    canvas.restoreState()

def compile_pdf():
    base_dir = r"C:\Users\Raghavendra s\.gemini\antigravity\brain\f96d0456-e9a2-4424-98b3-661c8b09ae4c"
    first_page_pdf = os.path.join(base_dir, "TalentForge_Event_Report.pdf")
    temp_report_pdf = os.path.join(base_dir, "temp_report.pdf")
    final_output_pdf = r"c:\Users\Raghavendra s\SE Project\TalentForge_Full_Report.pdf"
    
    doc = SimpleDocTemplate(
        temp_report_pdf,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Heading1'],
        fontName='Times-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#000000'),
        spaceAfter=10
    )
    
    section_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontName='Times-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#000000'),
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor('#000000'),
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-8,
        spaceAfter=3
    )

    code_style = ParagraphStyle(
        'CodeStyleCustom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#000000'),
        backColor=colors.HexColor('#f8fafc'),
        borderColor=colors.HexColor('#000000'),
        borderWidth=0.5,
        borderPadding=4,
        spaceAfter=6
    )

    story = []
    
    # ----------------------------------------------------
    # Page 2: Index Sheet (Table of Contents)
    # ----------------------------------------------------
    story.append(Paragraph("TABLE OF CONTENTS", title_style))
    story.append(Spacer(1, 10))
    
    toc_data = [
        [Paragraph("<b>Section</b>", body_style), Paragraph("<b>Page</b>", body_style)],
        [Paragraph("1. Abstract", body_style), Paragraph("2", body_style)],
        [Paragraph("2. Introduction", body_style), Paragraph("3", body_style)],
        [Paragraph("3. Software Requirements Specification (SRS)", body_style), Paragraph("4", body_style)],
        [Paragraph("&nbsp;&nbsp;&nbsp;&nbsp;3.1 Functional Requirements", body_style), Paragraph("4", body_style)],
        [Paragraph("&nbsp;&nbsp;&nbsp;&nbsp;3.2 Non-Functional Requirements", body_style), Paragraph("4", body_style)],
        [Paragraph("&nbsp;&nbsp;&nbsp;&nbsp;3.3 System Requirements", body_style), Paragraph("5", body_style)],
        [Paragraph("&nbsp;&nbsp;&nbsp;&nbsp;3.4 User Requirements", body_style), Paragraph("5", body_style)],
        [Paragraph("4. System Design & Architectural Diagrams", body_style), Paragraph("6", body_style)],
        [Paragraph("5. Implementation & Code Modules", body_style), Paragraph("9", body_style)],
        [Paragraph("6. Experimental Results & Screenshots", body_style), Paragraph("11", body_style)],
        [Paragraph("7. Conclusion & Future Enhancements", body_style), Paragraph("14", body_style)],
        [Paragraph("8. References", body_style), Paragraph("14", body_style)],
    ]
    t = Table(toc_data, colWidths=[400, 100])
    t.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (-1, 0), 1.2, colors.HexColor('#000000')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t)
    story.append(PageBreak())
    
    # ----------------------------------------------------
    # Page 3: Abstract & Introduction
    # ----------------------------------------------------
    story.append(Paragraph("1. Abstract", title_style))
    story.append(Paragraph(
        "TalentForge is an intelligent, high-performance web-based Career Networking & Recruitment platform designed "
        "to unify job hunting, profile showcasing, and project evaluation under a unified interface. "
        "Historically, professionals and students maintain segmented identities across portfolio hosts (e.g., GitHub) "
        "and corporate communication boards (e.g., LinkedIn). TalentForge bridges this gap, allowing users to list "
        "projects with direct source-code integration and live links, build digital resumes, and establish verified "
        "connections. For recruiters, the system provides candidate indexing, advanced analytics, and shortlist management. "
        "Built using the modern MERN stack (MongoDB, Express.js, React.js, Node.js), the platform leverages a custom "
        "reactive theme hook to maintain absolute synchronization between dark/light layout states. The architecture "
        "avoids high database dependency footprint by relying on local filesystem caching alongside intelligent MongoDB "
        "aggregation indexes. The system represents a structured implementation of security features such as JWT "
        "session authentication and bcrypt cryptographic password protection, resulting in an optimized software design "
        "tailored to academic and commercial hiring standards.",
        body_style
    ))
    story.append(Spacer(1, 10))
    story.append(Paragraph("2. Introduction", title_style))
    story.append(Paragraph(
        "In the contemporary, fast-paced technical industry, candidates and recruiters face substantial friction during "
        "talent evaluation. Standard professional job portals lack the feature depth to verify practical capability, "
        "forcing recruiters to browse external repositories separately. Conversely, developers lack unified platforms to "
        "present their codebase alongside structural career highlights. Manual screening processes are consequently "
        "sluggish, error-prone, and inefficient, leading to critical data loss and extended hiring cycles.",
        body_style
    ))
    story.append(Paragraph(
        "To address these issues, TalentForge provides a computerized, unified environment that facilitates candidate "
        "discovery through project showcasing and networking. The project aims to replace slow, manual candidate profiling "
        "with an integrated algorithmic matching system. The core design is built upon modular, object-oriented concepts, "
        "ensuring strict data encapsulation and role-based controller policies. The proposed system allows Student "
        "and Professional users to register and build unified profiles, upload academic/professional projects with "
        "verified GitHub metadata, upload PDF resumes, and send connection requests to expand their professional circle.",
        body_style
    ))
    story.append(PageBreak())
    
    # ----------------------------------------------------
    # Page 4: SRS Functional & Non-Functional
    # ----------------------------------------------------
    story.append(Paragraph("3. Software Requirements Specification (SRS)", title_style))
    story.append(Paragraph("3.1 Functional Requirements", section_style))
    f_reqs = [
        "<b>FR1 (Authentication):</b> The system shall support user registration and session management for Student, Professional, and Recruiter roles with cryptographically protected passwords using bcrypt.",
        "<b>FR2 (Profile Management):</b> The system shall allow users to update location, DOB, contact phone, and external link endpoints (LinkedIn, Portfolio) with direct validation checks.",
        "<b>FR3 (Project Uploads):</b> Users shall upload projects with title, tech stacks, GitHub emulation URLs, and screenshot image attachments (max 5MB in JPG/PNG formats).",
        "<b>FR4 (Outreach Management):</b> Recruiters shall shortlist, reject, and message candidates, capped at 50 outreach operations per 24 hours to prevent spam.",
        "<b>FR5 (Resume Generation):</b> The system shall compile structured database profile fields into a printable 2-column resume layout.",
    ]
    for req in f_reqs:
        story.append(Paragraph(f"&bull; {req}", bullet_style))
        
    story.append(Paragraph("3.2 Non-Functional Requirements", section_style))
    nf_reqs = [
        "<b>NFR1 (Security):</b> The system shall use HTTPS for all communication and enforce JWT auth tokens with automatic 30-minute session invalidation.",
        "<b>NFR2 (Performance):</b> The system shall process database queries in under 1 second and support up to 1,000 concurrent active client requests.",
        "<b>NFR3 (Scalability):</b> The architecture shall support horizontal scaling and modular layout updates without service interruption.",
        "<b>NFR4 (Usability):</b> The UI shall render responsive layouts across desktop and mobile browsers, supporting synchronized light/dark mode themes.",
    ]
    for req in nf_reqs:
        story.append(Paragraph(f"&bull; {req}", bullet_style))
    story.append(PageBreak())
    
    # ----------------------------------------------------
    # Page 5: SRS System & User Requirements
    # ----------------------------------------------------
    story.append(Paragraph("3.3 System Requirements", section_style))
    sys_reqs = [
        "<b>Hardware (Development):</b> Intel i5/AMD Ryzen 5 Processor, 8GB RAM, 256GB SSD, and broadband internet connectivity.",
        "<b>Hardware (Hosting):</b> Minimum 4-core virtual server processor, 8GB RAM, 100GB SSD, and 100Mbps dedicated bandwidth.",
        "<b>Software (Frontend):</b> React.js SPA, HTML5, CSS3, JavaScript (ES6+).",
        "<b>Software (Backend):</b> Node.js, Express.js REST API architecture, Mongoose ODM.",
        "<b>Software (Database):</b> MongoDB Community/Atlas Database Engine.",
    ]
    for req in sys_reqs:
        story.append(Paragraph(f"&bull; {req}", bullet_style))
        
    story.append(Paragraph("3.4 User Requirements", section_style))
    user_reqs = [
        "<b>Candidates:</b> Build profiling summaries, add technical credentials, manage uploaded project references, configure connection circles, and upload PDF documents.",
        "<b>Recruiters:</b> Administer company profiles, create/manage job posts, track candidates, and access analytics dashboards.",
        "<b>Administrators:</b> Access restricted dashboards, moderate inappropriate projects/posts, and execute platform maintenance.",
    ]
    for req in user_reqs:
        story.append(Paragraph(f"&bull; {req}", bullet_style))
    story.append(PageBreak())
    
    # ----------------------------------------------------
    # Page 6: System Design (Architecture & DFD)
    # ----------------------------------------------------
    story.append(Paragraph("4. System Design & Architectural Diagrams", title_style))
    story.append(Paragraph("Figure 4.1: Component System Architecture", section_style))
    story.append(Spacer(1, 280)) # High-clarity placeholder space for Draw.io Architecture
    story.append(Paragraph("Figure 4.2: Data Flow Diagram (DFD Level 1)", section_style))
    story.append(PageBreak())
    
    # ----------------------------------------------------
    # Page 7: System Design (Sequence & Control Flow)
    # ----------------------------------------------------
    story.append(Paragraph("Figure 4.3: Platform Interaction Sequence Diagram", section_style))
    story.append(Spacer(1, 280)) # High-clarity placeholder space for Draw.io Sequence
    story.append(Paragraph("Figure 4.4: Logic Control Flow Diagram", section_style))
    story.append(PageBreak())
    
    # ----------------------------------------------------
    # Page 8: System Design (Use Case Diagram)
    # ----------------------------------------------------
    story.append(Paragraph("Figure 4.5: Platform Use Case Model", section_style))
    story.append(Spacer(1, 350)) # High-clarity placeholder space for Draw.io Use Case
    story.append(PageBreak())
    
    # ----------------------------------------------------
    # Page 9: Implementation Modules (Hook)
    # ----------------------------------------------------
    story.append(Paragraph("5. Implementation & Code Modules", title_style))
    story.append(Paragraph("Module 5.1: Reactive Dark Mode Hook (useDarkMode.js)", section_style))
    code_hook = (
        "import { useState, useEffect } from 'react';\n\n"
        "const useDarkMode = () => {\n"
        "  const [dark, setDark] = useState(\n"
        "    () => document.documentElement.getAttribute('data-theme') === 'dark'\n"
        "  );\n"
        "  useEffect(() => {\n"
        "    const obs = new MutationObserver(() =>\n"
        "      setDark(document.documentElement.getAttribute('data-theme') === 'dark')\n"
        "    );\n"
        "    obs.observe(document.documentElement, {\n"
        "      attributes: true, attributeFilter: ['data-theme']\n"
        "    });\n"
        "    return () => obs.disconnect();\n"
        "  }, []);\n"
        "  return dark;\n"
        "};\n"
        "export default useDarkMode;"
    )
    story.append(Paragraph(code_hook.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))
    story.append(PageBreak())
    
    # ----------------------------------------------------
    # Page 10: Implementation Modules (Controller)
    # ----------------------------------------------------
    story.append(Paragraph("Module 5.2: Advanced Profile Controller (userController.js)", section_style))
    code_controller = (
        "const updateAdvancedProfile = async (req, res) => {\n"
        "  try {\n"
        "    const fields = req.body;\n"
        "    const user = await User.findById(req.user.id);\n"
        "    if (!user) return res.status(404).json({ success: false, message: 'User not found' });\n"
        "    Object.keys(fields).forEach(key => {\n"
        "      if (fields[key] !== undefined) user[key] = fields[key];\n"
        "    });\n"
        "    await user.save();\n"
        "    res.status(200).json({ success: true, message: 'Profile updated', user });\n"
        "  } catch (error) {\n"
        "    res.status(500).json({ success: false, message: error.message });\n"
        "  }\n"
        "};"
    )
    story.append(Paragraph(code_controller.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style))
    story.append(PageBreak())
    
    # ----------------------------------------------------
    # Page 11: Experimental Results (Snap 1 & 2)
    # ----------------------------------------------------
    story.append(Paragraph("6. Experimental Results & Screenshots", title_style))
    story.append(Paragraph("Figure 6.1: Platform Landing Page (Dark Mode)", section_style))
    story.append(Spacer(1, 240)) # High-clarity placeholder space for Landing Page screen
    story.append(Paragraph("Figure 6.2: User Login Panel", section_style))
    story.append(PageBreak())
    
    # ----------------------------------------------------
    # Page 12: Experimental Results (Snap 3 & 4)
    # ----------------------------------------------------
    story.append(Paragraph("Figure 6.3: Recruiter Analytics Dashboard", section_style))
    story.append(Spacer(1, 240)) # High-clarity placeholder space for Analytics Dashboard screen
    story.append(Paragraph("Figure 6.4: Profile Customizer & PDF Builder", section_style))
    story.append(PageBreak())
    
    # ----------------------------------------------------
    # Page 13: Experimental Results (Snap 5 & 6)
    # ----------------------------------------------------
    story.append(Paragraph("Figure 6.5: Connection Networks View", section_style))
    story.append(Spacer(1, 240)) # High-clarity placeholder space for Connection Networks View screen
    story.append(Paragraph("Figure 6.6: Admin Panel Overview", section_style))
    story.append(PageBreak())
    
    # ----------------------------------------------------
    # Page 14: Conclusion, Future Enhancements & References
    # ----------------------------------------------------
    story.append(Paragraph("7. Conclusion & Future Enhancements", title_style))
    story.append(Paragraph(
        "The TalentForge Career platform successfully automates candidate evaluation and portfolio tracking. "
        "The web-based implementation validates modular design guidelines, securing page operations under role controls. "
        "The implementation successfully validates the theoretical design patterns of modern web systems, establishing "
        "stable backend architectures, schema protections, and user access policies. Future enhancements of the system "
        "include integrating machine learning recommendation engines to auto-match developer skill endorsements, parsing "
        "PDF documents using OCR, and establishing secure video-conferencing modules.",
        body_style
    ))
    story.append(Spacer(1, 10))
    story.append(Paragraph("8. References", title_style))
    refs = [
        "C. K. Gomathy, M. Pedda Chandrasekhar, K. Mallikarjun, and V. Geetha, 'The Career Networking & Recruitment Platform Architecture', ResearchGate, 2025.",
        "M. S. Kumbhar, S. R. Patil, and A. R. Desai, 'System for Managing Digital Portfolios & Hiring Profiles', IJRASET, 2024.",
        "Robert C. Martin, 'Clean Code: A Handbook of Agile Software Craftsmanship', Prentice Hall, 2008.",
        "Bjarne Stroustrup, 'The design & structure of modular software architectures', Addison-Wesley, 2013.",
        "Mongoose ODM API Reference Guides, https://mongoosejs.com.",
        "React Component Life Cycle documentation guides, https://react.dev.",
    ]
    for r in refs:
        story.append(Paragraph(f"[{(refs.index(r)+1)}] {r}", body_style))
        story.append(Spacer(1, 2))

    doc.build(story, onFirstPage=draw_page_border, onLaterPages=draw_page_border)
    print("Temp report generated.")

    # Merge Cover Page and Main Content
    output_pdf = fitz.open()
    doc_first = fitz.open(first_page_pdf)
    output_pdf.insert_pdf(doc_first, from_page=0, to_page=0)
    
    doc_temp = fitz.open(temp_report_pdf)
    output_pdf.insert_pdf(doc_temp)
    
    output_pdf.save(final_output_pdf)
    output_pdf.close()
    doc_first.close()
    doc_temp.close()
    
    if os.path.exists(temp_report_pdf):
        os.remove(temp_report_pdf)
        
    print(f"Final compiled PDF Event Report saved successfully at: {final_output_pdf}")

if __name__ == "__main__":
    compile_pdf()
