# 🎭 Tone Rewriter Tools

AI-powered text transformation tools that change the tone and style of your writing using Google's Gemini AI. Perfect for content creators, marketers, educators, and anyone who needs to adapt their writing style.

## ✨ Features

Transform any text with 4 different tones:
- **💼 Professional** - Business-appropriate, formal tone
- **😂 Funny** - Humorous and entertaining while keeping the message
- **✂️ Short** - Concise and brief while preserving key information  
- **👶 Simple** - Explained as if for a 5-year-old using simple concepts

## 🌍 Available Languages

### English Version
- File: `english/tone-rewriter.html`
- Full English interface and AI prompts

### Norwegian Version (Toneomskriver)
- File: `norwegian/tone-rewriter-norwegian.html`
- Complete Norwegian translation
- Norwegian AI responses

## 🚀 Quick Start

1. **Get Google AI Studio API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create/select a project and generate an API key

2. **Setup the Tool**
   - Open either `english/tone-rewriter.html` or `norwegian/tone-rewriter-norwegian.html`
   - Replace `'YOUR_API_KEY_HERE'` with your actual API key
   - Open in any modern web browser

3. **Use the Tool**
   - Paste your text in the input area
   - Click any tone button
   - Get AI-transformed text instantly!

## 🛡️ Security Features

- API keys are never committed to git (protected by pre-commit hooks)
- Client-side only - no server required
- Direct API calls to Google's secure endpoints

## 💡 Use Cases

- **Content Marketing** - Adapt tone for different audiences
- **Education** - Simplify complex topics
- **Business Communication** - Make emails more professional
- **Social Media** - Make posts more engaging
- **Course Creation** - Adjust content complexity

## 🎯 Perfect For

- **AI Course Platforms** - Demonstrate AI capabilities
- **Content Creators** - Quick tone adjustments
- **Educators** - Teaching writing styles
- **Lead Generation** - Newsletter signup included

## 📁 Project Structure

```
tone-rewriter/
├── english/
│   └── tone-rewriter.html          # English version
├── norwegian/
│   └── tone-rewriter-norwegian.html # Norwegian version
├── docs/
│   └── (future documentation)
└── README.md                       # This file
```

## 🔧 Technical Details

- **AI Model**: Google Gemini 1.5 Pro
- **Framework**: Pure HTML/CSS/JavaScript (no dependencies)
- **Responsive**: Works on desktop and mobile
- **Error Handling**: Automatic retry on API overload
- **Newsletter**: Ready for integration with email services

## 🎨 Customization

Easy to customize:
- Change colors by modifying CSS gradients
- Add new tone buttons by extending `tonePrompts` object
- Integrate with different AI models by updating the API call
- Add your own branding and styling

## 📝 License

Created for educational and demonstration purposes. Feel free to use and modify for your projects.

---

*🤖 Generated with [Claude Code](https://claude.ai/code)*