# nashfn.github.io

Nash Mishra's personal site and blog, served by GitHub Pages at <https://nashfn.github.io/>.
Plain static HTML/CSS/JS with no build step (`.nojekyll` turns off Jekyll).

```
index.html                 home: banner, intro, about, filterable post list, experience
posts/<slug>.html          one file per article
assets/css/site.css        all styles (light and dark themes via CSS variables)
assets/js/site.js          theme toggle, category filter, reading progress, contents highlight
assets/img/                banner.svg (swap for a photo if you like), avatar, favicons
```

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Paths are root-relative (`/assets/...`), so serve from the repo root rather than opening files directly.

## Add a post

1. Copy `posts/instructgpt.html` to `posts/<slug>.html`. Update `<title>`, the meta tags, the header (log number, category, title, dek, date, read time), the contents sidebar and the article body.
2. In `index.html`, copy the `<li class="entry">` block, put it at the top of the list, and set:
   - `href` to the new post
   - the log number, title, summary, tags, date and read time
   - `data-cat` to one or more category slugs, separated by spaces

### Categories

| Slug                  | Chip label          |
| --------------------- | ------------------- |
| `paper-summaries`     | Paper Summaries     |
| `research`            | Research            |
| `agentic-engineering` | Agentic Engineering |
| `field-notes`         | Field Notes         |

To add a category, add a `<button class="chip" data-filter="slug" data-label="Label">` in `index.html`. Counts update automatically. Filters can be linked directly, e.g. `/#c=research`.

### Article components

`posts/instructgpt.html` shows each component in use: `.pull` (pull quote), `.callout`, `.fig` + `.panel` (figure with caption), `.bars` (bar chart), `.stats`, `.pipeline`, `.eq` (equation), `.triad`, `.timeline`, `.takeaways` and table (`.tbl-wrap`).
