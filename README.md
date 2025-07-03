# 🥑 Antical AI - Smart Meal Tracker & Grader

> An AI-powered meal tracking app that analyzes your food choices and gives you personalized nutrition grades and tips!

## 🎯 What is this?

Antical AI is a React Native app that helps you track your meals and get instant AI-powered nutrition analysis. Just tell it what you ate, and it'll give you a grade from A-F plus actionable tips to improve your nutrition game!

## ✨ Cool Features

-   🤖 **AI Meal Analysis** - Describe your meal and get instant nutrition grading
-   📸 **Smart Food Recognition** - Describe meals in natural language
-   📊 **Nutrition Insights** - Get detailed breakdowns of calories, protein, fiber, and more
-   📈 **Progress History** - See how your eating habits improve over time
-   💡 **Smart Tips** - Get personalized suggestions to upgrade your meal grades
-   🔄 **Real-time Sync** - All your data syncs across devices instantly
-   🔐 **Social Auth** - Easy login with Google, Apple, or email

## 🎥 Demo Videos

Want to see it in action? Check out our demo videos: [App_Demos](https://drive.google.com/drive/folders/1sYoWRFgJvZaqxDOUSIuAui0w1YA_n9x0?usp=share_link)  

## 🛠️ Tech Stack

-   **Frontend**: React Native + Expo
-   **Backend**: Supabase (Database + Auth + Realtime)
-   **Styling**: Tailwind CSS + NativeWind
-   **State Management**: React Query + Context API
-   **AI Integration**: Custom meal parsing and analysis engines\*
-   **Navigation**: Expo Router

\*Note: The core AI logic and sensitive algorithms are kept in private modules for security reasons.

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

-   Node.js (v18 or higher)
-   npm or yarn
-   Expo CLI (`npm install -g expo-cli`)
-   iOS Simulator (for Mac) or Android Studio

### Installation

1. **Clone the repo**

    ```bash
    git clone https://github.com/jay-kalaria/antical-ai-app
    cd antical_app
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    ```bash
    # Create a .env file and add your Supabase credentials
    cp .env.example .env
    ```

    You'll need:

    - Supabase URL
    - Supabase Anon Key
    - Any other API keys for the AI services

4. **Start the development server**

    ```bash
    npx expo start
    ```

5. **Run on your device**
    - Press `i` for iOS simulator
    - Press `a` for Android emulator
    - Scan the QR code with Expo Go app on your phone

## 📱 App Structure

```
antical_app/
├── app/                    # Main app screens (Expo Router)
├── components/             # Reusable UI components
├── contexts/               # React contexts for state management
├── hooks/                  # Custom React hooks
├── services/               # API services and external integrations
├── utils/                  # Helper functions and utilities
├── constants/              # App constants and theme
└── antical-private-core/   # 🔒 Private AI logic (hidden for security)
```

## 🔒 Privacy & Security

The core AI algorithms, meal parsing logic, and sensitive business rules are kept in private modules (`antical-private-core/`) to protect our intellectual property and maintain security. They are available upon request.

## 🎨 Key Features Explained

### Meal Grading System

-   **A Grade**: Excellent nutrition choices! 🌟
-   **B Grade**: Pretty good, minor improvements possible
-   **C Grade**: Average meal, room for improvement
-   **D Grade**: Below average, consider healthier options
-   **E Grade**: Poor nutrition choices, needs attention

### Smart Tips

The app doesn't just grade your meals - it gives you actionable tips to improve! For example:

-   "Add some leafy greens to boost fiber"
-   "Try swapping white rice for brown rice"
-   "Consider reducing portion size"

### Real-time Sync

All your meal data syncs in real-time across devices using Supabase's real-time features.

## 🧩 Contributing

Want to help make Antical AI even better? Here's how:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 🐛 Found a Bug?

If something's not working right:

1. Check if it's already reported in [Issues](https://github.com/jay-kalaria/antical-ai-app/issues)
2. If not, create a new issue with:
    - Steps to reproduce
    - What you expected to happen
    - What actually happened
    - Screenshots if helpful

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

Need help? Got questions?

-   📧 Email: [jaykalaria.kontakt@gmail.com]

## 🙏 Acknowledgments

-   Thanks to the Expo team for making React Native development awesome
-   Supabase for the amazing backend-as-a-service
-   All the open-source libraries that make this possible
-   Our beta testers who helped make this app better!

---

Made with ❤️ and lots of ☕ by Jay Kalaria.

_P.S. - This app is still evolving! We're constantly adding new features and improvements. Stay tuned! 🚀_
