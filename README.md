# Study Planner App
Final Report (README.md)

---

## 1. Team Information

|Member | Name | Student Number | Email |
|------|------|----------------|----------------|
|1| BINBIN WANG | 1011770460 | binb.wang@mail.utoronto.ca|
|2| Yiming Liu  | 1011337402 | yimingpaul.liu@mail.utoronto.ca|
|3| Yalin Tuo | 1006033196 | yalin.tuo@mail.utoronto.ca|

## 2. Motivation
During the university lives, students are struggling to manage their studying activities, including keeping track of task progress and organizing upcoming assignment deadlines. Traditional calendars or note-taking apps are more like writing down deadline on the paper and do not have features such as integrated study timers, task-based progress tracking, reminder intervals, or meaningful productivity feedback. 

We set out to build a lightweight, academically focused productivity application that helps students reach their academic milestones smoothly and with enthusiasm. Our motivation comes from our own challenges in balancing university coursework, deadlines, and study routines.

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

## 5. Features

### 5.1 Study Sessions
- Create daily study sessions with subject, duration, and optional notes.
- Built-in study timer with **Start**, **Pause**, and **Reset**.
- Automatic duration updates based on timer seconds.
- Break suggestions triggered after long study periods.
- Add tasks within a study session.
- Toggle task completion status.
- Delete tasks directly from the detail view.
- Link tasks to related assignments for automatic progress calculation.
- Visual badges (Gold, Silver, Incomplete) showing completion status.
- Select study reminder interval (None, 5, 15, 30 minutes).
- Display dynamic study tips fetched from a public API.

### 5.2 Tasks
Each task includes:
- A task name  
- Goal type: **full goal** or **partial goal**  
- Optional description  
- Optional assignment linkage  

Task logic:
- Full-goal tasks contribute **100%** progress to the linked assignment.
- Partial-goal tasks contribute **30%** each, up to a **maximum of 90%** if no full goal task is completed.

### 5.3 Assignments
- Create new assignments with name and due date.
- Edit existing assignments with updated details.
- Delete assignments from the list.
- Assignments are automatically sorted by closest due date.
- Color-coded urgency levels:
  - **Overdue**
  - **Due soon**
  - **Normal**
  - **Completed**
- Progress automatically calculated from linked tasks.
- Progress displayed using an **animated progress bar component**.

### 5.4 Themes
- Support for **Light** mode.
- Support for **Dark** mode.
- **Auto** mode follows system appearance.
- Entire UI responds dynamically to theme changes through a global ThemeContext.

### 5.5 Notifications
- Local study reminders sent based on selected reminder interval.
- Full permission checking and user prompts on startup.
- Debug mode to log and inspect scheduled notifications.
- All notifications handled using **Expo Notifications** API.

### 5.6 Persistent Storage
All user data persists across app restarts, including:
- Study sessions  
- Tasks  
- Assignments  
- Active timers  
- Notification settings  
- Theme preferences  
- Reminder interval settings  

Persistence is implemented using a custom AsyncStorage wrapper for reliability and modular code structure.

### 5.7 Advanced Features

#### 5.7.1 Gamification with Badges for Study Milestones
- A badge system visually rewards study performance.
- Badge levels:
  - **Gold** – complete study objective  
  - **Silver** – partially completed  
  - **Incomplete** – minimal or no progress  
- Encourages user engagement and consistency.
- Implemented as a reusable TypeScript component (`Badge.tsx`).
- Displayed on both Home and Detail screens.

#### 5.7.2 Custom Animations for Progress Tracking
- Smooth animated transitions for assignment progress.
- Implemented using React Native’s `Animated` API.
- Animation features:
  - `Animated.Value` for progress state
  - `Animated.timing` for smooth interpolation
- Created in reusable `ProgressBar.tsx` component with TypeScript-typed props.
- Enhances user experience with polished, responsive UI feedback.

---

## 6. User Guide

### 6.1 Home Screen
- Displays all study sessions for the user.
- “Create New Study Record” generates a session for the current day.
- Sessions show date, duration (from timers), and a completion badge.
- Tapping a session opens its detail page.
- Navigation options:
  - Manage Assignments
  - Settings

