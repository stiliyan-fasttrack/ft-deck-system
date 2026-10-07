# Core-message investigation: maps-ft.json (47 slides)

Basis: contact sheets 0 to 3 (sheet-0 and sheet-2 read in full; the rest checked against maps-ft.json), `maps-ft.json`, `reviews/source-maps.md` (cited as `src L<line>`), `ft-deck` design-system.md, archetypes.md, SKILL.md, check_deck.py, build_deck.js.

## Diagnosis in four lines
1. The transformation kept every number but moved the source's conclusions out of the titles. Source titles such as "...and they hold the margin" (L546) and "...where tmc sits" (L196 area) lost their second clause. Result: 14 titles are topics ("Six conclusions on price", "What the category maps show", "The six differences that matter", "Five differences between packs").
2. Split series repeat one title: 8/9, 16/17, 30/31, 41/42, 44/45, plus the "(n of 2)" tables. A repeated title cannot carry a claim for two different slides.
3. The TMC reading lives in places a viewer does not read: speaker notes (slides 4, 5, 18, 20, 21, 33, 35, 43), a 14-pt mono `sub` (slides 12, 33, 34), or a 16-pt grey `sub` line under a numbered label. Only slides 1, 2, 12, 39, 46 state the TMC consequence at full size.
4. The engine has no place for a so-what on `bar`, `table`, `versus` (note only). `bar` has no sub; `table` has only the yellow `footer`; `claim-bars` alone has `note`. Authors therefore had nowhere to put it.

Totals (table below): yes 9, weak 27, missing 11. (Slide 33 counted as buried = weak.)

Engine defects seen on the renders (not core-message, but they hide numbers): slide 11 row 5 renders "-RS 740" (the `~` is lost); slide 14 sub labels ("571,000 followers engaged") overflow the circle; slide 13 is `custom`, so `slide-map.md` shows an empty title and any title checker is blind to it (the title is an element at y 0.14).

---

## A. Per-slide table

Legend: P = core message present. Message column is the line the slide should be remembered by. Where: T = title, S = sub (chapter/statement), R = new stat-list row, F = table `footer` bar, N = note line (versus `note`).

