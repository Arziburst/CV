# CV Builder Project Memory

## Project Overview
A Next.js-based CV builder application that allows users to create, edit, and export professional CVs as PDF.

## Key Features
- React component-based CV rendering
- JSON-based CV data editing
- Real-time preview of CV changes
- PDF export functionality using jsPDF and html2canvas (canvas slicing prefers safe breakpoints at elements marked with `data-cv-page-break="block"`)
- Print functionality
- Professional two-column CV layout matching provided design

## Project Structure
- `src/components/cv/` - CV component modules (Header, Contact, Skills, Languages, Education, Profile, WorkExperience, CVDocument)
- `src/data/cvData.ts` - Default CV data structure
- `src/types/cv.ts` - TypeScript type definitions
- `src/utils/pdfExport.ts` - PDF export utility
- `src/app/page.tsx` - Main page with editor and preview

## Technology Stack
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- jsPDF for PDF generation
- html2canvas for canvas rendering

## CV Design
- Two-column layout
- Header integrates photo overlay, left gray block, and teal bar behind the title
- Left column: Photo (optional), Contact, Skills, Languages, Education
- Right column: Profile, Work Experience
- Timeline-style work experience with vertical line and square markers
- Print-friendly A4 format

## Styling Notes
- Section titles are standardized via `src/components/cv/SectionTitle.tsx` (uppercase + tracking + horizontal rule)
- Lists and timeline use circular markers for a more CV/PDF-like look
- Header always reserves space for a photo; when `photoUrl` is not provided, a neutral placeholder is displayed
