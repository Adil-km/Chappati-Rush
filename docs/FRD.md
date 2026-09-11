Functional Requirements Document (FRD)
1. Project Overview
1.1 Project Name
Chappathi Rush
1.2 Product Type
Browser-based casual game
1.3 Platform
Desktop web browsers
Mobile web browsers
Tablet browsers
1.4 Concept
Chappathi Rush is a casual, physics-inspired cooking game where the player rolls a piece of dough using a virtual rolling pin.
The player's objective is to transform the dough into a target shape as accurately as possible.
The game evaluates the final dough based on:
Shape accuracy
Size accuracy
Smoothness
Completion time
The player receives a score and can immediately replay to improve their result.

2. Product Objective
The primary objective is to create a simple, satisfying game that can be understood within seconds but offers enough skill and replayability to keep players coming back.
Core gameplay loop
Start Challenge → Roll Dough → Shape Dough → Submit → Calculate Score → View Result → Replay
The MVP should focus on making the rolling and shaping interaction feel satisfying rather than implementing a large number of game modes.

3. Target Audience
Primary audience
Casual gamers
Mobile gamers
Browser-game users
Children and teenagers
Players interested in cooking-themed games
Secondary audience
Players who enjoy score-chasing games
Players who enjoy precision/challenge games
Social-media users who may share high scores

4. MVP Scope
The first version should contain:
Start screen
Shape challenge
Interactive dough
Virtual rolling pin
Dough deformation
Timer
Submit/Done button
Shape comparison
Score calculation
Result screen
Replay functionality
Basic high-score tracking
The MVP should initially focus on one target: a perfect circle.
Additional shapes should be added after the core mechanic is proven fun.

5. User Flow
                   ┌──────────────┐
                    │  Start Game  │
                    └──────┬───────┘
                           ↓
                  ┌─────────────────┐
                  │ Select Challenge│
                  └────────┬────────┘
                           ↓
                  ┌─────────────────┐
                  │   Roll Dough    │
                  │                 │
                  │  Mouse / Touch  │
                  └────────┬────────┘
                           ↓
                  ┌─────────────────┐
                  │   Submit Dough  │
                  └────────┬────────┘
                           ↓
                  ┌─────────────────┐
                  │ Calculate Score │
                  └────────┬────────┘
                           ↓
                  ┌─────────────────┐
                  │   Result Screen │
                  └──────┬─────┬────┘
                         ↓     ↓
                    Play Again  Home


6. Screen Requirements
6.1 Home Screen
Purpose
Introduce the game and allow the player to start.
Elements
Game logo: Chappathi Rush
Play button
Best score
Short instruction
Optional settings button
Example
🫓 Chappathi Rush
Can you make the perfect roti?
[ PLAY ]
Best Score: 96.8

7. Challenge Screen
This is the primary gameplay screen.
Required UI
Target shape
Dough
Rolling pin
Timer
Current challenge
Submit button
Optional reset button
Example
┌─────────────────────────────────────┐
│  PERFECT CIRCLE          TIME: 24s  │
│                                     │
│              TARGET                 │
│            ┌────────┐               │
│          /            \             │
│         |     DOUGH    |            │
│          \            /             │
│            └────────┘               │
│                                     │
│                                     │
│          ═════════════              │
│          ROLLING PIN                │
│                                     │
│              [ DONE ]               │
└─────────────────────────────────────┘


8. Dough Interaction
8.1 Initial State
The player begins with a small circular ball of dough.
The dough should have:
Circular starting shape
Slightly irregular visual texture
Soft/organic appearance
Clearly visible boundary

8.2 Rolling Interaction
Desktop
The player clicks and drags the rolling pin across the dough.
Mobile
The player uses their finger to drag across the dough.
Expected behavior
When the rolling pin passes over the dough:
The dough becomes flatter.
The dough expands outward.
The dough boundary changes based on rolling direction.
Repeated rolling should progressively flatten/expand the dough.
Uneven rolling should produce an uneven shape.

