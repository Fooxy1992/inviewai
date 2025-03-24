import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Páginas públicas que não requerem autenticação
const publicPaths = ['/', '/login', '/signup', '/reset-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar se o caminho atual é público
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith('/api/')
  );
  
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  // Redirecionar para página de login se não estiver autenticado
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Configurar quais caminhos são afetados pelo middleware
export const config = {
  matcher: [
    /*
     * Corresponder a todos os caminhos exceto:
     * 1. Arquivos estáticos (_next/static, favicon.ico, images/, etc.)
     * 2. API routes (/api/*)
     */
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
  ],
}; 