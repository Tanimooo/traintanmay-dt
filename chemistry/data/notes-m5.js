/* Full topic notes, Module 5: Physical chemistry and transition elements. Replace the short notes in m5.js (loaded after it). */
(function(){
const N={};

N['5.1.1']=`
<h2>Orders and the rate equation</h2>
<p>For a reaction A + B → products, experiments show that the rate depends on the concentrations of the reactants raised to some power:</p>
<div class="eqgrid"><div>$$\\text{rate}=k[\\mathrm{A}]^m[\\mathrm{B}]^n$$</div></div>
<ul>
<li><strong>m</strong> and <strong>n</strong> are the <strong>orders of reaction</strong> with respect to A and B. They are usually 0, 1 or 2 and can <strong>only be found by experiment</strong>; they are not the coefficients in the balanced equation.</li>
<li>The <strong>overall order</strong> is m + n.</li>
<li><strong>k</strong> is the <strong>rate constant</strong>: the constant of proportionality. It is fixed for a reaction at a given temperature; it gets larger as temperature rises.</li>
</ul>
<h3>What each order means</h3>
<div class="tbl"><table><tr><th>Order in A</th><th>If [A] doubles, rate…</th><th>Why</th></tr>
<tr><td>0</td><td>stays the same</td><td>[A]⁰ = 1: A doesn't appear in the rate equation</td></tr>
<tr><td>1</td><td>doubles</td><td>2¹ = 2</td></tr>
<tr><td>2</td><td>quadruples</td><td>2² = 4</td></tr></table></div>
<h3>Units of k</h3>
<p>Rearrange the rate equation for k and cancel the units (rate is in mol dm⁻³ s⁻¹, concentrations in mol dm⁻³).</p>
<div class="wex"><p><strong>Worked example.</strong> rate = k[A]²[B]. Find the units of k.</p>
$$k=\\dfrac{\\text{rate}}{[\\mathrm{A}]^2[\\mathrm{B}]}=\\dfrac{\\text{mol dm}^{-3}\\,\\text{s}^{-1}}{(\\text{mol dm}^{-3})^3}=\\dfrac{1}{(\\text{mol dm}^{-3})^2\\,\\text{s}}=\\mathbf{dm^6\\,mol^{-2}\\,s^{-1}}$$
<p>Quick rule: overall order 1 gives s⁻¹; order 2 gives dm³ mol⁻¹ s⁻¹; order 3 gives dm⁶ mol⁻² s⁻¹.</p></div>

<h2>Finding orders from initial rates</h2>
<p>The <strong>initial rate</strong> is the rate at the very start (t = 0), when concentrations are known exactly. Run the reaction several times, changing the concentration of one reactant at a time, and compare.</p>
<div class="wex"><p><strong>Worked example.</strong> For 2NO(g) + O₂(g) → 2NO₂(g):</p>
<div class="tbl"><table><tr><th>Run</th><th>[NO] / mol dm⁻³</th><th>[O₂] / mol dm⁻³</th><th>Initial rate / mol dm⁻³ s⁻¹</th></tr>
<tr><td>1</td><td>0.010</td><td>0.010</td><td>2.5 × 10⁻⁵</td></tr>
<tr><td>2</td><td>0.020</td><td>0.010</td><td>1.0 × 10⁻⁴</td></tr>
<tr><td>3</td><td>0.020</td><td>0.020</td><td>2.0 × 10⁻⁴</td></tr></table></div>
<p>Runs 1→2: [NO] × 2, [O₂] constant, rate × 4: <strong>second order in NO</strong>.</p>
<p>Runs 2→3: [O₂] × 2, [NO] constant, rate × 2: <strong>first order in O₂</strong>.</p>
<p>So rate = k[NO]²[O₂], which is third order overall. From run 1:</p>$$k=\\dfrac{\\text{rate}}{[\\mathrm{NO}]^2[\\mathrm{O_2}]}=\\dfrac{2.5\\times 10^{-5}}{(0.010)^2\\times 0.010}=\\mathbf{25}\\ \\text{dm}^6\\,\\text{mol}^{-2}\\,\\text{s}^{-1}$$</div>
<h3>Clock reactions</h3>
<p>In a clock reaction you measure the time t for a fixed, small amount of product to form (shown by a sudden colour change). Over that short time the rate is close to the initial rate, and <strong>initial rate ∝ 1/t</strong>. In the <strong>iodine clock</strong>, a little thiosulfate removes iodine as it forms; when the thiosulfate runs out, free iodine turns starch blue-black. Repeat with different concentrations, keeping the total volume constant by adding water (PAG 10).</p>

<h2>Concentration–time graphs</h2>
<p>For <strong>continuous monitoring</strong> (PAG 9), you follow one reaction over time: measure gas volume, mass loss, or colour (with a colorimeter) at regular intervals and plot concentration against time. The rate at any time is the gradient of the tangent.</p>
<svg class="diagram" viewBox="0 0 560 210" role="img" aria-label="Concentration-time graphs: zero order is a straight line down; first order is a curve with constant half-life">
<g><line class="ax" x1="30" y1="180" x2="250" y2="180" marker-end="url(#ah)"/><line class="ax" x1="30" y1="180" x2="30" y2="20" marker-end="url(#ah)"/><line class="c1" x1="30" y1="40" x2="220" y2="175"/><text x="34" y="30" class="small">[A]</text><text x="225" y="198" class="small">time</text><text x="80" y="200" class="small">zero order: straight line</text></g>
<g transform="translate(290 0)"><line class="ax" x1="30" y1="180" x2="250" y2="180" marker-end="url(#ah)"/><line class="ax" x1="30" y1="180" x2="30" y2="20" marker-end="url(#ah)"/><path class="c1" d="M30 40 Q70 115 110 110 Q170 160 240 172"/>
<line class="dimline dash" x1="30" y1="110" x2="110" y2="110"/><line class="dimline dash" x1="110" y1="110" x2="110" y2="180"/><line class="dimline dash" x1="30" y1="145" x2="175" y2="145"/><line class="dimline dash" x1="175" y1="145" x2="175" y2="180"/>
<text x="60" y="195" class="small">t½</text><text x="135" y="195" class="small">t½</text><text x="34" y="30" class="small">[A]</text><text x="70" y="208" class="small">first order: constant half-life</text></g>
</svg>
<ul>
<li><strong>Zero order</strong>: a straight line with a constant negative gradient (the rate doesn't change as A is used up).</li>
<li><strong>First order</strong>: a curve with a <strong>constant half-life</strong>: the time for [A] to halve is the same whatever the starting concentration.</li>
<li><strong>Second order</strong>: a steeper curve whose half-life gets longer as the reaction proceeds.</li>
</ul>
<p>The <strong>half-life, t<sub>½</sub></strong>, is the time taken for the concentration of a reactant to fall to half its value. For a first-order reaction:</p>
<div class="eqgrid"><div>$$k=\\dfrac{\\ln 2}{t_{1/2}}\\approx\\dfrac{0.693}{t_{1/2}}$$</div></div>
<div class="wex"><p><strong>Worked example.</strong> A first-order reaction has a half-life of 40 s. Find k.</p>
$$k=\\dfrac{\\ln 2}{t_{1/2}}=\\dfrac{0.693}{40}=\\mathbf{0.0173}\\ \\text{s}^{-1}$$</div>

<h2>Rate–concentration graphs</h2>
<svg class="diagram" viewBox="0 0 560 200" role="img" aria-label="Rate against concentration graphs: zero order horizontal, first order straight line through origin, second order upward curve">
<g><line class="ax" x1="20" y1="170" x2="170" y2="170" marker-end="url(#ah)"/><line class="ax" x1="20" y1="170" x2="20" y2="25" marker-end="url(#ah)"/><line class="c1" x1="20" y1="100" x2="160" y2="100"/><text x="24" y="35" class="small">rate</text><text x="50" y="190" class="small">zero order</text></g>
<g transform="translate(190 0)"><line class="ax" x1="20" y1="170" x2="170" y2="170" marker-end="url(#ah)"/><line class="ax" x1="20" y1="170" x2="20" y2="25" marker-end="url(#ah)"/><line class="c1" x1="20" y1="170" x2="160" y2="50"/><text x="24" y="35" class="small">rate</text><text x="45" y="190" class="small">first order (gradient = k)</text></g>
<g transform="translate(380 0)"><line class="ax" x1="20" y1="170" x2="170" y2="170" marker-end="url(#ah)"/><line class="ax" x1="20" y1="170" x2="20" y2="25" marker-end="url(#ah)"/><path class="c1" d="M20 170 Q110 165 160 40"/><text x="24" y="35" class="small">rate</text><text x="50" y="190" class="small">second order</text></g>
</svg>
<p>For first order, the straight line through the origin has <strong>gradient = k</strong>.</p>

<h2>The rate-determining step</h2>
<p>Most reactions happen in several steps (the <strong>mechanism</strong>). The slowest step controls the overall rate: it is the <strong>rate-determining step</strong>.</p>
<ul>
<li>The rate equation tells you which species are involved in (or before) the rate-determining step, and how many of each: if rate = k[A]²[B], the slow step involves two A and one B.</li>
<li>A species that is zero order doesn't take part until after the rate-determining step.</li>
<li>A proposed mechanism must add up to the overall equation, and its slow step must match the rate equation.</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> 2NO₂ + F₂ → 2NO₂F has rate = k[NO₂][F₂]. Suggest a two-step mechanism.</p>
<p>Slow step must have one NO₂ and one F₂: <strong>NO₂ + F₂ → NO₂F + F</strong> (slow).</p>
<p>Second step uses the rest: <strong>NO₂ + F → NO₂F</strong> (fast). The two steps add up to the overall equation.</p></div>

<h2>The Arrhenius equation</h2>
<p>The rate constant increases with temperature (more molecules have E ≥ E<sub>a</sub>, see 3.2.2). The relationship is the <strong>Arrhenius equation</strong>:</p>
<div class="eqgrid"><div>$$k=Ae^{-E_a/RT}$$</div><div>$$\\ln k=-\\dfrac{E_a}{R}\\cdot\\dfrac{1}{T}+\\ln A$$</div></div>
<ul>
<li>A is the <strong>pre-exponential factor</strong>, related to collision frequency and orientation; E<sub>a</sub> in J mol⁻¹; R = 8.314 J mol⁻¹ K⁻¹; T in K.</li>
<li>The log form has the shape y = mx + c: plot <strong>ln k against 1/T</strong> to get a straight line with <strong>gradient = −E<sub>a</sub>/R</strong> and <strong>y-intercept = ln A</strong>.</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> A graph of ln k against 1/T has gradient −9800 K. Find E<sub>a</sub>.</p>
$$-\\dfrac{E_a}{R}=-9800\\ \\Rightarrow\\ E_a=9800\\times 8.314=81\\,477\\ \\text{J mol}^{-1}=\\mathbf{81.5}\\ \\text{kJ mol}^{-1}$$</div>
<blockquote class="tip"><p><strong>Exam tip:</strong> when finding orders from a table, choose two runs where only one concentration changes. If both change, divide out the effect of the one you already know.</p></blockquote>
`;

N['5.1.2']=`
<h2>K<sub>c</sub> expressions</h2>
<p>For aA + bB ⇌ cC + dD, using equilibrium concentrations (introduced in 3.2.3):</p>$$K_c=\\dfrac{[\\mathrm{C}]^c[\\mathrm{D}]^d}{[\\mathrm{A}]^a[\\mathrm{B}]^b}$$
<ul>
<li><strong>Homogeneous</strong> equilibrium: all species in the same phase. Every species appears.</li>
<li><strong>Heterogeneous</strong> equilibrium: species in different phases. <strong>Solids</strong> (and pure liquids, where present as a separate phase) are <strong>left out</strong>, because their concentration is constant.</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> Write K<sub>c</sub> for C(s) + H₂O(g) ⇌ CO(g) + H₂(g) and give its units.</p>
$$K_c=\\dfrac{[\\mathrm{CO}][\\mathrm{H_2}]}{[\\mathrm{H_2O}]}$$$$\\text{units: }\\dfrac{(\\text{mol dm}^{-3})^2}{\\text{mol dm}^{-3}}=\\mathbf{mol\\ dm^{-3}}$$</div>
<h3>Units of K<sub>c</sub></h3>
<p>Substitute mol dm⁻³ for each concentration and cancel. If the powers top and bottom are equal, K<sub>c</sub> has <strong>no units</strong>.</p>

<h2>Calculating K<sub>c</sub></h2>
<p>Use an <strong>initial / change / equilibrium</strong> table in <strong>moles</strong>, using the equation's ratio for the change row. Then divide by the volume to get concentrations, and substitute.</p>
<div class="wex"><p><strong>Worked example.</strong> 1.00 mol of ethanoic acid and 1.00 mol of ethanol are mixed. At equilibrium, 0.667 mol of ethyl ethanoate is present. Total volume V. Find K<sub>c</sub>.</p>
<p>CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O</p>
<div class="tbl"><table><tr><th></th><th>CH₃COOH</th><th>C₂H₅OH</th><th>ester</th><th>H₂O</th></tr>
<tr><td>Initial / mol</td><td>1.00</td><td>1.00</td><td>0</td><td>0</td></tr>
<tr><td>Change / mol</td><td>−0.667</td><td>−0.667</td><td>+0.667</td><td>+0.667</td></tr>
<tr><td>Equilibrium / mol</td><td>0.333</td><td>0.333</td><td>0.667</td><td>0.667</td></tr></table></div>
$$K_c=\\dfrac{\\left(\\frac{0.667}{V}\\right)\\left(\\frac{0.667}{V}\\right)}{\\left(\\frac{0.333}{V}\\right)\\left(\\frac{0.333}{V}\\right)}=\\dfrac{0.445}{0.111}=\\mathbf{4.0}$$<p>No units: the V terms cancel.</p></div>
<p>You may also be given K<sub>c</sub> and asked for an equilibrium concentration: rearrange the expression, and if one concentration is squared, take a square root at the end.</p>

<h2>K<sub>p</sub>: equilibria of gases</h2>
<p>For gases, it's easier to measure pressures than concentrations. In a mixture of gases each gas contributes a <strong>partial pressure</strong> to the total.</p>
<div class="eqgrid"><div>$$x_A=\\dfrac{n_A}{n_{\\text{total}}}$$</div><div>$$p_A=x_A\\times P_{\\text{total}}$$</div><div>$$\\bigsum p=P_{\\text{total}}$$</div></div>
<p>The mole fractions always add up to 1.</p>
<div class="eqgrid"><div>$$K_p=\\dfrac{p(\\mathrm{C})^c\\,p(\\mathrm{D})^d}{p(\\mathrm{A})^a\\,p(\\mathrm{B})^b}$$</div></div>
<p>Only gases appear in K<sub>p</sub>. Units come from the pressure unit (kPa, atm, Pa) in the same way as for K<sub>c</sub>.</p>
<div class="wex"><p><strong>Worked example.</strong> N₂O₄(g) ⇌ 2NO₂(g). At equilibrium there are 0.60 mol N₂O₄ and 0.80 mol NO₂ at a total pressure of 140 kPa. Find K<sub>p</sub>.</p>
$$n_{\\text{total}}=1.40\\ \\text{mol}$$$$ x(\\mathrm{N_2O_4})=\\dfrac{0.60}{1.40}=0.429$$$$ x(\\mathrm{NO_2})=\\dfrac{0.80}{1.40}=0.571$$
$$p(\\mathrm{N_2O_4})=0.429\\times 140=60\\ \\text{kPa}$$$$ p(\\mathrm{NO_2})=0.571\\times 140=80\\ \\text{kPa}$$
$$K_p=\\dfrac{p(\\mathrm{NO_2})^2}{p(\\mathrm{N_2O_4})}=\\dfrac{80^2}{60}=\\mathbf{107}\\ \\text{kPa}$$</div>

<h2>How conditions affect K</h2>
<p><strong>Only temperature changes the value of K.</strong></p>
<ul>
<li><strong>Temperature</strong>: if the forward reaction is <strong>exothermic</strong>, raising the temperature <strong>decreases K</strong> (less product at equilibrium). If it is <strong>endothermic</strong>, raising the temperature <strong>increases K</strong>. Because K has changed, the equilibrium position shifts to match the new K.</li>
<li><strong>Concentration or pressure</strong>: K stays the same. Changing a concentration makes the ratio of concentrations (the "quotient") temporarily different from K, so the system reacts until the ratio equals K again. That is <em>why</em> the position of equilibrium shifts, explaining Le Chatelier's principle quantitatively.</li>
<li><strong>Catalysts</strong>: no effect on K or on the position of equilibrium; equilibrium is reached faster.</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> For 2SO₂ + O₂ ⇌ 2SO₃, explain why increasing the pressure increases the yield of SO₃, in terms of K<sub>p</sub>.</p>
$$K_p=\\dfrac{p(\\mathrm{SO_3})^2}{p(\\mathrm{SO_2})^2\\,p(\\mathrm{O_2})}$$<p>Doubling the total pressure doubles every partial pressure: the top goes up by 2² = 4, the bottom by 2³ = 8, so the quotient halves and is now less than K<sub>p</sub>. The equilibrium shifts right (more SO₃) until the quotient equals K<sub>p</sub> again.</p></div>
<blockquote class="tip"><p><strong>Exam tip:</strong> K<sub>c</sub> calculations go wrong at the change row. Use the equation's coefficients: if 2 mol of a product forms for every 1 mol of reactant used, the change for the product is twice as big.</p></blockquote>
`;

N['5.1.3']=`
<h2>Brønsted–Lowry acids and bases</h2>
<ul>
<li>A <strong>Brønsted–Lowry acid</strong> is a <strong>proton (H⁺) donor</strong>.</li>
<li>A <strong>Brønsted–Lowry base</strong> is a <strong>proton acceptor</strong>.</li>
</ul>
<p>When an acid donates a proton, what's left can accept one back: it is the acid's <strong>conjugate base</strong>. An acid and base that differ by one H⁺ form a <strong>conjugate acid–base pair</strong>.</p>
<div class="rxn">HCl + H₂O ⇌ H₃O⁺ + Cl⁻<br>acid 1 &nbsp; base 2 &nbsp;&nbsp; acid 2 &nbsp; base 1</div>
<p>Pairs: HCl / Cl⁻ and H₃O⁺ / H₂O. In water, H⁺ is really H₃O⁺ (the oxonium ion), but H⁺(aq) is fine in equations.</p>
<ul>
<li>A <strong>monobasic</strong> acid releases one H⁺ per molecule (HCl, HNO₃, CH₃COOH); <strong>dibasic</strong> two (H₂SO₄); <strong>tribasic</strong> three (H₃PO₄).</li>
</ul>
<p>Acids react with metals, carbonates, metal oxides and alkalis (2.1.4); you need full and ionic equations for each, e.g. 2H⁺(aq) + MgO(s) → Mg²⁺(aq) + H₂O(l).</p>

<h2>pH</h2>
<div class="eqgrid"><div>$$\\mathrm{pH}=-\\log[\\mathrm{H^+}]$$</div><div>$$[\\mathrm{H^+}]=10^{-\\mathrm{pH}}$$</div></div>
<p>The log scale makes very small concentrations easy to handle: each unit of pH is a factor of 10 in [H⁺]. Give pH values to <strong>2 decimal places</strong>.</p>
<h3>Strong acids</h3>
<p>Strong acids dissociate completely, so [H⁺] = [acid] for a monobasic acid.</p>
<div class="wex"><p><strong>Worked example.</strong> pH of 0.050 mol dm⁻³ HNO₃:</p>$$\\mathrm{pH}=-\\log(0.050)=\\mathbf{1.30}$$
<p>And the reverse: a strong acid has pH 2.70.</p>$$[\\mathrm{H^+}]=10^{-\\mathrm{pH}}=10^{-2.70}=\\mathbf{2.00\\times 10^{-3}}\\ \\text{mol dm}^{-3}$$</div>

<h2>Weak acids and K<sub>a</sub></h2>
<p>A weak acid HA partly dissociates: HA ⇌ H⁺ + A⁻. The equilibrium constant is the <strong>acid dissociation constant</strong>:</p>
<div class="eqgrid"><div>$$K_a=\\dfrac{[\\mathrm{H^+}][\\mathrm{A^-}]}{[\\mathrm{HA}]}$$</div><div>$$\\mathrm{p}K_a=-\\log K_a$$</div><div>$$K_a=10^{-\\mathrm{p}K_a}$$</div></div>
<p>A larger K<sub>a</sub> (smaller pK<sub>a</sub>) means a stronger acid. Units of K<sub>a</sub>: mol dm⁻³.</p>
<h3>Calculating pH of a weak acid</h3>
<p>Two approximations make it simple:</p>
<ol>
<li><strong>[H⁺] = [A⁻]</strong>: every HA that dissociates gives one of each (we ignore the tiny amount of H⁺ from water).</li>
<li><strong>[HA]<sub>equilibrium</sub> ≈ [HA]<sub>start</sub></strong>: so little dissociates that the concentration barely changes.</li>
</ol>
<p>So:</p>$$K_a=\\dfrac{[\\mathrm{H^+}]^2}{[\\mathrm{HA}]}$$$$[\\mathrm{H^+}]=\\sqrt{K_a\\times[\\mathrm{HA}]}$$
<div class="wex"><p><strong>Worked example.</strong> Find the pH of 0.100 mol dm⁻³ ethanoic acid, K<sub>a</sub> = 1.74 × 10⁻⁵ mol dm⁻³.</p>
$$[\\mathrm{H^+}]=\\sqrt{K_a\\times[\\mathrm{HA}]}=\\sqrt{1.74\\times 10^{-5}\\times 0.100}=\\sqrt{1.74\\times 10^{-6}}=1.32\\times 10^{-3}\\ \\text{mol dm}^{-3}$$
$$\\mathrm{pH}=-\\log(1.32\\times 10^{-3})=\\mathbf{2.88}$$</div>
<p>The approximations break down for stronger weak acids (K<sub>a</sub> larger, so more dissociation) and for very dilute solutions (water's own H⁺ becomes significant). You may be asked to say this.</p>

<h2>The ionic product of water, K<sub>w</sub></h2>
<p>Water dissociates very slightly: H₂O ⇌ H⁺ + OH⁻.</p>
<div class="eqgrid"><div>$$K_w=[\\mathrm{H^+}][\\mathrm{OH^-}]=1.00\\times 10^{-14}\\ \\text{mol}^2\\,\\text{dm}^{-6}\\ \\text{at 298 K}$$</div></div>
<p>In pure water [H⁺] = [OH⁻] = 10⁻⁷, so pH = 7.00. K<sub>w</sub> increases with temperature (dissociation is endothermic), so pure water's pH falls below 7 when hot, but it is still <strong>neutral</strong> because [H⁺] = [OH⁻].</p>
<h3>pH of strong bases</h3>
<p>Find [OH⁻] from the concentration (NaOH gives one OH⁻; Ba(OH)₂ gives two), then:</p>$$[\\mathrm{H^+}]=\\dfrac{K_w}{[\\mathrm{OH^-}]}$$
<div class="wex"><p><strong>Worked example.</strong> pH of 0.0200 mol dm⁻³ NaOH.</p>
$$[\\mathrm{H^+}]=\\dfrac{K_w}{[\\mathrm{OH^-}]}=\\dfrac{1.00\\times 10^{-14}}{0.0200}=5.00\\times 10^{-13}$$$$\\mathrm{pH}=\\mathbf{12.30}$$</div>

<h2>Buffer solutions</h2>
<p>A <strong>buffer solution</strong> is a system that <strong>minimises pH changes</strong> when small amounts of an acid or a base are added. An acidic buffer is a mixture of a <strong>weak acid</strong> and its <strong>conjugate base</strong> (from a salt).</p>
<h3>Making a buffer</h3>
<ul>
<li>Mix a weak acid with a salt of it: CH₃COOH + CH₃COONa.</li>
<li>Or partly neutralise a weak acid with an alkali: adding NaOH to <em>excess</em> CH₃COOH turns some of the acid into CH₃COO⁻.</li>
</ul>
<h3>How a buffer works</h3>
<p>In the ethanoic acid / ethanoate buffer: CH₃COOH ⇌ H⁺ + CH₃COO⁻. There are large reservoirs of both CH₃COOH and CH₃COO⁻.</p>
<ul>
<li><strong>Add acid (H⁺)</strong>: the H⁺ reacts with the conjugate base, CH₃COO⁻ + H⁺ → CH₃COOH. The equilibrium shifts left, removing most of the added H⁺.</li>
<li><strong>Add alkali (OH⁻)</strong>: OH⁻ reacts with H⁺ to form water; the equilibrium shifts right as CH₃COOH dissociates to replace the H⁺. (The weak acid also reacts directly: CH₃COOH + OH⁻ → CH₃COO⁻ + H₂O.)</li>
</ul>
<p>Because the ratio [HA]/[A⁻] changes only slightly, the pH barely changes.</p>
<h3>Calculating the pH of a buffer</h3>
<div class="eqgrid"><div>$$[\\mathrm{H^+}]=K_a\\times\\dfrac{[\\mathrm{HA}]}{[\\mathrm{A^-}]}$$</div></div>
<div class="wex"><p><strong>Worked example.</strong> A buffer contains 0.100 mol dm⁻³ CH₃COOH and 0.150 mol dm⁻³ CH₃COONa. K<sub>a</sub> = 1.74 × 10⁻⁵. Find its pH.</p>
$$[\\mathrm{H^+}]=K_a\\times\\dfrac{[\\mathrm{HA}]}{[\\mathrm{A^-}]}=1.74\\times 10^{-5}\\times\\dfrac{0.100}{0.150}=1.16\\times 10^{-5}$$$$\\mathrm{pH}=\\mathbf{4.94}$$</div>
<div class="wex"><p><strong>Worked example (made by partial neutralisation).</strong> 25.0 cm³ of 0.200 mol dm⁻³ NaOH is added to 50.0 cm³ of 0.200 mol dm⁻³ HA (K<sub>a</sub> = 1.50 × 10⁻⁵). Find the pH.</p>
$$n(\\mathrm{HA})=0.200\\times\\dfrac{50.0}{1000}=0.0100\\ \\text{mol}$$$$ n(\\mathrm{OH^-})=0.200\\times\\dfrac{25.0}{1000}=0.00500\\ \\text{mol}$$<p>After reaction: n(HA) = 0.0100 − 0.00500 = 0.00500 mol, and n(A⁻) = 0.00500 mol.</p>
<p>Both are in the same volume, so use moles directly:</p>$$[\\mathrm{H^+}]=1.50\\times 10^{-5}\\times\\dfrac{0.00500}{0.00500}=1.50\\times 10^{-5}$$$$\\mathrm{pH}=\\mathbf{4.82}$$<p>This equals pK<sub>a</sub>, because the acid is half-neutralised.</p></div>
<h3>The blood buffer</h3>
<p>Blood is kept at pH <strong>7.35–7.45</strong> by the <strong>carbonic acid–hydrogencarbonate</strong> buffer: H₂CO₃ ⇌ H⁺ + HCO₃⁻. Extra acid reacts with HCO₃⁻ to form H₂CO₃; extra alkali reacts with H₂CO₃. The body controls H₂CO₃ by breathing out CO₂ (H₂CO₃ ⇌ H₂O + CO₂).</p>

<h2>pH titration curves</h2>
<svg class="diagram" viewBox="0 0 560 220" role="img" aria-label="Titration curves: strong acid with strong base has a long vertical section from pH 3 to 11; weak acid with strong base has a vertical section from about pH 7 to 11">
<g><line class="ax" x1="30" y1="190" x2="250" y2="190" marker-end="url(#ah)"/><line class="ax" x1="30" y1="190" x2="30" y2="20" marker-end="url(#ah)"/>
<path class="c1" d="M30 170 Q100 165 125 150 L135 50 Q150 35 240 30"/><line class="dimline dash" x1="30" y1="100" x2="250" y2="100"/><text x="34" y="30" class="small">pH</text><text x="200" y="208" class="small">volume of base</text><text x="40" y="96" class="small">7</text><text x="40" y="215" class="small">strong acid + strong base</text></g>
<g transform="translate(290 0)"><line class="ax" x1="30" y1="190" x2="250" y2="190" marker-end="url(#ah)"/><line class="ax" x1="30" y1="190" x2="30" y2="20" marker-end="url(#ah)"/>
<path class="c1" d="M30 150 Q45 130 70 125 Q110 115 125 105 L135 50 Q150 35 240 30"/><line class="dimline dash" x1="30" y1="100" x2="250" y2="100"/><circle class="fill1" cx="78" cy="123" r="3.5"/><text x="80" y="140" class="small">pH = pKa</text><text x="34" y="30" class="small">pH</text><text x="40" y="215" class="small">weak acid + strong base</text></g>
</svg>
<p>The <strong>equivalence point</strong> is where exactly enough base has been added to react with all the acid (in the middle of the vertical section). The <strong>end point</strong> is where the indicator changes colour; for a good indicator they coincide.</p>
<div class="tbl"><table><tr><th>Titration</th><th>pH at equivalence</th><th>Vertical section</th><th>Indicator</th></tr>
<tr><td>strong acid + strong base</td><td>7</td><td>about 3–11</td><td>methyl orange or phenolphthalein</td></tr>
<tr><td>weak acid + strong base</td><td>above 7</td><td>about 7–11</td><td>phenolphthalein (8.3–10)</td></tr>
<tr><td>strong acid + weak base</td><td>below 7</td><td>about 3–7</td><td>methyl orange (3.1–4.4)</td></tr>
<tr><td>weak acid + weak base</td><td>about 7</td><td>no sharp vertical section</td><td>none suitable</td></tr></table></div>
<p>An indicator is suitable if its <strong>pH range lies within the vertical section</strong> of the curve. An indicator is itself a weak acid whose HIn and In⁻ forms have different colours; the end point is where [HIn] = [In⁻], at pH = pK<sub>In</sub>.</p>
<p>From a weak acid / strong base curve, read off pK<sub>a</sub> at <strong>half the equivalence volume</strong>: at that point half the acid has become A⁻, [HA] = [A⁻], so [H⁺] = K<sub>a</sub> and pH = pK<sub>a</sub>.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> in buffer calculations, first work out what's left after any neutralisation, in moles. Then [H⁺] = K<sub>a</sub>[HA]/[A⁻]; you can use moles instead of concentrations because both are in the same volume.</p></blockquote>
`;

N['5.2.1']=`
<h2>Lattice enthalpy</h2>
<p>The <strong>lattice enthalpy, Δ<sub>LE</sub>H</strong>, is the enthalpy change that accompanies the <strong>formation of one mole of an ionic compound from its gaseous ions</strong> under standard conditions.</p>
<div class="rxn">Na⁺(g) + Cl⁻(g) → NaCl(s) &nbsp;&nbsp; Δ<sub>LE</sub>H = −787 kJ mol⁻¹</div>
<p>It is always <strong>exothermic</strong> (energy is released as the oppositely charged ions attract). A more negative (more exothermic) value means stronger ionic bonding. It can't be measured directly, so it is calculated with a Born–Haber cycle.</p>

<h2>The other enthalpy changes in the cycle</h2>
<div class="tbl"><table><tr><th>Enthalpy change</th><th>Definition</th><th>Example</th><th>Sign</th></tr>
<tr><td>formation, Δ<sub>f</sub>H</td><td>one mole of a compound formed from its elements in their standard states</td><td>Na(s) + ½Cl₂(g) → NaCl(s)</td><td>usually −</td></tr>
<tr><td>atomisation, Δ<sub>at</sub>H</td><td>one mole of <strong>gaseous atoms</strong> formed from the element in its standard state</td><td>Na(s) → Na(g); ½Cl₂(g) → Cl(g)</td><td>+</td></tr>
<tr><td>first ionisation energy, IE₁</td><td>one electron removed from each atom in one mole of gaseous atoms to form one mole of gaseous 1+ ions</td><td>Na(g) → Na⁺(g) + e⁻</td><td>+</td></tr>
<tr><td>second ionisation energy, IE₂</td><td>one electron removed from each 1+ ion in one mole of gaseous 1+ ions</td><td>Mg⁺(g) → Mg²⁺(g) + e⁻</td><td>+</td></tr>
<tr><td>first electron affinity, EA₁</td><td>each atom in one mole of gaseous atoms gains an electron to form one mole of gaseous 1− ions</td><td>Cl(g) + e⁻ → Cl⁻(g)</td><td>− (exothermic)</td></tr>
<tr><td>second electron affinity, EA₂</td><td>each 1− ion in one mole of gaseous 1− ions gains an electron</td><td>O⁻(g) + e⁻ → O²⁻(g)</td><td>+ (endothermic)</td></tr></table></div>
<p>The second electron affinity is <strong>endothermic</strong>: you are adding an electron to an ion that is already negative, so energy must be supplied to overcome the repulsion.</p>

<h2>Born–Haber cycles</h2>
<p>A Born–Haber cycle is a Hess cycle linking the formation of an ionic compound from its elements by two routes: directly (Δ<sub>f</sub>H), or step by step through gaseous atoms and gaseous ions, finishing with the lattice enthalpy.</p>
<svg class="diagram" viewBox="0 0 520 300" role="img" aria-label="Born-Haber cycle for sodium chloride: elements at the bottom, steps up to gaseous ions, lattice enthalpy down to solid sodium chloride">
<g class="small">
<line class="wire" x1="40" y1="200" x2="200" y2="200"/><text x="44" y="194">Na(s) + ½Cl₂(g)</text>
<line class="wire" x1="40" y1="165" x2="200" y2="165"/><text x="44" y="159">Na(g) + ½Cl₂(g)</text>
<line class="wire" x1="40" y1="130" x2="200" y2="130"/><text x="44" y="124">Na(g) + Cl(g)</text>
<line class="wire" x1="40" y1="40" x2="240" y2="40"/><text x="44" y="34">Na⁺(g) + e⁻ + Cl(g)</text>
<line class="wire" x1="250" y1="80" x2="460" y2="80"/><text x="360" y="98">Na⁺(g) + Cl⁻(g)</text>
<line class="wire" x1="40" y1="270" x2="440" y2="270"/><text x="44" y="264">NaCl(s)</text>
<line class="c2" x1="215" y1="200" x2="215" y2="167" marker-end="url(#aha)"/><text x="222" y="188">Δ<tspan baseline-shift="sub">at</tspan>H(Na) +107</text>
<line class="c2" x1="215" y1="165" x2="215" y2="132" marker-end="url(#aha)"/><text x="222" y="153">Δ<tspan baseline-shift="sub">at</tspan>H(Cl) +122</text>
<line class="c2" x1="215" y1="130" x2="215" y2="42" marker-end="url(#aha)"/><text x="222" y="95">IE₁(Na) +496</text>
<line class="c2" x1="330" y1="40" x2="330" y2="78" marker-end="url(#aha)"/><line class="wire dash" x1="240" y1="40" x2="340" y2="40"/><text x="336" y="60">EA₁(Cl) −349</text>
<line class="c1" x1="440" y1="80" x2="440" y2="268" marker-end="url(#ahb)"/><text x="360" y="180" class="lbl1">Δ<tspan baseline-shift="sub">LE</tspan>H = ?</text>
<line class="c2" x1="120" y1="200" x2="120" y2="268" marker-end="url(#aha)"/><text x="126" y="240">Δ<tspan baseline-shift="sub">f</tspan>H −411</text>
</g></svg>
<p>Going round the cycle: Δ<sub>f</sub>H = Δ<sub>at</sub>H(Na) + Δ<sub>at</sub>H(Cl) + IE₁ + EA₁ + Δ<sub>LE</sub>H.</p>
<div class="wex"><p><strong>Worked example.</strong> Use the values in the cycle to find Δ<sub>LE</sub>H(NaCl).</p>
$$\\Delta_{LE}H=\\Delta_f H-\\big(\\Delta_{at}H(\\mathrm{Na})+\\Delta_{at}H(\\mathrm{Cl})+\\text{IE}_1+\\text{EA}_1\\big)$$
$$=-411-(107+122+496-349)=-411-376=\\mathbf{-787}\\ \\text{kJ mol}^{-1}$$</div>
<p>Watch the stoichiometry: for MgCl₂ you need <strong>2 × Δ<sub>at</sub>H(Cl)</strong> and <strong>2 × EA₁(Cl)</strong>, and both IE₁ and IE₂ of magnesium. For MgO you need EA₁ and EA₂ of oxygen.</p>

<h2>Enthalpy of solution and hydration</h2>
<ul>
<li><strong>Enthalpy change of solution, Δ<sub>sol</sub>H</strong>: the enthalpy change when <strong>one mole of a solute dissolves</strong> in a solvent. NaCl(s) + aq → Na⁺(aq) + Cl⁻(aq). Can be exothermic or endothermic.</li>
<li><strong>Enthalpy change of hydration, Δ<sub>hyd</sub>H</strong>: the enthalpy change when <strong>one mole of gaseous ions dissolves in water</strong>. Na⁺(g) + aq → Na⁺(aq). Always exothermic: water molecules' δ− oxygen attracts cations, δ+ hydrogens attract anions.</li>
</ul>
<p>Dissolving can be imagined as breaking the lattice into gaseous ions (the reverse of lattice enthalpy, so +Δ<sub>LE</sub>H in magnitude) then hydrating them:</p>
<div class="eqgrid"><div>$$\\Delta_{sol}H=-\\Delta_{LE}H+\\bigsum\\Delta_{hyd}H$$</div></div>
<div class="wex"><p><strong>Worked example.</strong> Δ<sub>LE</sub>H(KCl) = −711; Δ<sub>hyd</sub>H(K⁺) = −322; Δ<sub>hyd</sub>H(Cl⁻) = −363 kJ mol⁻¹. Find Δ<sub>sol</sub>H.</p>
$$\\Delta_{sol}H=-\\Delta_{LE}H+\\bigsum\\Delta_{hyd}H=711+(-322-363)=\\mathbf{+26}\\ \\text{kJ mol}^{-1}$$<p>KCl dissolves endothermically: the solution gets colder.</p></div>

<h2>Factors affecting lattice and hydration enthalpies</h2>
<ul>
<li><strong>Ionic charge</strong>: higher charge, stronger attraction, <strong>more exothermic</strong>. Δ<sub>LE</sub>H(MgO) ≈ −3800 kJ mol⁻¹ against −787 for NaCl.</li>
<li><strong>Ionic radius</strong>: smaller ions, closer together, stronger attraction, <strong>more exothermic</strong>. Down a group the ions get bigger, so lattice enthalpies get less exothermic (LiCl −853, NaCl −787, KCl −711).</li>
</ul>
<p>The same two factors apply to hydration enthalpy: small, highly charged ions attract water molecules more strongly (Mg²⁺ −1920, Na⁺ −406 kJ mol⁻¹). This combination is called <strong>charge density</strong>.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> lattice enthalpy explanations need both factors and the link: "Mg²⁺ has a greater charge and a smaller radius than Na⁺, so there is stronger electrostatic attraction between the ions, and the lattice enthalpy is more exothermic."</p></blockquote>
`;

N['5.2.2']=`
<h2>Entropy</h2>
<p><strong>Entropy, S</strong>, is a measure of the <strong>dispersal of energy</strong> in a system: the more ways the particles and their energy can be arranged, the greater the entropy. Disordered systems have higher entropy. Units: <strong>J K⁻¹ mol⁻¹</strong>. All substances have a positive entropy (above 0 K).</p>
<ul>
<li><strong>Solid &lt; liquid &lt; gas</strong>: the biggest increase is from liquid to gas, because gas particles are free to move anywhere.</li>
<li>A reaction that <strong>increases the number of gas molecules</strong> has a positive entropy change.</li>
<li>Dissolving a solid usually increases entropy (the ions spread out).</li>
<li>More complex molecules have higher entropy than simpler ones.</li>
</ul>
<div class="eqgrid"><div>$$\\Delta S=\\bigsum S(\\text{products})-\\bigsum S(\\text{reactants})$$</div></div>
<div class="wex"><p><strong>Worked example.</strong> CaCO₃(s) → CaO(s) + CO₂(g). S: CaCO₃ 93, CaO 40, CO₂ 214 J K⁻¹ mol⁻¹.</p>
$$\\Delta S=\\bigsum S(\\text{products})-\\bigsum S(\\text{reactants})=(40+214)-93=\\mathbf{+161}\\ \\text{J K}^{-1}\\,\\text{mol}^{-1}$$<p>Positive, as expected: a gas is formed from a solid.</p></div>
<p>Remember to multiply each entropy by its coefficient in the equation. Unlike Δ<sub>f</sub>H, elements do <strong>not</strong> have zero entropy.</p>

<h2>Feasibility and Gibbs free energy</h2>
<p>A reaction is <strong>feasible</strong> (it can happen spontaneously) if the total entropy of the system and its surroundings increases. Exothermic reactions transfer energy to the surroundings and increase their entropy, which is why most exothermic reactions are feasible. Both effects are combined in the <strong>Gibbs free energy change</strong>:</p>
<div class="eqgrid"><div>$$\\Delta G=\\Delta H-T\\Delta S$$</div></div>
<p><strong>A reaction is feasible when ΔG ≤ 0.</strong> ΔG is in kJ mol⁻¹, ΔH in kJ mol⁻¹, T in K, so <strong>ΔS must be converted to kJ K⁻¹ mol⁻¹</strong> (÷ 1000) before using the equation.</p>
<div class="tbl"><table><tr><th>ΔH</th><th>ΔS</th><th>Feasibility</th></tr>
<tr><td>−</td><td>+</td><td>always feasible (ΔG always negative)</td></tr>
<tr><td>+</td><td>−</td><td>never feasible</td></tr>
<tr><td>−</td><td>−</td><td>feasible at <strong>low</strong> temperatures</td></tr>
<tr><td>+</td><td>+</td><td>feasible at <strong>high</strong> temperatures</td></tr></table></div>
<div class="wex"><p><strong>Worked example.</strong> For CaCO₃ → CaO + CO₂, ΔH = +178 kJ mol⁻¹ and ΔS = +161 J K⁻¹ mol⁻¹. Is it feasible at 298 K? Above what temperature does it become feasible?</p>
$$\\Delta G=\\Delta H-T\\Delta S=178-(298\\times 0.161)=178-48.0=+130\\ \\text{kJ mol}^{-1}$$<p>Positive: <strong>not feasible at 298 K</strong>.</p>
<p>It becomes feasible when ΔG = 0:</p>$$T=\\dfrac{\\Delta H}{\\Delta S}=\\dfrac{178}{0.161}=\\mathbf{1106}\\ \\text{K}$$<p>Above this, limestone decomposes, which is why lime kilns run hot.</p></div>
<h3>ΔG against T</h3>
<p>Rearranged, $\\Delta G=-\\Delta S\\cdot T+\\Delta H$ is a straight line: a graph of ΔG against T has <strong>gradient −ΔS</strong> and <strong>intercept ΔH</strong>. The reaction becomes feasible where the line crosses ΔG = 0.</p>

<h2>Limitations</h2>
<p>A negative ΔG says a reaction <em>can</em> happen, not that it <em>will</em> happen at a noticeable rate. Many feasible reactions are extremely slow because of a <strong>high activation energy</strong>: diamond turning into graphite has ΔG &lt; 0 at room temperature but doesn't happen. ΔG predictions are about thermodynamics; rates are about kinetics. Also, ΔH and ΔS themselves change a little with temperature, so the calculated temperature is approximate.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> the unit conversion of ΔS (J → kJ) is tested almost every time. Write "ΔS = +161 J K⁻¹ mol⁻¹ = +0.161 kJ K⁻¹ mol⁻¹" as a line of working.</p></blockquote>
`;

N['5.2.3']=`
<h2>Redox equations from half-equations</h2>
<p>A redox equation combines an oxidation half-equation and a reduction half-equation so that the electrons lost equal the electrons gained.</p>
<h3>Writing half-equations in acidic solution</h3>
<ol>
<li>Balance the atom that changes oxidation number.</li>
<li>Balance O by adding <strong>H₂O</strong>.</li>
<li>Balance H by adding <strong>H⁺</strong>.</li>
<li>Balance charge by adding <strong>electrons</strong>.</li>
</ol>
<div class="wex"><p><strong>Worked example.</strong> Half-equation for MnO₄⁻ → Mn²⁺.</p>
<p>Mn balanced. 4 O on the left: add 4H₂O on the right. 8 H on the right: add 8H⁺ on the left. Charge: left (−1 + 8) = +7, right +2, so add 5e⁻ on the left.</p>
<p><strong>MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O</strong></p></div>
<div class="wex"><p><strong>Worked example (combine).</strong> Manganate(VII) oxidises Fe²⁺ to Fe³⁺.</p>
<p>Fe²⁺ → Fe³⁺ + e⁻. Multiply by 5 to give 5 electrons, then add:</p>
<p><strong>MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 4H₂O + 5Fe³⁺</strong></p></div>
<p>You can also balance using oxidation numbers: the total increase in oxidation number must equal the total decrease (here Mn falls by 5; each Fe rises by 1, so 5 Fe).</p>

<h2>Redox titrations</h2>
<h3>Manganate(VII) titrations</h3>
<p>Acidified KMnO₄ (in the burette) is used to find the amount of a reducing agent such as Fe²⁺ or ethanedioate. It is <strong>self-indicating</strong>: purple MnO₄⁻ is reduced to almost colourless Mn²⁺. The <strong>end point</strong> is the first <strong>permanent pale pink</strong>, when one drop of excess MnO₄⁻ remains. The flask is acidified with <strong>dilute sulfuric acid</strong> (not HCl, which would be oxidised to Cl₂).</p>
<div class="wex"><p><strong>Worked example.</strong> An iron tablet is dissolved in acid and made up to 250.0 cm³. 25.0 cm³ portions need 12.40 cm³ of 0.0100 mol dm⁻³ KMnO₄. Find the mass of iron in the tablet.</p>
$$n(\\mathrm{MnO_4^-})=0.0100\\times\\dfrac{12.40}{1000}=1.24\\times 10^{-4}\\ \\text{mol}$$<p>The ratio is 1 : 5, so in 25.0 cm³:</p>$$n(\\mathrm{Fe^{2+}})=5\\times 1.24\\times 10^{-4}=6.20\\times 10^{-4}\\ \\text{mol}$$
<p>In the whole 250 cm³ there is 10 times as much, 6.20 × 10⁻³ mol:</p>$$m=6.20\\times 10^{-3}\\times 55.8=\\mathbf{0.346}\\ \\text{g}$$</div>
<h3>Iodine–thiosulfate titrations</h3>
<p>Used to find the amount of an oxidising agent (Cu²⁺, ClO⁻, IO₃⁻). The oxidising agent reacts with <strong>excess iodide</strong> to release iodine; the iodine is then titrated with sodium thiosulfate.</p>
<div class="rxn">2S₂O₃²⁻(aq) + I₂(aq) → 2I⁻(aq) + S₄O₆²⁻(aq)</div>
<p>As thiosulfate is added, the brown iodine fades to pale yellow. Then add <strong>starch</strong>: it turns blue-black with the remaining iodine. The end point is when the <strong>blue-black colour disappears</strong>. (Starch is added near the end because at high iodine concentrations the complex may not break up easily.)</p>
<div class="wex"><p><strong>Worked example.</strong> Copper(II) ions react with iodide: 2Cu²⁺ + 4I⁻ → 2CuI + I₂. The iodine formed from 25.0 cm³ of a Cu²⁺ solution needs 20.00 cm³ of 0.100 mol dm⁻³ Na₂S₂O₃. Find [Cu²⁺].</p>
$$n(\\mathrm{S_2O_3^{2-}})=0.100\\times\\dfrac{20.00}{1000}=2.000\\times 10^{-3}\\ \\text{mol}\\ \\Rightarrow\\ n(\\mathrm{I_2})=1.000\\times 10^{-3}\\ \\Rightarrow\\ n(\\mathrm{Cu^{2+}})=2.000\\times 10^{-3}\\ \\text{mol}$$
$$2\\,\\mathrm{Cu^{2+}}\\equiv\\mathrm{I_2}\\equiv 2\\,\\mathrm{S_2O_3^{2-}}$$$$[\\mathrm{Cu^{2+}}]=\\dfrac{2.000\\times 10^{-3}}{0.0250}=\\mathbf{0.0800}\\ \\text{mol dm}^{-3}$$</div>

<h2>Electrochemical cells</h2>
<p>An electrochemical cell has two <strong>half-cells</strong> joined by a <strong>wire</strong> (through a high-resistance voltmeter) and a <strong>salt bridge</strong> (filter paper soaked in KNO₃(aq), which lets ions flow to complete the circuit without mixing the solutions). Electrons flow through the wire from the more reactive (more easily oxidised) half-cell to the other.</p>
<ul>
<li><strong>Metal / metal ion</strong> half-cell: a metal dipping into a solution of its ions, e.g. Zn(s) in Zn²⁺(aq).</li>
<li><strong>Ions of the same element</strong> in different oxidation states, e.g. Fe²⁺ and Fe³⁺ together: an inert <strong>platinum electrode</strong> conducts electrons in and out.</li>
<li><strong>Gas</strong> half-cell: a gas bubbled over a platinum electrode in a solution of its ions.</li>
</ul>
<h3>The standard hydrogen electrode</h3>
<p>Potentials are measured against a reference: the <strong>standard hydrogen electrode</strong>, H₂ gas at 100 kPa bubbled over platinum in 1.00 mol dm⁻³ H⁺(aq) at 298 K. Its potential is defined as <strong>0 V</strong>.</p>
<p>The <strong>standard electrode potential, E<sup>⦵</sup></strong>, of a half-cell is the e.m.f. of a half-cell connected to a standard hydrogen half-cell under <strong>standard conditions</strong>: 298 K, 100 kPa, all ion concentrations 1 mol dm⁻³. Half-equations are always written as <strong>reductions</strong>:</p>
<div class="tbl"><table><tr><th>Half-equation</th><th>E<sup>⦵</sup> / V</th></tr>
<tr><td>Zn²⁺ + 2e⁻ ⇌ Zn</td><td>−0.76</td></tr><tr><td>Fe²⁺ + 2e⁻ ⇌ Fe</td><td>−0.44</td></tr><tr><td>2H⁺ + 2e⁻ ⇌ H₂</td><td>0.00</td></tr><tr><td>Cu²⁺ + 2e⁻ ⇌ Cu</td><td>+0.34</td></tr><tr><td>Fe³⁺ + e⁻ ⇌ Fe²⁺</td><td>+0.77</td></tr><tr><td>Ag⁺ + e⁻ ⇌ Ag</td><td>+0.80</td></tr><tr><td>Cl₂ + 2e⁻ ⇌ 2Cl⁻</td><td>+1.36</td></tr><tr><td>MnO₄⁻ + 8H⁺ + 5e⁻ ⇌ Mn²⁺ + 4H₂O</td><td>+1.51</td></tr></table></div>
<p>A <strong>more positive</strong> E<sup>⦵</sup> means the species on the left is more easily <strong>reduced</strong> (a stronger oxidising agent). A <strong>more negative</strong> E<sup>⦵</sup> means the species on the right is more easily <strong>oxidised</strong> (a stronger reducing agent).</p>
<div class="eqgrid"><div>$$E^{\\ominus}_{\\text{cell}}=E^{\\ominus}(\\text{positive electrode})-E^{\\ominus}(\\text{negative electrode})$$</div></div>
<div class="wex"><p><strong>Worked example.</strong> A Zn/Zn²⁺ half-cell is connected to a Cu/Cu²⁺ half-cell. Find E<sub>cell</sub> and the overall reaction.</p>
<p>Cu²⁺/Cu is more positive (+0.34), so it is the positive electrode and is reduced. Zn/Zn²⁺ (−0.76) is oxidised.</p>
$$E^{\\ominus}_{\\text{cell}}=E^{\\ominus}_{\\text{positive}}-E^{\\ominus}_{\\text{negative}}=0.34-(-0.76)=\\mathbf{+1.10}\\ \\text{V}$$<p>Overall: <strong>Zn + Cu²⁺ → Zn²⁺ + Cu</strong>. Electrons flow from the zinc to the copper through the wire.</p></div>

<h2>Predicting feasibility</h2>
<p>A reaction is predicted to be feasible if E<sub>cell</sub> is positive: the more positive half-cell is reduced (reaction goes forward, left to right) and the more negative one is oxidised (goes backward). The "anticlockwise rule": with the more negative half-equation written above the more positive one, the reactions go anticlockwise.</p>
<h3>Limitations of predictions</h3>
<ul>
<li>The reaction may be <strong>too slow</strong> to observe (high activation energy): E<sup>⦵</sup> says nothing about rate.</li>
<li>Conditions may be <strong>non-standard</strong>. Changing the concentration of an ion changes the electrode potential: increasing [ion] on the left of a half-equation makes E more positive (the equilibrium shifts right, taking in electrons).</li>
<li>E<sup>⦵</sup> values apply to aqueous solutions; other conditions may differ.</li>
</ul>

<h2>Storage and fuel cells</h2>
<ul>
<li><strong>Primary cells</strong> are non-rechargeable (alkaline batteries). <strong>Secondary (storage) cells</strong> are rechargeable: the reactions can be reversed by applying a current (lithium-ion, lead–acid). Cell voltage comes from the difference in electrode potentials of the two half-cells; you can be asked to calculate it from given half-equations.</li>
<li>A <strong>fuel cell</strong> uses the energy from the reaction of a fuel with oxygen to create a voltage. Fuel and oxygen are supplied continuously, so it doesn't run down or need recharging. The hydrogen fuel cell in alkaline conditions:<div class="rxn">H₂ + 2OH⁻ → 2H₂O + 2e⁻ (negative electrode)<br>O₂ + 2H₂O + 4e⁻ → 4OH⁻ (positive electrode)<br>overall: 2H₂ + O₂ → 2H₂O</div>Benefits: only water is produced, high efficiency. Problems: hydrogen is flammable and hard to store, and is usually made using fossil fuels.</li>
</ul>
<blockquote class="tip"><p><strong>Exam tip:</strong> in a cell, the half-cell with the more negative E<sup>⦵</sup> is always the one oxidised and is the negative electrode. Electrons flow from it, through the wire, to the positive electrode.</p></blockquote>
`;

N['5.3.1']=`
<h2>What a transition element is</h2>
<p>A <strong>transition element</strong> is a <strong>d-block element that forms at least one ion with an incomplete d sub-shell</strong>. Ti to Cu in period 4 are transition elements. Scandium (Sc³⁺ is 3d⁰) and zinc (Zn²⁺ is 3d¹⁰) are d-block elements but <strong>not</strong> transition elements, because their only ions have an empty or full d sub-shell.</p>
<h3>Electron configurations</h3>
<p>The d-block fills 3d after 4s, with two exceptions: <strong>Cr [Ar] 3d⁵ 4s¹</strong> and <strong>Cu [Ar] 3d¹⁰ 4s¹</strong>. When ions form, the <strong>4s electrons are lost first</strong>: Cu²⁺ is [Ar] 3d⁹; Mn²⁺ is [Ar] 3d⁵; Fe³⁺ is [Ar] 3d⁵.</p>

<h2>Characteristic properties</h2>
<ul>
<li><strong>Variable oxidation states</strong>: the 4s and 3d sub-shells are close in energy, so different numbers of electrons can be lost. Manganese shows +2 to +7.</li>
<li><strong>Coloured compounds and ions</strong> in solution: Cu²⁺(aq) blue, Fe²⁺(aq) pale green, Fe³⁺(aq) yellow/orange-brown, Cr³⁺(aq) green or violet, MnO₄⁻ purple, Cr₂O₇²⁻ orange.</li>
<li><strong>Catalysts</strong>, because they can change oxidation state (accepting and donating electrons) and provide surfaces where reactions happen. Fe in the Haber process; V₂O₅ in the Contact process (making SO₃); MnO₂ decomposing H₂O₂; Ni for hydrogenation; Cu²⁺ catalyses the zinc–acid reaction.</li>
</ul>

<h2>Complex ions</h2>
<p>A <strong>complex ion</strong> is a central metal ion surrounded by <strong>ligands</strong> bonded by <strong>coordinate (dative covalent) bonds</strong>.</p>
<ul>
<li>A <strong>ligand</strong> is a molecule or ion that <strong>donates a pair of electrons</strong> to a central metal ion to form a coordinate bond.</li>
<li><strong>Monodentate</strong> ligands form one coordinate bond: H₂O, NH₃, Cl⁻, CN⁻, OH⁻.</li>
<li><strong>Bidentate</strong> ligands form two: ethane-1,2-diamine (NH₂CH₂CH₂NH₂, "en") and ethanedioate (C₂O₄²⁻, oxalate).</li>
<li>The <strong>coordination number</strong> is the number of coordinate bonds to the central metal ion (not the number of ligands: three bidentate ligands give coordination number 6).</li>
</ul>
<h3>Shapes</h3>
<div class="tbl"><table><tr><th>Coordination number</th><th>Shape</th><th>Angle</th><th>Example</th></tr>
<tr><td>6</td><td>octahedral</td><td>90°</td><td>[Cu(H₂O)₆]²⁺, [Co(NH₃)₆]²⁺</td></tr>
<tr><td>4</td><td>tetrahedral</td><td>109.5°</td><td>[CuCl₄]²⁻, [CoCl₄]²⁻ (with large Cl⁻ ligands)</td></tr>
<tr><td>4</td><td>square planar</td><td>90°</td><td>[Pt(NH₃)₂Cl₂] (cisplatin)</td></tr></table></div>
<p>The overall charge of a complex = charge on the metal ion + total charge of the ligands: [CuCl₄]²⁻ is Cu²⁺ + 4Cl⁻.</p>

<h2>Stereoisomerism in complexes</h2>
<h3>Cis–trans isomerism</h3>
<p>Square planar complexes with two pairs of different ligands (MA₂B₂), and octahedral complexes of type MA₄B₂, can have cis (same side, 90° apart) and trans (opposite, 180°) isomers.</p>
<ul>
<li><strong>Cisplatin</strong>, cis-[Pt(NH₃)₂Cl₂], is an <strong>anticancer drug</strong>. It binds to DNA in cancer cells (the two Cl⁻ ligands are replaced by nitrogen atoms on adjacent guanine bases), preventing the DNA from replicating so the cell dies. Transplatin can't bind this way and is not effective. Cisplatin also harms healthy cells, causing side effects such as hair loss and kidney damage, so doses are kept low.</li>
</ul>
<h3>Optical isomerism</h3>
<p>Octahedral complexes with <strong>three bidentate ligands</strong> (e.g. [Ni(en)₃]²⁺), or two bidentate ligands with two others in a cis arrangement, exist as <strong>non-superimposable mirror images</strong>: optical isomers.</p>

<h2>Ligand substitution</h2>
<p>One ligand can be replaced by another. Learn these colour changes:</p>
<div class="tbl"><table><tr><th>Reaction</th><th>Colour change</th></tr>
<tr><td>[Cu(H₂O)₆]²⁺ + 4NH₃ → [Cu(NH₃)₄(H₂O)₂]²⁺ + 4H₂O<br>(excess aqueous ammonia)</td><td>pale blue → <strong>dark (deep) blue</strong> solution</td></tr>
<tr><td>[Cu(H₂O)₆]²⁺ + 4Cl⁻ ⇌ [CuCl₄]²⁻ + 6H₂O<br>(concentrated HCl)</td><td>pale blue → <strong>yellow</strong> (often looks green as a mixture); octahedral → tetrahedral</td></tr>
<tr><td>[Cr(H₂O)₆]³⁺ + 6NH₃ → [Cr(NH₃)₆]³⁺ + 6H₂O<br>(excess aqueous ammonia)</td><td>violet (green in practice) → <strong>purple</strong> solution</td></tr></table></div>
<h3>Haemoglobin</h3>
<p>Haemoglobin contains Fe²⁺ complexes. <strong>Oxygen</strong> binds to the iron as a ligand in the lungs and is released in tissues. <strong>Carbon monoxide</strong> forms a much <strong>stronger</strong> coordinate bond with Fe²⁺ than O₂ does, replacing it by ligand substitution. The CO isn't released, so haemoglobin can't carry oxygen: this is why CO is toxic.</p>

<h2>Precipitation reactions</h2>
<p>Adding aqueous sodium hydroxide or ammonia to a transition metal ion solution forms a <strong>hydroxide precipitate</strong>. Learn the colours and what happens in excess:</p>
<div class="tbl"><table><tr><th>Ion</th><th>NaOH(aq), a few drops</th><th>Excess NaOH(aq)</th><th>NH₃(aq), a few drops</th><th>Excess NH₃(aq)</th></tr>
<tr><td>Cu²⁺</td><td>blue ppt Cu(OH)₂</td><td>no change</td><td>blue ppt</td><td>dissolves → dark blue solution [Cu(NH₃)₄(H₂O)₂]²⁺</td></tr>
<tr><td>Fe²⁺</td><td>green ppt Fe(OH)₂ (turns orange-brown at the surface in air)</td><td>no change</td><td>green ppt</td><td>no change</td></tr>
<tr><td>Fe³⁺</td><td>orange-brown ppt Fe(OH)₃</td><td>no change</td><td>orange-brown ppt</td><td>no change</td></tr>
<tr><td>Mn²⁺</td><td>light brown ppt Mn(OH)₂ (darkens in air)</td><td>no change</td><td>light brown ppt</td><td>no change</td></tr>
<tr><td>Cr³⁺</td><td>grey-green ppt Cr(OH)₃</td><td>dissolves → dark green solution [Cr(OH)₆]³⁻</td><td>grey-green ppt</td><td>dissolves → purple solution [Cr(NH₃)₆]³⁺</td></tr></table></div>
<div class="rxn">Cu²⁺(aq) + 2OH⁻(aq) → Cu(OH)₂(s)<br>Fe³⁺(aq) + 3OH⁻(aq) → Fe(OH)₃(s)</div>

<h2>Redox reactions of transition metal ions</h2>
<ul>
<li><strong>Fe²⁺ ⇌ Fe³⁺</strong>: Fe²⁺ is oxidised to Fe³⁺ by acidified MnO₄⁻ (purple → colourless); Fe³⁺ is reduced to Fe²⁺ by I⁻ (2Fe³⁺ + 2I⁻ → 2Fe²⁺ + I₂, solution turns brown).</li>
<li><strong>Cr₂O₇²⁻ → Cr³⁺</strong>: dichromate(VI) is reduced by zinc in acid (orange → green), and further to Cr²⁺ (blue) with excess zinc. Cr³⁺ is oxidised back to CrO₄²⁻ (yellow) by hot alkaline H₂O₂.</li>
<li><strong>Cu²⁺ → Cu⁺</strong>: Cu²⁺ reacts with I⁻ to form a white precipitate of CuI and brown I₂: 2Cu²⁺ + 4I⁻ → 2CuI + I₂. Copper(I) ions disproportionate in solution: 2Cu⁺ → Cu²⁺ + Cu.</li>
</ul>
<p>You may be asked to interpret unfamiliar redox reactions of other transition metals using oxidation numbers and half-equations.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> "ligand" and "coordinate bond" must appear in a definition of a complex ion. When a question asks for the shape of a complex, give the coordination number and bond angle as well.</p></blockquote>
`;

N['5.3.2']=`
<h2>Identifying ions: the full set</h2>
<p>At A level you combine the anion tests from 3.1.4 with cation tests, including transition metal ions. You need to describe tests, give observations, and deduce the identity of unknown substances.</p>
<h3>Anions</h3>
<div class="tbl"><table><tr><th>Ion</th><th>Test</th><th>Positive result</th></tr>
<tr><td>CO₃²⁻</td><td>dilute HNO₃; gas into limewater</td><td>effervescence; limewater turns milky</td></tr>
<tr><td>SO₄²⁻</td><td>Ba(NO₃)₂(aq) or BaCl₂(aq)</td><td>white precipitate</td></tr>
<tr><td>Cl⁻ / Br⁻ / I⁻</td><td>dilute HNO₃ then AgNO₃(aq); then NH₃(aq)</td><td>white / cream / yellow ppt; dissolve in dilute / concentrated / neither NH₃</td></tr></table></div>
<p>Order: carbonate, then sulfate, then halide (see 3.1.4).</p>
<h3>Cations</h3>
<div class="tbl"><table><tr><th>Ion</th><th>Test</th><th>Positive result</th></tr>
<tr><td>NH₄⁺</td><td>warm with NaOH(aq)</td><td>gas turns damp red litmus blue</td></tr>
<tr><td>Cu²⁺</td><td>NaOH(aq); NH₃(aq) in excess</td><td>blue ppt; dissolves in excess NH₃ to a dark blue solution</td></tr>
<tr><td>Fe²⁺</td><td>NaOH(aq)</td><td>green ppt, slowly turning orange-brown at the surface</td></tr>
<tr><td>Fe³⁺</td><td>NaOH(aq)</td><td>orange-brown ppt</td></tr>
<tr><td>Mn²⁺</td><td>NaOH(aq)</td><td>light brown ppt, darkening in air</td></tr>
<tr><td>Cr³⁺</td><td>NaOH(aq) in excess</td><td>grey-green ppt; dissolves in excess to a dark green solution</td></tr></table></div>
<div class="wex"><p><strong>Worked example.</strong> A green solid dissolves to give a pale green solution. With NaOH(aq) a green precipitate forms, turning brown at the surface on standing. With HNO₃ and Ba(NO₃)₂, a white precipitate. Identify the solid.</p>
<p>Green ppt turning orange-brown: Fe²⁺. White ppt with barium ions: SO₄²⁻. The solid is <strong>iron(II) sulfate, FeSO₄</strong>.</p></div>
<blockquote class="tip"><p><strong>Exam tip:</strong> these questions reward precise observations: name the colour, say "precipitate" or "solution", and say what happens in excess. "Turns blue" is ambiguous; "pale blue precipitate that dissolves in excess ammonia to form a dark blue solution" scores fully.</p></blockquote>
`;

window.SPEC.topics.forEach(t=>{ if(N[t.id]) t.notes=N[t.id]; });
})();
