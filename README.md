# 🎭 Mystery Message — Anonymous Feedback Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-JWT-purple?style=for-the-badge&logo=nextauth)](https://next-auth.js.org/)

A full-stack, real-time anonymous messaging and feedback platform built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **MongoDB & Mongoose**, **NextAuth.js**, **Nodemailer / Resend**, and **OpenAI**.

Users can create a personalized profile, share their unique public link (`/u/[username]`), and receive authentic, anonymous questions, feedback, and compliments from friends, fans, and colleagues.

---

## ✨ Features

- 🔒 **100% Anonymous Messaging**: Visitors can send messages via any user's unique public link (`/u/[username]`) with zero sign-in barrier or identity tracking.
- ⚡ **Interactive User Dashboard**: Real-time message inbox with timestamps, one-click delete, and refresh controls.
- 🎚️ **Accept Messages Toggle**: Enable or disable receiving new messages with instant database synchronization.
- 🤖 **AI-Powered Message Suggestions**: Integrated OpenAI (`gpt-3.5-turbo`) to suggest engaging, open-ended questions with a single click.
- 🔐 **Secure Authentication**: NextAuth.js Credentials Provider with JWT session management, bcrypt password hashing, and route protection.
- ✉️ **OTP Email Verification**: Automated 6-digit verification codes sent via **Nodemailer** (with Google App Password) and **Resend** support. Also logs OTP to the server terminal for fast development testing.
- 🛡️ **Debounced Username Check & Validation**: Real-time username uniqueness checking with debouncing and end-to-end type safety using **Zod** and **React Hook Form**.
- 🎠 **Modern Landing Page & Carousel**: Autoplaying Embla Carousel showcasing feedback highlights, trust badges, workflow walkthroughs, and glassmorphic UI.
- 🎨 **Responsive Dark UI**: Modern dark theme with glowing accents, accessible components, and smooth micro-interactions.

---

## 🛠️ Tech Stack

| Category | Technology / Library |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router & Route Handlers) |
| **Frontend** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (Icons) |
| **Carousel** | [Embla Carousel React](https://www.embla-carousel.com/) + Autoplay Plugin |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/) |
| **Authentication** | [NextAuth.js v4](https://next-auth.js.org/) (Credentials Provider & JWT) |
| **Validation** | [Zod](https://zod.dev/), [React Hook Form](https://react-hook-form.com/), `@hookform/resolvers` |
| **Email Service** | [Nodemailer](https://nodemailer.com/) (Gmail SMTP / Google App Password) & [Resend](https://resend.com/) |
| **AI Integration** | [OpenAI SDK](https://platform.openai.com/docs/) (`gpt-3.5-turbo`) |
| **HTTP Client** | [Axios](https://axios-http.com/) |

---

## 📁 Project Structure

```text
my-app/
├── app/
│   ├── (app)/                    # Authenticated & public layout group
│   │   ├── dashboard/            # User dashboard for messages & link management
│   │   ├── layout.tsx            # Navbar & Footer layout wrapper
│   │   └── page.tsx              # Landing page with hero & feedback carousel
│   ├── (auth)/                   # Authentication pages group
│   │   ├── sign-in/              # Sign-in page
│   │   ├── sign-up/              # Sign-up page with real-time username check
│   │   └── verify/[username]/    # OTP verification page
│   ├── api/                      # Next.js Route Handlers (Backend APIs)
│   │   ├── accept-messages/      # GET/POST message acceptance status
│   │   ├── auth/[...nextauth]/   # NextAuth handler & options configuration
│   │   ├── check-username-unique/# GET check username availability
│   │   ├── delete-message/[id]/  # DELETE remove a specific message
│   │   ├── get-messages/         # GET retrieve messages for authenticated user
│   │   ├── send-message/         # POST submit anonymous message to user
│   │   ├── sign-up/              # POST register user & send verification OTP
│   │   ├── suggest-messages/     # POST generate AI questions via OpenAI
│   │   └── verify-code/          # POST verify user email via OTP
│   ├── helper/                   # Email & utility helpers (sendVerificationEmail)
│   ├── lib/                      # Shared libraries (dbConnect, resend, utils)
│   ├── model/                    # Mongoose User & Message schemas
│   ├── schemas/                  # Zod validation schemas (signUp, signIn, message)
│   ├── types/                    # TypeScript interfaces & API response definitions
│   ├── u/[username]/             # Public message submission page
│   ├── globals.css               # Tailwind CSS v4 root stylesheet
│   └── layout.tsx                # Root layout with AuthProvider & Toaster
├── components/
│   ├── ui/                       # Reusable UI components (Navbar, Footer, MessageCard, etc.)
├── emails/                       # React Email verification templates
├── hooks/                        # Custom React hooks (useToast)
├── lib/                          # Root UI utility helpers (cn, utils)
├── proxy.ts                      # Route protection & middleware handler
├── tsconfig.json                 # TypeScript compiler configuration & path aliases
└── package.json                  # Project dependencies & scripts
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/7gautamkumawat7/Mystery-Message.git
cd Mystery-Message/my-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root directory:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/mysterymessage?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# Email Verification (Nodemailer via Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_google_app_password

# Resend (Optional / Alternative Email Provider)
RESEND_API_KEY=re_your_resend_api_key

# OpenAI API Key (For AI Message Suggestions)
OPENAI_API_KEY=sk-your_openai_api_key
```

> [!TIP]
> **Gmail App Password Setup**: To generate a Google App Password for `EMAIL_PASS`, visit [Google App Passwords](https://myaccount.google.com/apppasswords) with 2-Step Verification enabled.
> 
> In **Development Mode**, generated OTP codes are also printed directly in your terminal console for easy testing.

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
- `npm run lint` — Runs ESLint checks across the codebase.

---

## 🛡️ Security & Privacy

- **True Anonymity**: No sender accounts, IP addresses, or tracking headers are stored with submitted messages.
- **Password Hashing**: Passwords are securely hashed using `bcryptjs` with salt rounds before saving.
- **Route Guarding**: Next.js route proxy prevents unauthenticated access to protected routes like `/dashboard` and redirects authenticated users away from `/sign-in` and `/sign-up`.
- **Input Validation**: All client and API inputs are validated using strict Zod schemas.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
