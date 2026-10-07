# Art director review: "Price, message, pack: what works" (maps-ft.json, 47 slides)

Slide numbers are 0-based, as in `reviews/slide-map.md` and `out/maps-render/slide-NN.png`. "Source N" means slide N of `reviews/source-maps.md` (1-based).

---

## 1. Verdict

1. **Do not send it yet.** It looks like Fast Track, but it still reads like the analytic document. The median slide carries about 60 words (the reference: 8). No chapter has a hero-number slide. It ends on a slogan, not a decision.
2. **Three headlines break against the deck's own numbers.** Slide 13 says discount predicts sales, yet two 0% brands sit at $75M and $8.7M. Slide 14 says "audiences of similar size" for 571,000 against 190,000 followers. Slide 2 says "winners sell near list price", yet slide 27's winners, Bella Vita and Beardo, sell at 50% and 42% off.
3. **The spine is right and the evidence is complete.** Every number I checked traces to the source, with two exceptions: an invented midpoint (Muuchstac 13%) and a source error carried over (Gillette "per blade").
4. **The change that moves it most:** rewrite the price thesis from "sell near list" to "hold one price". That fixes 2, 10 and 13, lines them up with 12, 17 and 27, and answers the CFO's first attack.
5. **Then end on a decision slide.** This is about half a day of JSON edits and needs no new research, apart from one manual price check on the live pages before the deck leaves the building.

---

## 2. Flow

### The arc as it reads now
| Part | Slides | Clicks | What happens |
|---|---|---|---|
| Opening | 0–2 | ~4 | Cover, then the triad (1), then the same triad as 75 words titled "The answer first" (2). |
| Ch 1 Price | 3–18 (16) | ~38 | The band (4–5), four slides of category tables and conclusions (6–9), discount (10), five prices (11), the pause (12), sales vs discount (13), engagement (14), a definition of brand power (15), six conclusions (16–17) and two positions (18). |
| Ch 2 Messages | 19–33 (15) | ~38 | Six consecutive table slides of quotes (20–25), the persona structure (26), WIN/LOSE (27), two tables (28–29), two conclusion slides (30–31), works/does not work (32), then the TMC pause (33). |
| Ch 3 Packaging | 34–45 (12) | ~25 | Four tables of pack facts (35–38), the entry-pack bar (39), the same point as a versus (40), two difference slides (41–42), works/does not work (43), five hypotheses (44–45). |
| Close | 46 | – | The triad as a slogan over a volcano, with a source line as the last words. |

At roughly 105 clicks it runs 55–65 minutes live, which is long for a companion chapter.

### Where it drags
- **20–25:** six table slides in a row (16 clicks of quotes). After row 1 of slide 20, TMC is gone until slide 33.
- **15–18:** four stat-lists in a row. Slide 18 repeats 17 row 06 word for word.
- **41–45:** five text slides back to back right before the close. The meeting ends in reading mode.
- **6–9:** four slides of category bands before any TMC tension appears.

### Where it jumps
- **12 → 13.** The emotional peak ("No price is real") cuts back to a cross-brand chart, and that chart's headline is false.
- **15 after 13/14.** The definition of brand power arrives after the evidence that uses it.
- **33 → 34.** Two full-bleed photo cards in a row. The TMC pause (33) is built as a `chapter`, so it reads as a new chapter, not as the end of chapter 2.
- **39 → 40.** The same numbers twice (Rs 59–149 against Rs 499), and the hero of chapter 3 shows up eleven slides into the chapter.

### Proposed order (moves and additions only, nothing cut)
`0, 1, NEW-A, 2, 3, NEW-B, 4, 5, 6, 7, 8, 9, 15, 13, 10, 14, 11, 12, 16, 17, 18, 19, 20 … 32, NEW-C, 33, 34, 40, 39, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, NEW-D, NEW-E` (52 slides).

- NEW-A is the pause "TMC does none of the three yet" (section 4).
- NEW-B is the chapter 1 hero, "80%" (section 4).
- NEW-C is "TMC's page does four of the five things that do not work" (section 4).
- NEW-D is the decision slide (P1-8).
- NEW-E is "How the evidence was collected". The source cover lists it as an agenda item ("how the team collects the evidence"), but no slide was ever built.
- In chapter 1 the order becomes market → what brand power is (15) → price does not buy sales (13) → TMC's discount (10) → TMC's engagement (14) → TMC's five prices (11) → pause (12) → conclusions. Each signal lands on TMC, and the pause comes as the climax, not mid-chapter.
- In chapter 3, the versus (40) becomes the hero right after the card, with the bar (39) as its context. That follows the house pattern: card → hero → context → breakdown → so-what.

