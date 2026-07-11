# Devlog

This assignment was developed using Claude Code as an AI-assisted development tool. The purpose of this document is to transparently describe how I approached the project, what decisions I made, where AI accelerated implementation, and how I validated the final result.

Rather than treating AI as an autopilot, I used it as an implementation partner. I made the architectural, product, UX, and prioritization decisions, while Claude Code accelerated implementation under my direction. Every significant change was reviewed in a running application before it was accepted.

## Development Process

I worked in iterative rounds:

1. Define the feature or change I wanted.
2. Review the proposed approach before implementation when appropriate.
3. Run and interact with the application myself.
4. Identify issues, improvements, or new ideas.
5. Repeat until satisfied.

This devlog was maintained throughout development rather than reconstructed afterward so that it accurately reflects my decision-making process.

---

# Engineering Decisions

## Initial Scope

The initial technology stack was intentionally kept modern while remaining appropriate for a small project.

Chosen stack:

- React
- TypeScript
- Vite
- Tailwind CSS
- Motion (formerly Framer Motion)

These technologies were selected because they provide a lightweight, modern React development experience while keeping the implementation maintainable and easy to discuss during review.

---

## Assignment Requirements

I chose:

- Genre filtering
- Client-side sorting
- Responsive grid layout
- Hover interactions

For optional enhancements I implemented:

- Responsive layout
- Multiple filtering controls
- CSS animations
- Alternate grid/list layout
- Clickable movie details

I intentionally **did not** implement rating-based card sizing.

Instead, I felt a layout toggle added more practical user value while demonstrating component composition and state management.

---

## Styling Decisions

I chose to keep styling co-located with the components rather than separating everything into standalone CSS files.

For a project of this size I felt this improved readability because the styling and component logic evolve together.

---

## Filtering Decisions

Filtering evolved in multiple iterations.

### Initial Version

Single genre selection to satisfy the assignment requirements.

### Second Iteration

Expanded filtering to support multiple genres.

I explicitly chose **OR** semantics instead of **AND** because I felt that matched user expectations.

For example:

- Action
- Comedy
- Action OR Comedy

rather than requiring every selected genre simultaneously.

I also chose a collapsible Filters panel to avoid cluttering the primary interface.

I intentionally decided **not** to add minimum vote count filtering to avoid expanding scope beyond what I considered valuable for the assignment.

### Final Adjustment

While testing I noticed the application still defaulted to Action.

I decided a better experience was showing all movies initially and allowing the user to narrow results intentionally.

---

# Visual Direction

I wanted the application to feel more polished than a basic CRUD assignment while avoiding excessive complexity.

The animated ember background went through several iterations after seeing it running:

- spread particles across the full viewport
- increased density
- randomized positioning
- shifted particles toward screen edges
- softened background blur

These changes all came from interacting with the application rather than reviewing source code.

---

# Additional Feature

Beyond the assignment requirements I added clickable movie cards.

Opening a card displays additional movie information with an animated slide-in transition.

I chose this because it demonstrated:

- additional API usage
- component composition
- asynchronous state management
- richer user interaction

without significantly increasing project complexity.

---

# AI Usage

Claude Code was used throughout development to accelerate implementation.

Areas where it provided the greatest value included:

- project scaffolding
- component implementation
- API integration
- TypeScript definitions
- test generation
- environment setup
- troubleshooting local tooling issues
- researching TMDB API behavior before implementation
- automated verification through a headless browser

Importantly, implementation was driven by decisions I made throughout the project. Claude Code accelerated the mechanical aspects of development, while I remained responsible for architecture, prioritization, feature selection, UX direction, and acceptance of the final implementation.

---

# Validation

I did not rely solely on generated code.

Every completed feature was verified by running the application and interacting with it myself.

Several issues were discovered during manual use, including:

- unreadable dropdown text
- layout transition behavior
- background layering issues
- default filtering behavior

These were identified through testing the product rather than inspecting generated code.

---

# Technical Review

Claude Code also identified implementation issues during development that were corrected before completion, including:

- a sorting edge case involving undated movies
- a potential `useEffect` dependency loop
- browser compatibility issues with testing tools

I reviewed these changes before accepting them.

---

# Cleanup Pass

Before submission I performed a cleanup pass focused on maintainability.

This included:

- removing unused types
- trimming unnecessary model fields
- verifying there were no orphaned files
- checking package dependencies
- confirming linting, tests, and production builds all passed successfully

I intentionally retained several currently unused pagination fields because they accurately reflect the TMDB API schema and would naturally support future expansion.

---

# Final Thoughts

My goal for this assignment was not to demonstrate how quickly I could write React by hand.

Instead, I approached it the same way I would approach product engineering work: define requirements, make deliberate architectural decisions, iterate based on feedback, validate changes in a running application, and use modern tools—including AI—responsibly to improve development velocity while maintaining ownership of the final product.

I expect AI-assisted development to become an increasingly standard part of software engineering. This project reflects how I currently integrate those tools into my workflow while remaining accountable for the engineering decisions behind the software.