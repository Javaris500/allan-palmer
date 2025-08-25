# Allan Palmer - Professional Violinist Website

A modern, responsive website for professional violinist Allan Palmer, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Responsive Design**: Optimized for all devices and screen sizes
- **Performance Optimized**: Built with Next.js 14 and modern web standards
- **SEO Friendly**: Comprehensive meta tags, sitemap, and structured data
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Video Gallery**: Integrated Mux video player for performance videos
- **Booking System**: Multi-step booking form with email notifications
- **Contact Forms**: Professional contact forms with email delivery
- **Email Integration**: Resend integration for reliable email delivery
- **Rate Limiting**: Built-in rate limiting for form submissions
- **Theme Support**: Light and dark mode with system preference detection

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Animations**: Framer Motion
- **Video**: Mux Player
- **Forms**: React Hook Form + Zod validation
- **Email**: Resend
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Resend account and API key

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd allan-palmer-violinist
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Copy environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Update environment variables in \`.env.local\`:
\`\`\`env
NEXT_PUBLIC_SITE_URL=https://allanpalmer.com
RESEND_API_KEY=re_your_resend_api_key_here
FROM_EMAIL=contact@allanpalmer.com
TO_EMAIL=allan@allanpalmer.com
NEXT_PUBLIC_MUX_ENV_KEY=your-mux-environment-key
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Email Setup

### Resend Configuration

1. Sign up for a [Resend account](https://resend.com)
2. Get your API key from the Resend dashboard
3. Add your domain and verify it in Resend
4. Update the environment variables:
   - \`RESEND_API_KEY\`: Your Resend API key
   - \`FROM_EMAIL\`: The email address to send from (must be from your verified domain)
   - \`TO_EMAIL\`: Allan's email address to receive notifications

### Email Features

- **Contact Form**: Users can send messages through the contact form
- **Booking Form**: Booking requests are sent via email with detailed information
- **Rate Limiting**: Prevents spam with built-in rate limiting
- **HTML & Text**: Emails are sent in both HTML and plain text formats
- **Professional Templates**: Well-formatted email templates for better readability

## Environment Variables

Create a \`.env.local\` file with the following variables:

\`\`\`env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://allanpalmer.com

# Resend Email Configuration
RESEND_API_KEY=re_your_resend_api_key_here
FROM_EMAIL=contact@allanpalmer.com
TO_EMAIL=allan@allanpalmer.com

# Mux Video Configuration
NEXT_PUBLIC_MUX_ENV_KEY=your-mux-environment-key

# Social Media Links (optional)
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/allan_palms
NEXT_PUBLIC_YOUTUBE_URL=https://youtube.com/@allanpalmer
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/allanpalmer
NEXT_PUBLIC_TIKTOK_URL=https://tiktok.com/@allanpalmer
\`\`\`

## API Routes

- \`POST /api/contact\` - Handle contact form submissions
- \`POST /api/booking\` - Handle booking form submissions

Both routes include:
- Input validation with Zod
- Rate limiting
- Email sending via Resend
- Error handling

## Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint
- \`npm run type-check\` - Run TypeScript type checking

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Required Environment Variables for Production

- \`RESEND_API_KEY\`
- \`FROM_EMAIL\`
- \`TO_EMAIL\`
- \`NEXT_PUBLIC_SITE_URL\`
- \`NEXT_PUBLIC_MUX_ENV_KEY\`

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── contact/route.ts    # Contact form API
│   │   └── booking/route.ts    # Booking form API
│   ├── (pages)/               # App pages
│   └── globals.css
├── components/                # React components
├── contexts/                  # React contexts
├── hooks/                     # Custom hooks
├── lib/
│   ├── email.ts              # Email utilities
│   ├── rate-limit.ts         # Rate limiting
│   ├── constants.ts          # App constants
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
\`\`\`

## Email Templates

The application includes professional email templates for:

- **Contact Form Submissions**: Clean, organized layout with all form data
- **Booking Requests**: Detailed booking information with clear action items
- **HTML & Text Versions**: Both formats for maximum compatibility

## Rate Limiting

Built-in rate limiting prevents spam:
- Contact form: 5 requests per 15 minutes per IP
- Booking form: 3 requests per 15 minutes per IP

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

© 2024 Allan Palmer. All rights reserved.
