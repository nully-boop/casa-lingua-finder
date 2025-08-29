# Casa Lingua Finder

Casa Lingua Finder is a comprehensive real estate platform designed to help users find properties across different languages and regions. The application provides a seamless experience for property buyers, renters, and sellers with advanced AI assistance, multilingual support, and a modern user interface.

## 🏠 Overview

Casa Lingua Finder is a full-featured real estate platform that connects property seekers with listings across different regions and languages. Built with React, TypeScript, and Tailwind CSS, it offers responsive design, AI-powered assistance, and comprehensive property management tools.

## ✨ Core Features

### 🤖 AI-Powered Features
- **Live Voice Chat with AI**: Real-time voice conversations about properties using Google Gemini AI
- **Property AI Chat**: Dedicated AI assistant for each property with contextual information
- **Global AI Chat Drawer**: Universal AI assistant accessible from anywhere in the app
- **AI Property Analysis**: Intelligent property suggestions and recommendations
- **Office AI Suggestions**: AI-powered insights for real estate offices

### 🏡 Property Management
- **Property Listings**: Browse, search, and filter properties with advanced criteria
- **Property Details**: Comprehensive property information with image galleries
- **Property Creation**: Multi-step property creation process for sellers
- **Property Status Management**: Track property status (active, inactive, pending)
- **Featured Properties**: Highlighted property listings on the homepage
- **Related Properties**: Smart property recommendations based on current viewing

### 🔍 Advanced Search & Filtering
- **Smart Search Bar**: Intelligent property search with auto-suggestions
- **Location-Based Filtering**: Filter by specific locations and regions
- **Property Type Filters**: Filter by apartment, house, commercial, etc.
- **Ad Type Filtering**: Separate views for sale and rental properties
- **Price Range Filters**: Customizable price range selection
- **Sort Options**: Sort by newest, price, popularity, etc.

### 🗺️ Maps & Location
- **Interactive Property Maps**: View property locations on interactive maps
- **Map Route Planning**: Get directions to properties
- **Location-Based Search**: Find properties in specific areas

### 👥 User Management
- **User Authentication**: Secure login and registration system
- **User Profiles**: Comprehensive user profile management
- **Profile Setup**: Multi-step profile creation for sellers
- **Avatar Management**: User avatar upload and display
- **Settings Management**: Customize user preferences

### 🏢 Office & Admin Features
- **Office Dashboard**: Comprehensive dashboard for real estate offices
- **Office Profile Management**: Create and manage office profiles
- **Office Followers**: Track and manage office followers
- **Office Property Management**: Manage office property listings
- **Office Requests**: Handle property viewing and inquiry requests
- **Admin Panel**: Full administrative control panel
- **Manage Offices**: Admin interface for office management
- **Manage Properties**: Admin property oversight tools
- **Subscription Management**: Handle office subscription plans

### 💰 Financial Features
- **Multi-Currency Support**: Support for multiple currencies with real-time conversion
- **Currency Context**: Dynamic currency switching throughout the app
- **Price Formatting**: Intelligent price display based on selected currency
- **Subscription Plans**: Tiered subscription system for offices

### 🌐 Internationalization
- **Multilingual Support**: Full support for multiple languages
- **RTL Language Support**: Complete right-to-left language compatibility
- **Language Context**: Dynamic language switching
- **Localized Content**: Region-specific content and formatting

### 🎨 UI/UX Features
- **Dark/Light Mode**: Complete theme customization with system detection
- **Responsive Design**: Optimized for all device sizes (mobile, tablet, desktop)
- **Modern UI Components**: Beautiful, accessible UI components using shadcn/ui
- **Toast Notifications**: User-friendly notifications and feedback
- **Loading States**: Elegant loading indicators throughout the app
- **Error Handling**: Comprehensive error states and retry mechanisms

### 📱 Interactive Features
- **Favorites System**: Save and manage favorite properties
- **Property Sharing**: Share properties with social sharing capabilities
- **Image Galleries**: Beautiful property image viewing experience
- **Property Comparison**: Compare multiple properties side by side

## 📄 Pages & Navigation

### Public Pages
- **Homepage** (`/`): Hero section, featured properties, search form, and company information
- **Properties** (`/properties`): Main property listing page with advanced filtering
- **Property Details** (`/property/:id`): Detailed property information with AI chat
- **Voice Chat** (`/voice-chat`): Traditional voice chat interface
- **Live Voice Chat** (`/live-voice-chat`): Real-time AI voice conversation

### Authentication
- **Login** (`/login`): User authentication page
- **Register** (`/register`): User registration page

### User Dashboard
- **Profile** (`/profile`): User profile management
- **Settings** (`/settings`): User preferences and account settings
- **Favorites** (`/favorites`): Saved favorite properties

