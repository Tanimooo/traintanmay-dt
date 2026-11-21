/* The formulae you are given in Edexcel A level Maths (9MA0), laid out like the Pearson booklet
   "Mathematical Formulae and Statistical Tables". Shown in the live data-sheet panel (../datasheet.js).
   Critical values for the PMCC were computed from the exact null distribution of r and match the printed tables. */
(function () {
  var PMCC = [[4,'0.8000','0.9000','0.9500','0.9800','0.9900'],[5,'0.6870','0.8054','0.8783','0.9343','0.9587'],[6,'0.6084','0.7293','0.8114','0.8822','0.9172'],[7,'0.5509','0.6694','0.7545','0.8329','0.8745'],[8,'0.5067','0.6215','0.7067','0.7887','0.8343'],[9,'0.4716','0.5822','0.6664','0.7498','0.7977'],[10,'0.4428','0.5494','0.6319','0.7155','0.7646'],[11,'0.4187','0.5214','0.6021','0.6851','0.7348'],[12,'0.3981','0.4973','0.5760','0.6581','0.7079'],[13,'0.3802','0.4762','0.5529','0.6339','0.6835'],[14,'0.3646','0.4575','0.5324','0.6120','0.6614'],[15,'0.3507','0.4409','0.5140','0.5923','0.6411'],[16,'0.3383','0.4259','0.4973','0.5742','0.6226'],[17,'0.3271','0.4124','0.4821','0.5577','0.6055'],[18,'0.3170','0.4000','0.4683','0.5425','0.5897'],[19,'0.3077','0.3887','0.4555','0.5285','0.5751'],[20,'0.2992','0.3783','0.4438','0.5155','0.5614'],[21,'0.2914','0.3687','0.4329','0.5034','0.5487'],[22,'0.2841','0.3598','0.4227','0.4921','0.5368'],[23,'0.2774','0.3515','0.4132','0.4815','0.5256'],[24,'0.2711','0.3438','0.4044','0.4716','0.5151'],[25,'0.2653','0.3365','0.3961','0.4622','0.5052'],[26,'0.2598','0.3297','0.3882','0.4534','0.4958'],[27,'0.2546','0.3233','0.3809','0.4451','0.4869'],[28,'0.2497','0.3172','0.3739','0.4372','0.4785'],[29,'0.2451','0.3115','0.3673','0.4297','0.4705'],[30,'0.2407','0.3061','0.3610','0.4226','0.4629'],[35,'0.2220','0.2826','0.3338','0.3916','0.4296'],[40,'0.2070','0.2638','0.3120','0.3665','0.4026'],[45,'0.1947','0.2483','0.2940','0.3457','0.3801'],[50,'0.1843','0.2353','0.2787','0.3281','0.3610'],[60,'0.1678','0.2144','0.2542','0.2997','0.3301'],[70,'0.1550','0.1982','0.2352','0.2776','0.3060'],[80,'0.1448','0.1852','0.2199','0.2597','0.2864'],[90,'0.1364','0.1745','0.2072','0.2449','0.2702'],[100,'0.1292','0.1654','0.1966','0.2324','0.2565']];
  var NORM = [['0.5000','0.0000'],['0.4000','0.2533'],['0.3000','0.5244'],['0.2000','0.8416'],['0.1500','1.0364'],['0.1000','1.2816'],['0.0500','1.6449'],['0.0250','1.9600'],['0.0100','2.3263'],['0.0050','2.5758'],['0.0010','3.0902'],['0.0005','3.2905']];

  var H = '' +
  '<style>.fbk{max-width:760px;margin:0 auto;line-height:1.55}.fbk h2{font-size:1.15rem;margin:22px 0 6px;padding-bottom:4px;border-bottom:2px solid currentColor}.fbk h2:first-of-type{margin-top:4px}' +
  '.fbk h3{font-size:.98rem;margin:14px 0 4px}.fbk p{margin:4px 0}.fbk .d{overflow-x:auto;margin:6px 0}.fbk .n{font-size:.85rem;opacity:.75}' +
  '.fbk table{border-collapse:collapse;font-size:.85rem;font-variant-numeric:tabular-nums;margin:6px 0}.fbk th,.fbk td{border:1px solid rgba(120,128,140,.45);padding:3px 8px;text-align:center}.fbk th{background:rgba(120,128,140,.12)}' +
  '.fbk .tw{overflow-x:auto}.fbk .src{font-size:.8rem;opacity:.7;margin-top:20px}</style>' +
  '<div class="fbk">' +
  '<p class="n">Pearson Edexcel AS and A level Mathematics: the formulae and tables you are given in the exam. Anything not here (e.g. the cosine rule, $\\sin^2 x+\\cos^2 x=1$, quadratic formula) you must learn.</p>' +

  '<h2>Pure Mathematics</h2>' +
  '<h3>Mensuration</h3><p>Surface area of sphere $= 4\\pi r^2$</p><p>Area of curved surface of cone $= \\pi r \\times \\text{slant height}$</p>' +

  '<h3>Arithmetic series</h3><div class="d">$$u_n = a + (n-1)d$$$$S_n = \\tfrac12 n(a+l) = \\tfrac12 n\\,[2a + (n-1)d]$$</div>' +

  '<h3>Binomial series</h3><div class="d">$$(a+b)^n = a^n + {}^nC_1\\, a^{n-1}b + {}^nC_2\\, a^{n-2}b^2 + \\dots + {}^nC_r\\, a^{n-r}b^r + \\dots + b^n \\quad (n\\in\\mathbb{N})$$</div>' +
  '<p>where ${}^nC_r = \\dbinom{n}{r} = \\dfrac{n!}{r!\\,(n-r)!}$</p>' +
  '<div class="d">$$(1+x)^n = 1 + nx + \\frac{n(n-1)}{1\\times 2}x^2 + \\dots + \\frac{n(n-1)\\dots(n-r+1)}{1\\times 2\\times\\dots\\times r}x^r + \\dots \\quad (|x|<1,\\ n\\in\\mathbb{R})$$</div>' +

  '<h3>Logarithms and exponentials</h3><div class="d">$$\\log_a x = \\frac{\\log_b x}{\\log_b a}$$$$e^{x\\ln a} = a^x$$</div>' +

  '<h3>Geometric series</h3><div class="d">$$u_n = ar^{n-1}$$$$S_n = \\frac{a(1-r^n)}{1-r}$$$$S_\\infty = \\frac{a}{1-r}\\ \\text{ for } |r|<1$$</div>' +

  '<h3>Trigonometric identities</h3><div class="d">$$\\sin(A\\pm B) = \\sin A\\cos B \\pm \\cos A\\sin B$$$$\\cos(A\\pm B) = \\cos A\\cos B \\mp \\sin A\\sin B$$$$\\tan(A\\pm B) = \\frac{\\tan A\\pm\\tan B}{1\\mp\\tan A\\tan B} \\quad \\big(A\\pm B \\ne (k+\\tfrac12)\\pi\\big)$$' +
  '$$\\sin A+\\sin B = 2\\sin\\frac{A+B}{2}\\cos\\frac{A-B}{2}$$$$\\sin A-\\sin B = 2\\cos\\frac{A+B}{2}\\sin\\frac{A-B}{2}$$$$\\cos A+\\cos B = 2\\cos\\frac{A+B}{2}\\cos\\frac{A-B}{2}$$$$\\cos A-\\cos B = -2\\sin\\frac{A+B}{2}\\sin\\frac{A-B}{2}$$</div>' +

  '<h3>Small angle approximations</h3><div class="d">$$\\sin\\theta\\approx\\theta$$$$\\cos\\theta\\approx 1-\\frac{\\theta^2}{2}$$$$\\tan\\theta\\approx\\theta$$</div><p class="n">where $\\theta$ is measured in radians.</p>' +

  '<h3>Differentiation</h3><p>First principles: $\\displaystyle f\'(x) = \\lim_{h\\to 0}\\frac{f(x+h)-f(x)}{h}$</p>' +
  '<div class="tw"><table><tr><th>$f(x)$</th><th>$f\'(x)$</th></tr><tr><td>$\\tan kx$</td><td>$k\\sec^2 kx$</td></tr><tr><td>$\\sec x$</td><td>$\\sec x\\tan x$</td></tr><tr><td>$\\cot x$</td><td>$-\\operatorname{cosec}^2 x$</td></tr><tr><td>$\\operatorname{cosec} x$</td><td>$-\\operatorname{cosec} x\\cot x$</td></tr><tr><td>$\\dfrac{f(x)}{g(x)}$</td><td>$\\dfrac{f\'(x)g(x)-f(x)g\'(x)}{\\big(g(x)\\big)^2}$</td></tr></table></div>' +

  '<h3>Integration</h3><p class="n">(+ constant)</p><div class="tw"><table><tr><th>$f(x)$</th><th>$\\int f(x)\\,dx$</th></tr><tr><td>$\\sec^2 kx$</td><td>$\\frac1k\\tan kx$</td></tr><tr><td>$\\tan kx$</td><td>$\\frac1k\\ln|\\sec kx|$</td></tr><tr><td>$\\cot kx$</td><td>$\\frac1k\\ln|\\sin kx|$</td></tr></table></div>' +
  '<div class="d">$$\\int u\\frac{dv}{dx}\\,dx = uv - \\int v\\frac{du}{dx}\\,dx$$</div>' +

  '<h3>Numerical methods</h3><p>The trapezium rule: $\\displaystyle\\int_a^b y\\,dx \\approx \\tfrac12 h\\{(y_0+y_n) + 2(y_1+y_2+\\dots+y_{n-1})\\}$, where $h=\\dfrac{b-a}{n}$</p>' +
  '<p>The Newton–Raphson iteration for solving $f(x)=0$: $\\displaystyle x_{n+1} = x_n - \\frac{f(x_n)}{f\'(x_n)}$</p>' +

  '<h2>Mechanics</h2><h3>Kinematics</h3><p class="n">For motion in a straight line with constant acceleration:</p>' +
  '<div class="d">$$v = u+at$$$$s = ut+\\tfrac12 at^2$$$$s = \\left(\\frac{u+v}{2}\\right)t$$$$v^2 = u^2+2as$$$$s = vt-\\tfrac12 at^2$$</div>' +
  '<p class="n">and in vector form:</p><div class="d">$$\\mathbf v = \\mathbf u+\\mathbf at$$$$\\mathbf r = \\mathbf ut+\\tfrac12\\mathbf at^2$$$$\\mathbf r = \\tfrac12(\\mathbf u+\\mathbf v)t$$$$\\mathbf r = \\mathbf vt-\\tfrac12\\mathbf at^2$$</div>' +

  '<h2>Statistics</h2><h3>Probability</h3><div class="d">$$P(A\') = 1-P(A)$$$$P(A\\cup B) = P(A)+P(B)-P(A\\cap B)$$$$P(A\\cap B) = P(A)\\,P(B\\mid A)$$' +
  '$$P(A\\mid B) = \\frac{P(B\\mid A)\\,P(A)}{P(B\\mid A)\\,P(A) + P(B\\mid A\')\\,P(A\')}$$</div>' +
  '<p>For independent events $A$ and $B$: $P(B\\mid A)=P(B)$, $P(A\\mid B)=P(A)$, $P(A\\cap B)=P(A)\\,P(B)$</p>' +

  '<h3>Standard deviation</h3><div class="d">$$\\text{Standard deviation} = \\sqrt{\\text{Variance}}$$$$\\text{Interquartile range} = IQR = Q_3 - Q_1$$</div>' +
  '<p>For a set of $n$ values $x_1,\\dots,x_n$: $\\displaystyle S_{xx} = \\sum(x_i-\\bar x)^2 = \\sum x_i^2 - \\frac{(\\sum x_i)^2}{n}$</p>' +
  '<div class="d">$$\\text{Standard deviation} = \\sqrt{\\frac{S_{xx}}{n}} \\ \\text{ or } \\ \\sqrt{\\frac{\\sum x^2}{n} - \\bar x^2}$$</div>' +

  '<h3>Discrete distributions</h3><p>Binomial $X\\sim B(n,p)$: $\\ P(X=x) = \\dbinom{n}{x}p^x(1-p)^{n-x}$, $\\ $ mean $np$, $\\ $ variance $np(1-p)$</p>' +

  '<h3>Sampling distributions</h3><p>For a random sample $X_1,\\dots,X_n$ of $n$ independent observations from $N(\\mu,\\sigma^2)$: $\\ \\bar X\\sim N\\!\\left(\\mu,\\dfrac{\\sigma^2}{n}\\right)$ and $\\dfrac{\\bar X-\\mu}{\\sigma/\\sqrt n}\\sim N(0,1)$</p>' +

  '<h2>Statistical tables</h2>' +
  '<h3>Percentage points of the normal distribution</h3><p class="n">The values $z$ in the table are those which a random variable $Z\\sim N(0,1)$ exceeds with probability $p$; that is, $P(Z>z)=1-\\Phi(z)=p$.</p>' +
  '<div class="tw"><table><tr><th>$p$</th><th>$z$</th><th>$p$</th><th>$z$</th></tr>' +
  NORM.slice(0, 6).map(function (r, i) { var s = NORM[i + 6]; return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + s[0] + '</td><td>' + s[1] + '</td></tr>'; }).join('') + '</table></div>' +
  '<h3>Critical values for correlation coefficients</h3><p class="n">Product moment coefficient, $r$. Sample size $n$.</p>' +
  '<div class="tw"><table><tr><th colspan="5">Level (one tail)</th><th rowspan="2">$n$</th></tr><tr><th>0.10</th><th>0.05</th><th>0.025</th><th>0.01</th><th>0.005</th></tr>' +
  PMCC.map(function (r) { return '<tr><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '</td><td>' + r[5] + '</td><th>' + r[0] + '</th></tr>'; }).join('') + '</table></div>' +
  '<p class="n">Two-tail levels are double the one-tail ones (0.20, 0.10, 0.05, 0.02, 0.01). Binomial cumulative probabilities: use your calculator\'s binomial CD function, as the exam allows.</p>' +
  '<p class="src">Typed up from the Pearson Edexcel formulae booklet for revision. If anything here disagrees with the official booklet, the booklet wins.</p>' +
  '</div>';

  window.TT_MATHS_FORMULAE = function (el) {
    el.innerHTML = H;
    try { renderMathInElement(el, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], throwOnError: false }); } catch (e) {}
  };
})();
