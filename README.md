# InterviewAI - Next.js Application

An AI-powered interview platform built with Next.js, React, and TypeScript.

## Features

- **Email/Password Authentication**: Secure signup and login system
- **Dual Role System**: Support for both Interviewers and Interviewees
- **User Registration**: Signup with name, email, password, and phone number
- **Resume Processing**: Upload and parse PDF/DOCX resumes with AI extraction
- **Interactive Interviews**: Real-time AI-powered interview sessions with scoring
- **Candidate Management**: Dashboard for interviewers to manage candidates
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Type Safety**: Full TypeScript support with strict type checking

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: Local Storage (for demo purposes)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler

## Project Structure

```
project/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── src/
│   ├── components/        # React components
│   │   ├── auth/         # Authentication components
│   │   ├── common/       # Shared components
│   │   ├── interview/    # Interview flow components
│   │   ├── interviewer/  # Interviewer dashboard components
│   │   └── ui/           # UI components
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── public/               # Static assets
└── ...config files
```

## Usage

### Authentication
1. **Sign Up**: Create account with email, password, name, and phone number
2. **Sign In**: Login with email and password
3. **Role Selection**: Choose between Interviewer or Candidate role during signup

### For Interviewers
1. Sign up with "Interviewer" role
2. Access the dashboard to view all candidates
3. Filter and sort candidates by various criteria
4. View detailed interview results and scores
5. **Export candidate data to CSV** with the following columns:
   - **Candidate**: Name
   - **Contact**: Email and phone number
   - **Status**: Current interview status
   - **Score**: Final or partial score
   - **Date**: Interview start date
   - **Progress**: Completion percentage
   - **Actions**: Recommended next action

### For Candidates
1. Sign up with "Candidate" role (requires phone number)
2. Upload your resume (PDF or DOCX)
3. Complete any missing information if prompted
4. Participate in the AI-powered interview
5. Receive real-time feedback and scoring

### Demo Accounts
For testing, you can use these demo accounts:
- **Interviewer**: `interviewer@demo.com` / `demo123`
- **Candidate**: `candidate@demo.com` / `demo123`

## Development

This project uses:
- **Next.js App Router** for routing and layout
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **ESLint** for code quality
- **Local Storage** for data persistence (demo purposes)

## Migration from Vite

This application was successfully migrated from Vite + React to Next.js with the following changes:
- Updated package.json dependencies
- Restructured to use Next.js App Router
- Updated TypeScript and build configurations
- Maintained all existing functionality and components
- Fixed all ESLint errors and warnings
