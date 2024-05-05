# Finance Tracker

## Description

This is a finance tracker app built with React, Remix, and TailwindCSS. It allows users to track their income and expenses and see a summary of their transactions.

## Features

-   Expense Tracking: Keep track of your expenses per month to manage your finances better
-   Savings Management: Monitor your savings and see how much you have saved per month
-   Responsive Design: The app is responsive and works seamlessly across different devices.

## Installation

1. Clone the repository

2. Install dependencies

    ```bash
    npm install
    ```

3. Setup environment variables by creating a `.env` file in the root of the project and adding variables based on the schema defined in `app/env.server.ts`

4. Run the migrations script

    ```bash
    npm run db:migrate
    ```

5. Start the development server

    ```bash
    npm run dev
    ```

6. Create a new user by following these steps:
    - Create a new entry in the `invitations` table
    - Navigate to `/register?invite={invitation_code}` and use the generated primary key id as the invitation code to create a new user
    - In the `user-details` table, update the `role` column to `admin` for to be able to generate new invitation directly from the app

## Technologies Used

-   React: UI library
-   TypeScript: Programming language
-   Remix: React framework
-   TailwindCSS: CSS framework
-   PostgreSQL: Database management system
-   Drizzle: Typescript-based ORM
-   Zod: Schema declaration and validation library
-   React Aria Components: Headless component library
-   Other libraries: Various other libraries and tools for specific functionalities (listed in package.json).
