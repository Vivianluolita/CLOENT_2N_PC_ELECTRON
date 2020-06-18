const countries = {
  af: {
    code: 'af',
    name: 'Afghanistan (‫افغانستان‬‎)',
    dialCode: 93,
    phoneFormat: '070 123 4567'
  },
  al: {
    code: 'al',
    name: 'Albania (Shqipëri)',
    dialCode: 355,
    phoneFormat: '066 123 4567'
  },
  dz: {
    code: 'dz',
    name: 'Algeria (‫الجزائر‬‎)',
    dialCode: 213,
    phoneFormat: '0551 23 45 67'
  },
  as: {
    code: 'as',
    name: 'American Samoa',
    dialCode: 1684,
    phoneFormat: '(684) 733-1234'
  },
  ad: { code: 'ad', name: 'Andorra', dialCode: 376, phoneFormat: '312 345' },
  ao: { code: 'ao', name: 'Angola', dialCode: 244, phoneFormat: '923 123 456' },
  ai: {
    code: 'ai',
    name: 'Anguilla',
    dialCode: 1264,
    phoneFormat: '(264) 235-1234'
  },
  ag: {
    code: 'ag',
    name: 'Antigua and Barbuda',
    dialCode: 1268,
    phoneFormat: '(268) 464-1234'
  },
  ar: {
    code: 'ar',
    name: 'Argentina',
    dialCode: 54,
    phoneFormat: '011 15-2345-6789'
  },
  am: {
    code: 'am',
    name: 'Armenia (Հայաստան)',
    dialCode: 374,
    phoneFormat: '077 123456'
  },
  aw: { code: 'aw', name: 'Aruba', dialCode: 297, phoneFormat: '560 1234' },
  au: {
    code: 'au',
    name: 'Australia',
    dialCode: 61,
    phoneFormat: '0412 345 678'
  },
  at: {
    code: 'at',
    name: 'Austria (Österreich)',
    dialCode: 43,
    phoneFormat: '0664 123456'
  },
  az: {
    code: 'az',
    name: 'Azerbaijan (Azərbaycan)',
    dialCode: 994,
    phoneFormat: '040 123 45 67'
  },
  bs: {
    code: 'bs',
    name: 'Bahamas',
    dialCode: 1242,
    phoneFormat: '(242) 359-1234'
  },
  bh: {
    code: 'bh',
    name: 'Bahrain (‫البحرين‬‎)',
    dialCode: 973,
    phoneFormat: '3600 1234'
  },
  bd: {
    code: 'bd',
    name: 'Bangladesh (বাংলাদেশ)',
    dialCode: 880,
    phoneFormat: '01812-345678'
  },
  bb: {
    code: 'bb',
    name: 'Barbados',
    dialCode: 1246,
    phoneFormat: '(246) 250-1234'
  },
  by: {
    code: 'by',
    name: 'Belarus (Беларусь)',
    dialCode: 375,
    phoneFormat: '8 029 491-19-11'
  },
  be: {
    code: 'be',
    name: 'Belgium (België)',
    dialCode: 32,
    phoneFormat: '0470 12 34 56'
  },
  bz: { code: 'bz', name: 'Belize', dialCode: 501, phoneFormat: '622-1234' },
  bj: {
    code: 'bj',
    name: 'Benin (Bénin)',
    dialCode: 229,
    phoneFormat: '90 01 12 34'
  },
  bm: {
    code: 'bm',
    name: 'Bermuda',
    dialCode: 1441,
    phoneFormat: '(441) 370-1234'
  },
  bt: {
    code: 'bt',
    name: 'Bhutan (འབྲུག)',
    dialCode: 975,
    phoneFormat: '17 12 34 56'
  },
  bo: { code: 'bo', name: 'Bolivia', dialCode: 591, phoneFormat: '71234567' },
  ba: {
    code: 'ba',
    name: 'Bosnia and Herzegovina (Босна и Херцеговина)',
    dialCode: 387,
    phoneFormat: '061 123 456'
  },
  bw: {
    code: 'bw',
    name: 'Botswana',
    dialCode: 267,
    phoneFormat: '71 123 456'
  },
  br: {
    code: 'br',
    name: 'Brazil (Brasil)',
    dialCode: 55,
    phoneFormat: '(11) 96123-4567'
  },
  io: {
    code: 'io',
    name: 'British Indian Ocean Territory',
    dialCode: 246,
    phoneFormat: '380 1234'
  },
  vg: {
    code: 'vg',
    name: 'British Virgin Islands',
    dialCode: 1284,
    phoneFormat: '(284) 300-1234'
  },
  bn: { code: 'bn', name: 'Brunei', dialCode: 673, phoneFormat: '712 3456' },
  bg: {
    code: 'bg',
    name: 'Bulgaria (България)',
    dialCode: 359,
    phoneFormat: '048 123 456'
  },
  bf: {
    code: 'bf',
    name: 'Burkina Faso',
    dialCode: 226,
    phoneFormat: '70 12 34 56'
  },
  bi: {
    code: 'bi',
    name: 'Burundi (Uburundi)',
    dialCode: 257,
    phoneFormat: '79 56 12 34'
  },
  kh: {
    code: 'kh',
    name: 'Cambodia (កម្ពុជា)',
    dialCode: 855,
    phoneFormat: '091 234 567'
  },
  cm: {
    code: 'cm',
    name: 'Cameroon (Cameroun)',
    dialCode: 237,
    phoneFormat: '6 71 23 45 67'
  },
  ca: {
    code: 'ca',
    name: 'Canada',
    dialCode: 1,
    phoneFormat: '(204) 234-5678'
  },
  cv: {
    code: 'cv',
    name: 'Cape Verde (Kabu Verdi)',
    dialCode: 238,
    phoneFormat: '991 12 34'
  },
  bq: {
    code: 'bq',
    name: 'Caribbean Netherlands',
    dialCode: 599,
    phoneFormat: '318 1234'
  },
  ky: {
    code: 'ky',
    name: 'Cayman Islands',
    dialCode: 1345,
    phoneFormat: '(345) 323-1234'
  },
  cf: {
    code: 'cf',
    name: 'Central African Republic (République centrafricaine)',
    dialCode: 236,
    phoneFormat: '70 01 23 45'
  },
  td: {
    code: 'td',
    name: 'Chad (Tchad)',
    dialCode: 235,
    phoneFormat: '63 01 23 45'
  },
  cl: { code: 'cl', name: 'Chile', dialCode: 56, phoneFormat: '09 6123 4567' },
  cn: {
    code: 'cn',
    name: 'China (中国)',
    dialCode: 86,
    phoneFormat: '131 2345 6789'
  },
  cx: {
    code: 'cx',
    name: 'Christmas Island',
    dialCode: 61,
    phoneFormat: '0412 345 678'
  },
  cc: {
    code: 'cc',
    name: 'Cocos (Keeling) Islands',
    dialCode: 61,
    phoneFormat: '0412 345 678'
  },
  co: {
    code: 'co',
    name: 'Colombia',
    dialCode: 57,
    phoneFormat: '321 1234567'
  },
  km: {
    code: 'km',
    name: 'Comoros (‫جزر القمر‬‎)',
    dialCode: 269,
    phoneFormat: '321 23 45'
  },
  cd: {
    code: 'cd',
    name: 'Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)',
    dialCode: 243,
    phoneFormat: '0991 234 567'
  },
  cg: {
    code: 'cg',
    name: 'Congo (Republic) (Congo-Brazzaville)',
    dialCode: 242,
    phoneFormat: '06 123 4567'
  },
  ck: {
    code: 'ck',
    name: 'Cook Islands',
    dialCode: 682,
    phoneFormat: '71 234'
  },
  cr: {
    code: 'cr',
    name: 'Costa Rica',
    dialCode: 506,
    phoneFormat: '8312 3456'
  },
  ci: {
    code: 'ci',
    name: 'Côte d’Ivoire',
    dialCode: 225,
    phoneFormat: '01 23 45 67'
  },
  hr: {
    code: 'hr',
    name: 'Croatia (Hrvatska)',
    dialCode: 385,
    phoneFormat: '091 234 5678'
  },
  cu: { code: 'cu', name: 'Cuba', dialCode: 53, phoneFormat: '05 1234567' },
  cw: { code: 'cw', name: 'Curaçao', dialCode: 599, phoneFormat: '9 518 1234' },
  cy: {
    code: 'cy',
    name: 'Cyprus (Κύπρος)',
    dialCode: 357,
    phoneFormat: '96 123456'
  },
  cz: {
    code: 'cz',
    name: 'Czech Republic (Česká republika)',
    dialCode: 420,
    phoneFormat: '601 123 456'
  },
  dk: {
    code: 'dk',
    name: 'Denmark (Danmark)',
    dialCode: 45,
    phoneFormat: '20 12 34 56'
  },
  dj: {
    code: 'dj',
    name: 'Djibouti',
    dialCode: 253,
    phoneFormat: '77 83 10 01'
  },
  dm: {
    code: 'dm',
    name: 'Dominica',
    dialCode: 1767,
    phoneFormat: '(767) 225-1234'
  },
  do: {
    code: 'do',
    name: 'Dominican Republic (República Dominicana)',
    dialCode: 1,
    phoneFormat: '(809) 234-5678'
  },
  ec: {
    code: 'ec',
    name: 'Ecuador',
    dialCode: 593,
    phoneFormat: '099 123 4567'
  },
  eg: {
    code: 'eg',
    name: 'Egypt (‫مصر‬‎)',
    dialCode: 20,
    phoneFormat: '0100 123 4567'
  },
  sv: {
    code: 'sv',
    name: 'El Salvador',
    dialCode: 503,
    phoneFormat: '7012 3456'
  },
  gq: {
    code: 'gq',
    name: 'Equatorial Guinea (Guinea Ecuatorial)',
    dialCode: 240,
    phoneFormat: '222 123 456'
  },
  er: { code: 'er', name: 'Eritrea', dialCode: 291, phoneFormat: '07 123 456' },
  ee: {
    code: 'ee',
    name: 'Estonia (Eesti)',
    dialCode: 372,
    phoneFormat: '5123 4567'
  },
  et: {
    code: 'et',
    name: 'Ethiopia',
    dialCode: 251,
    phoneFormat: '091 123 4567'
  },
  fk: {
    code: 'fk',
    name: 'Falkland Islands (Islas Malvinas)',
    dialCode: 500,
    phoneFormat: '51234'
  },
  fo: {
    code: 'fo',
    name: 'Faroe Islands (Føroyar)',
    dialCode: 298,
    phoneFormat: '211234'
  },
  fj: { code: 'fj', name: 'Fiji', dialCode: 679, phoneFormat: '701 2345' },
  fi: {
    code: 'fi',
    name: 'Finland (Suomi)',
    dialCode: 358,
    phoneFormat: '041 2345678'
  },
  fr: {
    code: 'fr',
    name: 'France',
    dialCode: 33,
    phoneFormat: '06 12 34 56 78'
  },
  gf: {
    code: 'gf',
    name: 'French Guiana (Guyane française)',
    dialCode: 594,
    phoneFormat: '0694 20 12 34'
  },
  pf: {
    code: 'pf',
    name: 'French Polynesia (Polynésie française)',
    dialCode: 689,
    phoneFormat: '87 12 34 56'
  },
  ga: { code: 'ga', name: 'Gabon', dialCode: 241, phoneFormat: '06 03 12 34' },
  gm: { code: 'gm', name: 'Gambia', dialCode: 220, phoneFormat: '301 2345' },
  ge: {
    code: 'ge',
    name: 'Georgia (საქართველო)',
    dialCode: 995,
    phoneFormat: '555 12 34 56'
  },
  de: {
    code: 'de',
    name: 'Germany (Deutschland)',
    dialCode: 49,
    phoneFormat: '01512 3456789'
  },
  gh: {
    code: 'gh',
    name: 'Ghana (Gaana)',
    dialCode: 233,
    phoneFormat: '023 123 4567'
  },
  gi: { code: 'gi', name: 'Gibraltar', dialCode: 350, phoneFormat: '57123456' },
  gr: {
    code: 'gr',
    name: 'Greece (Ελλάδα)',
    dialCode: 30,
    phoneFormat: '691 234 5678'
  },
  gl: {
    code: 'gl',
    name: 'Greenland (Kalaallit Nunaat)',
    dialCode: 299,
    phoneFormat: '22 12 34'
  },
  gd: {
    code: 'gd',
    name: 'Grenada',
    dialCode: 1473,
    phoneFormat: '(473) 403-1234'
  },
  gp: {
    code: 'gp',
    name: 'Guadeloupe',
    dialCode: 590,
    phoneFormat: '0690 30-1234'
  },
  gu: {
    code: 'gu',
    name: 'Guam',
    dialCode: 1671,
    phoneFormat: '(671) 300-1234'
  },
  gt: {
    code: 'gt',
    name: 'Guatemala',
    dialCode: 502,
    phoneFormat: '5123 4567'
  },
  gg: {
    code: 'gg',
    name: 'Guernsey',
    dialCode: 44,
    phoneFormat: '07781 123456'
  },
  gn: {
    code: 'gn',
    name: 'Guinea (Guinée)',
    dialCode: 224,
    phoneFormat: '601 12 34 56'
  },
  gw: {
    code: 'gw',
    name: 'Guinea-Bissau (Guiné Bissau)',
    dialCode: 245,
    phoneFormat: '955 012 345'
  },
  gy: { code: 'gy', name: 'Guyana', dialCode: 592, phoneFormat: '609 1234' },
  ht: { code: 'ht', name: 'Haiti', dialCode: 509, phoneFormat: '34 10 1234' },
  hn: { code: 'hn', name: 'Honduras', dialCode: 504, phoneFormat: '9123-4567' },
  hk: {
    code: 'hk',
    name: 'Hong Kong (中国香港)',
    dialCode: 852,
    phoneFormat: '5123 4567'
  },
  hu: {
    code: 'hu',
    name: 'Hungary (Magyarország)',
    dialCode: 36,
    phoneFormat: '(20) 123 4567'
  },
  is: {
    code: 'is',
    name: 'Iceland (Ísland)',
    dialCode: 354,
    phoneFormat: '611 1234'
  },
  in: {
    code: 'in',
    name: 'India (भारत)',
    dialCode: 91,
    phoneFormat: '099876 54321'
  },
  id: {
    code: 'id',
    name: 'Indonesia',
    dialCode: 62,
    phoneFormat: '0812-345-678'
  },
  ir: {
    code: 'ir',
    name: 'Iran (‫ایران‬‎)',
    dialCode: 98,
    phoneFormat: '0912 345 6789'
  },
  iq: {
    code: 'iq',
    name: 'Iraq (‫العراق‬‎)',
    dialCode: 964,
    phoneFormat: '0791 234 5678'
  },
  ie: {
    code: 'ie',
    name: 'Ireland',
    dialCode: 353,
    phoneFormat: '085 012 3456'
  },
  im: {
    code: 'im',
    name: 'Isle of Man',
    dialCode: 44,
    phoneFormat: '07924 123456'
  },
  il: {
    code: 'il',
    name: 'Israel (‫ישראל‬‎)',
    dialCode: 972,
    phoneFormat: '050-123-4567'
  },
  it: {
    code: 'it',
    name: 'Italy (Italia)',
    dialCode: 39,
    phoneFormat: '312 345 6789'
  },
  jm: {
    code: 'jm',
    name: 'Jamaica',
    dialCode: 1876,
    phoneFormat: '(876) 210-1234'
  },
  jp: {
    code: 'jp',
    name: 'Japan (日本)',
    dialCode: 81,
    phoneFormat: '090-1234-5678'
  },
  je: { code: 'je', name: 'Jersey', dialCode: 44, phoneFormat: '07797 123456' },
  jo: {
    code: 'jo',
    name: 'Jordan (‫الأردن‬‎)',
    dialCode: 962,
    phoneFormat: '07 9012 3456'
  },
  kz: {
    code: 'kz',
    name: 'Kazakhstan (Казахстан)',
    dialCode: 7,
    phoneFormat: '8 (771) 000 9998'
  },
  ke: { code: 'ke', name: 'Kenya', dialCode: 254, phoneFormat: '0712 123456' },
  ki: { code: 'ki', name: 'Kiribati', dialCode: 686, phoneFormat: '72012345' },
  xk: { code: 'xk', name: 'Kosovo', dialCode: 383, phoneFormat: '' },
  kw: {
    code: 'kw',
    name: 'Kuwait (‫الكويت‬‎)',
    dialCode: 965,
    phoneFormat: '500 12345'
  },
  kg: {
    code: 'kg',
    name: 'Kyrgyzstan (Кыргызстан)',
    dialCode: 996,
    phoneFormat: '0700 123 456'
  },
  la: {
    code: 'la',
    name: 'Laos (ລາວ)',
    dialCode: 856,
    phoneFormat: '020 23 123 456'
  },
  lv: {
    code: 'lv',
    name: 'Latvia (Latvija)',
    dialCode: 371,
    phoneFormat: '21 234 567'
  },
  lb: {
    code: 'lb',
    name: 'Lebanon (‫لبنان‬‎)',
    dialCode: 961,
    phoneFormat: '71 123 456'
  },
  ls: { code: 'ls', name: 'Lesotho', dialCode: 266, phoneFormat: '5012 3456' },
  lr: {
    code: 'lr',
    name: 'Liberia',
    dialCode: 231,
    phoneFormat: '077 012 3456'
  },
  ly: {
    code: 'ly',
    name: 'Libya (‫ليبيا‬‎)',
    dialCode: 218,
    phoneFormat: '091-2345678'
  },
  li: {
    code: 'li',
    name: 'Liechtenstein',
    dialCode: 423,
    phoneFormat: '660 234 567'
  },
  lt: {
    code: 'lt',
    name: 'Lithuania (Lietuva)',
    dialCode: 370,
    phoneFormat: '(8-612) 34567'
  },
  lu: {
    code: 'lu',
    name: 'Luxembourg',
    dialCode: 352,
    phoneFormat: '628 123 456'
  },
  mo: {
    code: 'mo',
    name: 'Macau (中国澳門)',
    dialCode: 853,
    phoneFormat: '6612 3456'
  },
  mk: {
    code: 'mk',
    name: 'Macedonia (FYROM) (Македонија)',
    dialCode: 389,
    phoneFormat: '072 345 678'
  },
  mg: {
    code: 'mg',
    name: 'Madagascar (Madagasikara)',
    dialCode: 261,
    phoneFormat: '032 12 345 67'
  },
  mw: {
    code: 'mw',
    name: 'Malawi',
    dialCode: 265,
    phoneFormat: '0991 23 45 67'
  },
  my: {
    code: 'my',
    name: 'Malaysia',
    dialCode: 60,
    phoneFormat: '012-345 6789'
  },
  mv: { code: 'mv', name: 'Maldives', dialCode: 960, phoneFormat: '771-2345' },
  ml: { code: 'ml', name: 'Mali', dialCode: 223, phoneFormat: '65 01 23 45' },
  mt: { code: 'mt', name: 'Malta', dialCode: 356, phoneFormat: '9696 1234' },
  mh: {
    code: 'mh',
    name: 'Marshall Islands',
    dialCode: 692,
    phoneFormat: '235-1234'
  },
  mq: {
    code: 'mq',
    name: 'Martinique',
    dialCode: 596,
    phoneFormat: '0696 20 12 34'
  },
  mr: {
    code: 'mr',
    name: 'Mauritania (‫موريتانيا‬‎)',
    dialCode: 222,
    phoneFormat: '22 12 34 56'
  },
  mu: {
    code: 'mu',
    name: 'Mauritius (Moris)',
    dialCode: 230,
    phoneFormat: '5251 2345'
  },
  yt: {
    code: 'yt',
    name: 'Mayotte',
    dialCode: 262,
    phoneFormat: '0639 12 34 56'
  },
  mx: {
    code: 'mx',
    name: 'Mexico (México)',
    dialCode: 52,
    phoneFormat: '044 222 123 4567'
  },
  fm: {
    code: 'fm',
    name: 'Micronesia',
    dialCode: 691,
    phoneFormat: '350 1234'
  },
  md: {
    code: 'md',
    name: 'Moldova (Republica Moldova)',
    dialCode: 373,
    phoneFormat: '0621 12 345'
  },
  mc: {
    code: 'mc',
    name: 'Monaco',
    dialCode: 377,
    phoneFormat: '06 12 34 56 78'
  },
  mn: {
    code: 'mn',
    name: 'Mongolia (Монгол)',
    dialCode: 976,
    phoneFormat: '8812 3456'
  },
  me: {
    code: 'me',
    name: 'Montenegro (Crna Gora)',
    dialCode: 382,
    phoneFormat: '067 622 901'
  },
  ms: {
    code: 'ms',
    name: 'Montserrat',
    dialCode: 1664,
    phoneFormat: '(664) 492-3456'
  },
  ma: {
    code: 'ma',
    name: 'Morocco (‫المغرب‬‎)',
    dialCode: 212,
    phoneFormat: '0650-123456'
  },
  mz: {
    code: 'mz',
    name: 'Mozambique (Moçambique)',
    dialCode: 258,
    phoneFormat: '82 123 4567'
  },
  mm: {
    code: 'mm',
    name: 'Myanmar (Burma) (မြန်မာ)',
    dialCode: 95,
    phoneFormat: '09 212 3456'
  },
  na: {
    code: 'na',
    name: 'Namibia (Namibië)',
    dialCode: 264,
    phoneFormat: '081 123 4567'
  },
  nr: { code: 'nr', name: 'Nauru', dialCode: 674, phoneFormat: '555 1234' },
  np: {
    code: 'np',
    name: 'Nepal (नेपाल)',
    dialCode: 977,
    phoneFormat: '984-1234567'
  },
  nl: {
    code: 'nl',
    name: 'Netherlands (Nederland)',
    dialCode: 31,
    phoneFormat: '06 12345678'
  },
  nc: {
    code: 'nc',
    name: 'New Caledonia (Nouvelle-Calédonie)',
    dialCode: 687,
    phoneFormat: '75.12.34'
  },
  nz: {
    code: 'nz',
    name: 'New Zealand',
    dialCode: 64,
    phoneFormat: '021 123 4567'
  },
  ni: {
    code: 'ni',
    name: 'Nicaragua',
    dialCode: 505,
    phoneFormat: '8123 4567'
  },
  ne: {
    code: 'ne',
    name: 'Niger (Nijar)',
    dialCode: 227,
    phoneFormat: '93 12 34 56'
  },
  ng: {
    code: 'ng',
    name: 'Nigeria',
    dialCode: 234,
    phoneFormat: '0802 123 4567'
  },
  nu: { code: 'nu', name: 'Niue', dialCode: 683, phoneFormat: '1234' },
  nf: {
    code: 'nf',
    name: 'Norfolk Island',
    dialCode: 672,
    phoneFormat: '3 81234'
  },
  kp: {
    code: 'kp',
    name: 'North Korea (조선 민주주의 인민 공화국)',
    dialCode: 850,
    phoneFormat: '0192 123 4567'
  },
  mp: {
    code: 'mp',
    name: 'Northern Mariana Islands',
    dialCode: 1670,
    phoneFormat: '(670) 234-5678'
  },
  no: {
    code: 'no',
    name: 'Norway (Norge)',
    dialCode: 47,
    phoneFormat: '406 12 345'
  },
  om: {
    code: 'om',
    name: 'Oman (‫عُمان‬‎)',
    dialCode: 968,
    phoneFormat: '9212 3456'
  },
  pk: {
    code: 'pk',
    name: 'Pakistan (‫پاکستان‬‎)',
    dialCode: 92,
    phoneFormat: '0301 2345678'
  },
  pw: { code: 'pw', name: 'Palau', dialCode: 680, phoneFormat: '620 1234' },
  ps: {
    code: 'ps',
    name: 'Palestine (‫فلسطين‬‎)',
    dialCode: 970,
    phoneFormat: '0599 123 456'
  },
  pa: {
    code: 'pa',
    name: 'Panama (Panamá)',
    dialCode: 507,
    phoneFormat: '6001-2345'
  },
  pg: {
    code: 'pg',
    name: 'Papua New Guinea',
    dialCode: 675,
    phoneFormat: '681 2345'
  },
  py: {
    code: 'py',
    name: 'Paraguay',
    dialCode: 595,
    phoneFormat: '0961 456789'
  },
  pe: {
    code: 'pe',
    name: 'Peru (Perú)',
    dialCode: 51,
    phoneFormat: '912 345 678'
  },
  ph: {
    code: 'ph',
    name: 'Philippines',
    dialCode: 63,
    phoneFormat: '0905 123 4567'
  },
  pl: {
    code: 'pl',
    name: 'Poland (Polska)',
    dialCode: 48,
    phoneFormat: '512 345 678'
  },
  pt: {
    code: 'pt',
    name: 'Portugal',
    dialCode: 351,
    phoneFormat: '912 345 678'
  },
  pr: {
    code: 'pr',
    name: 'Puerto Rico',
    dialCode: 1,
    phoneFormat: '(787) 234-5678'
  },
  qa: {
    code: 'qa',
    name: 'Qatar (‫قطر‬‎)',
    dialCode: 974,
    phoneFormat: '3312 3456'
  },
  re: {
    code: 're',
    name: 'Réunion (La Réunion)',
    dialCode: 262,
    phoneFormat: '0692 12 34 56'
  },
  ro: {
    code: 'ro',
    name: 'Romania (România)',
    dialCode: 40,
    phoneFormat: '0712 345 678'
  },
  ru: {
    code: 'ru',
    name: 'Russia (Россия)',
    dialCode: 7,
    phoneFormat: '8 (912) 345-67-89'
  },
  rw: {
    code: 'rw',
    name: 'Rwanda',
    dialCode: 250,
    phoneFormat: '0720 123 456'
  },
  bl: {
    code: 'bl',
    name: 'Saint Barthélemy (Saint-Barthélemy)',
    dialCode: 590,
    phoneFormat: '0690 30-1234'
  },
  sh: { code: 'sh', name: 'Saint Helena', dialCode: 290, phoneFormat: '51234' },
  kn: {
    code: 'kn',
    name: 'Saint Kitts and Nevis',
    dialCode: 1869,
    phoneFormat: '(869) 765-2917'
  },
  lc: {
    code: 'lc',
    name: 'Saint Lucia',
    dialCode: 1758,
    phoneFormat: '(758) 284-5678'
  },
  mf: {
    code: 'mf',
    name: 'Saint Martin (Saint-Martin (partie française))',
    dialCode: 590,
    phoneFormat: '0690 30-1234'
  },
  pm: {
    code: 'pm',
    name: 'Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)',
    dialCode: 508,
    phoneFormat: '055 12 34'
  },
  vc: {
    code: 'vc',
    name: 'Saint Vincent and the Grenadines',
    dialCode: 1784,
    phoneFormat: '(784) 430-1234'
  },
  ws: { code: 'ws', name: 'Samoa', dialCode: 685, phoneFormat: '601234' },
  sm: {
    code: 'sm',
    name: 'San Marino',
    dialCode: 378,
    phoneFormat: '66 66 12 12'
  },
  st: {
    code: 'st',
    name: 'São Tomé and Príncipe (São Tomé e Príncipe)',
    dialCode: 239,
    phoneFormat: '981 2345'
  },
  sa: {
    code: 'sa',
    name: 'Saudi Arabia (‫المملكة العربية السعودية‬‎)',
    dialCode: 966,
    phoneFormat: '051 234 5678'
  },
  sn: {
    code: 'sn',
    name: 'Senegal (Sénégal)',
    dialCode: 221,
    phoneFormat: '70 123 45 67'
  },
  rs: {
    code: 'rs',
    name: 'Serbia (Србија)',
    dialCode: 381,
    phoneFormat: '060 1234567'
  },
  sc: {
    code: 'sc',
    name: 'Seychelles',
    dialCode: 248,
    phoneFormat: '2 510 123'
  },
  sl: {
    code: 'sl',
    name: 'Sierra Leone',
    dialCode: 232,
    phoneFormat: '(025) 123456'
  },
  sg: { code: 'sg', name: 'Singapore', dialCode: 65, phoneFormat: '8123 4567' },
  sx: {
    code: 'sx',
    name: 'Sint Maarten',
    dialCode: 1721,
    phoneFormat: '(721) 520-5678'
  },
  sk: {
    code: 'sk',
    name: 'Slovakia (Slovensko)',
    dialCode: 421,
    phoneFormat: '0912 123 456'
  },
  si: {
    code: 'si',
    name: 'Slovenia (Slovenija)',
    dialCode: 386,
    phoneFormat: '031 234 567'
  },
  sb: {
    code: 'sb',
    name: 'Solomon Islands',
    dialCode: 677,
    phoneFormat: '74 21234'
  },
  so: {
    code: 'so',
    name: 'Somalia (Soomaaliya)',
    dialCode: 252,
    phoneFormat: '7 1123456'
  },
  za: {
    code: 'za',
    name: 'South Africa',
    dialCode: 27,
    phoneFormat: '071 123 4567'
  },
  kr: {
    code: 'kr',
    name: 'South Korea (대한민국)',
    dialCode: 82,
    phoneFormat: '010-0000-0000'
  },
  ss: {
    code: 'ss',
    name: 'South Sudan (‫جنوب السودان‬‎)',
    dialCode: 211,
    phoneFormat: '0977 123 456'
  },
  es: {
    code: 'es',
    name: 'Spain (España)',
    dialCode: 34,
    phoneFormat: '612 34 56 78'
  },
  lk: {
    code: 'lk',
    name: 'Sri Lanka (ශ්‍රී ලංකාව)',
    dialCode: 94,
    phoneFormat: '071 234 5678'
  },
  sd: {
    code: 'sd',
    name: 'Sudan (‫السودان‬‎)',
    dialCode: 249,
    phoneFormat: '091 123 1234'
  },
  sr: { code: 'sr', name: 'Suriname', dialCode: 597, phoneFormat: '741-2345' },
  sj: {
    code: 'sj',
    name: 'Svalbard and Jan Mayen',
    dialCode: 47,
    phoneFormat: '412 34 567'
  },
  sz: {
    code: 'sz',
    name: 'Swaziland',
    dialCode: 268,
    phoneFormat: '7612 3456'
  },
  se: {
    code: 'se',
    name: 'Sweden (Sverige)',
    dialCode: 46,
    phoneFormat: '070-123 45 67'
  },
  ch: {
    code: 'ch',
    name: 'Switzerland (Schweiz)',
    dialCode: 41,
    phoneFormat: '078 123 45 67'
  },
  sy: {
    code: 'sy',
    name: 'Syria (‫سوريا‬‎)',
    dialCode: 963,
    phoneFormat: '0944 567 890'
  },
  tw: {
    code: 'tw',
    name: 'Taiwan (中国台灣)',
    dialCode: 886,
    phoneFormat: '0912 345 678'
  },
  tj: {
    code: 'tj',
    name: 'Tajikistan',
    dialCode: 992,
    phoneFormat: '(8) 917 12 3456'
  },
  tz: {
    code: 'tz',
    name: 'Tanzania',
    dialCode: 255,
    phoneFormat: '0621 234 567'
  },
  th: {
    code: 'th',
    name: 'Thailand (ไทย)',
    dialCode: 66,
    phoneFormat: '081 234 5678'
  },
  tl: {
    code: 'tl',
    name: 'Timor-Leste',
    dialCode: 670,
    phoneFormat: '7721 2345'
  },
  tg: { code: 'tg', name: 'Togo', dialCode: 228, phoneFormat: '90 11 23 45' },
  tk: { code: 'tk', name: 'Tokelau', dialCode: 690, phoneFormat: '7290' },
  to: { code: 'to', name: 'Tonga', dialCode: 676, phoneFormat: '771 5123' },
  tt: {
    code: 'tt',
    name: 'Trinidad and Tobago',
    dialCode: 1868,
    phoneFormat: '(868) 291-1234'
  },
  tn: {
    code: 'tn',
    name: 'Tunisia (‫تونس‬‎)',
    dialCode: 216,
    phoneFormat: '20 123 456'
  },
  tr: {
    code: 'tr',
    name: 'Turkey (Türkiye)',
    dialCode: 90,
    phoneFormat: '0501 234 56 78'
  },
  tm: {
    code: 'tm',
    name: 'Turkmenistan',
    dialCode: 993,
    phoneFormat: '8 66 123456'
  },
  tc: {
    code: 'tc',
    name: 'Turks and Caicos Islands',
    dialCode: 1649,
    phoneFormat: '(649) 231-1234'
  },
  tv: { code: 'tv', name: 'Tuvalu', dialCode: 688, phoneFormat: '901234' },
  us: {
    code: 'us',
    name: 'United States',
    dialCode: 1,
    phoneFormat: '(201) 555-0123'
  },
  gb: {
    code: 'gb',
    name: 'United Kingdom',
    dialCode: 44,
    phoneFormat: '07400 123456'
  },
  vi: {
    code: 'vi',
    name: 'U.S. Virgin Islands',
    dialCode: 1340,
    phoneFormat: '(340) 642-1234'
  },
  ug: { code: 'ug', name: 'Uganda', dialCode: 256, phoneFormat: '0712 345678' },
  ua: {
    code: 'ua',
    name: 'Ukraine (Україна)',
    dialCode: 380,
    phoneFormat: '039 123 4567'
  },
  ae: {
    code: 'ae',
    name: 'United Arab Emirates (‫الإمارات العربية المتحدة‬‎)',
    dialCode: 971,
    phoneFormat: '050 123 4567'
  },
  uy: {
    code: 'uy',
    name: 'Uruguay',
    dialCode: 598,
    phoneFormat: '094 231 234'
  },
  uz: {
    code: 'uz',
    name: 'Uzbekistan (Oʻzbekiston)',
    dialCode: 998,
    phoneFormat: '8 91 234 56 78'
  },
  vu: { code: 'vu', name: 'Vanuatu', dialCode: 678, phoneFormat: '591 2345' },
  va: {
    code: 'va',
    name: 'Vatican City (Città del Vaticano)',
    dialCode: 39,
    phoneFormat: '312 345 6789'
  },
  ve: {
    code: 've',
    name: 'Venezuela',
    dialCode: 58,
    phoneFormat: '0412-1234567'
  },
  vn: {
    code: 'vn',
    name: 'Vietnam (Việt Nam)',
    dialCode: 84,
    phoneFormat: '091 234 56 78'
  },
  wf: {
    code: 'wf',
    name: 'Wallis and Futuna',
    dialCode: 681,
    phoneFormat: '50 12 34'
  },
  eh: {
    code: 'eh',
    name: 'Western Sahara (‫الصحراء الغربية‬‎)',
    dialCode: 212,
    phoneFormat: '0650-123456'
  },
  ye: {
    code: 'ye',
    name: 'Yemen (‫اليمن‬‎)',
    dialCode: 967,
    phoneFormat: '0712 345 678'
  },
  zm: { code: 'zm', name: 'Zambia', dialCode: 260, phoneFormat: '095 5123456' },
  zw: {
    code: 'zw',
    name: 'Zimbabwe',
    dialCode: 263,
    phoneFormat: '071 123 4567'
  },
  ax: {
    code: 'ax',
    name: 'Åland Islands',
    dialCode: 358,
    phoneFormat: '041 2345678'
  }
}

export default countries
