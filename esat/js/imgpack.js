/* ESAT questions, live from UAT-UK.
   No question images are stored on this site any more. Each question is shown from the official
   ENGAA / NSAA / TMUA paper on UAT-UK's own website (esat-tmua.ac.uk), cropped live to just that question by crop.js.
   window.esatLive(q) returns the HTML for a question; answers and worked solutions are ours. */
(function () {
  const S3 = 'https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/';
  // [question paper, answer key / worked answers] for each paper, as listed on esat-tmua.ac.uk
  const P = {
    'ENGAA 2016': ['2024/05/07112055/ENGAA_2016_S1_QuestionPaper.pdf', '2024/05/07112109/ENGAA_2016_S1_AnswerKey.pdf'],
    'ENGAA 2017': ['2024/05/07112231/ENGAA_2017_S1_QuestionPaper.pdf', '2024/05/07112228/ENGAA_2017_S1_AnswerKey.pdf'],
    'ENGAA 2018': ['2024/05/07113017/ENGAA_2018_S1_QuestionPaper.pdf', '2024/05/07113023/ENGAA_2018_S1_AnswerKey.pdf'],
    'ENGAA 2019': ['2024/05/07115511/ENGAA_2019_S1_QuestionPaper.pdf', '2024/05/07115515/ENGAA_2019_S1_AnswerKey.pdf'],
    'ENGAA 2020': ['2024/05/07115613/ENGAA_2020_S1_QuestionPaper.pdf', '2024/05/07115614/ENGAA_2020_S1_AnswerKey.pdf'],
    'ENGAA 2021': ['2024/05/07115611/ENGAA_2021_S1_QuestionPaper.pdf', '2024/05/07115613/ENGAA_2021_S1_AnswerKey.pdf'],
    'ENGAA 2022': ['2024/05/07115611/ENGAA_2022_S1_QuestionPaper.pdf', '2024/05/07115612/ENGAA_2022_S1_AnswerKey.pdf'],
    'ENGAA 2023': ['2024/05/07115605/ENGAA_2023_S1_QuestionPaper.pdf', '2024/05/07115610/ENGAA_2023_S1_AnswerKey.pdf'],
    'NSAA 2016': ['2024/05/07120539/NSAA_2016_S1_QuestionPaper.pdf', '2024/05/07120540/NSAA_2016_S1_AnswerKey.pdf'],
    'NSAA 2017': ['2024/05/07120538/NSAA_2017_S1_QuestionPaper.pdf', '2024/05/07120538/NSAA_2017_S1_AnswerKey.pdf'],
    'NSAA 2018': ['2024/05/07120537/NSAA_2018_S1_QuestionPaper.pdf', '2024/05/07120537/NSAA_2018_S1_AnswerKey.pdf'],
    'NSAA 2019': ['2024/05/07120534/NSAA_2019_S1_QuestionPaper.pdf', '2024/05/07120535/NSAA_2019_S1_AnswerKey.pdf'],
    'NSAA 2020': ['2024/05/07120533/NSAA_2020_S1_QuestionPaper.pdf', '2024/05/07120535/NSAA_2020_S1_AnswerKey.pdf'],
    'NSAA 2021': ['2024/05/07120532/NSAA_2021_S1_QuestionPaper.pdf', '2024/05/07120532/NSAA_2021_S1_AnswerKey.pdf'],
    'NSAA 2022': ['2024/05/07120525/NSAA_2022_S1_QuestionPaper.pdf', '2024/05/07120531/NSAA_2022_S1_AnswerKey.pdf'],
    'NSAA 2023': ['2024/05/07120523/NSAA_2023_S1_QuestionPaper.pdf', '2024/05/07120531/NSAA_2023_S1_AnswerKey.pdf'],
    'TMUA 2016': ['2024/05/07125112/TMUA-2016-paper-1.pdf', '2024/05/07125113/TMUA-2016-paper-1-worked-answers.pdf'],
    'TMUA 2017': ['2024/05/07125230/TMUA-2017-paper-1.pdf', '2024/05/07125231/TMUA-2017-paper-1-worked-answers.pdf'],
    'TMUA 2018': ['2024/05/07125407/TMUA-2018-paper-1.pdf', '2024/05/07125413/TMUA-2018-paper-1-worked-answers.pdf'],
    'TMUA 2019': ['2024/05/07140825/TMUA-2019-paper-1.pdf', '2024/05/07140826/TMUA-2019-paper-1-worked-answers.pdf'],
    'TMUA 2020': ['2024/05/07140953/TMUA-2020-paper-1.pdf', '2024/05/07140955/TMUA-2020-paper-1-worked-answers.pdf'],
    'TMUA 2021': ['2024/05/07141119/TMUA-2021-paper-1.pdf', '2024/05/07141121/TMUA-2021-paper-1-worked-answers.pdf'],
    'TMUA 2022': ['2024/05/07141241/TMUA-2022-paper-1.pdf', '2024/06/04105226/TMUA-2022-paper-1-worked-answers.pdf'],
    'TMUA 2023': ['2024/04/30144109/TMUA-2023-paper-1.pdf', '2024/06/04105227/TMUA-2023-paper-1-worked-answers.pdf'],
    'TMUA specimen': ['2024/05/07141417/TMUA-early-specimen-paper-1.pdf', '2024/05/07141418/TMUA-early-specimen-paper-1-worked-answers.pdf']
  };
  function paperOf(q) {
    const y = /specimen/i.test(q.year) || /specimen/i.test(q.img || '') ? 'specimen' : q.year;
    return P[q.exam + ' ' + y] || null;
  }
  window.esatLive = function (q, opts) {
    const p = paperOf(q);
    const part = /Part B/.test(q.source) ? ' (Part B)' : /Part A/.test(q.source) ? ' (Part A)' : '';
    const card = {
      ms: p && S3 + p[1], msLabel: q.exam === 'TMUA' ? 'Worked answers' : 'Answer key',
      q: q.qno + part, title: q.exam + ' ' + q.year, source: 'UAT-UK (esat-tmua.ac.uk)', embed: !(opts && opts.noEmbed)
    };
    // crop just this question out of the official paper (crop.js); falls back to the paper card if it can't
    if (window.ttCrop && p) return window.ttCrop.html({ url: S3 + p[0], q: String(q.qno), kind: 'qp', typeset: true, card: card });
    return window.ttLive.card(Object.assign({ url: p && S3 + p[0] }, card));
  };
})();
