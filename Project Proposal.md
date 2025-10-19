## ECE1778 Project Proposal

---

#### Team Members
- BINBIN WANG (1011770460)
- Yiming Liu (1011337402)
- Yalin Tuo (1006033196)
  
---

### 1. Motivation
#### 1.1 The Problem
Many students have difficulty planning their study time. Some of them are easily forget what they are supposed to do, while others study for long periods without taking breaks. Some start late and rush before exams. Also, notes are easily lost, and phone reminders are often ignored. This shows without a simple plan, studying feels stressfully and unorganized. To stay focused and manage time well, students need a study app that makes learning easier and calmer. 



#### 1.2 Why It Is Worth Pursuing
A study tool can make studying easier and more focused. When students see their progress, they feel proud. A good schedule saves time and keeps the mind calm. This app helps users build simple habits. It also gives reminders to study and rest. Its user-friendly design supports balance between work and breaks.



#### 1.3 Target Users
The main users are students in high school or university. They have many assignments, tests, and projects. Some of them want better time control and daily motivation. This app helps them for self-learners and online students. People can use it without training. 



#### 1.4 Existing Solution and Limitation
Many students use tools like Notion or Google Calendar. These help organize schedules but not track study habits. They have too many options and make people feel heavy. Also, some app show ads or need internet all the time. Our app is simple and clean. It keeps planning, reminders, and rewards in one place. It works offline and focused only on study.

---

### 2. Objective and Key Features

#### 2.1 Objective
The goal of this project is to build a Study Planner App that helps students plan, track, and enjoy learning. This app gives a clear and simple way to organize study life. It is made to keep users focused, clam, and motivatied during study time.

The app will have five screens. The Home Screen shows daily records with medals for completed goals.
On the Detail Screen, users can see a timer, study tips, and a list of tasks. The Add Section Screen lets them create or edit a study task. The Manage Assignnment Screen lists assignments with progress bars to show how much is done. On the Settings Page, users can changed reminders and choose light or dark mode.

All data will be saved with AsyncStorage, and changes will be managed by useReducer. Expo Notifications will send alert to users to study or rest. Assignement alert will appear three dasy before the due date. And a public API will bring study quotes to make users feel encouraged. 

Three advanced parts will make it better. 
First, Badges reward users when they finishing daily goals (Gamification). 
Second, Pedomerter reminders tell them to take breaks after long sessions (Sensors). 
Third, Animated bars will shows how much work is done.

These small motions make the app feel lively and fun. The project will use React Native and Expo to build each parts. Expo EAS Build allows the app to work well on both Android and iOS platforms. It loads fast, feels simple, and can be finished in a short time. The clean layout makes it friendly and comfortable for all students.


#### 2.2. Navigation Structure

##### 2.2.1. Screens Design

**Home Screen (Study Records List)**
- **Header:** Displays “Study Planner”
- **Study Record List (FlatList):**
  - Shows: Date, Study Duration (minutes), and action button (“…” → Edit / Delete)
  - **Completion Badge (Gamification):**
    - 🟢 Gold Medal → All tasks completed  
    - 🟡 Silver Medal → Partially completed  
    - 🔴 ❌ → Incomplete
  - Clicking a record navigates to the **Detail Screen**
- **Buttons / Actions:**
  - “Create New Study Record” → Adds an empty record
  - “Manage Assignments” → Opens Manage Assignments page
  - “Settings” → Opens Settings page

**Detail Screen**
- **Advanced Features:**  
  - Study reminders via **Expo Notifications** (based on assignment due dates)  
  - Break suggestions via **Expo Pedometer**
- **Timer Section:** Shows total focus time (e.g., `00:42:15`)
- **Date Section:** Displays today’s date
- **Task List (FlatList):** Lists tasks with name, goal, and completion status
- **Study Tip Section:** Fetches random study tips from a public API
- **Reminder Interval:** Dropdown for reminder frequency (None / 25 / 45 / 60 min)
- **Actions:**
  - “Return” → Back to Home
  - “Add Today Task” → Navigate to Add Session page

**Add Session Screen**
- **Task Source:** Choose from Assignment List or create a custom task manually
- **Completion Goal:** 🟢 Full / 🟡 Partial
- **Description:** Optional text input for task notes
- **Buttons / Actions:**
  - ✅ Save → Save session
  - ❌ Cancel → Return without saving

**Manage Assignments Screen**
- **Assignment List (FlatList):**
  - Sorted by due date
  - Each item shows: Assignment name, due date, progress bar (%), and delete button
  - **Advanced:** Custom animated progress bar for completion tracking
