# Bingo Board Generator 🎲

A free, responsive web application for creating custom bingo boards using numbers or images. Perfect for teachers, event planners, and anyone looking to create engaging bingo games.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

- 📊 Create number-based or image-based bingo boards
- 🖼️ Search and use images from Unsplash
- 📱 Fully responsive design
- 🎯 Customizable board sizes (2x2 up to 10x10)
- 📄 Generate multiple boards at once
- 🖨️ Print-friendly output
- 🔄 Drag and drop support for custom images

## 🚀 Live Demo

Check out the live demo at: [your-domain.com](https://your-domain.com)

## 🛠️ Technology Stack

- HTML5/CSS3
- Vanilla JavaScript
- Material Design Components
- Cloudflare Workers for API protection
- Unsplash API for image search

## 📋 Prerequisites

To deploy this project, you'll need:

1. An Unsplash API key ([Get it here](https://unsplash.com/developers))
2. A Cloudflare account (Free tier works fine)
3. A domain name
4. (Optional) Google AdSense account for monetization

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bingo-generator.git
cd bingo-generator
```

2. Configure the Cloudflare Worker:
   - Create a new Worker in your Cloudflare dashboard
   - Copy the contents of `worker/worker.js` to your Worker
   - Add your Unsplash API key as an environment variable named `UNSPLASH_API_KEY`
   - Set your domain as an environment variable named `ALLOWED_ORIGIN`

3. Update the configuration:
   - In `script.js`, update the `CONFIG.WORKER_URL` to your Worker's URL
   - In `index.html`, update your AdSense IDs (if using)

4. Deploy:
   - Push to GitHub
   - Enable GitHub Pages or deploy to your preferred hosting
   - Configure your domain in Cloudflare

## 📝 Configuration

### Cloudflare Worker Environment Variables

```javascript
UNSPLASH_API_KEY=your_unsplash_api_key
ALLOWED_ORIGIN=https://your-domain.com
```

### AdSense Configuration (Optional)

In `index.html`, replace:
- `your-adsense-id` with your Google AdSense publisher ID
- `your-ad-slot-1`, `your-ad-slot-2`, etc. with your ad unit IDs

## 🔒 Security Features

- API key protection via Cloudflare Worker
- CORS protection
- Rate limiting
- Origin verification

## 🖨️ Printing Support

The application includes specific CSS for printing bingo boards:
- Clean layout without UI elements
- One board per page
- Optimized for both color and black/white printing

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile phones

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License (CC BY-NC-ND 4.0).
This means you are free to:

Share — copy and redistribute the material in any medium or format

Under the following terms:

Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made
NonCommercial — You may not use the material for commercial purposes
NoDerivatives — If you remix, transform, or build upon the material, you may not distribute the modified material

See the LICENSE file for the full license text.

## 🙏 Acknowledgments

- [Unsplash](https://unsplash.com) for the image API
- [Material Design Components](https://material.io/components) for the UI components
- [Cloudflare](https://cloudflare.com) for the Workers platform

## 📧 Contact

Daniel Suissa - [@LinkedIn](https://www.linkedin.com/in/daniel-suissa-a1a230294/)

Project Link: [github](https://github.com/danielsuissa/danielsuissa.github.io)

---
Made with ❤️ for the bingo community
