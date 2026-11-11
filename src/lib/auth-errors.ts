/** Map Supabase / OAuth error strings to short Chinese copy. Never leak keys. */
export function mapAuthError(message: string | null | undefined): string {
  const raw = (message ?? "").trim();
  const m = raw.toLowerCase();

  if (
    m.includes("provider is not enabled") ||
    m.includes("unsupported provider") ||
    (m.includes("validation") && m.includes("provider"))
  ) {
    return "GitHub 登录尚未在后台开通。请改用邮箱登录链接，或稍后再试。";
  }
  if (
    m.includes("redirect_uri") ||
    (m.includes("redirect") && (m.includes("invalid") || m.includes("not allowed") || m.includes("whitelist")))
  ) {
    return "登录回调地址尚未在后台登记。请在 Supabase Auth URL 配置中加入本地与 GitHub Pages 地址后再试。";
  }
  if (m.includes("rate") && m.includes("limit")) {
    return "发送太频繁，请稍后再试。";
  }
  if (
    m.includes("otp_expired") ||
    m.includes("token has expired") ||
    m.includes("expired") ||
    ((m.includes("invalid") || m.includes("otp")) && (m.includes("token") || m.includes("otp")))
  ) {
    return "验证码无效或已过期，请重新发送。";
  }
  if (m.includes("invalid login") || m.includes("invalid email") || m.includes("email address") || m.includes("unable to validate email")) {
    return "请输入有效的邮箱地址。";
  }
  if (m.includes("signups not allowed") || m.includes("signup is disabled")) {
    return "当前未开放新账号注册。";
  }
  if (m.includes("email not confirmed")) {
    return "邮箱尚未确认，请先查收登录邮件。";
  }
  if (
    m.includes("user profile from external provider") ||
    m.includes("resource not accessible by integration") ||
    (m.includes("user/emails") && (m.includes("403") || m.includes("not accessible"))) ||
    (m.includes("email") && m.includes("accessible"))
  ) {
    return "GitHub 无法提供邮箱。请确认使用的是 OAuth App（不是 GitHub App），在 Supabase 的 GitHub Provider 中填写 Scopes：user:email，到 GitHub 设置撤销本次授权后再登录，并确保账号有已验证邮箱。";
  }
  if (!raw) {
    return "登录失败，请稍后重试。";
  }
  return "登录失败，请稍后重试。";
}
