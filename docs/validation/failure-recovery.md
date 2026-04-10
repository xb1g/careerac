### VAL-RECOVER-001: Course Status Change Menu
When a student clicks a course tile on the plan view (`/plan/[id]`), a status menu appears offering the options: completed, in-progress, cancelled, waitlisted, and failed. Selecting any option updates the course tile's visual state immediately (distinct styling per status). **Pass:** all five statuses are selectable and each renders a visually distinguishable indicator on the tile. **Fail:** any status is missing from the menu, or two statuses share the same visual treatment.
Tool: agent-browser
Evidence: screenshot of the status menu open; screenshot of a course tile in each of the five states showing distinct styling.

### VAL-RECOVER-002: AI Recovery Trigger on Failure
After a student marks a course as "cancelled" or "failed," the chat interface automatically initiates an AI recovery conversation within 5 seconds. The first AI message must reference the specific course by name/code and explain downstream impacts (e.g., prerequisite chains affected). **Pass:** AI message appears in chat naming the failed/cancelled course and listing at least one downstream dependency or explicitly stating none exist. **Fail:** no chat message appears, or the message is generic without referencing the specific course.
Tool: agent-browser
Evidence: screenshot of chat after marking a course as cancelled; screenshot of chat after marking a different course as failed; text content of the AI's first recovery message.

### VAL-RECOVER-003: Downstream Dependency Analysis
When a failed/cancelled course is a prerequisite for other courses in the student's plan, the AI recovery message enumerates every directly-dependent course. For example: "CHEM 101 was a prerequisite for BIO 205 and BIO 210." **Pass:** every course in the plan that lists the failed course as a prerequisite is mentioned in the AI's impact analysis. **Fail:** any dependent course is omitted, or a non-dependent course is incorrectly listed.
Tool: agent-browser
Evidence: screenshot of the AI impact message; cross-reference with the plan's prerequisite data to confirm completeness.

### VAL-RECOVER-004: Alternative Course Suggestions from Articulation Data
The AI suggests at least one alternative course sourced from articulation agreement data, including course code, title, and a brief reasoning for why it satisfies the same requirement. **Pass:** each suggested alternative exists in the articulation dataset and fulfills the same transfer requirement as the original course; reasoning is present. **Fail:** suggested course is fabricated (not in articulation data), does not satisfy the same requirement, or reasoning is absent.
Tool: agent-browser
Evidence: screenshot of AI suggestion message showing course code, title, and reasoning; verification against articulation data source.

### VAL-RECOVER-005: Plan Update on Alternative Acceptance
When the student accepts a suggested alternative course, the visual plan updates to replace or supplement the failed/cancelled course. The new course appears on the plan in the correct semester with proper prerequisite ordering. **Pass:** accepted alternative appears on the plan in a valid semester, the failed/cancelled course retains its failure status indicator, and the plan re-renders without a full page reload. **Fail:** plan does not update, alternative is placed in an invalid semester, or the failed course status is lost.
Tool: agent-browser
Evidence: screenshot of plan before acceptance; screenshot of plan after acceptance showing the new course placement and the retained failure status on the original course.

### VAL-RECOVER-006: No Alternatives Available — Clear Messaging
When a failed/cancelled course has no valid alternatives in the articulation data, the AI delivers a clear, human-readable message stating that no alternatives were found — not a blank response, spinner, or error state. The message should advise the student on next steps (e.g., consult a counselor). **Pass:** AI message explicitly states no alternatives are available and suggests a next step. **Fail:** chat shows a blank area, loading spinner that never resolves, error message, or generic fallback unrelated to the situation.
Tool: agent-browser
Evidence: screenshot of AI response when no alternatives exist; text content of the message.

### VAL-RECOVER-007: Recovery Preserves Prerequisite Integrity
Any plan modification resulting from a recovery suggestion must not introduce prerequisite violations. If accepting an alternative would place a course before its own prerequisite, the AI must either adjust semester placement automatically or warn the student. **Pass:** after accepting a recovery alternative, no course on the plan is scheduled before its prerequisites. **Fail:** a prerequisite violation exists on the plan post-recovery.
Tool: agent-browser
Evidence: screenshot of the updated plan after recovery; prerequisite audit of all courses confirming no violations; any warning messages shown to the student.

### VAL-RECOVER-008: Multiple Simultaneous Failures Tracked
A student can mark two or more courses as failed/cancelled in the same session. Each failure triggers its own recovery flow or is combined into a single comprehensive recovery conversation. All failures are reflected on the plan simultaneously. **Pass:** marking courses A and B as failed results in both showing the failure indicator, and the AI addresses recovery for both courses. **Fail:** only the most recent failure is tracked, or the AI ignores one of the failures.
Tool: agent-browser
Evidence: screenshot of plan with two or more courses marked as failed; chat transcript showing recovery discussion covering all failed courses.

### VAL-RECOVER-009: Failure Events Persist Across Sessions
After marking a course as failed/cancelled and reloading the page or returning later, the failure status and any accepted recovery alternatives remain on the plan. Failure events are persisted in the database. **Pass:** refreshing `/plan/[id]` retains the failure indicator on the course and shows any previously accepted alternatives. **Fail:** failure status resets to a default state on reload, or accepted alternatives disappear.
Tool: agent-browser
Evidence: screenshot of plan with failure status before reload; screenshot after full page reload confirming persistence; database query or network response confirming stored failure event.

### VAL-RECOVER-010: Waitlisted Course Recovery Flow
Marking a course as "waitlisted" triggers a contextually appropriate AI response — distinct from the cancelled/failed flow — that acknowledges the uncertainty and may suggest backup alternatives or a watch-and-wait approach. **Pass:** AI response references the waitlisted status specifically and offers contextually appropriate guidance (e.g., "If you don't get off the waitlist by [date], consider these alternatives..."). **Fail:** waitlisted status is treated identically to cancelled/failed with no acknowledgment of the different situation, or no AI response is triggered.
Tool: agent-browser
Evidence: screenshot of chat after marking a course as waitlisted; text content of the AI response.

### VAL-RECOVER-011: Stale Plan Warning
When the underlying articulation or course catalog data has been updated since the plan was last modified, the plan view displays a visible warning indicating the plan may be based on outdated information. **Pass:** a non-dismissable or clearly visible banner/badge appears on `/plan/[id]` when data staleness is detected, and it links to a refresh or review action. **Fail:** no warning appears despite stale data, or the warning is easily missed (e.g., only in a tooltip or footer).
Tool: agent-browser
Evidence: screenshot of plan view showing the stale data warning; timestamp comparison between plan modification date and data update date.

### VAL-RECOVER-012: Failed/Cancelled Courses Visually Distinct
Courses marked as failed or cancelled are rendered with clearly distinct visual treatment from completed, in-progress, and planned courses. The distinction must be accessible (not relying solely on color — e.g., uses icons, patterns, or labels). **Pass:** failed and cancelled courses are immediately identifiable through visual indicators that include at least one non-color cue (icon, strikethrough, label, or pattern). **Fail:** failed/cancelled courses look the same as other statuses, or distinction relies solely on color.
Tool: agent-browser
Evidence: screenshot of a plan containing courses in all five statuses side-by-side; accessibility audit confirming non-color indicators are present.