### The opening
The answer-first idea lands on slide 1, which is the best slide in the deck. Two faults:
- The deck's sharpest sentence, "TMC DOES NONE OF THE THREE YET", is the smallest type on the slide (mono sub-line).
- Slide 2 repeats the triad under the label "The answer first" instead of making a claim.

Give the punchline its own pause slide (NEW-A), and title slide 2 with TMC's facts (P3).

### The ending
It does not ask for anything. Slide 46 restates the triad and closes on "SOURCE: 107 PRICES READ…". Slide 18 offers "two positions" but never says which one TMC should take. Add NEW-D (P1-8) and leave it on screen during the discussion.

---

## 3. Core message

**The deck in one sentence (keep it):** winners charge a real price, say one checkable thing and let the pack prove it; TMC does none of the three yet.

| Chapter | The sentence the client must repeat | Slides that state it | Slides that only show data |
|---|---|---|---|
| 1 Price | "In one narrow band, power means holding one price. TMC sells one bottle at five prices, so no price is real." | 12 (fully), 17 row 05; 2 states it with the wrong frame ("near list") | 4, 5, 6, 7, 10, 13, 15 |
| 2 Messages | "Winners say one thing a buyer can check. TMC opens with the discount and the mildest character." | 33, 2 row MESSAGE, 26 row 03 sub-line | 20–25, 28–29, 30–31 |
| 3 Packaging | "Rivals let a man try for Rs 59 to 149. TMC's smallest perfume is a Rs 499 gift box." | 39, 40, 41 row 03, 44 row 02 | 35–38, 41–42 |

### Title rewrites (all ≤ 18 words; the `*yellow*` phrase names the highlighted element)
| Slide | Now | New `title` |
|---|---|---|
| 2 | The answer first | `TMC: *five prices*, a discount-first page, no trial pack` |
| 4 | Perfume is *one band*: Rs 449 to 799 | `Perfume is one band, Rs 449 to 799; *TMC* sits in it at Rs 499` |
| 10 | Brand power shows in *how little* a brand discounts | `Six brands sell near list; *TMC* sells at 80% off` |
| 13 | Price does not predict sales; *discount* does | `Neither price nor discount predicts sales; *TMC* discounts most and sells fourth` |
| 15 | Brand power = *three public signals* | `Brand power is three public signals; *TMC* trails the leader on each` |
| 16 | Six conclusions on price | `Price level does not explain *who sells more*` |
| 17 | Six conclusions on price | `A premium needs a named result; TMC first needs *one price*` |
| 18 | Where to price: *two positions* only | `Two positions only; *TMC* stands in the struck-through middle` |
| 20 | Five brands sell *a character* (1 of 2) | `Five brands sell a character; *TMC's* gentleman is the mildest` |
| 24 | The mass brands sell *a number* (1 of 2) | `Mass brands sell *a number*: 800 sprays, 12 hours, 48 hours` |
| 27 | Sharpest character + lowest fixed price *wins* | `Sharp character and a fixed price win; *TMC* has neither` |
| 28/29 | Seven brands say something *only they say* | `Ten brands, *seven claims* no one else makes` |
| 38 | For eight brands, *nothing was found* (2 of 2) | `TMC's pack: a gift box, *no redesign found since 2022*` |
| 39 | Rivals let a man try for *Rs 59 to 149*; no TMC mini was found | `Rivals let a man try for Rs 59 to 149; TMC asks *Rs 499*` |

Sources for the facts in these titles: "fourth" comes from 13's own bars (75, 54, 35, 19). "Mildest" is source 18. "Trails the leader": Bombay Shaving and Reginald at 0% off against TMC's 80%; Beardo at 2,522 ratings against TMC's 524; Beardo at 11.5% engagement against TMC's 0.05%.

---

## 4. Emotion

