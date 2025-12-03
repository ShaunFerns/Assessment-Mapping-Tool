# Curriculum Insight Suite

A polished React/TypeScript web application designed for TU Dublin programme teams to map module assessments across semesters, visualize assessment distribution and workload, and analyze learning outcome alignment.

## Overview

This tool allows programme coordinators to:
1.  **Define Programmes**: Set up programme details and Programme Learning Outcomes (PLOs).
2.  **Manage Modules**: Add modules and assign them to stages/semesters.
3.  **Map Assessments**: Create assessments for modules, linking them to PLOs, Module Learning Outcomes (MLOs), and Graduate Attributes.
4.  **Visualize Data**: View assessment timelines, workload heatmaps, and PLO coverage matrices.
5.  **Analyze**: Get insights into assessment balance and coverage.

## Key Features

*   **Programme Management**:
    *   Simple PLO generation (auto-numbered PLO1, PLO2, etc.).
    *   Configurable number of weeks and PLO counts.
*   **Module Management**:
    *   Add/Edit modules with code, title, stage, and semester.
    *   MLOs default to 6 per module.
*   **Assessment Mapping**:
    *   Detailed assessment entry (Week, Weight, Type, Mode).
    *   **Multi-select PLOs**: Map assessments to multiple Programme Learning Outcomes.
    *   **Multi-select MLOs**: Map assessments to multiple Module Learning Outcomes (default 6, expandable).
    *   **Graduate Attributes**: Multi-select support for "People", "Planet", and "Partnership".
*   **Visualizations**:
    *   **Triangle Timeline**: Visual timeline of assessments across weeks with shape/color coding for types.
    *   **Workload Heatmap**: Block view of assessment density and types.
    *   **PLO Coverage Map**: Matrix showing which modules cover which PLOs, with vertical headers and intensity heatmapping.
    *   **Analytics Dashboard**: Charts showing weekly load, assessment type distribution, and attribute coverage.
*   **Export**: Ability to print/export visualization maps.
*   **Branding**: TU Dublin color palette (Navy #003B5C, Teal #00A6A6) and Irish English spelling.

## Tech Stack

*   **Frontend**: React, TypeScript, Vite
*   **Styling**: Tailwind CSS, Shadcn UI
*   **Routing**: Wouter
*   **State Management**: React Context API (Mockup Mode - In-memory storage)
*   **Charts/Visuals**: Recharts, HTML-to-Image
*   **Icons**: Lucide React

## Mockup Mode

This application is currently running in **Mockup Mode**.
*   **Frontend Only**: All logic resides in the client.
*   **No Backend**: There is no server-side persistence. Data is stored in memory and will reset on reload (unless using the preloaded demo data).
*   **Demo Data**: The application comes pre-loaded with 3 sample modules (MGMT101, MKTG202, FIN303) to demonstrate visualizations immediately.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open Browser**:
    Navigate to the URL provided by Vite (usually `http://localhost:5000`).

## Project Structure

*   `client/src/pages`: Main application pages (Home, Programme, Modules, Assessments, Visualisations).
*   `client/src/components`: Reusable UI components and visualization charts.
*   `client/src/lib/store.tsx`: Central state management (Context API).
*   `client/src/lib/analytics.ts`: Helper functions for data processing and calculations.

---
*© 2025 Curriculum Insight Suite*
