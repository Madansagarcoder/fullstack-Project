document.addEventListener("DOMContentLoaded", function () {
  function handleFavoriteClick(btn) {
    const listingId = btn.dataset.id;
    const loggedIn = btn.dataset.loggedIn === "true";

    if (!loggedIn) {
    // redirect to login with return URL
      const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/login?redirect=${returnTo}`;
      return;
    }

    // send POST request to toggle favorite
    fetch(`/listings/${listingId}/favorite`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      credentials: "same-origin"
    })
    .then(async (res) => {
      if (res.status === 401) {
        // not logged in server-side
        const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login?redirect=${returnTo}`;
        return;
      }
      const data = await res.json();
      if (!data) return;
      if (data.favorited) btn.classList.add("favorited");
      else btn.classList.remove("favorited");
      btn.setAttribute("aria-pressed", data.favorited ? "true" : "false");
      // optional: update count UI if you add it
    })
    .catch(err => {
      console.error("Favorite toggle failed", err);
    });
  }

  document.body.addEventListener("click", function (e) {
    const btn = e.target.closest(".favorite-btn");
    if (!btn) return;
    e.preventDefault();
    handleFavoriteClick(btn);
  });
});