9. Dough Physics
The dough should behave like a deformable 2D object.
The MVP does not require physically accurate dough simulation.
A simplified mathematical simulation is acceptable.
Required properties
Position
Area
Boundary
Width
Height
Thickness
Perimeter
The game should maintain a representation of the dough boundary that can be modified during rolling.
Example
Initial:
     ●

After rolling:
    ╭────╮
   ╭─      ─╮
  │          │
   ╰─      ─╯
     ╰────╯

Uneven rolling:
     ______
   __/      \__
  /             \
  \__          _/
     \________/


10. Target Shape
For MVP, the target is a perfect circle.
Target parameters
The challenge should define:
Target diameter
Target center
Target shape
Allowed tolerance
Example:
Target Shape: Circle
Target Diameter: 180 px
Tolerance: ±10%
Time Limit: 30 seconds

The target should appear as a subtle outline behind/around the dough.

11. Timer
The challenge should have a countdown timer.
Default
30 seconds
Behavior
Timer starts when the player begins interacting with the dough.
Timer counts down continuously.
At 0 seconds, the game automatically submits the dough.
The player cannot continue rolling after time expires.
Optional future feature
Different difficulty levels can have different time limits.

12. Submit Function
The player can press:
DONE
The game then:
Stops the timer.
Stops dough interaction.
Captures the final dough shape.
Calculates the score.
Displays the result screen.

13. Scoring System
The total score should be out of 100.
13.1 Shape Accuracy — 40 points
Measures how closely the final dough resembles the target.
For the circle challenge, circularity can be calculated using:
Circularity = 4π × Area / Perimeter²
A perfect circle approaches 1.
This value can be converted into a 0–40 score.

13.2 Size Accuracy — 20 points
Compare the final dough diameter with the target diameter.
Example:
Target:
180 px
Player:
175 px
→ High score.
Player:
240 px
→ Lower score.

13.3 Smoothness — 15 points
Measures irregularities along the dough boundary.
A smooth boundary receives more points.
Large bumps, sharp irregularities, or extreme distortions reduce the score.

13.4 Thickness — 15 points
The game should estimate whether the dough has been rolled sufficiently.
Ideal thickness receives maximum points.
For MVP, this can be simulated rather than physically calculated.

13.5 Speed Bonus — 10 points
Players receive more points for finishing quickly.
Example:
Completion Time
Bonus
< 10 sec
10
10–15 sec
8
15–20 sec
6
20–25 sec
4
25–30 sec
2


14. Score Result
Example:
       YOUR ROTI

       ◯       ◉
     TARGET    YOU


Shape       38 / 40
Size        19 / 20
Smoothness  13 / 15
Thickness   14 / 15
Speed        8 / 10

------------------

TOTAL
92 / 100

⭐⭐⭐⭐

EXCELLENT!


15. Performance Ratings
Based on the final score:
Score
Rating
95–100
👑 Roti Master
90–94
⭐ Excellent
80–89
🔥 Great
70–79
👍 Good
50–69
😐 Needs Practice
0–49
💀 Disaster Roti

The game should use playful feedback rather than harsh failure messages.

16. Result Screen
Required elements
Final dough
Target outline
Score
Individual score categories
Rating
Best score indicator
Play Again button
Home button
New high score
If the player beats their previous best:
🏆 NEW BEST SCORE!
This should receive a noticeable animation.

17. High Score
For the MVP, high score can be stored locally in the browser.
Requirement
The game should remember:
Highest score
Best completion time
Number of attempts
Example:
PERSONAL BEST

Score: 97.8
Best Time: 18.2s
Attempts: 14

A server/database is not required for MVP.

18. Future Shape Challenges
After the circle challenge is stable, introduce additional targets.
Level 1
Circle
Oval
Level 2
Square
Triangle
Rectangle
Level 3
Heart
Star
Crescent
Level 4
Animal shapes
Objects
Letters
Numbers
Level 5
Random Shape Challenge
The game generates a random target and the player attempts to reproduce it.

19. Game Modes — Future
Classic
Make the target shape as accurately as possible.
Speed Roll
Finish as quickly as possible.
Perfect Circle
Compete specifically for the highest circularity.
Shape Copy
Recreate a displayed shape.
Endless
Keep making increasingly difficult shapes.
Daily Challenge
Everyone receives the same challenge each day.
Multiplayer
Players compete against another player's score.

