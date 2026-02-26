// middleware.ts
import { auth } from "@/auth"; // импортируйте 'auth' из вашего файла конфигурации

export default auth((req) => {
  // `req.auth` будет содержать данные сессии, если пользователь аутентифицирован.
  
  const isAuthenticated = !!req.auth;
  const isLoginPage = req.nextUrl.pathname.startsWith('/auth');
  
  // Если не аутентифицирован И пытается получить доступ к защищенному маршруту
  if (!isAuthenticated && !isLoginPage) {
    const loginUrl = new URL('/auth', req.nextUrl.origin);
    return Response.redirect(loginUrl);
  }

  // Если аутентифицирован И пытается получить доступ к странице входа, перенаправляем на дашборд
  if (isAuthenticated && isLoginPage) {
    const dashboardUrl = new URL('/dashboard', req.nextUrl.origin);
    return Response.redirect(dashboardUrl);
  }
});

// Настройте маршруты, где должно работать Middleware
export const config = {
  // Эта регулярка исключает: /api, /_next/static, /_next/image, /favicon.ico и т.д.
  // Но включает /auth для проверки аутентификации
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};