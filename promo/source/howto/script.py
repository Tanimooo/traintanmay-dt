# Narration for the "How to use TrainTanmay" video.
# Each step: (id, chapter, spoken text, subtitle text or None to reuse spoken)
# Spoken text spells some names the way they should sound.
CHAPTERS = {
    'home': 'Welcome', 'nav': 'Getting around', 'chem': 'Inside an app', 'classics': 'The other apps',
    'save': 'Your progress', 'league': 'Study leagues', 'access': 'Reading and colours', 'end': 'Help and bugs',
}
STEPS = [
    ('hi', 'home', "Hi! Welcome to Train Tanmay. I'm going to give you a quick tour, so you can get the most out of your revision.",
     "Hi! Welcome to TrainTanmay. I'm going to give you a quick tour, so you can get the most out of your revision."),
    ('what', 'home', "Train Tanmay is a set of free revision apps, made by an A level student, for other students.",
     "TrainTanmay is a set of free revision apps, made by an A level student, for other students."),
    ('worlds', 'home', "Each world on the start screen is its own app. Design and Technology, Physics, Chemistry, Maths, and the E-sat.",
     "Each world on the start screen is its own app: Design & Technology, Physics, Chemistry, Maths, and the ESAT."),
    ('pick', 'home', "Just pick a world to jump in. Let's start with Chemistry.", None),

    ('apphome', 'nav', "Every app works in a similar way. The home page shows your progress, the flashcards you've got due, and where you left off.", None),
    ('topbar', 'nav', "Along the top, you'll find the notes, practice questions, past papers, and the labs.", None),
    ('logo', 'nav', "To switch apps, tap the Train Tanmay logo in the top corner. Its colour tells you which app you're in. Orange is Chemistry.",
     "To switch apps, tap the TrainTanmay logo in the top corner. Its colour tells you which app you're in: orange is Chemistry."),
    ('jump', 'nav', "Looking for something specific? Use Jump to anything, and just type what you need.", None),

    ('topic', 'chem', "Every topic has full notes with worked examples, plus key terms, equations, flashcards, and videos.", None),
    ('ai', 'chem', "The notes were written with AI, so if anything looks off, double check it against your textbook or a video.",
     "The notes were written with AI, so if anything looks off, double-check it against your textbook or a video."),
    ('drill', 'chem', "The calculation drills give you new numbers every time. Type your answer, and it's marked straight away, with a worked solution.", None),
    ('lab', 'chem', "And in the labs, you can spin real 3D molecules, see every bond angle, then flip it into an exam style drawing.",
     "And in the labs, you can spin real 3D molecules, see every bond angle, then flip it into an exam-style drawing."),

    ('dt', 'classics', "Design and Technology covers the whole Edexcel product design course. Flip a flashcard, then say whether you knew it, and it'll come back at the right time.",
     "Design & Technology covers the whole Edexcel Product Design course. Flip a flashcard, then say whether you knew it, and it'll come back at the right time."),
    ('ph', 'classics', "Physics has notes, practice tests, and nearly fifty labs, like this one, which flies real space missions.", None),
    ('ma', 'classics', "In Maths, you can search thousands of past papers, topic packs and worksheets, all sorted by course and topic.", None),
    ('es', 'classics', "And the E-sat app has real admissions test questions, timed mocks, and analytics that show your weak spots. Plus a few games, for when you need a break.",
     "And the ESAT app has real admissions test questions, timed mocks, and analytics that show your weak spots. Plus a few games, for when you need a break."),

    ('local', 'save', "Your progress saves automatically, right here in your browser. You don't need an account.", None),
    ('backup', 'save', "From Save progress, you can download a backup file, and load it again on any device.", None),
    ('google', 'save', "Or, sign in with Google, and your progress follows you to your phone, your laptop, and your school computer.", None),
    ('adds', 'save', "Syncing only ever adds progress, so nothing on one device can wipe out another.", None),

    ('lg1', 'league', "Now for the fun part. Study leagues are weekly leaderboards, for you and your friends.", None),
    ('lg2', 'league', "They count your active revision minutes, whenever you're clicking, typing or scrolling, in any of the apps.", None),
    ('lg3', 'league', "Share your league code to invite people. You can be in up to five leagues at once.", None),
    ('lg4', 'league', "Everyone's minutes reset on Monday, so there's a new crown to win every week.", None),
    ('lg5', 'league', "To start your own league, or join a friend's, tap New or join.", None),

    ('dys', 'access', "Everyone reads differently. Tap the A A button for a dyslexia friendly font.",
     "Everyone reads differently. Tap the Aa button for a dyslexia-friendly font."),
    ('theme', 'access', "The menu next to it switches the colours. Try dark mode, or a softer, warmer background.", None),
    ('lang', 'access', "And in the logo menu, you can read everything in Welsh or Scottish Gaelic.", None),

    ('bug', 'end', "If you spot a mistake, or something's broken, tap Report a bug, and let Tanmay know. It really helps.", None),
    ('bye', 'end', "That's everything! Good luck with your revision, and I'll see you on the leaderboard.", None),
]
