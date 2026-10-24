// 만든 파일 — 고치지 말 것. 원본은 pokebuddy 저장소 data/*.json, 만드는 곳은 scripts/build-pokebuddy-data.cjs (npm run sync:pokebuddy)
import type { TrainerInfo } from './dataTypes';

export const TRAINERS: TrainerInfo[] = [
 {
  "id": "hard-01",
  "level": "hard",
  "name": "드래곤조련사",
  "kind": "type-concept",
  "theme": "dragon",
  "party": [
   {
    "id": "rayquaza-mega",
    "ko": "메가레쿠쟈",
    "pokemonId": 10079,
    "types": [
     "dragon",
     "flying"
    ]
   },
   {
    "id": "latios",
    "ko": "라티오스",
    "pokemonId": 381,
    "types": [
     "dragon",
     "psychic"
    ]
   },
   {
    "id": "dragapult",
    "ko": "드래펄트",
    "pokemonId": 887,
    "types": [
     "dragon",
     "ghost"
    ]
   },
   {
    "id": "garchomp",
    "ko": "한카리아스",
    "pokemonId": 445,
    "types": [
     "dragon",
     "ground"
    ]
   },
   {
    "id": "baxcalibur",
    "ko": "드닐레이브",
    "pokemonId": 998,
    "types": [
     "dragon",
     "ice"
    ]
   },
   {
    "id": "latias",
    "ko": "라티아스",
    "pokemonId": 380,
    "types": [
     "dragon",
     "psychic"
    ]
   }
  ]
 },
 {
  "id": "hard-02",
  "level": "hard",
  "name": "수영팬티소년",
  "kind": "weather",
  "theme": "rain",
  "party": [
   {
    "id": "miraidon",
    "ko": "미라이돈",
    "pokemonId": 1008,
    "types": [
     "electric",
     "dragon"
    ]
   },
   {
    "id": "politoed",
    "ko": "왕구리",
    "pokemonId": 186,
    "types": [
     "water"
    ]
   },
   {
    "id": "urshifu-rapid-strike",
    "ko": "우라오스(연격의 태세)",
    "pokemonId": 892,
    "types": [
     "fighting",
     "water"
    ]
   },
   {
    "id": "kingdra",
    "ko": "킹드라",
    "pokemonId": 230,
    "types": [
     "water",
     "dragon"
    ]
   },
   {
    "id": "swampert-mega",
    "ko": "메가대짱이",
    "pokemonId": 10064,
    "types": [
     "water",
     "ground"
    ]
   },
   {
    "id": "tapu-koko",
    "ko": "카푸꼬꼬꼭",
    "pokemonId": 785,
    "types": [
     "electric",
     "fairy"
    ]
   }
  ]
 },
 {
  "id": "hard-03",
  "level": "hard",
  "name": "엘리트트레이너",
  "kind": "weather",
  "theme": "sun",
  "party": [
   {
    "id": "victini",
    "ko": "비크티니",
    "pokemonId": 494,
    "types": [
     "psychic",
     "fire"
    ]
   },
   {
    "id": "groudon-primal",
    "ko": "원시그란돈",
    "pokemonId": 10078,
    "types": [
     "ground",
     "fire"
    ]
   },
   {
    "id": "armarouge",
    "ko": "카디나르마",
    "pokemonId": 936,
    "types": [
     "fire",
     "psychic"
    ]
   },
   {
    "id": "charizard",
    "ko": "리자몽",
    "pokemonId": 6,
    "types": [
     "fire",
     "flying"
    ]
   },
   {
    "id": "infernape",
    "ko": "초염몽",
    "pokemonId": 392,
    "types": [
     "fire",
     "fighting"
    ]
   },
   {
    "id": "hydrapple",
    "ko": "과미드라",
    "pokemonId": 1019,
    "types": [
     "grass",
     "dragon"
    ]
   }
  ]
 },
 {
  "id": "hard-04",
  "level": "hard",
  "name": "과학자",
  "kind": "type-cover",
  "theme": null,
  "party": [
   {
    "id": "zacian-crowned",
    "ko": "자시안(검왕)",
    "pokemonId": 888,
    "types": [
     "fairy",
     "steel"
    ]
   },
   {
    "id": "steelix",
    "ko": "강철톤",
    "pokemonId": 208,
    "types": [
     "steel",
     "ground"
    ]
   },
   {
    "id": "metagross-mega",
    "ko": "메가메타그로스",
    "pokemonId": 10076,
    "types": [
     "steel",
     "psychic"
    ]
   },
   {
    "id": "guzzlord",
    "ko": "악식킹",
    "pokemonId": 799,
    "types": [
     "dark",
     "dragon"
    ]
   },
   {
    "id": "dugtrio-alola",
    "ko": "알로라 닥트리오",
    "pokemonId": 51,
    "types": [
     "ground",
     "steel"
    ]
   },
   {
    "id": "tapu-lele",
    "ko": "카푸나비나",
    "pokemonId": 786,
    "types": [
     "psychic",
     "fairy"
    ]
   }
  ]
 },
 {
  "id": "hard-05",
  "level": "hard",
  "name": "베테랑트레이너",
  "kind": "legend",
  "theme": null,
  "party": [
   {
    "id": "mewtwo-mega-x",
    "ko": "메가뮤츠X",
    "pokemonId": 10043,
    "types": [
     "psychic",
     "fighting"
    ]
   },
   {
    "id": "tyranitar",
    "ko": "마기라스",
    "pokemonId": 248,
    "types": [
     "rock",
     "dark"
    ]
   },
   {
    "id": "tapu-lele",
    "ko": "카푸나비나",
    "pokemonId": 786,
    "types": [
     "psychic",
     "fairy"
    ]
   },
   {
    "id": "dragonite",
    "ko": "망나뇽",
    "pokemonId": 149,
    "types": [
     "dragon",
     "flying"
    ]
   },
   {
    "id": "kingambit",
    "ko": "대도각참",
    "pokemonId": 983,
    "types": [
     "dark",
     "steel"
    ]
   },
   {
    "id": "wo-chien",
    "ko": "총지엔",
    "pokemonId": 1001,
    "types": [
     "dark",
     "grass"
    ]
   }
  ]
 },
 {
  "id": "hard-06",
  "level": "hard",
  "name": "배틀걸",
  "kind": "offense",
  "theme": null,
  "party": [
   {
    "id": "zacian",
    "ko": "자시안",
    "pokemonId": 888,
    "types": [
     "fairy"
    ]
   },
   {
    "id": "garchomp",
    "ko": "한카리아스",
    "pokemonId": 445,
    "types": [
     "dragon",
     "ground"
    ]
   },
   {
    "id": "lucario-mega",
    "ko": "메가루카리오",
    "pokemonId": 10059,
    "types": [
     "fighting",
     "steel"
    ]
   },
   {
    "id": "salamence",
    "ko": "보만다",
    "pokemonId": 373,
    "types": [
     "dragon",
     "flying"
    ]
   },
   {
    "id": "meowscarada",
    "ko": "마스카나",
    "pokemonId": 908,
    "types": [
     "grass",
     "dark"
    ]
   },
   {
    "id": "iron-valiant",
    "ko": "무쇠무인",
    "pokemonId": 1006,
    "types": [
     "fairy",
     "fighting"
    ]
   }
  ]
 },
 {
  "id": "hard-07",
  "level": "hard",
  "name": "초능력자",
  "kind": "offense",
  "theme": null,
  "party": [
   {
    "id": "hoopa",
    "ko": "후파(굴레에 빠진 후파)",
    "pokemonId": 720,
    "types": [
     "psychic",
     "ghost"
    ]
   },
   {
    "id": "mewtwo-mega-y",
    "ko": "메가뮤츠Y",
    "pokemonId": 10044,
    "types": [
     "psychic"
    ]
   },
   {
    "id": "chandelure",
    "ko": "샹델라",
    "pokemonId": 609,
    "types": [
     "ghost",
     "fire"
    ]
   },
   {
    "id": "gardevoir",
    "ko": "가디안",
    "pokemonId": 282,
    "types": [
     "psychic",
     "fairy"
    ]
   },
   {
    "id": "flutter-mane",
    "ko": "날개치는머리",
    "pokemonId": 987,
    "types": [
     "ghost",
     "fairy"
    ]
   },
   {
    "id": "volcarona",
    "ko": "불카모스",
    "pokemonId": 637,
    "types": [
     "bug",
     "fire"
    ]
   }
  ]
 },
 {
  "id": "hard-08",
  "level": "hard",
  "name": "신사",
  "kind": "bulk",
  "theme": null,
  "party": [
   {
    "id": "ting-lu",
    "ko": "딩루",
    "pokemonId": 1003,
    "types": [
     "dark",
     "ground"
    ]
   },
   {
    "id": "giratina",
    "ko": "기라티나(어나더폼)",
    "pokemonId": 487,
    "types": [
     "ghost",
     "dragon"
    ]
   },
   {
    "id": "garganacl",
    "ko": "콜로솔트",
    "pokemonId": 934,
    "types": [
     "rock"
    ]
   },
   {
    "id": "slowbro-mega",
    "ko": "메가야도란",
    "pokemonId": 10071,
    "types": [
     "water",
     "psychic"
    ]
   },
   {
    "id": "corviknight",
    "ko": "아머까오",
    "pokemonId": 823,
    "types": [
     "flying",
     "steel"
    ]
   },
   {
    "id": "dondozo",
    "ko": "어써러셔",
    "pokemonId": 977,
    "types": [
     "water"
    ]
   }
  ]
 },
 {
  "id": "hard-09",
  "level": "hard",
  "name": "포켓몬레인저",
  "kind": "type-cover",
  "theme": null,
  "party": [
   {
    "id": "shaymin",
    "ko": "쉐이미(랜드폼)",
    "pokemonId": 492,
    "types": [
     "grass"
    ]
   },
   {
    "id": "ho-oh",
    "ko": "칠색조",
    "pokemonId": 250,
    "types": [
     "fire",
     "flying"
    ]
   },
   {
    "id": "swampert",
    "ko": "대짱이",
    "pokemonId": 260,
    "types": [
     "water",
     "ground"
    ]
   },
   {
    "id": "venusaur-mega",
    "ko": "메가이상해꽃",
    "pokemonId": 10033,
    "types": [
     "grass",
     "poison"
    ]
   },
   {
    "id": "rillaboom",
    "ko": "고릴타",
    "pokemonId": 812,
    "types": [
     "grass"
    ]
   },
   {
    "id": "blastoise",
    "ko": "거북왕",
    "pokemonId": 9,
    "types": [
     "water"
    ]
   }
  ]
 },
 {
  "id": "hard-10",
  "level": "hard",
  "name": "유적마니아",
  "kind": "weather",
  "theme": "sand",
  "party": [
   {
    "id": "forretress",
    "ko": "쏘콘",
    "pokemonId": 205,
    "types": [
     "bug",
     "steel"
    ]
   },
   {
    "id": "tyranitar-mega",
    "ko": "메가마기라스",
    "pokemonId": 10049,
    "types": [
     "rock",
     "dark"
    ]
   },
   {
    "id": "whiscash",
    "ko": "메깅",
    "pokemonId": 340,
    "types": [
     "water",
     "ground"
    ]
   },
   {
    "id": "garchomp",
    "ko": "한카리아스",
    "pokemonId": 445,
    "types": [
     "dragon",
     "ground"
    ]
   },
   {
    "id": "mamoswine",
    "ko": "맘모꾸리",
    "pokemonId": 473,
    "types": [
     "ice",
     "ground"
    ]
   },
   {
    "id": "gholdengo",
    "ko": "타부자고",
    "pokemonId": 1000,
    "types": [
     "steel",
     "ghost"
    ]
   }
  ]
 },
 {
  "id": "normal-01",
  "level": "normal",
  "name": "낚시꾼",
  "kind": "type-cover",
  "theme": null,
  "party": [
   {
    "id": "claydol",
    "ko": "점토도리",
    "pokemonId": 344,
    "types": [
     "ground",
     "psychic"
    ]
   },
   {
    "id": "dondozo",
    "ko": "어써러셔",
    "pokemonId": 977,
    "types": [
     "water"
    ]
   },
   {
    "id": "sandaconda",
    "ko": "사다이사",
    "pokemonId": 844,
    "types": [
     "ground"
    ]
   },
   {
    "id": "rhyperior",
    "ko": "거대코뿌리",
    "pokemonId": 464,
    "types": [
     "ground",
     "rock"
    ]
   },
   {
    "id": "cloyster",
    "ko": "파르셀",
    "pokemonId": 91,
    "types": [
     "water",
     "ice"
    ]
   },
   {
    "id": "hippowdon",
    "ko": "하마돈",
    "pokemonId": 450,
    "types": [
     "ground"
    ]
   }
  ]
 },
 {
  "id": "normal-02",
  "level": "normal",
  "name": "캠핑보이",
  "kind": "type-concept",
  "theme": "fire",
  "party": [
   {
    "id": "ninetales",
    "ko": "나인테일",
    "pokemonId": 38,
    "types": [
     "fire"
    ]
   },
   {
    "id": "incineroar",
    "ko": "어흥염",
    "pokemonId": 727,
    "types": [
     "fire",
     "dark"
    ]
   },
   {
    "id": "magmortar",
    "ko": "마그마번",
    "pokemonId": 467,
    "types": [
     "fire"
    ]
   },
   {
    "id": "turtonator",
    "ko": "폭거북스",
    "pokemonId": 776,
    "types": [
     "fire",
     "dragon"
    ]
   },
   {
    "id": "rapidash",
    "ko": "날쌩마",
    "pokemonId": 78,
    "types": [
     "fire"
    ]
   },
   {
    "id": "arcanine-hisui",
    "ko": "히스이 윈디",
    "pokemonId": 59,
    "types": [
     "fire",
     "rock"
    ]
   }
  ]
 },
 {
  "id": "normal-03",
  "level": "normal",
  "name": "등산가",
  "kind": "weather",
  "theme": "sand",
  "party": [
   {
    "id": "archaludon",
    "ko": "브리두라스",
    "pokemonId": 1018,
    "types": [
     "steel",
     "dragon"
    ]
   },
   {
    "id": "tyranitar",
    "ko": "마기라스",
    "pokemonId": 248,
    "types": [
     "rock",
     "dark"
    ]
   },
   {
    "id": "donphan",
    "ko": "코리갑",
    "pokemonId": 232,
    "types": [
     "ground"
    ]
   },
   {
    "id": "hippowdon",
    "ko": "하마돈",
    "pokemonId": 450,
    "types": [
     "ground"
    ]
   },
   {
    "id": "palossand",
    "ko": "모래성이당",
    "pokemonId": 770,
    "types": [
     "ghost",
     "ground"
    ]
   },
   {
    "id": "relicanth",
    "ko": "시라칸",
    "pokemonId": 369,
    "types": [
     "water",
     "rock"
    ]
   }
  ]
 },
 {
  "id": "normal-04",
  "level": "normal",
  "name": "피크닉걸",
  "kind": "weather",
  "theme": "sun",
  "party": [
   {
    "id": "tauros-paldea-blaze-breed",
    "ko": "팔데아 켄타로스 블레이즈종",
    "pokemonId": 128,
    "types": [
     "fighting",
     "fire"
    ]
   },
   {
    "id": "torkoal",
    "ko": "코터스",
    "pokemonId": 324,
    "types": [
     "fire"
    ]
   },
   {
    "id": "brambleghast",
    "ko": "공푸리",
    "pokemonId": 947,
    "types": [
     "grass",
     "ghost"
    ]
   },
   {
    "id": "rillaboom",
    "ko": "고릴타",
    "pokemonId": 812,
    "types": [
     "grass"
    ]
   },
   {
    "id": "salazzle",
    "ko": "염뉴트",
    "pokemonId": 758,
    "types": [
     "poison",
     "fire"
    ]
   },
   {
    "id": "arcanine-hisui",
    "ko": "히스이 윈디",
    "pokemonId": 59,
    "types": [
     "fire",
     "rock"
    ]
   }
  ]
 },
 {
  "id": "normal-05",
  "level": "normal",
  "name": "아로마아가씨",
  "kind": "type-cover",
  "theme": null,
  "party": [
   {
    "id": "toedscruel",
    "ko": "육파리",
    "pokemonId": 949,
    "types": [
     "ground",
     "grass"
    ]
   },
   {
    "id": "incineroar",
    "ko": "어흥염",
    "pokemonId": 727,
    "types": [
     "fire",
     "dark"
    ]
   },
   {
    "id": "samurott-hisui",
    "ko": "히스이 대검귀",
    "pokemonId": 503,
    "types": [
     "water",
     "dark"
    ]
   },
   {
    "id": "arboliva",
    "ko": "올리르바",
    "pokemonId": 930,
    "types": [
     "grass",
     "normal"
    ]
   },
   {
    "id": "leavanny",
    "ko": "모아머",
    "pokemonId": 542,
    "types": [
     "bug",
     "grass"
    ]
   },
   {
    "id": "rillaboom",
    "ko": "고릴타",
    "pokemonId": 812,
    "types": [
     "grass"
    ]
   }
  ]
 },
 {
  "id": "normal-06",
  "level": "normal",
  "name": "아가씨",
  "kind": "type-cover",
  "theme": null,
  "party": [
   {
    "id": "gholdengo",
    "ko": "타부자고",
    "pokemonId": 1000,
    "types": [
     "steel",
     "ghost"
    ]
   },
   {
    "id": "goodra-hisui",
    "ko": "히스이 미끄래곤",
    "pokemonId": 706,
    "types": [
     "steel",
     "dragon"
    ]
   },
   {
    "id": "kingdra",
    "ko": "킹드라",
    "pokemonId": 230,
    "types": [
     "water",
     "dragon"
    ]
   },
   {
    "id": "kingambit",
    "ko": "대도각참",
    "pokemonId": 983,
    "types": [
     "dark",
     "steel"
    ]
   },
   {
    "id": "alcremie-mint-cream-flower-sweet",
    "ko": "마휘핑(밀키민트 · 꽃사탕)",
    "pokemonId": 869,
    "types": [
     "fairy"
    ]
   },
   {
    "id": "florges",
    "ko": "플라제스",
    "pokemonId": 671,
    "types": [
     "fairy"
    ]
   }
  ]
 },
 {
  "id": "normal-07",
  "level": "normal",
  "name": "폭주족",
  "kind": "offense",
  "theme": null,
  "party": [
   {
    "id": "pinsir",
    "ko": "쁘사이저",
    "pokemonId": 127,
    "types": [
     "bug"
    ]
   },
   {
    "id": "aggron",
    "ko": "보스로라",
    "pokemonId": 306,
    "types": [
     "steel",
     "rock"
    ]
   },
   {
    "id": "lilligant-hisui",
    "ko": "히스이 드레디어",
    "pokemonId": 549,
    "types": [
     "grass",
     "fighting"
    ]
   },
   {
    "id": "obstagoon",
    "ko": "가로막구리",
    "pokemonId": 862,
    "types": [
     "dark",
     "normal"
    ]
   },
   {
    "id": "lucario",
    "ko": "루카리오",
    "pokemonId": 448,
    "types": [
     "fighting",
     "steel"
    ]
   },
   {
    "id": "samurott-hisui",
    "ko": "히스이 대검귀",
    "pokemonId": 503,
    "types": [
     "water",
     "dark"
    ]
   }
  ]
 },
 {
  "id": "normal-08",
  "level": "normal",
  "name": "포켓몬브리더",
  "kind": "bulk",
  "theme": null,
  "party": [
   {
    "id": "slowking-galar",
    "ko": "가라르 야도킹",
    "pokemonId": 199,
    "types": [
     "poison",
     "psychic"
    ]
   },
   {
    "id": "lapras",
    "ko": "라프라스",
    "pokemonId": 131,
    "types": [
     "water",
     "ice"
    ]
   },
   {
    "id": "magnezone",
    "ko": "자포코일",
    "pokemonId": 462,
    "types": [
     "electric",
     "steel"
    ]
   },
   {
    "id": "florges-orange",
    "ko": "플라제스(오렌지색 꽃)",
    "pokemonId": 671,
    "types": [
     "fairy"
    ]
   },
   {
    "id": "gardevoir",
    "ko": "가디안",
    "pokemonId": 282,
    "types": [
     "psychic",
     "fairy"
    ]
   },
   {
    "id": "corviknight",
    "ko": "아머까오",
    "pokemonId": 823,
    "types": [
     "flying",
     "steel"
    ]
   }
  ]
 },
 {
  "id": "normal-09",
  "level": "normal",
  "name": "태권왕",
  "kind": "type-concept",
  "theme": "fighting",
  "party": [
   {
    "id": "conkeldurr",
    "ko": "노보청",
    "pokemonId": 534,
    "types": [
     "fighting"
    ]
   },
   {
    "id": "scrafty",
    "ko": "곤율거니",
    "pokemonId": 560,
    "types": [
     "dark",
     "fighting"
    ]
   },
   {
    "id": "annihilape",
    "ko": "저승갓숭",
    "pokemonId": 979,
    "types": [
     "fighting",
     "ghost"
    ]
   },
   {
    "id": "machamp",
    "ko": "괴력몬",
    "pokemonId": 68,
    "types": [
     "fighting"
    ]
   },
   {
    "id": "pawmot",
    "ko": "빠르모트",
    "pokemonId": 923,
    "types": [
     "electric",
     "fighting"
    ]
   },
   {
    "id": "pangoro",
    "ko": "부란다",
    "pokemonId": 675,
    "types": [
     "fighting",
     "dark"
    ]
   }
  ]
 },
 {
  "id": "normal-10",
  "level": "normal",
  "name": "오컬트마니아",
  "kind": "type-concept",
  "theme": "psychic",
  "party": [
   {
    "id": "orbeetle",
    "ko": "이올브",
    "pokemonId": 826,
    "types": [
     "bug",
     "psychic"
    ]
   },
   {
    "id": "slowbro",
    "ko": "야도란",
    "pokemonId": 80,
    "types": [
     "water",
     "psychic"
    ]
   },
   {
    "id": "gallade",
    "ko": "엘레이드",
    "pokemonId": 475,
    "types": [
     "psychic",
     "fighting"
    ]
   },
   {
    "id": "jellicent",
    "ko": "탱탱겔",
    "pokemonId": 593,
    "types": [
     "water",
     "ghost"
    ]
   },
   {
    "id": "gengar",
    "ko": "팬텀",
    "pokemonId": 94,
    "types": [
     "ghost",
     "poison"
    ]
   },
   {
    "id": "dusknoir",
    "ko": "야느와르몽",
    "pokemonId": 477,
    "types": [
     "ghost"
    ]
   }
  ]
 },
 {
  "id": "easy-01",
  "level": "easy",
  "name": "반바지꼬마",
  "kind": "type-concept",
  "theme": "normal",
  "party": [
   {
    "id": "pyroar",
    "ko": "화염레오",
    "pokemonId": 668,
    "types": [
     "fire",
     "normal"
    ]
   },
   {
    "id": "snorlax",
    "ko": "잠만보",
    "pokemonId": 143,
    "types": [
     "normal"
    ]
   },
   {
    "id": "furfrou-diamond",
    "ko": "트리미앙(다이아컷)",
    "pokemonId": 676,
    "types": [
     "normal"
    ]
   },
   {
    "id": "tauros",
    "ko": "켄타로스",
    "pokemonId": 128,
    "types": [
     "normal"
    ]
   },
   {
    "id": "dodrio",
    "ko": "두트리오",
    "pokemonId": 85,
    "types": [
     "normal",
     "flying"
    ]
   },
   {
    "id": "porygon-z",
    "ko": "폴리곤Z",
    "pokemonId": 474,
    "types": [
     "normal"
    ]
   }
  ]
 },
 {
  "id": "easy-02",
  "level": "easy",
  "name": "곤충채집소년",
  "kind": "type-concept",
  "theme": "bug",
  "party": [
   {
    "id": "vikavolt",
    "ko": "투구뿌논",
    "pokemonId": 738,
    "types": [
     "bug",
     "electric"
    ]
   },
   {
    "id": "shuckle",
    "ko": "단단지",
    "pokemonId": 213,
    "types": [
     "bug",
     "rock"
    ]
   },
   {
    "id": "scolipede",
    "ko": "펜드라",
    "pokemonId": 545,
    "types": [
     "bug",
     "poison"
    ]
   },
   {
    "id": "golisopod",
    "ko": "갑주무사",
    "pokemonId": 768,
    "types": [
     "bug",
     "water"
    ]
   },
   {
    "id": "ninjask",
    "ko": "아이스크",
    "pokemonId": 291,
    "types": [
     "bug",
     "flying"
    ]
   },
   {
    "id": "scizor",
    "ko": "핫삼",
    "pokemonId": 212,
    "types": [
     "bug",
     "steel"
    ]
   }
  ]
 },
 {
  "id": "easy-03",
  "level": "easy",
  "name": "짧은치마",
  "kind": "type-concept",
  "theme": "grass",
  "party": [
   {
    "id": "sawsbuck-spring",
    "ko": "바라철록(봄의 모습)",
    "pokemonId": 586,
    "types": [
     "normal",
     "grass"
    ]
   },
   {
    "id": "gogoat",
    "ko": "고고트",
    "pokemonId": 673,
    "types": [
     "grass"
    ]
   },
   {
    "id": "lilligant-hisui",
    "ko": "히스이 드레디어",
    "pokemonId": 549,
    "types": [
     "grass",
     "fighting"
    ]
   },
   {
    "id": "tsareena",
    "ko": "달코퀸",
    "pokemonId": 763,
    "types": [
     "grass"
    ]
   },
   {
    "id": "carnivine",
    "ko": "무스틈니",
    "pokemonId": 455,
    "types": [
     "grass"
    ]
   },
   {
    "id": "sinistcha",
    "ko": "그우린차",
    "pokemonId": 1013,
    "types": [
     "grass",
     "ghost"
    ]
   }
  ]
 },
 {
  "id": "easy-04",
  "level": "easy",
  "name": "도련님",
  "kind": "type-cover",
  "theme": null,
  "party": [
   {
    "id": "blaziken",
    "ko": "번치코",
    "pokemonId": 257,
    "types": [
     "fire",
     "fighting"
    ]
   },
   {
    "id": "blastoise",
    "ko": "거북왕",
    "pokemonId": 9,
    "types": [
     "water"
    ]
   },
   {
    "id": "cherrim-sunshine",
    "ko": "체리꼬(포지폼)",
    "pokemonId": 421,
    "types": [
     "grass"
    ]
   },
   {
    "id": "venusaur",
    "ko": "이상해꽃",
    "pokemonId": 3,
    "types": [
     "grass",
     "poison"
    ]
   },
   {
    "id": "breloom",
    "ko": "버섯모",
    "pokemonId": 286,
    "types": [
     "grass",
     "fighting"
    ]
   },
   {
    "id": "charizard",
    "ko": "리자몽",
    "pokemonId": 6,
    "types": [
     "fire",
     "flying"
    ]
   }
  ]
 },
 {
  "id": "easy-05",
  "level": "easy",
  "name": "쌍둥이",
  "kind": "weather",
  "theme": "sun",
  "party": [
   {
    "id": "ninetales",
    "ko": "나인테일",
    "pokemonId": 38,
    "types": [
     "fire"
    ]
   },
   {
    "id": "torkoal",
    "ko": "코터스",
    "pokemonId": 324,
    "types": [
     "fire"
    ]
   },
   {
    "id": "venusaur",
    "ko": "이상해꽃",
    "pokemonId": 3,
    "types": [
     "grass",
     "poison"
    ]
   },
   {
    "id": "arcanine",
    "ko": "윈디",
    "pokemonId": 59,
    "types": [
     "fire"
    ]
   },
   {
    "id": "victreebel",
    "ko": "우츠보트",
    "pokemonId": 71,
    "types": [
     "grass",
     "poison"
    ]
   },
   {
    "id": "tangrowth",
    "ko": "덩쿠림보",
    "pokemonId": 465,
    "types": [
     "grass"
    ]
   }
  ]
 },
 {
  "id": "easy-06",
  "level": "easy",
  "name": "학원아이",
  "kind": "offense",
  "theme": null,
  "party": [
   {
    "id": "skarmory",
    "ko": "무장조",
    "pokemonId": 227,
    "types": [
     "steel",
     "flying"
    ]
   },
   {
    "id": "throh",
    "ko": "던지미",
    "pokemonId": 538,
    "types": [
     "fighting"
    ]
   },
   {
    "id": "grimmsnarl",
    "ko": "오롱털",
    "pokemonId": 861,
    "types": [
     "dark",
     "fairy"
    ]
   },
   {
    "id": "corviknight",
    "ko": "아머까오",
    "pokemonId": 823,
    "types": [
     "flying",
     "steel"
    ]
   },
   {
    "id": "breloom",
    "ko": "버섯모",
    "pokemonId": 286,
    "types": [
     "grass",
     "fighting"
    ]
   },
   {
    "id": "altaria",
    "ko": "파비코리",
    "pokemonId": 334,
    "types": [
     "dragon",
     "flying"
    ]
   }
  ]
 },
 {
  "id": "easy-07",
  "level": "easy",
  "name": "유치원생",
  "kind": "bulk",
  "theme": null,
  "party": [
   {
    "id": "arboliva",
    "ko": "올리르바",
    "pokemonId": 930,
    "types": [
     "grass",
     "normal"
    ]
   },
   {
    "id": "bastiodon",
    "ko": "바리톱스",
    "pokemonId": 411,
    "types": [
     "rock",
     "steel"
    ]
   },
   {
    "id": "golem",
    "ko": "딱구리",
    "pokemonId": 76,
    "types": [
     "rock",
     "ground"
    ]
   },
   {
    "id": "slowking",
    "ko": "야도킹",
    "pokemonId": 199,
    "types": [
     "water",
     "psychic"
    ]
   },
   {
    "id": "stonjourner",
    "ko": "돌헨진",
    "pokemonId": 874,
    "types": [
     "rock"
    ]
   },
   {
    "id": "dudunsparce",
    "ko": "노고고치",
    "pokemonId": 982,
    "types": [
     "normal"
    ]
   }
  ]
 },
 {
  "id": "easy-08",
  "level": "easy",
  "name": "기타리스트",
  "kind": "type-cover",
  "theme": null,
  "party": [
   {
    "id": "perrserker",
    "ko": "나이킹",
    "pokemonId": 863,
    "types": [
     "steel"
    ]
   },
   {
    "id": "aggron",
    "ko": "보스로라",
    "pokemonId": 306,
    "types": [
     "steel",
     "rock"
    ]
   },
   {
    "id": "togedemaru",
    "ko": "토게데마루",
    "pokemonId": 777,
    "types": [
     "electric",
     "steel"
    ]
   },
   {
    "id": "copperajah",
    "ko": "대왕끼리동",
    "pokemonId": 879,
    "types": [
     "steel"
    ]
   },
   {
    "id": "raichu",
    "ko": "라이츄",
    "pokemonId": 26,
    "types": [
     "electric"
    ]
   },
   {
    "id": "sandslash-alola",
    "ko": "알로라 고지",
    "pokemonId": 28,
    "types": [
     "ice",
     "steel"
    ]
   }
  ]
 },
 {
  "id": "easy-09",
  "level": "easy",
  "name": "백팩커",
  "kind": "type-cover",
  "theme": null,
  "party": [
   {
    "id": "sneasler",
    "ko": "포푸니크",
    "pokemonId": 903,
    "types": [
     "fighting",
     "poison"
    ]
   },
   {
    "id": "stunfisk-galar",
    "ko": "가라르 메더",
    "pokemonId": 618,
    "types": [
     "ground",
     "steel"
    ]
   },
   {
    "id": "scolipede",
    "ko": "펜드라",
    "pokemonId": 545,
    "types": [
     "bug",
     "poison"
    ]
   },
   {
    "id": "swalot",
    "ko": "꿀꺽몬",
    "pokemonId": 317,
    "types": [
     "poison"
    ]
   },
   {
    "id": "qwilfish",
    "ko": "침바루",
    "pokemonId": 211,
    "types": [
     "water",
     "poison"
    ]
   },
   {
    "id": "golurk",
    "ko": "골루그",
    "pokemonId": 623,
    "types": [
     "ground",
     "ghost"
    ]
   }
  ]
 },
 {
  "id": "easy-10",
  "level": "easy",
  "name": "작업원",
  "kind": "weather",
  "theme": "sand",
  "party": [
   {
    "id": "magcargo",
    "ko": "마그카르고",
    "pokemonId": 219,
    "types": [
     "fire",
     "rock"
    ]
   },
   {
    "id": "hippowdon",
    "ko": "하마돈",
    "pokemonId": 450,
    "types": [
     "ground"
    ]
   },
   {
    "id": "krookodile",
    "ko": "악비아르",
    "pokemonId": 553,
    "types": [
     "ground",
     "dark"
    ]
   },
   {
    "id": "skarmory",
    "ko": "무장조",
    "pokemonId": 227,
    "types": [
     "steel",
     "flying"
    ]
   },
   {
    "id": "sandslash",
    "ko": "고지",
    "pokemonId": 28,
    "types": [
     "ground"
    ]
   },
   {
    "id": "drednaw",
    "ko": "갈가부기",
    "pokemonId": 834,
    "types": [
     "water",
     "rock"
    ]
   }
  ]
 },
 {
  "id": "champion-01",
  "level": "champion",
  "name": "챔피언 레드",
  "kind": "champion",
  "theme": null,
  "party": [
   {
    "id": "pikachu",
    "ko": "피카츄",
    "pokemonId": 25,
    "types": [
     "electric"
    ]
   },
   {
    "id": "lapras",
    "ko": "라프라스",
    "pokemonId": 131,
    "types": [
     "water",
     "ice"
    ]
   },
   {
    "id": "snorlax",
    "ko": "잠만보",
    "pokemonId": 143,
    "types": [
     "normal"
    ]
   },
   {
    "id": "venusaur",
    "ko": "이상해꽃",
    "pokemonId": 3,
    "types": [
     "grass",
     "poison"
    ]
   },
   {
    "id": "charizard-mega-y",
    "ko": "메가리자몽Y",
    "pokemonId": 10035,
    "types": [
     "fire",
     "flying"
    ]
   },
   {
    "id": "blastoise",
    "ko": "거북왕",
    "pokemonId": 9,
    "types": [
     "water"
    ]
   }
  ]
 },
 {
  "id": "champion-02",
  "level": "champion",
  "name": "챔피언 그린",
  "kind": "champion",
  "theme": null,
  "party": [
   {
    "id": "gyarados",
    "ko": "갸라도스",
    "pokemonId": 130,
    "types": [
     "water",
     "flying"
    ]
   },
   {
    "id": "alakazam",
    "ko": "후딘",
    "pokemonId": 65,
    "types": [
     "psychic"
    ]
   },
   {
    "id": "pidgeot-mega",
    "ko": "메가피죤투",
    "pokemonId": 10073,
    "types": [
     "normal",
     "flying"
    ]
   },
   {
    "id": "rhyperior",
    "ko": "거대코뿌리",
    "pokemonId": 464,
    "types": [
     "ground",
     "rock"
    ]
   },
   {
    "id": "exeggutor",
    "ko": "나시",
    "pokemonId": 103,
    "types": [
     "grass",
     "psychic"
    ]
   },
   {
    "id": "arcanine",
    "ko": "윈디",
    "pokemonId": 59,
    "types": [
     "fire"
    ]
   }
  ]
 },
 {
  "id": "champion-03",
  "level": "champion",
  "name": "챔피언 목호",
  "kind": "champion",
  "theme": null,
  "party": [
   {
    "id": "aerodactyl",
    "ko": "프테라",
    "pokemonId": 142,
    "types": [
     "rock",
     "flying"
    ]
   },
   {
    "id": "gyarados-mega",
    "ko": "메가갸라도스",
    "pokemonId": 10041,
    "types": [
     "water",
     "dark"
    ]
   },
   {
    "id": "dragonite",
    "ko": "망나뇽",
    "pokemonId": 149,
    "types": [
     "dragon",
     "flying"
    ]
   },
   {
    "id": "kingdra",
    "ko": "킹드라",
    "pokemonId": 230,
    "types": [
     "water",
     "dragon"
    ]
   },
   {
    "id": "charizard",
    "ko": "리자몽",
    "pokemonId": 6,
    "types": [
     "fire",
     "flying"
    ]
   },
   {
    "id": "salamence",
    "ko": "보만다",
    "pokemonId": 373,
    "types": [
     "dragon",
     "flying"
    ]
   }
  ]
 },
 {
  "id": "champion-04",
  "level": "champion",
  "name": "챔피언 성호",
  "kind": "champion",
  "theme": null,
  "party": [
   {
    "id": "armaldo",
    "ko": "아말도",
    "pokemonId": 348,
    "types": [
     "rock",
     "bug"
    ]
   },
   {
    "id": "aggron",
    "ko": "보스로라",
    "pokemonId": 306,
    "types": [
     "steel",
     "rock"
    ]
   },
   {
    "id": "skarmory",
    "ko": "무장조",
    "pokemonId": 227,
    "types": [
     "steel",
     "flying"
    ]
   },
   {
    "id": "claydol",
    "ko": "점토도리",
    "pokemonId": 344,
    "types": [
     "ground",
     "psychic"
    ]
   },
   {
    "id": "metagross-mega",
    "ko": "메가메타그로스",
    "pokemonId": 10076,
    "types": [
     "steel",
     "psychic"
    ]
   },
   {
    "id": "cradily",
    "ko": "릴리요",
    "pokemonId": 346,
    "types": [
     "rock",
     "grass"
    ]
   }
  ]
 },
 {
  "id": "champion-05",
  "level": "champion",
  "name": "챔피언 윤진",
  "kind": "champion",
  "theme": null,
  "party": [
   {
    "id": "milotic",
    "ko": "밀로틱",
    "pokemonId": 350,
    "types": [
     "water"
    ]
   },
   {
    "id": "ludicolo",
    "ko": "로파파",
    "pokemonId": 272,
    "types": [
     "water",
     "grass"
    ]
   },
   {
    "id": "gyarados",
    "ko": "갸라도스",
    "pokemonId": 130,
    "types": [
     "water",
     "flying"
    ]
   },
   {
    "id": "wailord",
    "ko": "고래왕",
    "pokemonId": 321,
    "types": [
     "water"
    ]
   },
   {
    "id": "whiscash",
    "ko": "메깅",
    "pokemonId": 340,
    "types": [
     "water",
     "ground"
    ]
   },
   {
    "id": "tentacruel",
    "ko": "독파리",
    "pokemonId": 73,
    "types": [
     "water",
     "poison"
    ]
   }
  ]
 },
 {
  "id": "champion-06",
  "level": "champion",
  "name": "챔피언 난천",
  "kind": "champion",
  "theme": null,
  "party": [
   {
    "id": "garchomp-mega",
    "ko": "메가한카리아스",
    "pokemonId": 10058,
    "types": [
     "dragon",
     "ground"
    ]
   },
   {
    "id": "spiritomb",
    "ko": "화강돌",
    "pokemonId": 442,
    "types": [
     "ghost",
     "dark"
    ]
   },
   {
    "id": "lucario",
    "ko": "루카리오",
    "pokemonId": 448,
    "types": [
     "fighting",
     "steel"
    ]
   },
   {
    "id": "roserade",
    "ko": "로즈레이드",
    "pokemonId": 407,
    "types": [
     "grass",
     "poison"
    ]
   },
   {
    "id": "togekiss",
    "ko": "토게키스",
    "pokemonId": 468,
    "types": [
     "fairy",
     "flying"
    ]
   },
   {
    "id": "milotic",
    "ko": "밀로틱",
    "pokemonId": 350,
    "types": [
     "water"
    ]
   }
  ]
 },
 {
  "id": "champion-07",
  "level": "champion",
  "name": "챔피언 노간주",
  "kind": "champion",
  "theme": null,
  "party": [
   {
    "id": "accelgor",
    "ko": "어지리더",
    "pokemonId": 617,
    "types": [
     "bug"
    ]
   },
   {
    "id": "bouffalant",
    "ko": "버프론",
    "pokemonId": 626,
    "types": [
     "normal"
    ]
   },
   {
    "id": "escavalier",
    "ko": "슈바르고",
    "pokemonId": 589,
    "types": [
     "bug",
     "steel"
    ]
   },
   {
    "id": "druddigon",
    "ko": "크리만",
    "pokemonId": 621,
    "types": [
     "dragon"
    ]
   },
   {
    "id": "volcarona",
    "ko": "불카모스",
    "pokemonId": 637,
    "types": [
     "bug",
     "fire"
    ]
   },
   {
    "id": "vanilluxe",
    "ko": "배바닐라",
    "pokemonId": 584,
    "types": [
     "ice"
    ]
   }
  ]
 },
 {
  "id": "champion-08",
  "level": "champion",
  "name": "챔피언 아이리스",
  "kind": "champion",
  "theme": null,
  "party": [
   {
    "id": "archeops",
    "ko": "아케오스",
    "pokemonId": 567,
    "types": [
     "rock",
     "flying"
    ]
   },
   {
    "id": "hydreigon",
    "ko": "삼삼드래",
    "pokemonId": 635,
    "types": [
     "dark",
     "dragon"
    ]
   },
   {
    "id": "aggron",
    "ko": "보스로라",
    "pokemonId": 306,
    "types": [
     "steel",
     "rock"
    ]
   },
   {
    "id": "druddigon",
    "ko": "크리만",
    "pokemonId": 621,
    "types": [
     "dragon"
    ]
   },
   {
    "id": "haxorus",
    "ko": "액스라이즈",
    "pokemonId": 612,
    "types": [
     "dragon"
    ]
   },
   {
    "id": "lapras",
    "ko": "라프라스",
    "pokemonId": 131,
    "types": [
     "water",
     "ice"
    ]
   }
  ]
 },
 {
  "id": "champion-09",
  "level": "champion",
  "name": "챔피언 카르네",
  "kind": "champion",
  "theme": null,
  "party": [
   {
    "id": "gardevoir-mega",
    "ko": "메가가디안",
    "pokemonId": 10051,
    "types": [
     "psychic",
     "fairy"
    ]
   },
   {
    "id": "goodra",
    "ko": "미끄래곤",
    "pokemonId": 706,
    "types": [
     "dragon"
    ]
   },
   {
    "id": "tyrantrum",
    "ko": "견고라스",
    "pokemonId": 697,
    "types": [
     "rock",
     "dragon"
    ]
   },
   {
    "id": "hawlucha",
    "ko": "루차불",
    "pokemonId": 701,
    "types": [
     "fighting",
     "flying"
    ]
   },
   {
    "id": "gourgeist",
    "ko": "펌킨인",
    "pokemonId": 711,
    "types": [
     "ghost",
     "grass"
    ]
   },
   {
    "id": "aurorus",
    "ko": "아마루르가",
    "pokemonId": 699,
    "types": [
     "rock",
     "ice"
    ]
   }
  ]
 },
 {
  "id": "champion-10",
  "level": "champion",
  "name": "챔피언 단델",
  "kind": "champion",
  "theme": null,
  "party": [
   {
    "id": "charizard",
    "ko": "리자몽",
    "pokemonId": 6,
    "types": [
     "fire",
     "flying"
    ]
   },
   {
    "id": "aegislash",
    "ko": "킬가르도",
    "pokemonId": 681,
    "types": [
     "steel",
     "ghost"
    ]
   },
   {
    "id": "dragapult",
    "ko": "드래펄트",
    "pokemonId": 887,
    "types": [
     "dragon",
     "ghost"
    ]
   },
   {
    "id": "haxorus",
    "ko": "액스라이즈",
    "pokemonId": 612,
    "types": [
     "dragon"
    ]
   },
   {
    "id": "rhyperior",
    "ko": "거대코뿌리",
    "pokemonId": 464,
    "types": [
     "ground",
     "rock"
    ]
   },
   {
    "id": "seismitoad",
    "ko": "두빅굴",
    "pokemonId": 537,
    "types": [
     "water",
     "ground"
    ]
   }
  ]
 }
];
