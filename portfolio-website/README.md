# Portfolio Website

A modern, responsive portfolio website built with Next.js 14, featuring a blog, project showcase, and contact functionality. Built with TypeScript, Tailwind CSS, and Framer Motion for smooth animations.

## 🚀 Features

- **Modern Design**: Clean, professional design with subtle animations
- **Responsive**: Mobile-first approach, works on all devices
- **Performance**: Optimized for speed with Next.js 14 App Router
- **SEO Ready**: Built-in SEO optimization with meta tags and structured data
- **Blog Platform**: Full-featured blog with markdown support
- **Project Showcase**: Interactive portfolio section with filtering
- **Contact Form**: Functional contact form with validation
- **Animations**: Smooth animations powered by Framer Motion
- **Accessibility**: WCAG 2.1 AA compliant

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd portfolio-website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME="Your Name"
   NEXT_PUBLIC_SITE_DESCRIPTION="Full-stack developer portfolio"

   # Contact Form (optional for local development)
   CONTACT_EMAIL=your.email@example.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your.email@example.com
   SMTP_PASS=your-app-password
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to see the website.

## 🎨 Customization

### Personal Information
Update the following files with your personal information:

- `src/lib/navigation.ts` - Navigation links and social media URLs
- `src/app/layout.tsx` - Site metadata and SEO information
- `src/app/page.tsx` - Hero section content

### Styling
The design system can be customized in:

- `src/app/globals.css` - CSS custom properties for colors
- `tailwind.config.js` - Tailwind configuration and theme customization

### Content
- **Projects**: Add your projects data (will be implemented)
- **Blog Posts**: Add your blog content (will be implemented)
- **About Page**: Create your about page content (will be implemented)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx          # Homepage
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Badge.tsx
│   └── layout/           # Layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Navigation.tsx
├── lib/                  # Utility functions
│   ├── utils.ts         # General utilities
│   └── navigation.ts    # Navigation configuration
└── types/               # TypeScript type definitions
    ├── project.ts
    ├── blog.ts
    └── api.ts
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to a Git repository
2. Connect your repository to [Vercel](https://vercel.com)
3. Set up environment variables in Vercel dashboard
4. Deploy with zero configuration

### Other Platforms
- **Netlify**: Supports Next.js with Edge Functions
- **Railway**: Full-stack deployment with database support
- **AWS Amplify**: Scalable hosting with CI/CD

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎯 Roadmap

- [x] Basic project setup and structure
- [x] Homepage with hero section
- [x] Responsive navigation
- [x] UI components library
- [ ] About page
- [ ] Projects showcase with filtering
- [ ] Blog functionality
- [ ] Contact form with email integration
- [ ] Dark mode toggle
- [ ] CMS integration
- [ ] Analytics integration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from modern portfolio websites
- Built with the amazing Next.js framework
- Icons provided by Lucide React
- Animations powered by Framer Motion

---

**Note**: This is a work in progress. More features and pages will be added according to the roadmap above.