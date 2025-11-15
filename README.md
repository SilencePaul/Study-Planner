# Study Planner App
Final Report (README.md)

---

## 1. Team Information

| Name | Student Number | 
|------|----------------|
| BINBIN WANG | 1011770460 | 
| Yiming Liu  | 1011337402 | 
| Yalin Tuo | 1006033196 | 

## 2. Motivation

Students frequently struggle to manage daily study sessions, keep track of task progress, and organize upcoming assignment deadlines. Traditional calendar or note-taking apps lack features such as integrated study timers, task-based progress tracking, reminder intervals, or meaningful productivity feedback. 

We wanted to build a lightweight and academically-focused productivity application that supports better habits, improves consistency, and fits naturally into a student’s workflow. This motivation stems from our own challenges balancing university coursework, deadlines, and study routines.

---

## 3. Objectives

### Functional Objectives
- Allow users to create, view, and manage daily study sessions.
- Provide a built-in study timer with start, pause, and reset controls.
- Support task management, including creation, completion toggling, linking to assignments, and deletion.
- Enable assignment creation with due dates and automatic progress calculation.
- Provide optional periodic study reminders.
- Offer motivational features like badges, study tips, and break suggestions.
- Ensure all data persists reliably across app restarts.

### Technical Objectives
- Implement the app using React Native, Expo, and TypeScript.
- Use Expo Router for file-based navigation.
- Use Context API + useReducer for global state management.
- Persist state through AsyncStorage.
- Implement a theme system with light, dark, and auto modes.
- Integrate expo-notifications for user reminders.

---

## 4. Technical Stack

### Core Technologies
- React Native  
- Expo SDK 50  
- TypeScript  

### Navigation
- Expo Router (file-based routing)

### State Management
- Context API + useReducer  
- Reducer stored in `features/reducer.ts`

### Storage
- Custom AsyncStorage wrapper in `services/storage.ts`

### Themes
- ThemeProvider implemented in `theme/context.tsx`
- Light, dark, and auto (system-based) modes

### Notifications
- expo-notifications  
- Permission checking  
- Interval-based study reminders  

### Supporting Libraries
- @react-native-community/datetimepicker  
- expo-status-bar  
- expo-router  



my-app/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── +not-found.tsx
│   ├── context.tsx
│   ├── assignments/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── [id].tsx
│   │   └── new.tsx
│   ├── Detail/
│   │   └── [id].tsx
│   ├── session/
│   │   └── add.tsx
│   └── settings/
│       └── index.tsx
├── assets/
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   ├── notification-icon.png
│   ├── splash-icon.png
│   └── splash.png
├── components/
│   ├── Badge.tsx
│   └── ProgressBar.tsx
├── constants/
│   └── index.tsx
├── features/
│   └── reducer.ts
├── services/
│   ├── api.ts
│   ├── notifications.ts
│   └── storage.ts
├── theme/
│   ├── context.tsx
│   └── index.ts
├── types/
│   └── index.tsx
├── utils/
│   └── index.ts
├── App.tsx
├── app.json
├── index.ts
├── package.json
├── package-lock.json
└── tsconfig.json


npx expo start 