| # | title (built) | P | Core message as it should read (<= 18 words) | Where | Source |
|---|---|---|---|---|---|
| 00 | Price, message, pack / what works | weak | Price, message, pack: *TMC does none of the three yet* that winners do. | T line 2 | L16 |
| 01 | Winners charge a real price... | yes | (already: winners charge a real price, one checkable claim, a proving pack; TMC none yet) | T + S | L16 |
| 02 | The answer first | yes | Each row names the winner rule and TMC's gap. 4th point (price does not explain sales) is only in notes. | add R: "SALES" | L24 |
| 03 | 1 / Price map (chapter) | missing | TMC's price problem is *coherence, not level*: one bottle, five prices, 80% off. | S (replace "WHAT EACH BRAND CHARGES") | L391, L393 |
| 04 | Perfume is one band: Rs 449 to 799 | weak | Perfume is one band; *TMC Black at Rs 499* sits inside it after an 80% cut from Rs 2,499. | T | L34, L72 |
| 05 | Three price levels, and the gap is in the story | weak | Fogg and Beardo differ in story, not price: *TMC's story is the discount*. | T | L90, L656 |
| 06 | Every category sits in a narrow band (1 of 2) | missing | Every category is a narrow band; *TMC sits mid-pack in all*, with no premium and no value choice. | T (+F) | L201-202 |
| 07 | A premium exists only where a result or a system is sold (2 of 2) | weak | A premium needs a result or system; *TMC sells none*, and is absent in razors and trimmers. | T | L198, L202 |
| 08 | What the category maps show | weak | Price room is narrow: *a premium of two to three times* exists in three places only. | T | L194-198 |
| 09 | What the category maps show | weak | The Rs 499 gift set is a commodity; *TMC is mid-pack in every category*. | T | L196-202 |
| 10 | Brand power shows in how little a brand discounts | weak | Brand power shows in how little a brand discounts; *TMC stands alone at 80%*. | T | L277 |
| 11 | One bottle of Black, five prices | weak | One bottle, five prices: *no price is real to the buyer*. Confirm live, fix before any price rise. | T | L297 |
| 12 | No price is real to the buyer | yes | (statement with TMC consequence in sub; sub is 14-pt mono) | S | L297 |
| 13 | (custom) Price does not predict sales; discount does | yes | Price does not predict sales: *TMC sells $19M at 80% off*, Bella Vita $54M at 50%. | T | L321-336, L379 |
| 14 | Brand power is engagement, not followers | weak | With a similar audience, *Beardo's engagement is about 200 times TMC's*: 11.5% against 0.05%. | T | L386 |
| 15 | Brand power = three public signals | weak | TMC trails on all three signals: *80% discount, 524 ratings, 0.05% engagement*. | T | L362, L386 |
| 16 | Six conclusions on price | weak | Price does not predict sales; *deep discounts cost margin*. | T | L379-380 |
| 17 | Six conclusions on price | weak | Fix price *coherence* first, then pick one of two positions. | T | L387-393 |
| 18 | Where to price: two positions only | weak | Two positions; *TMC stands in the struck-through middle*, like every persona brand. | R (notes line, L393, is invisible) | L393 |
| 19 | 2 / Messages (chapter) | missing | Five brands say the same thing in five costumes; *seven say something only they say*. | S | L437, L546 |
| 20 | Five brands sell a character (1 of 2) | weak | Five brands sell a character in five costumes; *TMC opens with the deal*. | T | L437, L656 |
| 21 | Five brands sell a character (2 of 2) | missing | Persona proof is stars and hours; *only Fogg and Engage give a figure a buyer can test*. | T or N | L425, L599 |
| 22 | Six challengers sell a proof (1 of 2) | weak | Six challengers sell a proof; *TMC opens with the discount*. | T | L455-463, L656 |
| 23 | Six challengers sell a proof (2 of 2) | missing | Traya and Man Matters put money behind it: *93% saw results, money-back guarantee*. | T | L470-476 |
| 24 | The mass brands sell a number (1 of 2) | weak | Mass brands name a number the buyer can count: *800 sprays, 12 hours, 48 hours*. | T | L494, L514, L519 |
| 25 | The mass brands sell a number (2 of 2) | missing | Same rule, and *six home pages were not read* (caveat now only in notes). | N | L523 |
| 26 | Five persona brands share one structure | weak | Five persona brands share one structure; *TMC has the mildest character*. | T | L539-540 |
| 27 | Sharpest character + lowest fixed price wins | yes | (claim + WIN/LOSE; add TMC by name in title if space) | T | L540 |
| 28 | Seven brands say something only they say (1 of 2) | weak | Seven brands say something only they say, *and they hold the margin*. | T (restore source clause) | L546 |
| 29 | Seven brands say something only they say (2 of 2) | missing | One removed objection earns 25% margin (Reginald); a price ladder earns 31% (Gillette). | T | L567-577 |
| 30 | The six differences that matter | weak | Persona brands name a man; *winners name a number*, a count or a time. | T | L592, L599 |
| 31 | The six differences that matter | weak | *TMC opens with the deal* and speaks to the man and the gift buyer at once. | T | L600, L606 |
| 32 | What works in a message, and what does not | weak | A message that works carries a number the buyer can verify; *TMC's page offers none*. | T | L623, L656 |
| 33 | TMC's page says the discount first (chapter) | weak (buried) | TMC's page opens with the discount and offers no checkable number: *rebuild on one claim*. | new stat-list after it (S is 14-pt mono) | L656 |
| 34 | 3 / Packaging (chapter) | missing | Packs that work changed for a commercial reason; *evidence is thinner here* (trade press, not the packs). | S | L696 |
| 35 | Six packs changed for a commercial reason (1 of 2) | weak | Six packs changed to be *seen on a shelf, read on a phone, hit a price*, or prove a claim. | T | L696 |
| 36 | Six packs changed for a commercial reason (2 of 2) | weak | Fogg and Guard let the pack prove the claim; Guard has *80% fewer parts*. | T | L681, L685 |
| 37 | Packs documented from listings and reviews (1 of 2) | missing | Rivals win trial with pocket packs: *Engage's Rs 60 spray took 3.3% share in a year*. | T | L706, L714 |
| 38 | For eight brands, nothing was found (2 of 2) | weak | TMC's Black gift boxes show *no redesign since 2022*, and reviews report uneven bottles. | T or highlighted row | L717 |
| 39 | Rivals let a man try for Rs 59 to 149; no TMC mini was found | yes | (claim + number + TMC gap) | T | L755 |
| 40 | Trying a rival against trying TMC | weak | Trying a rival costs Rs 59 to 149; *trying TMC costs Rs 499 to 599*. | T | L755 |
| 41 | Five differences between packs | weak | Winning packs *break the black default* and prove the claim in the pack. | T | L769-770 |
| 42 | Five differences between packs | weak | TMC designs *for the gift*, not for the daily pack or the thumbnail. | T | L776-781 |
| 43 | What works in packaging, and what does not | weak | Packs that prove the claim and break the category colour work; *a premium signal alone does not*. | T (+ cautions visible) | L798-823 |
| 44 | What this means for TMC's packs: five hypotheses | yes | (title is a so-what; consider verb: "Test five changes to TMC's packs") | T | L833-845 |
| 45 | What this means for TMC's packs: five hypotheses | yes | (continuation) | T | L833-845 |
| 46 | Real price. One checkable claim. A pack that proves it. | yes | (closing; sub is only a source line, could carry "TMC does none of the three yet") | S | L16 |

