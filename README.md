# CV Builder

A React-based CV builder application that allows you to create, edit, and export your CV as PDF.

## Features

- View your CV in a professional format
- Edit CV data using JSON editor
- Real-time preview of changes
- Export CV to PDF format
- Print-friendly layout

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Usage

1. Click "Show Editor" to edit CV data in JSON format
2. Modify the JSON data as needed
3. Click "Update CV" to see changes
4. Click "Export to PDF" to download your CV as PDF

## Project Structure

- `src/components/cv/` - CV component modules
- `src/data/cvData.ts` - Default CV data
- `src/types/cv.ts` - TypeScript types for CV data
- `src/utils/pdfExport.ts` - PDF export functionality
