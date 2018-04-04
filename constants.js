const REPLACEMENTS = [
    {
        from: 'yt',
        to: 'youtube'
    },
    {
        from: 'wk',
        to: 'wikipedia'
    },
    {
        from: 'rd',
        to: 'reddit'
    },
    {
        from: 'az',
        to: 'amazon'
    },
    {
        from: 'tw',
        to: 'twitter'
    },
    {
        from: 'ig',
        to: 'instagram'
    },
    {
        from: 'li',
        to: 'linkedin'
    },
    {
        from: 'nf',
        to: 'netflix'
    },
    {
        from: 'st',
        to: 'steam'
    },
    {
        from: 'eb',
        to: 'ebay'
    }
];

const TLDS = ["com", "ac", "ad", "ae", "com.af", "com.ag", "com.ai", "al", "am", "co.ao", "com.ar", "as", "at", "com.au", "az", "ba", "com.bd", "be", "bf", "bg", "com.bh", "bi", "bj", "com.bn", "com.bo", "com.br", "bs", "bt", "co.bw", "by", "com.bz", "ca", "com.kh", "cc", "cd", "cf", "cat", "cg", "ch", "ci", "co.ck", "cl", "cm", "cn", "com.co", "co.cr", "com.cu", "cv", "com.cy", "cz", "de", "dj", "dk", "dm", "com.do", "dz", "com.ec", "ee", "com.eg", "es", "com.et", "fi", "com.fj", "fm", "fr", "ga", "ge", "gf", "gg", "com.gh", "com.gi", "gl", "gm", "gp", "gr", "com.gt", "gy", "com.hk", "hn", "hr", "ht", "hu", "co.id", "iq", "ie", "co.il", "im", "co.in", "io", "is", "it", "je", "com.jm", "jo", "co.jp", "co.ke", "ki", "kg", "co.kr", "com.kw", "kz", "la", "com.lb", "com.lc", "li", "lk", "co.ls", "lt", "lu", "lv", "com.ly", "co.ma", "md", "me", "mg", "mk", "ml", "com.mm", "mn", "ms", "com.mt", "mu", "mv", "mw", "com.mx", "com.my", "co.mz", "com.na", "ne", "com.nf", "com.ng", "com.ni", "nl", "no", "com.np", "nr", "nu", "co.nz", "com.om", "com.pk", "com.pa", "com.pe", "com.ph", "pl", "com.pg", "pn", "com.pr", "ps", "pt", "com.py", "com.qa", "ro", "rs", "ru", "rw", "com.sa", "com.sb", "sc", "se", "com.sg", "sh", "si", "sk", "com.sl", "sn", "sm", "so", "st", "sr", "com.sv", "td", "tg", "co.th", "com.tj", "tk", "tl", "tm", "to", "tn", "com.tr", "tt", "com.tw", "co.tz", "com.ua", "co.ug", "co.uk", "com.uy", "co.uz", "com.vc", "co.ve", "vg", "co.vi", "com.vn", "vu", "ws", "co.za", "co.zm", "co.zw", "org", "net"];


let GOOGLE_DOMAINS = [];
for (let i = 0; i < TLDS.length; i++) {
    GOOGLE_DOMAINS.push("*://google." + TLDS[i] + "/search?q=*");
    GOOGLE_DOMAINS.push("*://www.google." + TLDS[i] + "/search?q=*");
}
GOOGLE_DOMAINS.push("*://adityaanand.in/*");