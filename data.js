const unlData = [
    { "year": "2004", "male_undergrads": 8278, "female_undergrads": 7406, "men_total": 421, "women_total": 265, "men_unduplicated": 340, "women_unduplicated": 211, "track_women": 106, "football_men": 133, "volleyball_women": 15 },
    { "year": "2005", "male_undergrads": 8339, "female_undergrads": 7429, "men_total": 428, "women_total": 283, "men_unduplicated": 342, "women_unduplicated": 212, "track_women": 128, "football_men": 127, "volleyball_women": 15 },
    { "year": "2006", "male_undergrads": 8339, "female_undergrads": 7429, "men_total": 433, "women_total": 276, "men_unduplicated": 354, "women_unduplicated": 214, "track_women": 114, "football_men": 135, "volleyball_women": 14 },
    { "year": "2007", "male_undergrads": 8995, "female_undergrads": 7762, "men_total": 456, "women_total": 290, "men_unduplicated": 353, "women_unduplicated": 226, "track_women": 118, "football_men": 132, "volleyball_women": 15 },
    { "year": "2008", "male_undergrads": 9345, "female_undergrads": 7938, "men_total": 488, "women_total": 288, "men_unduplicated": 384, "women_unduplicated": 222, "track_women": 116, "football_men": 156, "volleyball_women": 18 },
    { "year": "2009", "male_undergrads": 9583, "female_undergrads": 8154, "men_total": 491, "women_total": 315, "men_unduplicated": 386, "women_unduplicated": 237, "track_women": 115, "football_men": 153, "volleyball_women": 20 },
    { "year": "2010", "male_undergrads": 9774, "female_undergrads": 8355, "men_total": 494, "women_total": 327, "men_unduplicated": 395, "women_unduplicated": 258, "track_women": 127, "football_men": 167, "volleyball_women": 24 },
    { "year": "2011", "male_undergrads": 9677, "female_undergrads": 8362, "men_total": 423, "women_total": 321, "men_unduplicated": 348, "women_unduplicated": 253, "track_women": 126, "football_men": 150, "volleyball_women": 16 },
    { "year": "2012", "male_undergrads": 9604, "female_undergrads": 8162, "men_total": 465, "women_total": 321, "men_unduplicated": 372, "women_unduplicated": 242, "track_women": 123, "football_men": 151, "volleyball_women": 14 },
    { "year": "2013", "male_undergrads": 9697, "female_undergrads": 8405, "men_total": 478, "women_total": 325, "men_unduplicated": 376, "women_unduplicated": 244, "track_women": 126, "football_men": 141, "volleyball_women": 19, "sand_volleyball_women": 0, "overlap_volleyball_women": 0 },
    { "year": "2014", "male_undergrads": 9887, "female_undergrads": 8773, "men_total": 447, "women_total": 316, "men_unduplicated": 356, "women_unduplicated": 240, "track_women": 130, "football_men": 138, "volleyball_women": 16, "sand_volleyball_women": 0, "overlap_volleyball_women": 0 },
    { "year": "2015", "male_undergrads": 9905, "female_undergrads": 8912, "men_total": 414, "women_total": 364, "men_unduplicated": 337, "women_unduplicated": 260, "track_women": 166, "football_men": 138, "volleyball_women": 16, "sand_volleyball_women": 15, "overlap_volleyball_women": 13 },
    { "year": "2016", "male_undergrads": 10022, "female_undergrads": 9359, "men_total": 416, "women_total": 364, "men_unduplicated": 336, "women_unduplicated": 266, "track_women": 151, "football_men": 139, "volleyball_women": 17, "sand_volleyball_women": 16, "overlap_volleyball_women": 14 },
    { "year": "2017", "male_undergrads": 10175, "female_undergrads": 9359, "men_total": 411, "women_total": 366, "men_unduplicated": 330, "women_unduplicated": 272, "track_women": 153, "football_men": 128, "volleyball_women": 16, "sand_volleyball_women": 16, "overlap_volleyball_women": 13 },
    { "year": "2018", "male_undergrads": 10207, "female_undergrads": 9255, "men_total": 442, "women_total": 403, "men_unduplicated": 358, "women_unduplicated": 300, "track_women": 163, "football_men": 158, "volleyball_women": 18, "sand_volleyball_women": 19, "overlap_volleyball_women": 15 },
    { "year": "2019", "male_undergrads": 9941, "female_undergrads": 9189, "men_total": 409, "women_total": 343, "men_unduplicated": 392, "women_unduplicated": 304, "track_women": 114, "football_men": 176, "volleyball_women": 17, "sand_volleyball_women": 18, "overlap_volleyball_women": 16 },
    { "year": "2020", "male_undergrads": 9689, "female_undergrads": 9260, "men_total": 458, "women_total": 379, "men_unduplicated": 391, "women_unduplicated": 281, "track_women": 183, "football_men": 166, "volleyball_women": 20, "sand_volleyball_women": 19, "overlap_volleyball_women": 15 },
    { "year": "2021", "male_undergrads": 9238, "female_undergrads": 9197, "men_total": 428, "women_total": 391, "men_unduplicated": 369, "women_unduplicated": 299, "track_women": 146, "football_men": 155, "volleyball_women": 17, "sand_volleyball_women": 17, "overlap_volleyball_women": 15 },
    { "year": "2022", "male_undergrads": 9015, "female_undergrads": 9155, "men_total": 427, "women_total": 360, "men_unduplicated": 364, "women_unduplicated": 272, "track_women": 152, "football_men": 153, "volleyball_women": 18, "sand_volleyball_women": 18, "overlap_volleyball_women": 14 },
    { "year": "2023", "male_undergrads": 8919, "female_undergrads": 9159, "men_total": 419, "women_total": 348, "men_unduplicated": 345, "women_unduplicated": 266, "track_women": 137, "football_men": 142, "volleyball_women": 17, "sand_volleyball_women": 19, "overlap_volleyball_women": 14 }
];


