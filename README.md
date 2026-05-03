# 🌾 KisaanMate: AI-Powered Farming Assistant

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-magenta?logo=google)
![Tailwind CSS](https://img.shields.io/badge/Style-Tailwind-cyan?logo=tailwindcss)

**KisaanMate** is an intelligent, hyper-personalized farming assistant designed specifically for **new and first-time farmers in India**. It bridges the gap between complex agricultural science and beginner realities by providing step-by-step guidance in vernacular languages.

---

## 🚀 The Problem

*   **The Information Gap:** Generic agricultural advice often fails to account for local realities like specific soil types, water availability, and small budgets.
*   **High Attrition:** Over 60% of hobbyists and new farmers quit within 2 years due to a lack of proper guidance.
*   **Chemical Dependency:** Fear of failure often leads beginners to overuse harmful pesticides immediately.

## 💡 The Solution

KisaanMate acts as a **Personal AI Agronomist** that is:
1.  **Hyper-Personalized:** Creates plans based on *your* soil, water source, and budget.
2.  **Vernacular First:** Fluent in **English, Hindi, Tamil, Telugu, and Kannada**.
3.  **Organic Focused:** Prioritizes eco-friendly and natural remedies over chemicals.

---

## ✨ Key Features

### 1. Smart Onboarding & Profiling
*   Assess farming goals (Profit vs. Hobby).
*   Logs constraints: Water source (Borewell/Rain), Visit frequency (Daily/Weekend), and Budget.
*   **Automatic Location Detection** using OpenStreetMap/Nominatim.

### 2. AI-Driven "My Plan"
*   **Crop Recommendations:** Suggests beginner-friendly crops based on soil type and season.
*   **Visual Soil Analysis:** Users can upload a photo of their soil; **Gemini 2.5 Flash** analyzes visual cues to estimate soil type and moisture.
*   **Risk & Cost Analysis:** Real-time estimation of input costs (Seeds, Fertilizer, Labor) vs. the user's budget.

### 3. Agentic AI Chat
*   A persistent, context-aware chat assistant.
*   **Multimodal:** Can analyze images of plants for disease detection.
*   **Safety Guardrails:** Hard-coded system instructions ensure the AI never promises profits and always suggests organic remedies first.

### 4. Dashboard & Tools
*   **Weather Integration:** Real-time weather snapshots.
*   **Calendar:** Week-by-week task generation.
*   **Vernacular UI:** The entire interface translates dynamically based on user preference.

---

## 🤖 Agentic Approach & AI Stack

KisaanMate utilizes the **Google GenAI SDK** to create specific "Agents" for different tasks:

*   **The Empathy Engine:** System prompts enforce a calm, supportive, and non-judgmental tone suitable for nervous beginners.
*   **Gemini 2.5 Flash (Vision):** Used for analyzing soil images and plant diseases.
*   **Gemini 3.0 Flash (Reasoning):** Used for complex logic, such as cross-referencing budget constraints with crop input costs.

---

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **AI Model:** Google Gemini API (`@google/genai`)
*   **Visualization:** Recharts (for cost breakdown)
*   **Icons:** Lucide React
*   **Maps:** HTML5 Geolocation API + OpenStreetMap

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/KisaanMate.git
cd KisaanMate
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Key
Create a `.env` file in the root directory and add your Google Gemini API key.
*(You can get a key from [Google AI Studio](https://aistudio.google.com/))*

```env
VITE_API_KEY=your_actual_gemini_api_key_here
```

### 4. Run the App
```bash
npm run dev
```
Open your browser to `http://localhost:5173` (or the port shown in the terminal).

---

## 📂 Project Structure

```
src/
├── components/       # UI Components (Onboarding, Home, MyPlan, AIChat)
├── services/         # API logic (geminiService.ts handles all AI calls)
├── translations.ts   # Dictionary for 5 Indian languages
├── types.ts          # TypeScript interfaces for Profile, Crops, Chat
├── App.tsx           # Main Router and State Manager
└── main.tsx          # Entry point
```

---

## 🔮 Future Roadmap

*   **Offline Mode:** PWA support for farmers in low-network areas.
*   **Marketplace:** Connect farmers directly to organic seed vendors.
*   **Community:** A forum for farmers to share local success stories.
*   **Voice-to-Text:** Audio interaction for farmers who prefer speaking over typing.

---

## 🤝 Contributing

Contributions are welcome!
1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Made with ❤️ for Indian Farmers.