| Pain | Where it is now | Felt or clinical? | Intensify, within the system |
|---|---|---|---|
| **80% discount** | Only as a yellow bar on 10 and 13, and in sub-lines | Clinical. It is never alone on a slide. | **NEW-B hero-number after 3:** `{"type":"hero-number","value":"80%","pictograms":false,"label":"off list on TMC Black. Six rivals sell within 0 to 19% of list."}`. Notes: Rs 499 against Rs 2,499 on the own site; Rs 180 against Rs 899 on BigBasket (F). The six are Reginald 0%, Bombay Shaving 0%, Minimalist 10%, Muuchstac 10–17%, Fogg 15% and Gillette 19% (source 7). |
| **Five prices for one bottle** | 11, five clicks, then the pause at 12 | **Felt.** The best beat in the deck. | Keep it. Fix the `~` glyph (P1-5). Move it to the end of chapter 1 so it is the climax. |
| **0.05% engagement** | 14, two circles of the same size | Half felt. Equal circles tell the eye the two are equal. | Make the areas true in a `custom` slide: Beardo `circle d 4.3` in `B2B2B2`; TMC `circle d 0.28` in `FEF37F` (4.3 × √(0.05/11.5)). TMC becomes a dot with "0.05%" beside it. Fix the note (P1-3). |
| **No trial pack** | 39 bar, 40 versus | Numbers are there; the pack is not. Chapter 3 has **zero pack images.** The source editor asked for this ("compare visually the packaging – the images should tell the story", source 19), and the dark grey chips on 35–38 read as empty image frames. | Use slide 39 as `dir:"col"` with `icons` = dated listing shots of the five entry packs (BSC foam, Engage pocket, BSC razor, Bella Vita pocket, TMC gift box). Put pack shots in the 35–38 chips. Move 40 to open the chapter. |
| **The discount-first page** | 33, a pier in fog | Felt as words. The photo is generic. | Replace `image` with a dated screenshot of the themancompany.com hero, showing "Premium Men's Grooming Essentials" with the "SUPER SAVING OFFER !!" banner, `dim` 40. The evidence is the image. |
| **TMC's message mistakes** | 32 lists 10 generic rules; TMC is not named | Clinical | **NEW-C after 32** (stat-list): `TMC's page does *four of the five* things that do not work`. Rows: `PREMIUM` "Premium Men's Grooming Essentials" / every rival says it; `OFFER` under a "SUPER SAVING OFFER !!" banner / the second message cancels the first; `CERTIFICATE` a fragrance-safety certificate as proof / it reassures without proving; `GENTLEMAN` the mildest character of five / describes no one. Traced to 20, 26, 32 and the 33 notes. The fifth rule ("naming the range or the mood") is not claimed. |
| **WIN / LOSE** | 27, words without numbers | Reads as opinion | `left.sub` → `"$35M · $54M"`, `right.sub` → `"$19M · $8.6M"` (the sales figures from 13). Title per section 3. |
| **TMC does none of the three** | Mono sub-line on 1 | Buried | **NEW-A after 1:** `{"type":"statement","title":["TMC does","*none of the three*","yet"],"size":128,"y":0.9}`; delete `sub` on 1. |

### Photos
| Slide | Photo | Serves the slide? | Action |
|---|---|---|---|
| 0 | Dagger on wood ("Brutal Honesty") | Risky. On a pricing cover it reads as "cut" or violence. | P3: keep only if the presenter says "brutal honesty" aloud; otherwise swap. |
| 3 | Target | Yes ("where to aim a price"). | Keep. |
| 19 | Letterboard "YOU DIDN'T COME THIS FAR…" | No. The photo carries a second message that competes with the title, on the chapter that teaches "one message per page". It is also a motivational cliché. | Swap for a photo without legible words, or drop it. |
| 33 | Pier in fog | Mood only | Use the TMC page screenshot (above). |
| 34 | Pack sketches | Yes | Keep. |
| 46 | Volcano with purple lightning | No. The photo has a hard crop edge at about 70% of the width (slide-46.png), the purple is off-palette, and an eruption reads as disaster. | Drop `image`/`dim` (statement archetype, no media). The words carry the slide. |

---

## 5. Data

Checked against source-maps.md. ✗ = must fix, ⚠ = should fix, ✓ = verified.

| # | Slide | Item | Deck | Source / arithmetic | Verdict |
|---|---|---|---|---|---|
| 1 | 13 | Title claim | "discount does" predict sales | Bars: Bombay Shaving 0% → 75; Reginald 0% → 8.7; TMC 80% → 19. No order holds. The source said "engagement and discount do". | ✗ |
| 2 | 13 | Bombay Shaving 75 | Plain top bar | Source 9: "75 (claim)"; the build has it only in notes | ✗ |
| 3 | 10, 13 | Muuchstac discount | 13% | Source 7/9: "10 to 17%"; 13 is an unlabelled midpoint | ⚠ |
| 4 | 14 | "Audiences of similar size" | 571,000 vs 190,000 | 3× apart | ✗ |
| 5 | 14 | "571,000 followers engaged" | Reads as 571,000 engaged people | 571,000 is the follower count; 11.5% is the rate | ✗ |
| 6 | 14 | "about 200 times" | – | 11.5 ÷ 0.05 = 230 | ⚠ say "more than 200 times" |
| 7 | 8 row 03 | "20 to 29 times Guard per blade" | – | 273 ÷ 13 = 21 and 375 ÷ 13 = 29 are **per cartridge**. Guard is single-blade and Fusion five-blade, so per blade the premium is 4–6× | ✗ (source error) |
| 8 | 11 | "~Rs 740" | Renders as "-RS 740" (minus) in Plaak at projection distance | – | ✗ |
| 9 | 26 row 03 | "40 to 80%" off list | – | Ustraa, a persona brand, is 35% (13, source 9) | ⚠ → "35 to 80%" |
| 10 | 28/29 | "Seven brands" | Ten brand names in seven rows | – | ⚠ |
| 11 | 6 vs 9 | Beard oil TMC Rs 9.9/ml | Core band "Rs 10 to 11.5 for all five brands" | TMC sits below the band, which contradicts 9 row 05 ("none where it is the value choice") | ⚠ |
| 12 | 7, 8 row 03 | "Premium only where a result or system is sold… three places only" | Trimmer: Ustraa Chrome Rs 2,899 against a Rs 669–1,182 core = 2.5–4.3×. Gift kit Rs 1,399–1,530 | A fourth premium, with no result or system behind it | ⚠ |
| 13 | 8 row 02 | "Everything sits within Rs 100" | Face wash Rs 166 (Himalaya) to Rs 299 (Beardo) = Rs 133 | – | ⚠ (source) |
| 14 | 16 row 01 | "Perfume brands… sell $9M to $54M… Bombay Shaving grows fastest" | These are company sales, not perfume sales. BSC's 75 is silently excluded. No growth figure appears anywhere. | – | ⚠ |
| 15 | 16 row 02 | "Discount depth runs opposite to margin" | Margin type and year undefined. Muuchstac (10–17% off) has 37%, more than Reginald (0%) at 25%. TMC's loss has no number. | – | ⚠ |
| 16 | 2, 12, 17 | "Rs 180 to Rs 740" | Rs 740 is the Nykaa August audit | (I) appears only on 11 | ⚠ |
| 17 | 11 | $ conversions | 2 of 5 prices have one | Rs 2,499 = $29.4, Rs 899 = $10.6, Rs 740 = $8.7 (at 85) | ⚠ all or none |
| 18 | 5, 6, 7, 40 vs 2, 4, 39, 41, 43 | Range format | "Rs 412-487", "Rs 59-149" vs "Rs 449 to 799", "Rs 59 to 149" | – | ⚠ pick one |
| 19 | 39 | TMC bar | Rs 499 | Source 21: "Rs 499 to 599" | ⚠ label the range |
| 20 | 4 | Titan Skinn | Rs 1,716 plotted among 100 ml prices | 50 ml ≈ Rs 3,432 per 100 ml | ⚠ minor |
| 21 | 28/29 | Result column | "37% / 25% / 31% margin" auto-set in small yellow Plaak; "$81M…" in white Riforma | Three yellows on 29, and the type changes within one column | ⚠ |
| 22 | 13, 15, 16, 27, 28–29, 40 | Labels | Sales (F), engagement (I), margins (Chapter A), "v7 plan" (I) are all missing on the slide | – | ⚠ |
| 23 | 4, 10, 13, 27, 38, 39 | Highlight against title | The yellow word in the title names a concept ("one band", "how little", "discount", "wins", "nothing was found", "Rs 59 to 149"); the yellow bar/row/circle is TMC. On 27 the yellow is LOSE while the title's yellow is WINS. On 38 the yellow TMC row has findings under a title that says nothing was found. | – | ✗ on 13, 38; ⚠ others |
| 24 | 10, 13, 14, 6, 7, 35 | **Dropped source content** | Missing: list and selling prices for all 10 brands (source 7, e.g. CODE Rs 1,299 → 649, Gillette Rs 474 → 384, Fogg Rs 299 → 254); BSC "40 to 45% on trimmers"; source 7 readings; Instagram counts for BSC 289,000, Bella Vita 600,000+, Muuchstac 200,000+; BSC ratings "low hundreds"; Muuchstac Amazon 4.4–4.6 (I); Wild Stone Edge 65,900 on Myntra (I); every category $ conversion (source 4–5); shampoo plans $14–24; pack sizes (beard oil 30–50 ml, shampoo 200–250 ml); the source 19 framing note; the source 2 note "Each price and quote needs one manual check before it goes on a slide" | – | ⚠ (the brief said "without losing content") |
| ✓ | – | Verified | 80% (499/2,499; 180/899), $5.9, $2.1, $4.8–5.7, $5.3–9.4, $14+, Rs 15 crore = $1.8M, Beardo 42% (699/1,200), Bella Vita 50%, CODE 50%, Fogg 15%, Gillette 19%, Minimalist 10%, all 13 perfume bars, every category-table cell, all chapter 2 quotes (verbatim), pack facts, FICCI 40%, Engage 3.3%, BSC offline 10% → 50% | – | ✓ |

---

## 6. Logic

### Claims with no evidence on the slide or in the notes
- **16 row 01, "grows fastest" (Bombay Shaving).** No growth number anywhere in the deck. Add it from Chapter A §2 in the notes.
- **16 row 02, "TMC… loses most".** No TMC margin figure. Add it from Chapter A §2 and say which margin it is.
- **26 row 02, "fragrance-safety certificate as proof" for all five persona brands.** Only TMC's row on 20 shows a certificate, and only Villain shows hours. Cite companion §2.2 in the notes or narrow the claim.
- **41 row 05, "One brand redesigned for the kirana shelf".** Name the brand.
- **27 WIN/LOSE.** No numbers on the slide (fix in section 4).

### Conclusions that do not follow
1. **"Winners sell near list price" (2) against "sharp character + lowest fixed price wins: Beardo, Bella Vita" (26, 27).** The two largest persona winners discount 42–50%. The variable the data supports is **stability**, not depth. Source 10 already concedes it: "Bella Vita is the exception: its fixed discount is the brand idea". So 12 and 17 row 05 ("coherence, not level") are right, and 2 and 10 are wrong.
2. **13: "discount does" predict sales.** It does not on its own chart.
3. **16 row 02: "Discount depth runs opposite to margin".** The evidence is three margins of undefined type, and inside the near-list group the relation inverts (Muuchstac against Reginald). Defensible version: "The three brands near list all earn 25 to 37%; TMC, the deepest discounter, loses money."
4. **18: "Every persona brand stands in the struck-through middle"**, yet two persona brands in that middle win. The deck's own answer is on 27: the middle survives only with a sharp character and a fixed price, and TMC has the mildest character and the least stable price. Put that sentence in the 18 notes. It is the hinge of the deck.

### "Two positions" against the hypotheses: consistent in direction, silent on choice and order
- **Every hypothesis is a position-A move.** "Test two claim versions at the same price" (33), "one checkable claim on the front" (44 row 03) and "entry pack under Rs 200" (44 row 02) all assume A, a fixed core-band price with one claim. TMC's own-site Rs 499 already sits inside the Rs 449–799 band.
- **No hypothesis supports B (a 2× premium on one named result).** Pack hypothesis 01 says Black's content varies from bottle to bottle (38, (I)), so TMC has no named result to charge for. B is closed until 01 is fixed.
- **Hypothesis 01 gates everything.** A checkable claim on an uneven bottle invites the one-star review that 43 warns about.
- **Hypothesis 05 (gift box as a separate product) depends on 02.** Today the gift box is TMC's only small format (39–40). Separate it before an entry pack exists and trial disappears.
- **"Fix before any price increase" (12, 17) never says what increases.** Read with A, it means the BigBasket buyer moves from Rs 180 to one fixed price. Say it.
- **Recommended sequence (state it on NEW-D and in the 18 notes):** fix Black's content and spray → one price on every channel → test two claims at that price → entry pack under Rs 200 → gift box as its own product → B only once one result is proven. Label it (H).

### What a sceptical CFO attacks first, in order
1. **"Your winners discount."** Bella Vita at 50% is the largest; Beardo runs 42% plus "Buy 2 Get 2 Free". The thesis has to be stability (P1-2).
2. **"What is it worth?"** The deck has no size of prize: no Black revenue, no channel margin, no volume at risk if the 80% banner goes. One line in the NEW-D notes from Chapter A §2 closes it.
3. **"Is the Rs 180 the same bottle?"** A BigBasket list of Rs 899 against an own-site list of Rs 2,499 could be a different size or a third-party seller. The source says it needs a manual check. Until that check is done, the deck's emotional centrepiece (11–12) is an allegation (P1-9).
4. **"n = 3."** The margins are Reginald, Muuchstac and Gillette (a multinational's segment); the engagement figures cover three brands; the ratings come from different sites. Concede it in the notes and keep the claims at the size of the data.
5. **"Packaging is trade press."** The deck already says so in the notes, which is good. Keep chapter 3 framed as hypotheses.

---

## 7. Fix list

### P1: must fix before sending
| # | Slide | Problem | Exact change |
|---|---|---|---|
| P1-1 | 13 | False headline; claim not labelled | `elements[0].text` → `Neither price nor discount predicts sales; *TMC* discounts most and sells fourth`. `elements[1].text` → `SALES, $M, LATEST FILED (F)`. `elements[3].categories[0]` → `Bombay Shaving Co. (claim)` |
| P1-2 | 2, 10 | The price thesis contradicts the deck's own winners | 2 `rows[0].label` → `Winners hold one price. TMC's Black shows two list prices and sells from Rs 180 to Rs 740 (I).` 10 `title` → `Six brands sell near list; *TMC* sells at 80% off`. 10 `notes`: add `Bella Vita holds a fixed 50%: the low price is the promise. Stability, not depth, is the signal.` |
| P1-3 | 14 | "Similar size" is false; "followers engaged" misreads; text crosses the circles | `left.sub` → `of 571,000 followers`; `right.sub` → `of 190,000 followers`; `note` → `Engagement is a rate, so audience size drops out: Beardo's is more than 200 times TMC's. Ustraa: 299,000 followers, 0.02% (I).` |
| P1-4 | 8 | "per blade" is wrong | `rows[2].sub`: `per blade` → `per cartridge` |
| P1-5 | 11 | `~` renders as a minus | `rows[4].value` → `Rs 740`; `rows[4].label` → `Selling price on Nykaa in August, approximate (I)` |
| P1-6 | 43 | Last bullet clipped ("…one-star" with "review" lost) | `itemSize` 20 → 18, or split into two `list-3` slides (WORKS / DOES NOT WORK), keeping every bullet |
| P1-7 | 38 | Title says nothing was found; the yellow row is TMC's findings | 38 `title` → `TMC's pack: a gift box, *no redesign found since 2022*`. 37 `title` → `Rivals' packs, documented from listings and reviews` (drop the "(1 of 2)" counters) |
| P1-8 | after 46 | No decision | Add `{"type":"stat-list","title":"Three decisions for TMC","rows":[{"value":"PRICE","label":"One price for Black on every channel","sub":"Confirm the five prices on the live pages; fix one list and one selling price before any increase"},{"value":"CLAIM","label":"Test two claim versions at the same price (H)","sub":"Rebuild the page on one checkable claim before the creative work starts"},{"value":"PACK","label":"Put an entry pack under Rs 200 on the shelf (H)","sub":"The Rs 99 and Rs 199 minis are in TMC's v7 plan, not on the shelf (I)"}],"notes":"Order: fix Black's content and spray first (pack hypothesis 01). All three build position A; B needs a named result TMC does not have yet. Size of prize: add Black's revenue and channel margin from Chapter A §2."}`. On 46, move the source line from `sub` to `notes`. |
| P1-9 | 2, 11, 20–25 | The source's manual-check rule was dropped, and notes still say "needs a check" | Add to 2 `notes`: `Each price and quote needs one manual check before it goes on a slide.` Run the check, especially: is BigBasket's Rs 180 / Rs 899 item the same 100 ml Black? Then remove the "needs a check" wording from the 11 and 20–23 notes. |

