## TibiaRise Frontend Documentation

### Overview

TibiaRise is a web application built for Tibia players to track their in-game progress. The frontend is a modern, fast, and scalable application built with Next.js and a comprehensive set of libraries to provide a smooth user experience. This document outlines the key aspects of the frontend architecture and development practices.

***

### 1. Technology Stack

The TibiaRise frontend is built using the following core technologies:

* **Framework**: **Next.js 15** (with App Router) for server-side rendering, routing, and a component-based architecture.
* **Language**: **TypeScript** for type-safe code.
* **Styling**: **Tailwind CSS** for utility-first styling.
* **Data Fetching**: **React Query** (also known as TanStack Query) for managing server state and caching data.
* **UI Components**: **shadcn/ui**, a collection of reusable components built with Radix UI and Tailwind CSS.
* **Authentication**: **NextAuth.js** (v5 beta) for Google authentication.
* **Internationalization**: **next-intl** for multi-language support (English and Portuguese).

***

### 2. Project Structure

The frontend repository is organized as follows:

* `src/app`: Contains the main application pages and layouts. The `[locale]` dynamic segment is used for internationalization/(public)/layout.tsx].
* `src/components`: Contains shared UI components, including the `ui` directory which houses the shadcn/ui components.
* `src/queries`: Contains React Query hooks for fetching and mutating data from the backend API.
* `src/views`: Contains the main logic for each page, separating presentation from core application logic.
* `src/models`: Defines TypeScript interfaces and types for application data.
* `src/i18n`: Configuration and middleware for internationalization with `next-intl`.
* `src/utils`: Contains various utility functions, including helpers for number formatting and game-specific calculations.

***

### 3. Core Features

The frontend application provides the following features:

* **Character Progression Tracking**: Users can view detailed information about a character's experience gains over time, including daily logs, total XP, and levels achieved.
* **Player Comparison**: A dedicated tool allows users to compare two characters side-by-side, analyzing metrics like level and XP gains.
* **Experience by World**: A page to view top experience gainers for specific worlds within different time periods (daily, weekly, monthly).
* **Loot Splitter**: A tool to calculate fair loot distribution among party members by parsing session data.
* **Profit Manager**: A dashboard feature for logged-in users to track hunt profits. It includes a table of entries and cards with total and best profit metrics.

***

### 4. Code Principles & Best Practices

* **Component-Based Architecture**: The application is structured into reusable and modular components, which promotes code reuse and maintainability.
* **Data Fetching with React Query**: Instead of managing fetching state manually, React Query provides hooks (`useQuery`, `useMutation`) that handle caching, background refetching, and stale data out of the box, leading to better performance and developer experience.
* **TypeScript for Strong Typing**: The use of TypeScript across the codebase helps catch type-related errors at compile-time and improves code predictability. Interfaces in the `src/models` directory ensure data consistency.
* **Next.js App Router**: The application leverages Next.js 14 features for streamlined server-side rendering and data fetching, improving initial load times and SEO.
* **Internationalization**: By using `next-intl`, all user-facing strings are stored in `dictionaries` and loaded dynamically based on the user's locale, making the application easily translatable and accessible to a wider audience.
* **Authentication**: Secure authentication is handled through `next-auth`, which provides a robust and easy-to-implement solution for user management and data security.
