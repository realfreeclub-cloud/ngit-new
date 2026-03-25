import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const family = searchParams.get('family');

    if (!family) {
        return NextResponse.json({ error: 'Family required' }, { status: 400 });
    }

    try {
        // We trick Google Fonts into giving us the raw .ttf files by passing an old IE or Mozilla User-Agent.
        // Google Fonts dynamically serves .woff2 to modern browsers, but .ttf to older ones!
        const cssResponse = await fetch(`https://fonts.googleapis.com/css?family=${family.replace(/ /g, '+')}:400,700`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0'
            }
        });

        const css = await cssResponse.text();

        // Parse out the TTF URL
        // CSS looks like: @font-face { ... src: local('...'), url(https://fonts.gstatic.com/s/...ttf) format('truetype'); }
        const match = css.match(/url\((https:\/\/[^)]+\.ttf)\)/i);

        if (match && match[1]) {
            const ttfUrl = match[1];
            
            // We can actually just redirect the React-PDF engine straight to the gstatic TTF URL.
            // This is lightning fast and offloads the data transfer directly to Google CDN!
            return NextResponse.redirect(ttfUrl);
        }

        return NextResponse.json({ error: 'Failed to extract TTF URL from Google CSS source' }, { status: 404 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
