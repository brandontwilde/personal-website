My personal webpage. Here, I'll share a little about my background and what I've been up to.

## Local development

```
python3 serve.py
```

Prints a localhost URL and a LAN URL for testing on a phone. Sends `Cache-Control:
no-store`, which `python3 -m http.server` does not — without it the browser caches
the ES modules and boots a mix of old and new files. Pass `--host 127.0.0.1` to keep
it off the network.

## Deployment

Pushes to `master` publish the site to GitHub Pages (via the `gh-pages`
branch). Each pull request also gets a preview at
`https://brandontwilde.com/pr-preview/pr-<number>/`, linked in a comment on the
PR and removed when the PR closes.
