
const isProduction = process.env.NODE_ENV === "production";

export const setAuthCookies = (res, tokens) => {
  const commonOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  };

  res.cookie("accessToken", tokens.accessToken, {
    ...commonOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    ...commonOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearAuthCookies = (res) => {
  const commonOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  };

  res.clearCookie("accessToken", commonOptions);
  res.clearCookie("refreshToken", commonOptions);
};