20. Visual Design
Art direction
The visual style should be:
Warm
Playful
Simple
Food-focused
Slightly cartoon-like
Main visual elements
Wooden rolling pin
Dough texture
Flour particles
Wooden kitchen surface
Tawa
Small cooking animations
The interface should remain clean so that the dough is the main focus.

21. Audio
MVP sounds
Dough rolling sound
Soft tap/click
Button click
Score reveal
Success sound
High-score sound
Future
Add:
Tawa sizzling
Roti puff sound
Kitchen ambience
Funny failure sounds

22. Animations
The game should include small satisfying animations.
Dough
Slight deformation while rolling
Subtle bounce after releasing the rolling pin
Score
Score should animate upward:
0 → 20 → 45 → 72 → 92

Perfect score
For 95+:
Confetti
Glow
Celebration sound
New record
Display:
🏆 NEW PERSONAL BEST!

23. Responsive Design
The game must work on:
Desktop
Mouse
Trackpad
Mobile
Touch
Tablet
Touch
The gameplay area should automatically resize based on screen dimensions.
The dough should remain centered and sufficiently large for comfortable interaction.

24. Accessibility
The game should provide:
Clear visual contrast
Large buttons
Text readable on mobile
No essential information communicated only through color
Optional sound mute
Pause functionality where appropriate

25. Technical Requirements
Frontend
Recommended:
HTML + CSS + JavaScript
or:
React + Canvas
Canvas is recommended for the interactive dough simulation.

Game Rendering
Use HTML5 Canvas for:
Dough
Target shape
Rolling pin
Dough deformation
Visual effects
HTML/CSS can be used for:
Buttons
Score
Timer
Menus
Result screen

26. Data Model
A challenge can be represented approximately as:
Challenge
├── id
├── shape
├── targetSize
├── targetThickness
├── timeLimit
└── difficulty

Player result:
GameResult
├── score
├── shapeScore
├── sizeScore
├── smoothnessScore
├── thicknessScore
├── speedScore
├── completionTime
└── timestamp


27. MVP Acceptance Criteria
The MVP is considered complete when:
Gameplay
[ ] Player can start a game.
[ ] Dough appears on screen.
[ ] Player can control a rolling pin.
[ ] Rolling pin changes the dough shape.
[ ] Dough can become larger/flatter.
[ ] Player can submit the dough.
[ ] Timer works correctly.
Scoring
[ ] Final shape is analyzed.
[ ] Shape score is calculated.
[ ] Size score is calculated.
[ ] Smoothness score is calculated.
[ ] Thickness score is calculated.
[ ] Speed score is calculated.
[ ] Final score is displayed.
Replay
[ ] Player can play again.
[ ] Personal best is saved.
[ ] New high score is detected.
Compatibility
[ ] Works on desktop.
[ ] Works on mobile.
[ ] Touch controls work.
[ ] Game does not require installation.

28. MVP Success Metrics
Once released, the most important metrics to track are:
Engagement
Average session length
Games played per session
Replay rate
Difficulty
Average score
Percentage of players completing a round
Average number of attempts
Retention
Returning users
Daily challenge participation
Viral potential
High-score shares
Challenge shares
Referral visits

29. Phase 2
Once the basic circle game is fun:
Add
Multiple shapes
Difficulty levels
Cooking/tawa phase
Sound effects
Better dough physics
Character reactions
Unlockable cosmetics
Achievements

30. Phase 3
For a larger game:
Daily challenges
Global leaderboard
User profiles
Multiplayer challenges
Generated shapes
Shareable results
Seasonal events
Advanced dough physics

31. Core Product Principle
The most important requirement is:
The rolling itself must feel fun.
Players should feel that they are actually manipulating a soft piece of dough, rather than simply moving a cursor over a shape.
The game should therefore prioritize:
Good interaction > complicated features
A simple game with satisfying dough physics will be more successful than a feature-rich game with frustrating controls.

32. One-Sentence Product Definition
Chappathi Rush is a casual browser game where players roll virtual dough into increasingly challenging shapes and compete for the highest accuracy score.

