function layoutMobile(isMobile) {
  return {
    type: "LAYOUT_MOBILE",
    data: isMobile,
  };
}

export {
  layoutMobile,
};
