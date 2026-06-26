# blog.substitute.tech

Personal tech blog built with [Hugo](https://gohugo.io/) + [PaperMod](https://github.com/adityatelange/hugo-PaperMod).

## Quick Start

```bash
# Install Hugo (macOS)
brew install hugo

# Clone with submodules
git clone --recurse-submodules https://github.com/haoxiqiang/haoxiqiang.github.io.git
cd haoxiqiang.github.io

# Run dev server
hugo server -D

# Create a new post
hugo new content posts/my-new-post.md
```

## Project Structure

```
.
├── archetypes/          # Post templates
├── content/
│   ├── posts/           # Blog posts (*.md = Chinese, *.en.md = English)
│   ├── about.md         # About page
│   ├── archives.md      # Archives page
│   └── search.md        # Search page
├── docs/                # Project documentation
├── static/              # Static assets (images, favicons)
├── themes/PaperMod/     # Theme (git submodule)
├── hugo.yaml            # Site configuration
└── CNAME                # Custom domain
```

## Multilingual

- Chinese (default): `content/posts/my-post.md`
- English: `content/posts/my-post.en.md`

## Deployment

Automatically deployed to GitHub Pages via GitHub Actions on push to `master`.

## License

Content © haoxiqiang. Theme: MIT.