### Office Management
- **Office Dashboard** (`/office/dashboard`): Main office control panel
- **Office Profile** (`/office/profile`): Office profile management
- **Office Properties** (`/office/properties`): Manage office property listings
- **Create Property** (`/office/create-property`): Multi-step property creation
- **Office Requests** (`/office/requests`): Handle property inquiries
- **Office Followers** (`/office/followers`): Manage office followers
- **Seller Profile Setup** (`/office/seller-setup`): Seller onboarding
- **Subscriptions** (`/office/subscriptions`): Manage office subscriptions
- **Owner Panel** (`/office/owner`): Owner-specific management tools

### Admin Panel
- **Admin Dashboard** (`/admin`): Main administrative interface
- **Manage Offices** (`/admin/offices`): Office administration
- **Manage Properties** (`/admin/properties`): Property administration
- **Manage Subscriptions** (`/admin/subscriptions`): Subscription administration

## 🛠️ Technical Features

### Frontend Architecture
- **React 18**: Modern React with hooks and context API
- **TypeScript**: Full type safety and developer experience
- **Vite**: Fast development and optimized builds
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **React Router**: Client-side routing with protected routes
- **React Query**: Efficient data fetching and caching
- **Framer Motion**: Smooth animations and transitions

### State Management
- **Context API**: Global state management for theme, language, and currency
- **React Query**: Server state management and caching
- **Custom Hooks**: Reusable logic for AI suggestions and property management

### AI Integration
- **Google Gemini AI**: Advanced AI capabilities for chat and analysis
- **Real-time Voice**: Live voice conversation with AI
- **Context-Aware Responses**: AI responses based on property and user context

### Development Tools
- **ESLint**: Code linting and quality enforcement
- **TypeScript**: Static type checking
- **Custom TypeScript Interfaces**: Comprehensive type definitions

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm, yarn, or bun package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/casa-lingua-finder.git
cd casa-lingua-finder
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
bun install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🔧 Project Structure

```
casa-lingua-finder/
├── public/                 # Static assets
├── src/                    # Source code
│   ├── components/         # UI components
│   │   ├── auth/           # Authentication components
│   │   ├── buttons/        # Button components
│   │   ├── home/           # Home page components
│   │   ├── office/         # Office management components
│   │   ├── profile/        # Profile components
│   │   ├── properties/     # Property-related components
│   │   ├── property/       # Property creation steps
│   │   ├── settings/       # Settings components
│   │   ├── admin/          # Admin panel components
│   │   └── ui/             # Reusable UI components (shadcn/ui)
│   ├── contexts/           # React contexts (Theme, Language, Currency)
│   ├── hooks/              # Custom React hooks
│   ├── interfaces/         # TypeScript interfaces
│   ├── pages/              # Page components
│   │   ├── AI/             # AI-related pages
│   │   ├── Auth/           # Authentication pages
│   │   ├── Property/       # Property pages
│   │   ├── admin/          # Admin pages
│   │   ├── office/         # Office management pages
│   │   └── user/           # User dashboard pages
│   ├── services/           # API services and integrations
│   ├── utils/              # Utility functions
│   └── func/               # Business logic functions
├── App.tsx                 # Main application component
├── index.css               # Global styles and design system
└── main.tsx                # Application entry point
```

## 🎨 Design System

The application uses a comprehensive design system built with Tailwind CSS:

- **Semantic Color Tokens**: HSL-based color system for consistent theming
- **Typography Scale**: Consistent font sizes and weights
- **Spacing System**: Standardized spacing and sizing
- **Component Variants**: Reusable component variations
- **Dark/Light Themes**: Complete theme support with automatic detection

## 🔮 Future Roadmap

### Enhanced AI Features
- **Voice Commands**: Voice-controlled property search
- **Image Recognition**: AI-powered property image analysis
- **Smart Recommendations**: Machine learning-based property suggestions
- **Virtual Property Tours**: AI-guided virtual property tours

### Advanced Features
- **Mortgage Calculator**: Integrated loan calculation tools
- **Market Analytics**: Real estate market insights and trends
- **Appointment Scheduling**: Automated property viewing scheduling
- **Document Management**: Digital contract and document handling
- **Integration APIs**: Connect with external real estate services

### Mobile & Performance
- **Progressive Web App**: Offline capabilities and app-like experience
- **Native Mobile Apps**: iOS and Android applications
- **Performance Optimization**: Advanced caching and loading strategies
- **Accessibility Enhancements**: WCAG compliance and screen reader support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For any questions or suggestions, please open an issue on GitHub or contact the project maintainers.

---

Built with ❤️ by the Casa Lingua Finder Team