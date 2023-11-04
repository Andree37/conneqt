import {NextRequest, NextResponse} from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export default async function middleware(req: NextRequest) {
    const {pathname} = req.nextUrl;
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.startsWith('/schedule') ||
        pathname.startsWith('/pme/contact') ||
        PUBLIC_FILE.test(pathname)
    ) {
        return NextResponse.next();
    }
    try {
        const userID = req.cookies.get((process.env.COOKIE_NAME as string) || 'userID');

        const existsUserID = userID && userID.value.length > 0;

        // if no cookie but we are on authenticated pages, redirect to log in
        if (
            !existsUserID &&
            !(pathname.startsWith('/pme/login'))
        ) {
            req.nextUrl.pathname = '/pme/login';
            return NextResponse.redirect(req.nextUrl);
        }

        // if cookie but we are on login or register page or initial page, redirect to dashboard
        if (
            existsUserID &&
            (pathname.startsWith('/pme/login'))
        ) {
            req.nextUrl.pathname = '/pme/dashboard';
            return NextResponse.redirect(req.nextUrl);
        }
    } catch (e) {
        console.error(e);
        req.nextUrl.pathname = '/pme/login';
        const resp = NextResponse.redirect(req.nextUrl);
        resp.cookies.delete((process.env.COOKIE_NAME as string) || 'userID');
        return resp;
    }
}
