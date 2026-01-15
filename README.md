# 👨‍🍳 Let Him Cook

**Let Him Cook** is a modern, intelligent recipe finder and meal planning application designed to help you hit your macro targets while enjoying delicious meals. 

Built with **Next.js 15** and powered by the **Edamam API**, it offers a personalized cooking experience based on your dietary preferences and health goals.

![Dashboard Preview](public/file.svg) *(Replace with actual screenshot link later)*

## 🚀 Features

-   **🥗 Smart Recipe Search**: Find recipes based on ingredients, calories, and specific macro-nutrient targets (Protein, Carbs, Fat).
-   **🥑 Personalized Experience**: Onboarding flow to set your dietary preferences (Vegan, Keto, Paleo) and allergies (Gluten, Peanuts, etc.).
-   **📊 Macro Calculator**: Dynamic slider interface to adjust your nutritional goals in real-time.
-   **❤️ Favorites Manager**: Save your best finds to your personal cookbook.
-   **🔒 Secure Authentication**: Robust user management via Supabase Auth.
-   **📱 Responsive Design**: optimized for desktop and mobile use.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/) (via Supabase)
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Auth**: [Supabase Auth](https://supabase.com/auth)
-   **API**: [Edamam Recipe API](https://www.edamam.com/)

## 🏁 Getting Started

### Prerequisites

-   Node.js 18+
-   A Supabase project
-   An Edamam API account

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/EmanuelMatei/let-him-cook.git
    cd let-him-cook
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory and add the following:

    ```env
    # App
    NEXT_PUBLIC_BASE_URL=http://localhost:3000

    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    DATABASE_URL=your_postgres_transaction_connection_string
    DIRECT_URL=your_postgres_session_connection_string

    # Edamam API
    NEXT_PUBLIC_EDAMAM_APP_ID=your_app_id
    NEXT_PUBLIC_EDAMAM_APP_KEY=your_app_key
    
    # Monetization (AdSense)
    NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
    ```

4.  **Run the application**:
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Deployment

This project is optimized for deployment on **Vercel**.

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Add the environment variables from your `.env` file.
4.  Deploy!

## 📄 License

This project is licensed under the MIT License.
