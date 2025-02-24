# project-semester-2-front

A modern RATP project.

## ✨ Features

- Real-time place search with autocomplete
- Journey planning with flexible timing options
- Modern, responsive UI with Material Design
- Type-safe API integration with Zod validation
- Debounced search inputs for optimal performance

## 🛠 Tech Stack

- SvelteKit
- TypeScript
- SCSS
- Zod
- Axios

## 🚀 Getting Started

### Prerequisites

- RATP API Key

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your RATP API key:
```
RATP_API_KEY=your_api_key_here
```

4. Start development server:
```bash
npm run dev
```

## 💻 Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📝 API Integration

This application uses the RATP API for:
- Place search
- Journey planning
- Real-time transit information
