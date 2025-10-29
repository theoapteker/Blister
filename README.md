# 🚀 Blister Launchpad

**The 14-Day Digital Onboarding Experience for Gen Z hires**

Blister Launchpad is a modern, interactive onboarding platform designed to help new hires feel confident, connected, and productive from day one. Built with React and featuring a beautiful, mobile-first design.

## ✨ Features

### 🎯 Three-Phase Journey
- **Days 1-3: Confidence Phase** - "What am I supposed to do?"
- **Days 4-8: Connection Phase** - "Who are my people?"
- **Days 9-14: Productivity Phase** - "How do I contribute?"

### 📱 Core Features
- **Personalized Dashboard** - AI-tailored experience by role and team
- **Daily 10-Minute Microbursts** - Bite-sized learning content
- **Buddy Portal** - Peer mentor matching and chat system
- **Gamified Progress Tracker** - Visual "Orbit Map" showing journey progress
- **Launch Report Generator** - Comprehensive 14-day summary

### 🎮 Gen Z Optimized
- **Clarity** - Clear goals and next steps
- **Connection** - Social belonging and peer mentorship
- **Instant Feedback** - Daily progress updates and quick wins
- **Digital First** - Mobile-responsive, visual content over text

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open in Browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Dashboard.js          # Main dashboard with tasks and progress
│   ├── Navigation.js         # Top navigation with phase indicators
│   ├── OrbitMap.js          # Gamified progress tracker
│   ├── BuddyPortal.js       # Peer mentor matching and chat
│   └── LaunchReport.js      # 14-day summary report
├── context/
│   └── UserContext.js       # Global state management
└── App.js                   # Main application component
```

## 🎨 Design System

### Color Palette
- **Primary**: `#667eea` (Confidence Blue)
- **Secondary**: `#f093fb` (Connection Pink)
- **Accent**: `#4facfe` (Productivity Cyan)
- **Success**: `#00d4aa` (Achievement Green)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

### Components
- **Cards**: Rounded corners (12-20px), subtle shadows
- **Buttons**: Gradient backgrounds, hover animations
- **Progress**: Animated bars and circular indicators
- **Icons**: Lucide React icon library

## 🔧 Customization

### User Data
Edit `src/context/UserContext.js` to customize:
- User profile information
- Available tasks and milestones
- Buddy matching criteria
- Achievement definitions

### Styling
All component styles are in individual `.css` files:
- `src/components/Dashboard.css`
- `src/components/Navigation.css`
- `src/components/OrbitMap.css`
- `src/components/BuddyPortal.css`
- `src/components/LaunchReport.css`

## 📱 Mobile Responsive

The application is built mobile-first with responsive breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎯 Key User Flows

### Day 1 - "Welcome to Orbit"
1. Watch CEO welcome video
2. Complete account setup checklist
3. Get auto-matched with a buddy

### Day 3 - "Meet Your Tools"
1. Interactive tool walkthroughs
2. Complete first milestone
3. Earn first badge

### Day 7 - "Culture in Action"
1. 15-minute peer chat
2. Share ideas on #Launchpad channel
3. Build team connections

### Day 14 - "Lift-Off"
1. Generate comprehensive launch report
2. Receive manager recognition
3. Earn completion badge

## 🛠️ Technologies Used

- **React 18** - UI framework
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **CSS3** - Styling with custom properties
- **Context API** - State management

## 📈 Future Enhancements

- [ ] Real-time chat functionality
- [ ] Video call integration
- [ ] PDF report generation
- [ ] Analytics dashboard
- [ ] Admin panel for HR
- [ ] Mobile app version
- [ ] Integration with HR systems

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for the next generation of workplace onboarding**
