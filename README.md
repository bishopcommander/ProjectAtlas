# 🌍 ProjectAtlas

**ProjectAtlas** is an AI-powered project discovery and mentorship platform designed to help developers find, evaluate, and build high-impact projects. It leverages the **Google Gemini API** to provide smart search capabilities, project scoring, and personalized mentorship.

---

## 🚀 Key Features

### 🧠 AI-Powered Smart Search
Stop struggling with complex filters. Simply type what you want to build in natural language (e.g., *"intermediate backend projects using Java and Microservices"*), and our AI will parse your intent and find the perfect match.

### 📈 Project Evaluation & Scoring
Every project is evaluated by AI across four dimensions:
- **Overall Score**: General quality and depth.
- **Resume Value**: How much it stands out to recruiters.
- **Uniqueness**: How original the idea is compared to common tutorials.
- **Learning Potential**: The technical challenge and growth opportunity.

### 🗺️ Level-Based Roadmaps
Each project is broken down into progressive levels:
- **Beginner**: Minimum viable product (MVP) requirements.
- **Intermediate**: Adding complexity and professional features.
- **Advanced**: Scalability, security, and advanced optimizations.

### 🤖 AI Project Mentor
A built-in conversational AI assistant that provides career guidance, project recommendations, and technical implementation tips based on your interests and skill level.

### 📊 Discovery Feeds
Curated categories to help you find inspiration:
- **Trending**: What the community is building right now.
- **High Impact**: Projects specifically chosen to boost your portfolio.
- **Backend Focused**: Deep dives into systems, APIs, and data.
- **Underrated Gems**: Unique projects that offer high learning value.

---

## 🛠️ Tech Stack

### Backend
- **Java 17+** with **Spring Boot 3**
- **Spring Data JPA** & **Hibernate 6**
- **MySQL** Database
- **Google Gemini API** (via AI Studio)

### Frontend
- **React** (Vite)
- **Modern CSS** with Tailwind-inspired utility classes
- **Glassmorphism** & Responsive Design

---

## ⚙️ Setup & Installation

### Prerequisites
- JDK 17 or higher
- Node.js (v18+)
- MySQL Server
- Google AI Studio (Gemini) API Key

### Backend Setup
1. Clone the repository.
2. Create a `.env` file in the root directory:
   ```env
   AI_API_KEY=your_gemini_api_key_here
   DB_URL=jdbc:mysql://localhost:3306/project_atlas
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```
3. Run the Spring Boot application using Maven:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🛡️ Security Note
This project uses environment variables (`.env`) to manage sensitive information like API keys. The `.env` file and experimental `scratch/` directory are excluded from version control via `.gitignore`. 

If you encounter an API key leak warning, ensure you rotate your keys immediately and scrub your Git history using `git-filter-repo`.

---

## 📄 License
This project is for educational purposes as part of a professional developer portfolio.
