# Sentiment Analyzer

A full-stack web application that analyzes the sentiment of movie reviews using two approaches:

- Rule-based word analysis
- LLM-based classification via Google's Gemini API

---

## Approach to Sentiment Analysis

This application supports two distinct approaches to sentiment classification:

### 1. Rule-Based Sentiment Analysis

- A curated list of positive, negative, and neutral words/phrases is used to assess the sentiment of the review.
- The algorithm counts occurrences of these keywords, while also handling edge cases such as:
  - Negations (e.g., _"not good"_ is treated as negative)
  - Multi-word expressions (e.g., _"highly recommend"_ is treated as positive)
  - Neutral expressions (e.g., _"okay"_, _"average"_)
- The final sentiment (Positive, Negative, or Neutral) is determined based on the relative counts.
- An explanation with counts and a **computed score** is returned to help interpret the result.

**Example:**

> **Review:** "Absolutely not great. I expected better."
> **Sentiment:** Negative
> **Explanation:** Rule-based: Score = -2.5 (Pos: 0, Neg: 2, Neutral: 0)

### 2. LLM-Based Sentiment Analysis (via Gemini)

- Reviews are passed to the Google Gemini API with a prompt instructing it to classify sentiment as **Positive**, **Negative**, or **Neutral**.
- The model's textual response is parsed and matched to one of the three sentiment labels.
- A short explanation (e.g., _"Gemini says: Mostly positive with uplifting words"_) is returned to provide interpretability.
- This method supports more nuanced or complex sentence structures.

---

## Features

- Analyze movie reviews using either LLM or rule-based logic
- View past analyses in a searchable, filterable, and sortable table
- Clear explanations provided for both analysis methods
- Delete entries with confirmation dialogs
- Method preference is remembered locally

---

## Tech Stack

### Frontend

- **Next.js** (App Router)
- **Tailwind CSS** for styling
- **React Hot Toast** for user feedback

### Backend

- **Express.js** using ES Modules
- **MongoDB Atlas** for database
- **Google Gemini API** integration
- **CORS**, **dotenv**, and **body-parser**

---

## Folder Structure

```

sentiment-analyzer/
├── backend/                 # Express.js API
│   ├── routes/              # Modular route handlers
│   ├── utils/               # Gemini and rule-based logic
│   ├── models/              # Mongoose schemas
│   └── app.js               # Application entry point
│
├── frontend/                # Next.js application
│   ├── app/                 # App Router pages
│   ├── components/          # Reusable UI components
│   ├── lib/                 # API interaction helpers
│   └── tailwind.config.js   # Tailwind CSS config
│
├── .env                     # Environment variables
└── README.md

```

---

## Local Development

1. **Clone the repository**

```bash
git clone https://github.com/sourabhaprasad/sentiment-analyzer.git
cd sentiment-analyzer
```

2. **Backend Setup**

```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGO_URI and GEMINI_API_KEY
npm run dev
# Server runs at http://localhost:3001
```

3. **Frontend Setup**

```bash
cd ../frontend
npm install
cp .env.example .env
# Add NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
npm run dev
# Frontend runs at http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint       | Description                        |
| ------ | -------------- | ---------------------------------- |
| POST   | `/analyze`     | Analyze a movie review             |
| GET    | `/results`     | Fetch all analyzed results         |
| GET    | `/results/:id` | Fetch details of a specific result |
| DELETE | `/results/:id` | Delete a specific result           |

---

## Extension Patterns (Backend)

- Routes are modular and grouped by resource (`/results`, `/analyze`)
- Easy to extend: just add a new file in `routes/` and wire it in `app.js`
- Shared logic like Gemini and rule-based models live in `utils/`
- Environment and configuration values are centralized in `.env`

This structure supports quick scalability with minimal boilerplate.

---

## Future Enhancements

- Add confidence scores and probability output from LLM
- Build a dashboard to visualize sentiment trends over time
- Support multiple languages for international reviews
- Implement user authentication and history
- Enhance explanation by highlighting detected keywords

---

**Built by [Sourabha K H](mailto:sourabhaprasad04@gmail.com)** — for assignment submission.