---

## B. Top 10 fixes (ordered by damage: topic title on a slide that carries the decision)

All titles are <= 63 characters so they stay on one line at the current title size. If the engine wraps, set `size` 38.

1. `slides[16].title = "Price does not predict sales; *deep discounts* cost margin"` (src L379-380). The first of the two "Six conclusions" slides.
2. `slides[17].title = "Fix price *coherence* first, then pick one of two positions"` (src L391-393).
3. `slides[8].title = "Price room is *narrow*: a premium exists in three places"` (src L194-198).
4. `slides[18].rows` push `{"value": "TMC", "label": "Today: in the struck-through middle, like every persona brand"}` (src L393; this line is currently only in notes). Keep the title.
5. `slides[15].title = "TMC trails on all *three signals* of brand power"` (src L362, L386; the numbers 80%, 524, 0.05% are already in the row subs).
6. `slides[30].title = "Persona brands name a man; winners name *a number*"` (src L592, L599).
7. `slides[33]`: keep title; set `slides[33].sub = "THE PAGE OFFERS NO NUMBER A BUYER COULD CHECK: REBUILD IT ON ONE CHECKABLE CLAIM (H)"` and add the Section C slide after it so the claim is also at full size (src L656).
8. `slides[41].title = "Winning packs *break the black* and prove the claim"` (src L769-770).
9. `slides[22].title = "Six challengers sell *a proof*; TMC opens with the discount"` (src L455-476, L656).
10. `slides[6].title = "Every category is *a narrow band*; TMC sits mid-pack in all"` (src L201-202). Also add `slides[6].footer = ["TMC", "Mid-pack everywhere: no premium, no value choice"]` and check the render; the footer bar is built for a label plus values, so verify the fit.

Next in line if time allows: `slides[9].title = "The Rs 499 gift set is a *commodity*; TMC is mid-pack everywhere"`, `slides[31].title = "*TMC opens with the deal* and speaks to two buyers at once"`, `slides[43].title = "Packs that *prove the claim* work; a premium signal alone does not"`, `slides[28].title = "Seven brands say something *only they say*, and hold the margin (1 of 2)"`.

---

## C. Flow gaps

