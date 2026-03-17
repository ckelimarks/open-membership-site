# Open Membership Site

A free, open-source membership site template with pay-what-you-want pricing, magic link authentication, and a beautiful dark UI.

Perfect for creators, writers, educators, and indie hackers who want to build a membership community without the complexity of platforms like Patreon or Substack.

## Features

- ✨ **Magic Link Authentication** - Passwordless login via Supabase
- 💰 **Pay-What-You-Want Pricing** - Let supporters choose their contribution ($0-$∞)
- 🎨 **Dark, Modern UI** - Sleek design with gradient accents
- 📝 **Content Management** - Articles, videos, resources
- 🔒 **Content Gating** - Member-only access control
- 📱 **Fully Responsive** - Works on all devices
- 🚀 **No Framework** - Pure HTML/CSS/JS (easy to understand & modify)
- 🎯 **SEO Friendly** - Static pages, fast loading
- 🆓 **Actually Free** - No hidden costs, no platform fees (besides Stripe)

## Quick Start

### Prerequisites

- A [Supabase](https://supabase.com) account (free tier works great)
- A [Stripe](https://stripe.com) account for payments (optional - you can start with free-only)
- Basic knowledge of HTML/CSS

### 5-Minute Setup

1. **Clone this repo**
   ```bash
   git clone https://github.com/ckelimarks/open-membership-site.git
   cd open-membership-site
   ```

2. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings → API
   - Copy your `URL` and `anon/public` key

3. **Configure authentication**
   Edit `auth.js` and add your Supabase credentials:
   ```javascript
   const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key-here';
   ```

4. **Enable email authentication**
   - In Supabase: Authentication → Providers
   - Enable "Email" provider
   - Customize email templates (optional)

5. **Deploy**
   - Push to GitHub
   - Connect to Vercel/Netlify (one-click deploy)
   - Update `emailRedirectTo` in `auth.js` to your domain
   - Done! ✅

### Optional: Add Payments

6. **Set up Stripe** (only if you want paid tiers)
   - Create a Stripe account
   - Add API keys to `.env`
   - Configure webhook endpoint
   - Update pricing in `join.html`

## What's Included

This is a complete, production-ready template:

- ✅ **Landing page** with hero, features, and preview content
- ✅ **Join/pricing page** with pay-what-you-want input
- ✅ **Member feed** with protected content
- ✅ **About page** template
- ✅ **Account settings** page
- ✅ **Article templates** ready to customize
- ✅ **Design system** documentation
- ✅ **Stripe integration** for payments
- ✅ **Email authentication** via Supabase
- ✅ **Responsive design** for mobile/desktop
- ✅ **CDN placeholder images** (easy to replace)

## File Structure

```
├── index.html              # Landing page
├── join.html               # Signup/pricing page
├── feed.html               # Member feed (protected)
├── about.html              # About page
├── account.html            # User account settings
├── article-example.html    # Article template
├── auth.js                 # Supabase authentication
├── design-system.html      # Design system reference
├── api/                    # Serverless functions (Stripe)
│   ├── create-checkout.js
│   ├── stripe-webhook.js
│   └── subscribe.js
├── .env.example            # Environment variables template
└── README.md               # You are here
```

## Customization

### 1. Branding

Replace "YourBrand" throughout the site:
```bash
# Quick find & replace
find . -name "*.html" -exec sed -i '' 's/YourBrand/Your Actual Brand/g' {} +
```

Update colors in CSS:
```css
:root {
    --dark-bg: #0a0e12;
    --dark-card: #12171d;
    --accent-cyan: #00d9ff;      /* Primary accent */
    --accent-magenta: #ff00aa;   /* Secondary accent */
}
```

### 2. Content

**Add articles:**
1. Copy `article-example.html`
2. Update title, content, featured image
3. Add preview card to `feed.html` and `index.html`

**Replace placeholder images:**
- Logos: Update `<img src="https://via.placeholder.com/...">`
- Use your own images or services like Unsplash, Pexels

### 3. Pricing

Edit `join.html` to customize:
- Default suggested amounts
- Tier descriptions
- Minimum/maximum amounts
- Free vs paid access levels

## How It Works

### Authentication Flow

```
User enters email → Magic link sent → User clicks link → Authenticated → Access granted
```

No passwords to manage. Sessions persist via JWT in localStorage.

### Payment Flow (Optional)

```
User chooses amount → Stripe Checkout → Payment confirmed → Webhook updates access
```

You control what "paid" members get vs free members.

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (no build step!)
- **Authentication**: Supabase Auth (magic links)
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe Checkout (optional)
- **Hosting**: Vercel, Netlify, Cloudflare Pages, etc.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `STRIPE_SECRET_KEY` (if using payments)
4. Deploy!

### Netlify

Same process as Vercel. Both offer generous free tiers.

### Custom Server

This is just static HTML + serverless functions. Host anywhere!

## Security

- ✅ `.env` is gitignored by default
- ✅ Supabase handles authentication securely
- ✅ Row Level Security policies protect data
- ✅ Stripe webhooks are signature-verified
- ✅ No sensitive data in client-side code

**Best practices:**
- Never commit `.env` files
- Use Supabase RLS policies
- Rotate keys if accidentally exposed
- Keep dependencies updated

## Roadmap

Want to contribute? Here are some ideas:

- [ ] Email templates for member communications
- [ ] Admin dashboard for content management
- [ ] Analytics integration
- [ ] Comment system for articles
- [ ] Member directory/profiles
- [ ] Discord/Slack community integration

## Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - use this for personal or commercial projects, no attribution required.

## Support

- **Issues**: [GitHub Issues](https://github.com/ckelimarks/open-membership-site/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ckelimarks/open-membership-site/discussions)
- **Documentation**: This README + inline code comments

## Credits

Built with ❤️ for indie creators who want to own their audience and build sustainable membership communities.

---

**Questions?** Open an issue!

**Found this useful?** Give it a ⭐️ on GitHub!

**See it in action:** [sutra.christopherkmarks.com](https://sutra.christopherkmarks.com) - Live example of this template