### 6.2 Study Session Detail
- Main timer with Start, Pause, and Reset buttons.
- Timer increments global state every second when running.
- Break suggestions appear after long study durations.
- Tasks section:
  - Add new tasks
  - Toggle task completion
  - Delete tasks
  - Linked assignment indicators
- Reminder interval selection dropdown.
- Study tip section displays helpful suggestions.

### 6.3 Assignment List
- Shows all assignments sorted by due date.
- Each assignment displays:
  - Name
  - Due date
  - Color-coded urgency status
  - Progress percentage
- Animated progress bar shows assignment completion visually.
- Delete button removes an assignment.
- Button to add new assignment.

### 6.4 Add Assignment
- Fields:
  - Assignment name
  - Due date (via date picker)
- Validation ensures name is not empty.
- Saves assignment and returns to assignment list.

### 6.5 Settings
- Toggle study reminder notifications.
- Switch between Light, Dark, and Auto appearance modes.
- Notification permission requests are triggered when needed.
- Theme changes immediately update the appearance of the entire app.

## 7. Development Guide

### 7.1 Requirements
To run and develop the Study Planner App, the following tools are required:

- Node.js (LTS recommended)
- npm (comes with Node.js)
- Expo CLI (`npm install -g expo-cli`)
- Git
- Expo Go (for physical device testing)
- Optional:
  - Android Studio (for Android Emulator)
  - Xcode (for iOS Simulator on macOS)

---

### 7.2 Installation
Clone the repository and install dependencies:
```bash
git clone <your-repo-url>
cd study-planner
npm install --legacy-peer-deps
```
### 7.3 Running the App

Start the development server:
```bash
npm expo start
```
Open the app:

- Press i to launch the iOS simulator, or

- Scan the QR code using Expo Go on a physical device.
All core technical requirements (navigation, state management, AsyncStorage persistence, study reminders with Expo Notifications, and API integration) run entirely in this local environment, as required by the course.


### 7.4 Project Structure Overview
```text
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
```
## 8. Deployment Information

There are several ways to deploy or distribute the Study Planner App.

### 8.1 Expo Build Link (Recommended)
Publish the app using Expo and include the public link:

```css
https://expo.dev/@your-username/study-planner
```

This allows instructors to open the app directly in Expo Go.

### 8.2 Android APK (EAS Build)
To generate an Android APK:

```bash
eas build --platform android
```
After the build completes, provide the download link to the APK file.

### 8.3 iOS IPA (EAS Build)
To generate an iOS archive:
```bash
eas build --platform ios
```

Provide the generated IPA or TestFlight link.

### 8.4 Local Execution Option
If needed, reviewers can run the app locally:

```bash
npm install
npx expo start
```


They can launch the app through a simulator or Expo Go on a physical device.


## 9. Individual Contributions

### Member 1 BINBIN WANG
- Implemented the Home screen interface and logic.
- Developed the study timer system (start, pause, reset).
- Implemented the reminder interval logic and local notification triggers.
- Added break suggestion logic and study tips integration.

### Member 2 Yiming Liu 
- Developed the Assignment module (list, create, edit, delete).
- Designed and implemented assignment progress calculation.
- Built reusable UI components: ProgressBar and Badge.
- Implemented due date color coding and sorting behavior.

### Member 3 Yalin Tuo 
- Designed global state architecture using Context API + useReducer.
- Implemented persistent storage with AsyncStorage wrapper.
- Built the theme system (light, dark, auto modes).
- Integrated screens with global state and routing.
- Performed debugging and device testing.


## 10. Lessons Learned and Concluding Remarks

Throughout this project, our team gained experiences in building mobile applications with React Native and Expo. Followings are the aspects we have learnt:
- Organize and manage global state using the Context API  with useReducer.
- Structure navigation in a clean, scalable way with Expo Router.
- Store data reliably through AsyncStorage, supported by a custom wrapper that we built.
- Handle asynchronous features like timers, reminders, and notifications.
- Work through permission handling and subtle differences between mobile platforms.

The Study Planner App has successfully meet the motivation at the start. It not only offer students a reminder of their course work, but also make study an interesting and enjoyable parts of lives.  Through the process, we have developed experiences in mobile UI/UX design, state management, asynchronous programming, and collaborative development. 
## Video Demo
(link should be here)