### P2
| # | Slide | Problem | Exact change |
|---|---|---|---|
| P2-1 | Ch 1 | No hero; the signals arrive out of order | Add NEW-B (80% hero, section 4) after 3. Move 15 before 13, move 10 after 13, and move 11 and 12 after 14. |
| P2-2 | Ch 3 | The hero comes late | Move 40 directly after 34, then 39, then 35–38 |
| P2-3 | 32 → 33 | TMC is never named against the rules | Add NEW-C (section 4) after 32 |
| P2-4 | 1 | Punchline buried | Add NEW-A after 1; delete `sub` on 1 |
| P2-5 | 15 | The yellow slot is spent on ordinals; label missing | Title per section 3. `rows[].value` → `80%`, `524`, `0.05%` (TMC's score on each signal). `rows[2].sub` ends with `(I)` |
| P2-6 | 27 | Opinion without numbers; title yellow ≠ circle yellow | Title per section 3; `left.sub` `$35M · $54M`; `right.sub` `$19M · $8.6M` |
| P2-7 | 14 | Equal circles flatten 230× | Rebuild as `custom` with area-true circles (section 4) |
| P2-8 | 39 | Title yellow ≠ bar yellow | Title per section 3; `categories[4]` → `TMC: smallest perfume, a gift box (Rs 499 to 599)`; add pack-shot `icons` |
| P2-9 | 40 | Internal jargon, no label | `note` → `TMC's Profit Engine v7 plans Rs 99 and Rs 199 minis; none is on the shelf (I).` |
| P2-10 | 26 | 40–80% excludes Ustraa | `rows[2].label` → `A struck-through list price of 35 to 80% as the offer` |
| P2-11 | 28, 29 | Count wrong; result type inconsistent | Title per section 3. Make all Result cells either sentences (`Margin 37%, near list`) or short numbers, so one rule sets all of them |
| P2-12 | 7, 8 | "Only… three places" vs the trimmer row | Either add the trimmer (Ustraa Chrome Rs 2,899, 2.5–4.3× core) to 8 row 03 with the companion's reason, or change "only" to "mostly". Do not leave "three places only" next to a table that shows four. |
| P2-13 | 6, 9 | Beard oil Rs 9.9 vs "all five Rs 10–11.5" vs "never the value choice" | Confirm in the companion. Either round TMC to `Rs 10` inside the band, or add to 9 `rows[1].sub` `…except beard oil, where it is cheapest at Rs 9.9 per ml` |
| P2-14 | 16 | Margin undefined; perfume vs company sales | `rows[0].sub` → `Brands whose hero perfume sells at Rs 449 to 799 have company sales of $9M to $54M…`. Notes: margin type and year, TMC's figure, BSC growth figure (Chapter A §2) |
| P2-15 | 18 | Repeats 17; ducks the hinge | Title per section 3; `notes` add: `Beardo and Bella Vita survive the middle with a sharp character and a fixed price; TMC has the mildest character and the least stable price.` |
| P2-16 | 33 | Generic photo; reads as a chapter card next to 34 | `image` → dated TMC page screenshot. Without one, change `type` to `statement` (no media) |
| P2-17 | 19, 46 | Photos do not serve | 19: swap for a photo without words. 46: delete `image` and `dim` |
| P2-18 | 10, 13, 14, 6, 7, 35, 20 | Dropped source content (Data #24) | 10 `categories` → `Brand · product, Rs list → selling` from source 7 (e.g. `Wild Stone · CODE, Rs 1,299 → 649`; check the "→" glyph in the render, fall back to "/"). 10 notes: BSC "40 to 45% on trimmers" and the source 7 readings. 13 notes: Instagram counts for BSC, Bella Vita, Muuchstac; ratings for BSC, Muuchstac, Wild Stone Edge. 6/7 notes: the $ conversions and pack sizes. 35 notes: the source 19 framing sentence. 20 notes: "Chapter A, section 8 covers campaigns". |
| P2-19 | 12, 14, 15, 16, 27, 40, 41, 44 | No speaker notes on key slides (15 slides have none) | Write a 2-line presenter script with the evidence line for each |
| P2-20 | after NEW-D | Source agenda item never built | Add NEW-E `stat-list` "How the evidence was collected" with rows `107` (prices read 3 October 2026; brand sites, Nykaa Man, BigBasket; Amazon not read (F)), `PAGES` (home and product pages, October 2026; quotes checked by hand), `PACKS` (trade press and listings, not the packs), `(I)` (Nykaa August audit, Instagram, TMC review analysis) |
| P2-21 | all data slides | A PDF handout shows no sources (all are in the notes) | One mono 10 pt source line bottom-left on every chart and table slide |
| P2-22 | 8, 16, 17 | The yellow slot is spent on 01/02/03 | 8 values `Rs 4–8`, `Rs 269`, `2–3×`; 16 values `$9–54M`, `25–37%`, `200×`; 17 values `2–3×`, `5`, `A / B` |

### P3
- **2:** title per section 3. **4:** title per section 3. **16/17:** titles per section 3.
- **Ranges:** one format per deck. Use `Rs 449–799` (en dash) in Plaak values and table cells, and `Rs 449 to 799` in sentences. Hyphen-minus in Plaak reads as a minus, like the tilde.
- **11:** add $ to all five prices or to none.
- **20/21:** add a `Character` column (Gentleman, Don, Boss, Villain, Bro; source 14), which also fills the half-empty 21.
- **6/7:** drop "(1 of 2)/(2 of 2)" where the two titles differ.
- **4:** note that Titan Skinn is a 50 ml bottle (about Rs 3,432 per 100 ml).
- **0:** cover photo (section 4).
- **Optional chapter 2 hero after 19:** `0`, "numbers a buyer can check on TMC's page. Fogg: 800 sprays." (source 18, 13).

### Three things that are strong: do not touch
1. **The spine: slide 1's triad and its bookend at 46** ("Real price. One checkable claim. A pack that proves it."). The client can repeat it, and every chapter maps to one of its words.
2. **The 11 → 12 beat.** Five prices land one click at a time, then "No price is real to the buyer" with "coherence, not level; fix it before any price increase". This is pure Fast Track and the best two slides in the deck.
3. **The chapter 2 taxonomy:** character / proof / number (20–25 titles). It is clear, it is MECE, and it gives TMC leadership the words for where they stand. (Also keep slide 13's twin aligned bar layout. Only its headline is wrong.)

---

## 8. Five rules for the ft-deck skill

1. **The headline must survive its own rows.** The QA agent tests every title that uses a relation word (predicts, only, all, every, similar, opposite, never, wins) against every bar, row and note on the slide. One counter-example means the title is rewritten to the fact. *(Would have caught 2, 10, 13, 14, 7/8, 26, 28.)*
2. **One yellow, the same thing twice.** The `*yellow*` run in the title must name the highlighted bar, row or circle. Lint fails when the highlighted category's text is not inside the yellow run. Concept words stay white. *(4, 10, 13, 27, 38, 39.)*
3. **Every chapter opens on the client's number.** Within two slides of each chapter card there is a `hero-number`, `versus` or `before-after` with the client in yellow. A stat-list `value` holds data; ordinals or letters are allowed on one slide per chapter. Never more than three consecutive slides of one archetype. *(No hero in any chapter; 13 of 16 stat-lists spend the yellow on 01/02/03 or A/B; streaks at 15–18, 20–25, 41–45.)*
4. **Fidelity both ways, then end on a decision.** Run a number diff between source and deck. Every source number appears on a slide or in the notes. Every deck number exists in the source, or is labelled as derived with its arithmetic. Every caveat ("claim", "needs a manual check", (I)) travels with its number. The last content slide is a decision slide with three asks or fewer, each citing the slide that proves it. Every non-card slide has notes. *(Muuchstac 13%, BSC claim, the dropped list/selling prices, the dropped manual-check rule, the slogan ending, 15 slides without notes.)*
5. **Render lint for the display face and the frame.** Ban `~`, `≈` and hyphen ranges in Plaak strings (use "c." and an en dash). Flag text that crosses a shape edge (`versus.sub` ≤ 4 words), text below y 7.3 in, photos with hard crop edges, legible words or off-palette dominant hues. INR decks keep the decimal point: the house decimal comma collides with "Rs 2,499". *(11, 14, 27, 43, 46, 19.)*
