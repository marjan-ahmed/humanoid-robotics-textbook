# Quickstart: Physical AI & Humanoid Robotics Book Frontend

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git (optional, for version control)

## Setup Process

### 1. Clone or Create Project
```bash
# If starting fresh
mkdir book_source
cd book_source
npm init -y
```

### 2. Install Docusaurus
```bash
npm install @docusaurus/core@latest @docusaurus/preset-classic@latest
```

### 3. Install Additional Dependencies
```bash
npm install @docusaurus/module-type-aliases@latest
npm install typescript @docusaurus/tsconfig @docusaurus/types
```

### 4. Initialize Docusaurus Structure
```bash
npx create-docusaurus@latest . classic --typescript
```

### 5. Configure Docusaurus
Update `docusaurus.config.js` with course-specific settings:
```javascript
// docusaurus.config.js
module.exports = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'Bridging the gap between the digital brain and the physical body',
  favicon: 'img/favicon.ico',

  url: 'https://your-book-url.com',
  baseUrl: '/',

  organizationName: 'your-org',
  projectName: 'humanoid-robotics-book',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/your-org/humanoid-robotics-book',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Physical AI & Humanoid Robotics',
      logo: {
        alt: 'Physical AI Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Book',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/your-org/humanoid-robotics-book',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Book',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/your-org/humanoid-robotics-book',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI & Humanoid Robotics Book. Built with Docusaurus.`,
    },
  },
};
```

### 6. Create Content Structure
Create the directory structure for all 6 chapters with 3-5 submodules each:
```bash
# In the book_source directory
mkdir -p docs/chapter-1 docs/chapter-2 docs/chapter-3 docs/chapter-4 docs/chapter-5 docs/chapter-6

# Create index files for each chapter
touch docs/chapter-1/index.md docs/chapter-2/index.md docs/chapter-3/index.md docs/chapter-4/index.md docs/chapter-5/index.md docs/chapter-6/index.md
```

### 7. Update Sidebar Configuration
Update `sidebars.js` to include all chapters and submodules:
```javascript
// sidebars.js
module.exports = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Chapter 1: Physical AI Foundations',
      items: ['chapter-1/index', 'chapter-1/submodule-1', 'chapter-1/submodule-2', 'chapter-1/submodule-3'],
    },
    {
      type: 'category',
      label: 'Chapter 2: ROS 2 Fundamentals',
      items: ['chapter-2/index', 'chapter-2/submodule-1', 'chapter-2/submodule-2', 'chapter-2/submodule-3'],
    },
    // ... continue for all chapters
  ],
};
```

### 8. Run the Development Server
```bash
npm start
```

## Verification Steps
1. Verify the homepage displays course information correctly
2. Confirm all 6 chapters are accessible through navigation
3. Test that all submodules load without errors
4. Check responsive behavior on different screen sizes
5. Verify all links work correctly