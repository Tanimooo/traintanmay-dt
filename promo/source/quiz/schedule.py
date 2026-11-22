import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from script import LINES
D = json.load(open('voice/durations.json'))
t = .12; lines = []
for sid, say, cap, gap in LINES:
    d = D[sid]; words = cap.split(' ')
    # word timings: spread over the line by length (with a small weight per word and extra after punctuation)
    w = [len(re.sub(r'[^\w½²×√]', '', x)) + 2.2 + (2.5 if re.search(r'[.,?!…]$', x) else 0) for x in words]
    tot = sum(w); acc = 0; wt = []
    for x, ww in zip(words, w): wt.append(round(t + d * acc / tot, 3)); acc += ww
    lines.append({'id': sid, 'start': round(t, 3), 'dur': d, 'end': round(t + d, 3), 'caption': cap, 'words': words, 'wordTimes': wt})
    t += d + gap
total = round(t + .25, 2)
json.dump({'total': total, 'lines': lines}, open('../www/quiz/schedule.json', 'w'), indent=1)
print('total', total); [print(l['id'], l['start'], l['end']) for l in lines]
