# 🎭 Mystery Message — Anonymous Feedback Platform

A full-stack, real-time anonymous messaging and feedback platform built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **MongoDB & Mongoose**, **NextAuth.js**, **Resend**, and **OpenAI**.

Users can register a personalized profile, share their unique public link, and receive authentic, anonymous feedback, questions, and compliments from peers, fans, and colleagues.

---

## ✨ Features

- 🔒 **100% Anonymous Messaging**: Anyone can send messages via a user's unique public URL (`/u/[username]`) with zero sign-in barrier or identity exposure.
- ⚡ **Interactive User Dashboard**: Real-time management of received messages with timestamps, one-click delete, and refresh controls.
- 🎚️ **Accept Messages Toggle**: Easily toggle accepting new messages on or off with instant database synchronization.
- 🤖 **AI-Powered Message Suggestions**: Integrated OpenAI (`gpt-3.5-turbo`) to help visitors generate engaging, open-ended questions with a single click.
- 🔐 **Secure Authentication**: NextAuth.js credentials provider with JWT session management, bcrypt password hashing, and Next.js middleware protection.
- ✉️ **OTP Email Verification**: Automated 6-digit verification codes sent via **Resend** using responsive **React Email** templates.
- 🛡️ **Debounced Username Check & Validation**: Real-time username availability checking with debouncing and end-to-end type safety using **Zod** and **React Hook Form**.
- 🎠 **Modern Landing Page & Carousel**: Autoplaying Embla Carousel showcasing featured feedback, trust badges, workflow walkthroughs, and modern glassmorphic UI.
- 🎨 **Responsive Dark Theme**: Sleek, modern dark mode with glowing accents and smooth micro-interactions.

---

## 🛠️ Tech Stack

| Category | Technology / Library |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router & Server Actions / Route Handlers) |
| **Frontend** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (Icons) |
| **Carousel** | [Embla Carousel React](https://www.embla-carousel.com/) + [Autoplay Plugin](https://www.embla-carousel.com/plugins/autoplay/) |
| **Database** | [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/) |
| **Authentication** | [NextAuth.js v4](https://next-auth.js.org/) (Credentials Provider & JWT) |
| **Validation** | [Zod](https://zod.dev/), [React Hook Form](https://react-hook-form.com/), `@hookform/resolvers` |
| **Email Service** | [Resend](https://resend.com/) with [@react-email/components](https://react.email/) |
| **AI Integration** | [OpenAI SDK](https://platform.openai.com/docs/) (`gpt-3.5-turbo`) |
| **HTTP Client** | [Axios](https://axios-http.com/) |

---

## 📁 Project Structure

```text
├── app/
│   ├── (app)/                    # Authenticated & public layout group
│   │   ├── dashboard/            # User dashboard for messages & link management
│   │   ├── layout.tsx            # Navbar & Footer layout wrapper
│   │   └── page.tsx              # Landing page with hero & feedback carousel
│   ├── (auth)/                   # Authentication pages group
│   │   ├── sign-in/              # Sign-in page
│   │   ├── sign-up/              # Sign-up page with real-time username check
│   │   └── verify/[username]/    # OTP code verification page
│   ├── api/                      # Next.js Route Handlers (Backend APIs)
│   │   ├── accept-messages/      # GET/POST toggle message acceptance status
│   │   ├── auth/[...nextauth]/   # NextAuth handler & options configuration
│   │   ├── check-username-unique/# GET validate unique username availability
│   │   ├── delete-message/[id]/  # DELETE remove a specific message
│   │   ├── get-messages/         # GET retrieve messages for authenticated user
│   │   ├── send-message/         # POST submit anonymous message to user
│   │   ├── sign-up/              # POST register new user & send verification OTP
│   │   ├── suggest-messages/     # POST generate AI questions via OpenAI
│   │   └── verify-code/          # POST verify user email via OTP
│   ├── helper/                   # Helper functions (e.g., sendVerificationEmail)
│   ├── lib/                      # Shared libraries (dbConnect, resend client, utils)
│   ├── model/                    # Mongoose User and Message models
│   ├── schemas/                  # Zod validation schemas (signUp, signIn, message, etc.)
│   ├── types/                    # TypeScript interfaces and API response definitions
│   ├── u/[username]/             # Public message submission page
│   ├── globals.css               # Tailwind CSS v4 root stylesheet
│   └── layout.tsx                # Root layout with AuthProvider & Toaster
├── components/
│   ├── ui/                       # Reusable UI components (Navbar, Footer, MessageCard, Carousel, Card, Button, Toast)
├── emails/                       # React Email verification templates
├── hooks/                        # Custom React hooks (useToast, etc.)
├── message.json                  # Sample messages for landing page showcase
├── middleware.ts                 # NextAuth route protection & redirects
└── package.json
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mystery-message.git
cd mystery-message
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and configure the following keys:

```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mysterymessage?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Resend (Email Verification)
RESEND_API_KEY=re_your_resend_api_key_here

# OpenAI (AI Message Suggestions)
OPENAI_API_KEY=sk-your_openai_api_key_here
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/sign-up` | Register new user & send OTP | ❌ |
| `POST` | `/api/verify-code` | Verify user email with OTP code | ❌ |
| `GET` | `/api/check-username-unique` | Check if username is available | ❌ |
| `POST` | `/api/send-message` | Send anonymous message to a user | ❌ |
| `POST` | `/api/suggest-messages` | Generate AI questions via OpenAI | ❌ |
| `GET` | `/api/get-messages` | Fetch messages for logged-in user | ✅ |
| `DELETE` | `/api/delete-message/[id]` | Delete a message by ID | ✅ |
| `GET` | `/api/accept-messages` | Get user's message acceptance status | ✅ |
| `POST` | `/api/accept-messages` | Toggle user's message acceptance status | ✅ |

---

## 📜 Available Scripts

- `npm run dev` — Starts the Next.js development server.
- `npm run build` — Builds the application for production.
- `npm run start` — Runs the production server.
- `npm run lint` — Runs ESLint checks.

---

## 🛡️ Security & Privacy

- **Sender Anonymity**: No sender accounts, IP addresses, or tracking tokens are linked to submitted messages.
- **Password Security**: Passwords are never stored in plaintext and are hashed using bcrypt with salt rounds.
- **Route Protection**: Next.js Edge Middleware prevents unauthorized access to the `/dashboard` and redirects authenticated users away from auth pages.
- **Input Sanitization & Validation**: All user inputs are validated against strict Zod schemas on both client and server.

---