- **Add Assignment Form:**
  - Inputs: Assignment name, due date
- **Buttons:**
  - ✅ Save
  - ❌ Cancel

**Settings Page**
- **Notification Settings:** Toggle to enable/disable study reminders
- **Appearance Settings:** Light / Dark / Auto theme mode


##### 2.2.2. File-Based Routes (Expo Router)
The following file structure ensures modularity and maintainability across the app:
```
app/
├── _layout.tsx # Root layout (global Stack + providers)
├── _index.tsx # Home screen (study overview)
│
├── Detail/
│ ├── _layout.tsx # Layout for detail-related screens
│ └── _index.tsx # Today’s plan (timer, tasks, tips)
│ └── [id].tsx # Edit detail session
│
├── session/
│ ├── _layout.tsx
│ └── add.tsx # Add session page
│
├── assignments/
│ ├── _layout.tsx
│ ├── _index.tsx # Manage assignments
│ └── new.tsx # Add new assignment
│ └── [id].tsx # Edit assignment
│
├── settings/
│ └── _index.tsx # Settings (notifications, pedometer opt-in)
│
├── modals/
│ ├── reminder-permission.tsx
│ └── pedometer-optin.tsx
│
├── components/ # Shared UI components (Button, Card)
├── features/ # Domain logic (sessions, assignments)
├── services/ # APIs (notifications, storage)
├── theme/ # Colors, spacing, typography
├── utils/ # Helpers (formatDate, sortByDueDate)
├── types/ # Global TS types
└── constants/ # Route names, default timer, etc.
```


#### 2.3. State Management and Persistence
- **State Management (useReducer):**  
  Handles actions such as `ADD_SESSION`, `UPDATE_DURATION`, and `TOGGLE_TASK_COMPLETE` for predictable, centralized state updates.
- **Persistence (Async Storage):**  
  Stores all session and task data as JSON (`@studyPlanner:sessions`), allowing offline access.
- **Data Flow:**  
  `User Action → Dispatch → Reducer Update → AsyncStorage Save → Rehydrate on Launch`
- **TypeScript Typing:**  
  Interfaces (`ActionType`, `AppState`) ensure type-safe data management and reducer actions.



#### 2.4. Notifications
- **Study Reminders:** Triggered during active study sessions based on chosen interval (25/45/60 minutes).  
- **Assignment Reminders:** Local alerts appear three days before due dates.  
Both use **Expo Notifications API** for local scheduling.



#### 2.5. Backend Integration
- **Phase 0:** Offline-first model — all data stored on-device with AsyncStorage.  
- **Phase 1 (Optional):** Add optional cloud sync for account-based data restoration and multi-device access.



#### 2.6. Deployment Plan (Expo EAS Build)
- Deployed through **Expo EAS Build** for both Android and iOS.  
- Tested on physical devices via **Expo Go**.  
- Generates `.apk` and `.ipa` files for app stores or direct distribution.



#### 2.7. Advanced Features
- **Gamification:** Medal-based feedback (Gold, Silver, Red ❌) for completion levels.  
- **Pedometer Integration:** Uses **Expo Pedometer** to recommend breaks after long study sessions.  
- **Animated Progress Bars:** Smooth progress animations to visualize study or assignment completion.



#### 2.8. Fulfillment of Course Project Requirements
- **Components & Navigation:** Modular React Native structure with nested Expo Router layouts.  
- **State Management & Persistence:** useReducer + AsyncStorage showcase local data handling and rehydration.  
- **Notifications & Sensors:** Expo Notifications and Pedometer demonstrate device integration.  
- **Backend Integration:** Optional cloud sync design shows extendability.  
- **Advanced Features:** Gamification, animations, and pedometer usage fulfill advanced functionality criteria.



#### 2.9. Project Scope and Feasibility
The project is well-scoped for a 6–8 week timeline.  
It emphasizes essential mobile development features—navigation, persistence, notifications, and animations—while remaining lightweight and achievable.  
Each module is independent, enabling parallel work among team members and efficient integration.

---

### 3. Tentative Plan
Each team member will take responsibility for different development areas to ensure steady progress and efficient collaboration:

- **Binbin Wang:** Front-end development, navigation design, and UI/UX styling using React Navigation and TypeScript.  
- **Yiming Liu:** Core logic, state management (reducer + AsyncStorage), and API/notification integration.  
- **Yalin Tuo:** Pedometer integration, animation design, and Expo build setup for deployment.  

All members will collaborate on testing, debugging, and documentation. The team will follow an iterative process—building, testing, and refining—to deliver a polished, functional prototype by the project deadline.
