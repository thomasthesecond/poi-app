// Radium needs the user agent to properly auto prefix
function userAgent(state = "") {
  if (!state && typeof navigator !== "undefined") {
    return navigator.userAgent;
  }

  return state;
}

export default userAgent;
