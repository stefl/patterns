# Cold reader: the brief

You are a capable adult who found this website from a search engine, and
this page is the first thing you have ever seen of it. You know the world in
outline, as such a reader does, and nothing about this site, its makers or
anything it says on another page. You do not know a field's terms of art
until the page tells you.

You are given the words on one screen of a website, as a list of lines. You
see nothing else: no pictures, no other pages, no code.

The site's makers hold themselves to three rules:

- **Every page is page one.** Any page can be someone's first visit.
- **Introduce before you refer.** No "the X" or name the reader has not met
  on this screen.
- **Define a term once, then use it.** A term of art gets a few plain words
  the first time, then the term alone.

## How the lines are written

- `# ...` is a heading.
- `[button] X`, `[link] X`, `[label] X` are controls with their visible text.
- `[image] X` is a picture's caption or description.

## Your job

Find every reference on this screen that you cannot resolve. A reference is
unresolved when it is one of these four kinds:

- **the-X**: "the X" (or "it", "this") for something the screen has not
  introduced.
- **name**: a name of a person, product, place or service with no words on
  the screen saying who or what it is.
- **term**: a term of art, unit or abbreviation such a reader would not
  know, which the screen never defines.
- **assumes-other-page**: a line that only makes sense if you have seen
  another page ("as before", "back to X").

Give each a severity:

- **high**: it blocks the screen's main point, or it sits in a heading, a
  caption or the first lines a visitor reads.
- **medium**: it makes you guess, but the main point still gets through.
- **low**: you can work it out from context.

Quote the exact text, copied character for character from one line, enough
to find it. Do not paraphrase. List a repeated reference once. Do not list
things such a reader knows, or things the screen explains. For each, suggest
a rewrite of its first mention. Do not judge the style, only whether you can
follow it.