| Where | Gap | Slide to add (archetype + text) |
|---|---|---|
| Ch 1, opening (after 03) | Chapter sub is a topic; the chapter's claim first appears at slide 11 or 12. | No new slide. `slides[3].sub = "TMC'S PRICE PROBLEM IS COHERENCE, NOT LEVEL"` (src L391). |
| Ch 1, closing (after 18) | Chapter ends on two options and no statement of what TMC does. Ch 3 has a "What this means for TMC" slide (44-45); ch 1 and ch 2 do not. | `stat-list`, title "What this means for TMC's price: *fix, then choose*". Rows: 01 "Confirm the five prices on the live pages" sub "Two list prices, selling prices Rs 180 to Rs 740 (src L297)"; 02 "Fix coherence before any price increase" (L297, L393); 03 "Pick position A or B" sub "A fixed, honest core-band price with one checkable claim, or a two-times premium on one named result (L393)". |
| Ch 2, opening (slide 19) | Sub "WHAT EACH BRAND SAYS FIRST ON ITS OWN PAGE" is a topic. | `slides[19].sub = "FIVE BRANDS SAY THE SAME THING; SEVEN SAY SOMETHING ONLY THEY SAY"` (L437, L546). |
| Ch 2, middle (slides 20-25) | Six table slides with no bridge: character, proof, number. | `statement` before slide 20: title ["Three ways", "to say it:", "*character, proof, number*"], sub "TMC IS IN THE CHARACTER GROUP, THE ONE WITH THE LEAST TO CHECK" (L437, L539). Wording stays inside what the source says. |
| Ch 2, closing (33 sits as a "chapter") | The TMC reading of the whole chapter is a 14-pt mono line on a photo slide; slide 33 is also mis-typed as a chapter (no number, no section). | `stat-list` after 33, title "TMC's page: *the deal first*, no number to check". Rows: 01 "Opens with the discount" sub "Banner: SUPER SAVING OFFER, starting from @599, 80% off (L408-410)"; 02 "The mildest character in a group of five" sub "'Gentleman' (L656)"; 03 "No number a buyer could check" sub "Rebuild on one checkable claim before the creative work starts (H): test two claim versions at the same price (L656)". |
| Ch 3, opening (slide 34) | Sub "WHAT EACH BRAND SHOWS" is a topic, and the evidence-strength warning is only in notes of 35/36. | `slides[34].sub = "PACKS THAT WORK CHANGED FOR A COMMERCIAL REASON; EVIDENCE IS THINNER HERE"` (L696). |
| Ch 3, closing | Slides 44-45 are a good closing. Slide 46 sub is a source line, not a message. | `slides[46].sub = "TMC DOES NONE OF THE THREE YET"` (L16); move the source to notes. |
| Whole deck | Slide 02 gives three answers; slide 46 repeats them. Between them, no chapter says "back to the answer: this is the PRICE part". | Add the chapter's one-line claim as chapter sub (3, 19, 34); done by the three fixes above. |

---

## D. Skill improvements

### D1. Rule for SKILL.md (Hard rules) and design-system.md (new section "Every slide carries a message")

> **Every slide states its message at full size.** The message is the one sentence a viewer repeats: a claim with a direction, a number or a named subject, and a consequence for the client.
> 1. **Title = claim, not topic.** Subject + verb + number or contrast + what it means for the client. Not "Six conclusions on price" but "Price does not predict sales; deep discounts cost margin". The title may not be a count of items ("six", "five"), a "what ... show", or a "X against Y" without a verdict.
> 2. **Where the so-what goes, by archetype.**
>    - `bar`: the title carries claim plus the client's position ("... TMC stands alone at 80%").
>    - `table`: the title names the finding; the client's row is `highlightRows`; a one-line verdict goes in `footer` (or the new `sowhat` field).
>    - numbered `stat-list` (conclusions, differences): the title states what the items add up to; a split series gets a different claim per slide, never a repeated title.
>    - `versus`: both numbers and the verdict in the title; `note` only adds evidence.
>    - `chapter`: `sub` is the chapter's claim in one sentence, not the topic.
>    - Every chapter ends with "What this means for <client>" (3 to 5 rows).
> 3. **Notes may add evidence, never the only copy of a claim or caveat.** A caveat that changes how the slide is read (for example "six home pages were not read", "evidence rests on trade press") goes on the slide at 16 pt or larger.
> 4. **Source titles are claims; keep their second clause.** When transforming a dense deck, carry the whole source title (for example "...and they hold the margin") before shortening.
> 5. **Never leave a number unexplained.** A slide that shows data without saying what it means for the client fails, even if the numbers are right.

Engine suggestion: add one optional field `sowhat` (string, `*yellow*` allowed, Riforma 22 at y ~6.75) honoured by `bar`, `table`, `stat-list`, `list-3`, `versus` (today only `claim-bars` has `note`, `table` only `footer`). It reveals on the last click.

### D2. check_deck.py: title-claim checker (run on `deck.json`, not the pptx, so `custom` slides can be read too)

Add `python check_deck.py deck.pptx --deck deck.json` (or a new `check_titles.py`). Normalise a title first: join arrays, remove `*`, strip a trailing `(n of m)`, lowercase. For `custom` slides, use the element with the largest `fontSize` at `y < 1`. For `chapter` and `statement`, test `sub` as well as the title.

