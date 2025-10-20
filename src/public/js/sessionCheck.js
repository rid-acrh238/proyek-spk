export async function checkSession() {
  const res = await fetch("/api/auth/session");
  const data = await res.json();
  if (!data.loggedIn) {
    window.location.href = "/login.html";
  }
}
