/* ============================================================
   Revision hub content — "Know Before You Sit".
   Each entry: [section, title, markdown with LaTeX].
   IDs are derived from tab + title, so keep titles stable: they key the
   user's "learned" ticks in storage.
   ============================================================ */
'use strict';

const HUB_TABS = [
  ['m1', 'Maths 1', 'M1'],
  ['m2', 'Maths 2', 'M2'],
  ['ph', 'Physics', 'P'],
  ['un', 'Units & constants', 'U'],
  ['sp', 'Spec checklist', '✓'],
];

const HUB_RAW = {
  /* ------------------------------ MATHS 1 ------------------------------ */
  m1: [
    ['Number', 'Index laws', '$a^m\\times a^n=a^{m+n}$, $\\ a^m\\div a^n=a^{m-n}$, $\\ (a^m)^n=a^{mn}$\n\n$a^0=1$, $\\ a^{-n}=\\dfrac1{a^n}$, $\\ a^{1/n}=\\sqrt[n]{a}$, $\\ a^{m/n}=\\left(\\sqrt[n]{a}\\right)^m$'],
    ['Number', 'Standard form', '$a\\times10^n$ with $1\\le a<10$ and $n$ an integer. Multiply: multiply the $a$s, add the powers. Divide: divide the $a$s, subtract the powers. Re-normalise at the end.'],
    ['Number', 'Surds', '$\\sqrt{ab}=\\sqrt a\\sqrt b$, $\\ \\sqrt{\\dfrac ab}=\\dfrac{\\sqrt a}{\\sqrt b}$, $\\ \\sqrt a\\times\\sqrt a=a$\n\nRationalise: $\\dfrac1{\\sqrt a}=\\dfrac{\\sqrt a}a$ and $\\dfrac1{\\sqrt a+\\sqrt b}=\\dfrac{\\sqrt a-\\sqrt b}{a-b}$'],
    ['Number', 'Fractions, decimals, percentages', 'Percentage change: multiplier $1\\pm\\dfrac r{100}$. Reverse percentage: **divide** by the multiplier. Compound change: $P\\left(1\\pm\\dfrac r{100}\\right)^n$.\n\nRecurring decimals: $0.\\dot3=\\dfrac13$; for $x=0.\\dot1\\dot2$ do $100x-x=12$, so $x=\\dfrac{12}{99}=\\dfrac4{33}$.'],
    ['Number', 'Factors, multiples, primes', '$\\text{HCF}\\times\\text{LCM}=a\\times b$ for two numbers. Prime factorisation $N=p^a q^b\\dots$ has $(a+1)(b+1)\\dots$ factors. Primes below 50: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47.'],
    ['Number', 'Counting and listing', 'Multiplication principle: $m$ ways then $n$ ways gives $m\\times n$. Order matters: $n!$ arrangements of $n$ different items. Choosing $r$ from $n$ (order irrelevant): $\\dbinom nr=\\dfrac{n!}{r!(n-r)!}$.'],
    ['Number', 'Estimation and bounds', 'Round to 1 significant figure first: $\\pi\\approx3.14$, $\\sqrt2\\approx1.41$, $\\sqrt3\\approx1.73$, $g=10$. Bounds: max of $a+b$ uses upper bounds; max of $a-b$ is $a_{\\max}-b_{\\min}$; max of $a/b$ is $a_{\\max}/b_{\\min}$. Rounding to $d$ d.p. gives error $\\pm0.5\\times10^{-d}$.'],
    ['Units', 'Unit conversions', '1 m = 100 cm; 1 m² = 10 000 cm²; 1 m³ = 10⁶ cm³ = 1000 L; 1 L = 1000 cm³. Speed: 1 m/s = 3.6 km/h, so $36\\text{ km/h}=10\\text{ m/s}$. Convert area and volume by squaring and cubing the length factor.'],
    ['Units', 'Compound units', '$\\text{speed}=\\dfrac{\\text{distance}}{\\text{time}}$, $\\ \\text{density}=\\dfrac{\\text{mass}}{\\text{volume}}$, $\\ \\text{pressure}=\\dfrac{\\text{force}}{\\text{area}}$, $\\ \\text{unit price}=\\dfrac{\\text{cost}}{\\text{quantity}}$. Check units at the end: wrong units mean a wrong method.'],
    ['Ratio and proportion', 'Ratio and sharing', 'To share $T$ in ratio $a:b$: parts $=a+b$, one part $=\\dfrac T{a+b}$. Scale factor $k$ means every length is multiplied by $k$.'],
    ['Ratio and proportion', 'Direct and inverse proportion', 'Direct: $y=kx$ (straight line through the origin). $y\\propto x^2$: $y=kx^2$. Inverse: $y=\\dfrac kx$ (xy constant). Find $k$ from one pair of values, then use it.'],
    ['Ratio and proportion', 'Similar shapes', 'Linear scale factor $k$: lengths $\\times k$, areas $\\times k^2$, volumes $\\times k^3$. So a volume ratio $8:27$ means a length ratio $2:3$.'],
    ['Algebra', 'Expanding and factorising', '$(a\\pm b)^2=a^2\\pm2ab+b^2$, $\\ a^2-b^2=(a-b)(a+b)$.\n\n$x^2+bx+c=(x+p)(x+q)$ with $pq=c$, $p+q=b$. For $ax^2+bx+c$ find two numbers with product $ac$ and sum $b$.'],
    ['Algebra', 'Quadratic formula and discriminant', '$ax^2+bx+c=0\\Rightarrow x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}$\n\nDiscriminant $b^2-4ac$: $>0$ two real roots, $=0$ one repeated root, $<0$ no real roots.'],
    ['Algebra', 'Completing the square', '$x^2+bx+c=\\left(x+\\dfrac b2\\right)^2+c-\\dfrac{b^2}4$, so the turning point is $\\left(-\\dfrac b2,\\ c-\\dfrac{b^2}4\\right)$. Roots sum to $-\\dfrac ba$ and multiply to $\\dfrac ca$.'],
    ['Algebra', 'Straight lines', '$y=mx+c$; $m=\\dfrac{y_2-y_1}{x_2-x_1}$; $y-y_1=m(x-x_1)$. Parallel: $m_1=m_2$. Perpendicular: $m_1m_2=-1$. Midpoint $\\left(\\dfrac{x_1+x_2}2,\\dfrac{y_1+y_2}2\\right)$; length $\\sqrt{(\\Delta x)^2+(\\Delta y)^2}$.'],
    ['Algebra', 'Sequences', 'Linear: $u_n=a+(n-1)d$. Quadratic: $u_n=an^2+bn+c$ where **half the constant second difference** is $a$. Term-to-term rule: $u_{n+1}=f(u_n)$.'],
    ['Algebra', 'Inequalities and rearranging', 'Multiplying or dividing an inequality by a negative **reverses** it. Quadratic inequality: sketch the parabola and read off the regions. To rearrange, do the same to both sides and collect the subject on one side before factorising.'],
    ['Algebra', 'Graphs to recognise', 'Reciprocal $y=\\dfrac1x$ (two branches, asymptotes at the axes); cubic $y=x^3$; exponential $y=a^x$ through $(0,1)$; parabola $y=ax^2+bx+c$ opens up if $a>0$, y-intercept at $c$. Gradient of a distance-time graph is speed; area under a velocity-time graph is distance.'],
    ['Geometry', 'Angle facts', 'Angles on a line sum to 180°; at a point 360°; triangle 180°; quadrilateral 360°. Polygon with $n$ sides: interior sum $(n-2)\\times180°$, each regular exterior angle $\\dfrac{360°}n$. Alternate angles equal; co-interior sum to 180°.'],
    ['Geometry', 'Circle theorems', '1. Angle at the centre is **twice** the angle at the circumference.\n2. Angle in a semicircle is 90°.\n3. Angles in the same segment are equal.\n4. Opposite angles of a cyclic quadrilateral sum to 180°.\n5. Tangent is perpendicular to the radius; two tangents from a point are equal.\n6. Alternate segment theorem. Perpendicular from the centre bisects a chord.'],
    ['Geometry', 'Pythagoras and trig', '$a^2+b^2=c^2$; 3D diagonal $\\sqrt{a^2+b^2+c^2}$. $\\sin\\theta=\\dfrac{\\text{opp}}{\\text{hyp}}$, $\\cos\\theta=\\dfrac{\\text{adj}}{\\text{hyp}}$, $\\tan\\theta=\\dfrac{\\text{opp}}{\\text{adj}}$.\n\nTriples: 3-4-5, 5-12-13, 8-15-17, 7-24-25, 20-21-29.'],
    ['Geometry', 'Exact trig values', '| θ | 0° | 30° | 45° | 60° | 90° |\n|---|---|---|---|---|---|\n| sin | 0 | ½ | $\\frac{1}{\\sqrt2}$ | $\\frac{\\sqrt3}2$ | 1 |\n| cos | 1 | $\\frac{\\sqrt3}2$ | $\\frac{1}{\\sqrt2}$ | ½ | 0 |\n| tan | 0 | $\\frac1{\\sqrt3}$ | 1 | $\\sqrt3$ | — |'],
    ['Geometry', 'Areas and perimeters', 'Triangle $\\tfrac12bh$; parallelogram $bh$; trapezium $\\tfrac12(a+b)h$; circle $\\pi r^2$, circumference $2\\pi r$. Arc length $\\dfrac\\theta{360}\\times2\\pi r$; sector area $\\dfrac\\theta{360}\\times\\pi r^2$.'],
    ['Geometry', 'Volumes and surface areas', 'Prism $=$ area of cross-section $\\times$ length. Cylinder $\\pi r^2h$, curved area $2\\pi rh$. Cone $\\tfrac13\\pi r^2h$, curved area $\\pi rl$. Pyramid $\\tfrac13Ah$. Sphere $\\tfrac43\\pi r^3$, area $4\\pi r^2$.'],
    ['Geometry', 'Congruence, vectors, bearings', 'Congruent: SSS, SAS, ASA, RHS. Vectors add head to tail; $k\\mathbf a$ is parallel to $\\mathbf a$; position vector of the midpoint is the average. Bearings: measured clockwise from North, three figures. Back bearing: $\\pm180°$.'],
    ['Statistics and probability', 'Averages and charts', 'Mean $=\\dfrac{\\sum x}n$; for a frequency table $\\dfrac{\\sum fx}{\\sum f}$ (use mid-points for grouped data and call it an estimate). Median is the middle value; range = max − min. Histogram: frequency density $=\\dfrac{\\text{frequency}}{\\text{class width}}$, area is frequency.'],
    ['Statistics and probability', 'Probability rules', '$0\\le P\\le1$; $P(\\text{not }A)=1-P(A)$. Mutually exclusive: $P(A\\text{ or }B)=P(A)+P(B)$. Independent: $P(A\\text{ and }B)=P(A)P(B)$. General: $P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$. Expected number $=n\\times p$.'],
    ['Statistics and probability', 'Conditional probability', '$P(B\\mid A)=\\dfrac{P(A\\cap B)}{P(A)}$. On a tree diagram multiply along branches, add between branches. Without replacement the second-stage probabilities change.'],
  ],

  /* ------------------------------ MATHS 2 ------------------------------ */
  m2: [
    ['Algebra and functions', 'Indices and surds (all rationals)', '$a^{m/n}=\\left(\\sqrt[n]a\\right)^m$, $\\ a^{-n}=\\dfrac1{a^n}$. Rationalise using the conjugate: $\\dfrac{1}{a+\\sqrt b}=\\dfrac{a-\\sqrt b}{a^2-b}$.'],
    ['Algebra and functions', 'Quadratics', 'Discriminant $\\Delta=b^2-4ac$. Completing the square: $ax^2+bx+c=a\\left(x+\\dfrac b{2a}\\right)^2+c-\\dfrac{b^2}{4a}$. Turning point $x=-\\dfrac b{2a}$. Sum of roots $-\\dfrac ba$, product $\\dfrac ca$.'],
    ['Algebra and functions', 'Simultaneous equations', 'Line and quadratic: substitute the linear into the quadratic and solve. Discriminant of the result tells you how many intersections: $>0$ two, $=0$ tangent, $<0$ none.'],
    ['Algebra and functions', 'Inequalities', 'Linear: reverse the sign when multiplying or dividing by a negative. Quadratic: factorise, sketch, read off ($>0$ outside the roots for a positive parabola, $<0$ between).'],
    ['Algebra and functions', 'Polynomials: factor theorem', '$(x-a)$ is a factor of $f(x)$ **iff** $f(a)=0$. Remainder on dividing by $(x-a)$ is $f(a)$; by $(ax+b)$ it is $f(-b/a)$. A polynomial of degree $n$ has at most $n$ real roots.'],
    ['Algebra and functions', 'Functions', 'A function maps each input to exactly one output (one-to-one or many-to-one). Domain = allowed inputs, range = outputs. $fg(x)=f(g(x))$: do $g$ first. Inverse: swap $x$ and $y$ and rearrange; its graph is the reflection in $y=x$. Watch $\\sqrt{\\ }$, $\\dfrac1x$ and $\\ln x$ domains.'],
    ['Sequences and series', 'Arithmetic series', '$u_n=a+(n-1)d$. $S_n=\\dfrac n2\\big(2a+(n-1)d\\big)=\\dfrac n2(a+l)$. Sum of first $n$ natural numbers $=\\dfrac{n(n+1)}2$.'],
    ['Sequences and series', 'Geometric series', '$u_n=ar^{n-1}$. $S_n=\\dfrac{a(1-r^n)}{1-r}$. Sum to infinity $S_\\infty=\\dfrac a{1-r}$ **only if $|r|<1$**.'],
    ['Sequences and series', 'Binomial expansion', '$(a+b)^n=\\sum_{r=0}^n\\dbinom nr a^{n-r}b^r$ for positive integer $n$; $\\dbinom nr=\\dfrac{n!}{r!(n-r)!}$.\n\n$(1+x)^n=1+nx+\\dfrac{n(n-1)}{2!}x^2+\\dfrac{n(n-1)(n-2)}{3!}x^3+\\dots$ For $(a+f(x))^n$ factor out $a^n$ first.'],
    ['Sequences and series', 'Recurrence', '$x_{n+1}=f(x_n)$: iterate. A fixed point satisfies $x=f(x)$. Sigma notation $\\sum_{r=1}^{n}$ means add the terms.'],
    ['Coordinate geometry', 'Straight line', '$y-y_1=m(x-x_1)$; $ax+by+c=0$ has gradient $-\\dfrac ab$. Parallel: equal gradients. Perpendicular: $m_1m_2=-1$. Perpendicular bisector of AB passes through the midpoint with gradient $-1/m_{AB}$.'],
    ['Coordinate geometry', 'Circles', '$(x-a)^2+(y-b)^2=r^2$: centre $(a,b)$, radius $r$. From $x^2+y^2+cx+dy+e=0$: centre $\\left(-\\dfrac c2,-\\dfrac d2\\right)$, $\\ r^2=\\dfrac{c^2}4+\\dfrac{d^2}4-e$. Tangent at a point is perpendicular to the radius there.'],
    ['Coordinate geometry', 'Circle properties', 'Perpendicular from the centre bisects a chord. Angle at the centre is twice the angle at the circumference. Angle in a semicircle is 90°. A chord and tangent meet at 90° only at the radius.'],
    ['Trigonometry', 'Sine rule, cosine rule, area', '$\\dfrac a{\\sin A}=\\dfrac b{\\sin B}=\\dfrac c{\\sin C}$ (ambiguous case: ASS may give two triangles). $a^2=b^2+c^2-2bc\\cos A$. Area $=\\tfrac12ab\\sin C$.'],
    ['Trigonometry', 'Radians', '$\\pi\\text{ rad}=180°$. Arc $s=r\\theta$. Sector $A=\\tfrac12r^2\\theta$. Segment $=\\tfrac12r^2(\\theta-\\sin\\theta)$. $30°=\\dfrac\\pi6$, $45°=\\dfrac\\pi4$, $60°=\\dfrac\\pi3$, $90°=\\dfrac\\pi2$.'],
    ['Trigonometry', 'Identities', '$\\tan\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}$, $\\quad\\sin^2\\theta+\\cos^2\\theta=1$. Use the second to turn $\\cos^2$ into $1-\\sin^2$ and get a quadratic in $\\sin\\theta$.'],
    ['Trigonometry', 'Graphs and symmetries', '$\\sin$, $\\cos$: period $360°$ ($2\\pi$), range $[-1,1]$. $\\tan$: period $180°$ ($\\pi$), asymptotes at $90°+180°n$. $\\sin(180°-\\theta)=\\sin\\theta$; $\\cos(-\\theta)=\\cos\\theta$; $\\cos(180°-\\theta)=-\\cos\\theta$; $\\sin(-\\theta)=-\\sin\\theta$; $\\tan(180°+\\theta)=\\tan\\theta$. CAST diagram for the signs.'],
    ['Trigonometry', 'Solving trig equations', '1. Find the principal value. 2. Use symmetry for the second solution ($180°-\\theta$ for sin; $360°-\\theta$ for cos; $+180°$ for tan). 3. Add periods and keep only values in the interval. For $\\sin kx$ divide the interval by $k$ first.'],
    ['Exponentials and logs', 'Exponential graph', '$y=a^x$ ($a>1$) passes through $(0,1)$, is always positive, increasing, with the x-axis as asymptote. For $0<a<1$ it decays.'],
    ['Exponentials and logs', 'Laws of logarithms', '$a^b=c\\iff b=\\log_ac$. $\\ \\log_ax+\\log_ay=\\log_a(xy)$, $\\ \\log_ax-\\log_ay=\\log_a\\dfrac xy$, $\\ k\\log_ax=\\log_a x^k$. $\\log_a1=0$, $\\log_aa=1$, $\\log_a\\dfrac1x=-\\log_ax$.'],
    ['Exponentials and logs', 'Solving a^x = b equations', 'Take logs of both sides: $x=\\dfrac{\\log b}{\\log a}$. If the equation is quadratic in $a^x$, substitute $y=a^x$ first, e.g. $25^x-3\\cdot5^x+2=0$. Match bases when you can: $3^{2x}=9\\Rightarrow x=1$.'],
    ['Differentiation', 'Rules', '$\\dfrac{d}{dx}(kx^n)=knx^{n-1}$ for any rational $n$; constants go to 0; differentiate sums term by term. Rewrite roots and reciprocals as powers first: $\\sqrt x=x^{1/2}$, $\\dfrac1{x^2}=x^{-2}$.'],
    ['Differentiation', 'Tangents and normals', 'Gradient of the tangent at $x=a$ is $f\'(a)$. Normal gradient $=-\\dfrac1{f\'(a)}$. Tangent: $y-f(a)=f\'(a)(x-a)$.'],
    ['Differentiation', 'Stationary points', '$f\'(x)=0$. Then $f\'\'(x)>0$ minimum; $f\'\'(x)<0$ maximum. $f\'(x)>0$ strictly increasing; $f\'(x)<0$ strictly decreasing. Rate of change: $\\dfrac{dy}{dx}$ is change in $y$ per unit $x$.'],
    ['Integration', 'Rules', '$\\displaystyle\\int x^n\\,dx=\\dfrac{x^{n+1}}{n+1}+c$ for $n\\neq-1$. Integrate sums term by term; simplify first (expand brackets, split fractions). Do not forget $+c$ for indefinite integrals.'],
    ['Integration', 'Definite integrals and area', '$\\displaystyle\\int_a^bf(x)\\,dx=F(b)-F(a)$. The integral gives signed area: parts below the x-axis count negative. **Area** = split at the roots and add the magnitudes.'],
    ['Integration', 'Fundamental theorem', '$\\dfrac d{dx}\\displaystyle\\int_a^xf(t)\\,dt=f(x)$. Differentiation and integration undo each other. $\\displaystyle\\int_a^b=-\\int_b^a$ and $\\displaystyle\\int_a^b+\\int_b^c=\\int_a^c$.'],
    ['Integration', 'Trapezium rule', '$\\displaystyle\\int_a^by\\,dx\\approx\\dfrac h2\\Big[y_0+y_n+2(y_1+\\dots+y_{n-1})\\Big]$ with $h=\\dfrac{b-a}n$. **Overestimates** where the curve is convex (curving up, $f\'\'>0$); underestimates where concave.'],
    ['Integration', 'Differential equations', '$\\dfrac{dy}{dx}=f(x)\\Rightarrow y=\\int f(x)dx$. Use a given point to find $c$.'],
    ['Graphs of functions', 'Transformations', '$y=f(x)+a$: up $a$. $y=f(x+a)$: **left** $a$. $y=af(x)$: stretch in y by $a$. $y=f(ax)$: stretch in x by $\\dfrac1a$. $y=-f(x)$: reflect in the x-axis. $y=f(-x)$: reflect in the y-axis.'],
    ['Graphs of functions', 'Quadratic shapes', '$y=a(x+b)^2+c$ has vertex $(-b,c)$ and is $y=ax^2$ shifted left $b$ and up $c$. $y=mx+c$: $m$ is the steepness, $c$ the y-intercept.'],
    ['Graphs of functions', 'Sketching checklist', 'Axis intercepts ($x=0$ and $y=0$); stationary points; behaviour for large $|x|$; asymptotes; symmetry. Common graphs: lines, quadratics, cubics, trig, $\\log$, $a^x$, $\\sqrt x$, $|x|$. Intersections of two graphs are the solutions of the simultaneous equations.'],
  ],

  /* ------------------------------ PHYSICS ------------------------------ */
  ph: [
    ['Electricity', 'Charge, current, p.d.', '$Q=It$ (coulombs = amps × seconds). Potential difference $V=\\dfrac WQ$ (energy per unit charge). Electrons move from − to +, conventional current from + to −.'],
    ['Electricity', 'Ohm\'s law and resistance', '$V=IR$. Series: $R=R_1+R_2+\\dots$, same current. Parallel: $\\dfrac1R=\\dfrac1{R_1}+\\dfrac1{R_2}$, same p.d., currents add. Two equal parallel resistors give half.'],
    ['Electricity', 'Electrical power and energy', '$P=IV=I^2R=\\dfrac{V^2}R$. Energy $E=Pt=QV$. Fuse: choose the next rating above $I=\\dfrac PV$.'],
    ['Electricity', 'Circuit components', 'Diode: current in one direction only. LDR: resistance falls as light increases. Thermistor (NTC): resistance falls as temperature rises. Ammeter in **series**, voltmeter in **parallel**. AC alternates; DC is one direction.'],
    ['Electricity', 'Static electricity', 'Friction transfers electrons: gain means negative, loss means positive. Like charges repel, unlike attract. Earthing removes excess charge safely.'],
    ['Magnetism', 'Fields and the motor effect', 'Field lines run N to S and are closest where the field is strongest. Straight wire: concentric circles; solenoid: like a bar magnet. $F=BIL$ for a wire at right angles to the field. Left-hand rule: First finger = Field, seCond = Current, thuMb = Motion (force).'],
    ['Magnetism', 'Electromagnetic induction', 'A voltage is induced when a conductor cuts field lines or the field through a coil changes. Bigger with a **stronger magnet, more turns, faster movement**. Reversing motion or the magnet reverses the voltage. An ac generator spins a coil in a field; faster spin means greater and higher-frequency output.'],
    ['Magnetism', 'Transformers', '$\\dfrac{V_s}{V_p}=\\dfrac{n_s}{n_p}$. Step-up: $n_s>n_p$. 100% efficient: $V_pI_p=V_sI_s$. High-voltage transmission means lower current and so less $I^2R$ heating loss.'],
    ['Mechanics', 'Speed, velocity, acceleration', '$v=\\dfrac st$, $\\ a=\\dfrac{\\Delta v}t$. Vectors have direction (displacement, velocity, force); scalars do not (distance, speed, mass). Gradient of a displacement-time graph is velocity; gradient of a velocity-time graph is acceleration; **area** under it is displacement.'],
    ['Mechanics', 'Equations of motion (constant a)', '$v=u+at$\n\n$s=\\dfrac{(u+v)}2t$\n\n$s=ut+\\tfrac12at^2$\n\n$v^2=u^2+2as$\n\nFree fall near Earth: $a=g=10\\text{ m/s}^2$.'],
    ['Mechanics', 'Newton\'s laws', '1: no resultant force means constant velocity (including at rest). 2: $F=ma$ (resultant force). 3: forces come in equal and opposite pairs acting on **different** bodies. Mass resists change in motion (inertia).'],
    ['Mechanics', 'Weight and free fall', '$W=mg$ with $g=10\\text{ N/kg}$ (or $\\text{m/s}^2$). Mass is constant; weight depends on the field strength. At terminal velocity: weight = drag, resultant 0, $a=0$.'],
    ['Mechanics', 'Momentum', '$p=mv$. Conserved in a collision with no external force: $m_1u_1+m_2u_2=m_1v_1+m_2v_2$. $F=\\dfrac{\\Delta p}{t}$. Kinetic energy is not always conserved (inelastic collisions lose it).'],
    ['Mechanics', 'Work, energy, power', '$W=Fd$ (in the direction of the force). $\\text{GPE}=mgh$. $\\text{KE}=\\tfrac12mv^2$. $P=\\dfrac Et=\\dfrac Wt$. Efficiency $=\\dfrac{\\text{useful output}}{\\text{total input}}$. Falling from rest: $v=\\sqrt{2gh}$.'],
    ['Mechanics', 'Springs (Hooke\'s law)', '$F=kx$ up to the limit of proportionality. Stored energy $E=\\tfrac12kx^2=\\tfrac12Fx$ (area under the F-x graph). Series springs are softer; parallel springs are stiffer.'],
    ['Thermal physics', 'Heat capacity', '$\\Delta Q=mc\\Delta T$, with $c$ in J/(kg °C). Water: $c=4200$ J/(kg °C). Electrical heater: $Pt=mc\\Delta T$.'],
    ['Thermal physics', 'Heat transfer', 'Conduction: vibrations and free electrons through solids; metals conduct best. Convection: warmer fluid is less dense and rises. Radiation: infrared; dark, matt surfaces absorb and emit best; no medium needed.'],
    ['Matter', 'Density and pressure', '$\\rho=\\dfrac mV$. $p=\\dfrac FA$. Liquid: $p=h\\rho g$. Pressure rises with depth and density, not with container shape. Upthrust equals the weight of fluid displaced.'],
    ['Matter', 'Gases and states', '$pV=\\text{constant}$ at constant temperature (Boyle). Gas pressure is from particle collisions with the walls; higher temperature means faster particles and more pressure at fixed volume. Solids: fixed lattice; liquids: close but move; gases: far apart, random.'],
    ['Matter', 'Changes of state', '$E=mL$: latent heat of fusion for melting; of vaporisation for boiling. Temperature stays **constant** during a change of state while energy goes into breaking bonds.'],
    ['Waves', 'Wave equation', '$v=f\\lambda$, $\\ T=\\dfrac1f$. Transverse: oscillation perpendicular to the direction of travel (light, water). Longitudinal: parallel (sound); compressions and rarefactions. Waves carry energy, not matter.'],
    ['Waves', 'Reflection and refraction', 'Angle of incidence = angle of reflection (measured from the normal). Refraction: speed and wavelength change at a boundary; **frequency stays the same**. Into a slower medium the ray bends **towards** the normal. Doppler effect: source approaching gives higher observed frequency.'],
    ['Waves', 'Sound', 'Needs a medium. Louder means larger amplitude; higher pitch means higher frequency. Human hearing 20 Hz to 20 kHz. Speed in air about 340 m/s. Echo: $d=\\dfrac{vt}2$. Ultrasound is above 20 kHz.'],
    ['Waves', 'Electromagnetic spectrum', 'Order from long wavelength: **radio, micro, infrared, visible, ultraviolet, X-ray, gamma**. All transverse and travel at $3\\times10^8$ m/s in a vacuum. Higher frequency means more energy.'],
    ['Radioactivity', 'Atomic structure', 'Proton: relative mass 1, charge +1. Neutron: 1, 0. Electron: about 1/2000, −1. Nuclide ${}^{A}_{Z}X$: $Z$ protons (atomic number), $A-Z$ neutrons, $A$ = mass number. Isotopes: same $Z$, different $A$.'],
    ['Radioactivity', 'Decay and nuclear equations', 'Alpha ${}^4_2\\alpha$: $A-4$, $Z-2$. Beta-minus ${}^{\\ 0}_{-1}\\beta$: $A$ unchanged, $Z+1$. Gamma: no change. Check that top and bottom numbers balance on both sides. Decay is random but the rate is predictable.'],
    ['Radioactivity', 'Ionising radiation', 'Ionising power: alpha > beta > gamma. Penetration: alpha stopped by paper, beta by a few mm of aluminium, gamma reduced by thick lead. In a magnetic or electric field alpha and beta deflect in opposite directions; gamma is unaffected.'],
    ['Radioactivity', 'Half-life', 'After $n$ half-lives the remaining fraction is $\\left(\\tfrac12\\right)^n$. Activity and count rate halve in each half-life; remember to subtract background count rate.'],
  ],

  /* ------------------------------ UNITS & CONSTANTS ------------------------------ */
  un: [
    ['SI units', 'Base quantities', 'Length m · mass kg · time s · current A · temperature K (or °C) · amount mol. Everything else is derived from these.'],
    ['SI units', 'Force, energy, power', 'Force N = kg m s⁻². Work, energy J = N m = kg m² s⁻². Power W = J s⁻¹. Pressure Pa = N m⁻². Momentum kg m s⁻¹. Impulse N s.'],
    ['SI units', 'Electricity units', 'Charge C = A s. p.d. V = J C⁻¹. Resistance Ω = V A⁻¹. Frequency Hz = s⁻¹. Power W = V A.'],
    ['SI units', 'Prefixes', 'p 10⁻¹² · n 10⁻⁹ · µ 10⁻⁶ · m 10⁻³ · c 10⁻² · k 10³ · M 10⁶ · G 10⁹. A big source of lost marks: convert **before** substituting.'],
    ['Dimension checks', 'Checking an answer by units', 'Both sides of an equation must have the same units. Only quantities with the same units can be added. Arguments of $\\sin$, $\\log$, $e^x$ are dimensionless. Eliminating options by their units often takes 10 seconds.'],
    ['Constants for the exam', 'Values to use', '$g=10$ N/kg · $\\pi\\approx3.14$ · speed of light $3\\times10^8$ m/s · speed of sound in air ≈ 340 m/s · specific heat capacity of water 4200 J/(kg °C) · density of water 1000 kg/m³ · $\\sqrt2\\approx1.41$ · $\\sqrt3\\approx1.73$.'],
    ['Constants for the exam', 'Quick-reference conversions', '1 kWh = 3.6 MJ · 1 tonne = 1000 kg · 1 L = 1000 cm³ = 10⁻³ m³ · 0 °C = 273 K · 1 hour = 3600 s · 1 day = 86 400 s.'],
  ],
};

/* Build final item list with stable IDs. */
const HUB_ITEMS = [];
(() => {
  const slug = (s) =>
    s
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  Object.keys(HUB_RAW).forEach((tab) => {
    HUB_RAW[tab].forEach(([sec, t, md]) => {
      HUB_ITEMS.push({ id: `${tab}:${slug(sec)}:${slug(t)}`, tab, sec, t, md });
    });
  });
})();

/* The spec checklist is built from data/spec.json (generated from the official
   content specification) so every item has its official code. */
