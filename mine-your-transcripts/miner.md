# Brief: mine one source for candidate patterns

Read every transcript in `transcripts/`. Each is one session between a
person and a coding agent. Look for habits: what the person corrected, what
went wrong twice, what was settled and then held.

Write each habit you find to `candidates.md`, in this form:

## <a working title, in plain words>

**Pressure.** What keeps causing the problem, in one or two sentences.
**Mechanism.** What the person settled on instead.
**Evidence.** Each line that shows it: the file, and the line quoted
character for character. Mark each one **checked** if you opened the file
and found the line yourself just now, or **relayed** if you are going on
something else. Never pass a relayed line off as checked.
**Recurrence.** How many sessions and how many projects it appears in.

Rules:

- The pressure and the mechanism name no project, product, company or
  person. Names, files and quotes go only under Evidence, which stays in
  this private folder.
- A habit seen once is still written down; mark it "once". The owner
  decides what clears the bar, not you.
- Write nowhere except `candidates.md`. Change nothing else.