const peerData2023 = [
    {
        "institution": "Ohio State University",
        "unadjusted_men": 568,
        "unadjusted_women": 529,
        "adjusted_men": 362,
        "adjusted_women": 261,
        "unduplicated_men": 517,
        "unduplicated_women": 455
    },
    {
        "institution": "University of Iowa",
        "unadjusted_men": 369,
        "unadjusted_women": 471,
        "adjusted_men": 369,
        "adjusted_women": 344,
        "unduplicated_men": 301,
        "unduplicated_women": 378
    },
    {
        "institution": "University of Minnesota",
        "unadjusted_men": 321,
        "unadjusted_women": 385,
        "adjusted_men": 263,
        "adjusted_women": 291,
        "unduplicated_men": 305,
        "unduplicated_women": 310
    },
    {
        "institution": "University of Nebraska",
        "unadjusted_men": 419,
        "unadjusted_women": 348,
        "adjusted_men": 419,
        "adjusted_women": 348,
        "unduplicated_men": 345,
        "unduplicated_women": 266
    },
    {
        "institution": "University of Kansas",
        "unadjusted_men": 322,
        "unadjusted_women": 336,
        "adjusted_men": 322,
        "adjusted_women": 268,
        "unduplicated_men": 250,
        "unduplicated_women": 262
    },
    {
        "institution": "Purdue University",
        "unadjusted_men": 380,
        "unadjusted_women": 281,
        "adjusted_men": 342,
        "adjusted_women": 232,
        "unduplicated_men": 327,
        "unduplicated_women": 213
    },
    {
        "institution": "Iowa State University",
        "unadjusted_men": 333,
        "unadjusted_women": 264,
        "adjusted_men": 333,
        "adjusted_women": 264,
        "unduplicated_men": 259,
        "unduplicated_women": 203
    },
    {
        "institution": "University of Missouri",
        "unadjusted_men": 361,
        "unadjusted_women": 259,
        "adjusted_men": 336,
        "adjusted_women": 259,
        "unduplicated_men": 300,
        "unduplicated_women": 195
    },
    {
        "institution": "University of Illinois",
        "unadjusted_men": 320,
        "unadjusted_women": 250,
        "adjusted_men": 320,
        "adjusted_women": 250,
        "unduplicated_men": 277,
        "unduplicated_women": 202
    },
    {
        "institution": "University of Colorado",
        "unadjusted_men": 299,
        "unadjusted_women": 238,
        "adjusted_men": 285,
        "adjusted_women": 194,
        "unduplicated_men": 221,
        "unduplicated_women": 187
    }
];
