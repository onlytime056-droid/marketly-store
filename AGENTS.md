<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- GitHub Pages copy is built by .github/workflows/github-pages.yml with GITHUB_PAGES=1 (static prerender of `/` only, 404.html redirects to `/`); keep all data access client-side so the static build keeps working.
