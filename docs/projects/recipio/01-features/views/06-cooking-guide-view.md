# 6. Cooking Guide View

Step-by-step cooking guide screen. Provides a visual, interactive experience similar to the Google Stitch project.

### Core Logic & Functionality

- **Step-by-step guide**: Image and description per step
- **Progress**: Indicates current step
- **Timer**: Shown when a step has a timer
- **Notes**: Add notes per step
- **Next/Previous**: Move between steps
- **Complete**: Notification when all steps are done

### Architecture & Components

This view will live under `src/screens/cooking-guide/`.

#### File structure

```
src/screens/cooking-guide/
├── components/
│   ├── cooking-guide-screen.tsx
│   ├── sections/
│   │   ├── step-content.tsx         # Step content
│   │   ├── step-navigation.tsx       # Next/previous buttons
│   │   ├── progress-indicator.tsx    # Progress indicator
│   │   └── timer-section.tsx        # Timer
│   └── step-image.tsx                # Step image
├── hooks/
│   └── use-cooking-guide-view-model.ts
├── models/
│   └── cooking-guide-models.ts
├── store/
│   └── cooking-guide-store.ts
└── ...
```

### Reference Design

This screen is designed with reference to the [Google Stitch project](https://stitch.withgoogle.com/projects/16264947854290603127). It offers a visual, interactive cooking experience.

### Translation Keys

```json
{
  "cookingGuide": {
    "title": "Cooking Guide",
    "step": "Step",
    "of": "/",
    "next": "Next",
    "previous": "Previous",
    "complete": "Complete",
    "timer": "Timer",
    "addNote": "Add Note",
    "notes": "Notes"
  }
}
```