Score the title:
- `V` = contains a finite verb or operator: a word list (is, are, was, sits, sit, win, wins, lose, loses, charge, charges, sell, sells, say, says, show, shows, does, do, pay, paid, cost, costs, exists, has, have, share, shares, runs, let, lets, means, prove, proves, trails, discounts, open, opens, name, names, fix, test, add, keep, stop) or `=`, `:`, `;`.
- `N` = contains a digit, `Rs`, `$`, `%`, or a number word (one to ten) used as a quantity of data, not as a list count.
- `C` = contrast or consequence marker: not, no, never, only, against, than, but, before, instead, "and", "so", or a named client (TMC) or action verb.

Hard fail ("topic title") when any of:
- `T1` regex `^(what|how|who|where|which|why)\b` and no `N` ("What the category maps show", "What works in a message, and what does not").
- `T2` regex `^(the )?(\d+|one|two|three|four|five|six|seven|eight|nine|ten) (conclusions?|differences?|points?|reasons?|things?|ways?|insights?|findings?|hypotheses)\b` (also "the six differences that matter").
- `T3` no `V`.
- `T4` regex `^\w+( \w+){0,5} (against|vs\.?|between) ` and no `V`, no `N`.
- `T5` the same normalised title appears on two slides (a split series, "Six conclusions on price" twice).
- `T6` `V` present but neither `N` nor `C`.

Soft warn:
- `W1` fewer than 1 in 3 titles per chapter mention the client or an action verb (the deck never says what it means for TMC).
- `W2` a `chapter` sub with no `V` and all-caps ("WHAT EACH BRAND CHARGES").
- `W3` a `table` or `bar` slide whose `notes` contains a sentence with `V` + client name but whose visible text does not (message buried in notes). Detect by matching the client token in notes only.
- `W4` a chapter's last slide is not a "what this means" slide (title regex `means for|so what|next|decide|fix|test`).
- `W5` title longer than 70 characters, or more than one `*...*` span.

Ten example titles:

| # | Title | Verdict | Why |
|---|---|---|---|
| 1 | "Perfume is one band: Rs 449 to 799, and TMC's Rs 499 sits inside it" | pass | verb, number, client |
| 2 | "TMC discounts 80%; winners sell near list" | pass | verb, number, contrast |
| 3 | "Brand power is engagement, not followers" | pass | verb, contrast (borderline: add TMC) |
| 4 | "Rivals let a man try for Rs 59 to 149; no TMC mini was found" | pass | verb, number, client gap |
| 5 | "Fix price coherence first, then pick one of two positions" | pass | action verbs, ordered |
| 6 | "Six conclusions on price" | fail | T2, T3, T5 |
| 7 | "What the category maps show" | fail | T1, T3, T5 |
| 8 | "Five differences between packs" | fail | T2, T4, T5 |
| 9 | "Trying a rival against trying TMC" | fail | T4: no verdict, no number |
| 10 | "What works in a message, and what does not" | fail | T1: topic, no number, no client |

Also accept `T-ok-override`: a per-slide `"title_ok": true` for cover and closing statements, logged in the report.

### D3. Title formula

**Subject + verb + number or contrast + so-what for the client.** Test: read the title aloud with the slide hidden; the viewer must know what to do or believe. Max 63 characters; one `*yellow*` span on the thing the title claims.

Five rewrites from this deck:

| Before | After |
|---|---|
| Six conclusions on price | Price does not predict sales; *deep discounts* cost margin |
| What the category maps show | Price room is *narrow*: a premium exists in three places |
| The six differences that matter | Persona brands name a man; winners name *a number* |
| Five differences between packs | Winning packs *break the black* and prove the claim |
| Trying a rival against trying TMC | Trying a rival costs Rs 59 to 149; *trying TMC, Rs 499 to 599* |

A sixth, for chapters: "WHAT EACH BRAND CHARGES" becomes "TMC'S PRICE PROBLEM IS COHERENCE, NOT LEVEL".

Closing rule for the Workflow templates (`build-chapters.js`): the chapter agent's output spec must list, per slide, `title (claim)`, `so-what`, `source line`, and the chapter's last slide must be "What this means for <client>". The verifier agent should fail any slide whose `claim` field equals its `title` minus a topic noun.
