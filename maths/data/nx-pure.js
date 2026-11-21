/* Full topic notes for Pure Mathematics (Edexcel 9MA0). Overrides the short notes in notes.js. */
(function(){
const N={};

N.p1_1=String.raw`### Indices: what a power means
A power (index) counts how many times a number is multiplied by itself: $a^4=a\times a\times a\times a$. Every index law is just careful counting of how many $a$'s there are.
- **Multiplying**: $a^3\times a^2=(a\,a\,a)(a\,a)=a^5$. Five $a$'s, so **add** the powers: $a^m\times a^n=a^{m+n}$.
- **Dividing**: $a^5\div a^2=\dfrac{a\,a\,a\,a\,a}{a\,a}=a^3$. Two cancel, so **subtract**: $a^m\div a^n=a^{m-n}$.
- **Power of a power**: $(a^2)^3=a^2\times a^2\times a^2=a^6$, so **multiply**: $(a^m)^n=a^{mn}$.
- **Brackets**: $(ab)^n=a^nb^n$. The power applies to everything inside: $(3x)^2=9x^2$, not $3x^2$.
### Zero, negative and fractional powers
These are not extra rules to memorise: they are the only values that keep the laws above working.
- $a^3\div a^3=1$, but the law says it is $a^{0}$. So $a^0=1$ (for $a\neq0$).
- $a^2\div a^5=a^{-3}$, but cancelling gives $\dfrac{1}{a^3}$. So a negative power means **one over**: $a^{-n}=\dfrac1{a^n}$.
- $a^{\frac12}\times a^{\frac12}=a^1$, so $a^{\frac12}$ is the number that multiplied by itself gives $a$: the square root. In general $a^{\frac1n}=\sqrt[n]{a}$ and $a^{\frac mn}=\left(\sqrt[n]{a}\right)^m$.
Work out fractional powers root first, then power, to keep the numbers small: $27^{\frac23}=(\sqrt[3]{27})^2=3^2=9$.
> **Worked example.** Simplify $\dfrac{2x^{3}\times 6x^{-1}}{4\sqrt{x}}$.
> Top: $12x^{3-1}=12x^2$. Bottom: $4x^{\frac12}$.
> So the expression is $3x^{2-\frac12}=3x^{\frac32}$.
> **Worked example.** Evaluate $\left(\dfrac{16}{81}\right)^{-\frac34}$.
> The negative power flips the fraction: $\left(\dfrac{81}{16}\right)^{\frac34}=\left(\dfrac{3}{2}\right)^3=\dfrac{27}{8}$.
### Expanding brackets
Multiply every term in one bracket by every term in the other. For three brackets, expand two first, then multiply the result by the third.
$$(x+3)(2x-5)=2x^2-5x+6x-15=2x^2+x-15$$
$$(x+1)(x-2)(x+4)=(x^2-x-2)(x+4)=x^3+3x^2-6x-8$$
### Factorising
Factorising is expanding in reverse.
- **Common factor**: $6x^3-9x^2=3x^2(2x-3)$. Take out the highest common factor of the numbers and the lowest power of each letter.
- **Quadratics** $ax^2+bx+c$: find two numbers that multiply to $ac$ and add to $b$, split the middle term, then factorise in pairs. For $2x^2+7x+3$: $ac=6$, numbers $6$ and $1$. So $2x^2+6x+x+3=2x(x+3)+1(x+3)=(2x+1)(x+3)$.
- **Difference of two squares**: $a^2-b^2=(a+b)(a-b)$. So $9x^2-25=(3x+5)(3x-5)$.
- **Cubics**: take out a common factor first if you can: $x^3-4x=x(x^2-4)=x(x+2)(x-2)$. (Harder cubics use the factor theorem, chapter 7.)
### Surds
A **surd** is a root that cannot be simplified to a whole number or fraction, such as $\sqrt2$ or $\sqrt[3]{5}$. Surds are irrational: their decimals never end or repeat. We keep them as surds to keep answers **exact**.
- $\sqrt{ab}=\sqrt a\sqrt b$ and $\sqrt{\dfrac ab}=\dfrac{\sqrt a}{\sqrt b}$.
- To simplify, find the largest square factor: $\sqrt{72}=\sqrt{36\times2}=6\sqrt2$.
- Add only "like" surds, just like algebra: $3\sqrt2+5\sqrt2=8\sqrt2$, but $\sqrt2+\sqrt3$ cannot be simplified.
- $\sqrt a\times\sqrt a=a$.
- Warning: $\sqrt{a+b}\neq\sqrt a+\sqrt b$. Try $a=9,b=16$: $\sqrt{25}=5$, but $3+4=7$.
### Rationalising the denominator
"Rationalising" means rewriting a fraction so there is no surd in the denominator.
- If the bottom is $\sqrt a$: multiply top and bottom by $\sqrt a$. $\dfrac{6}{\sqrt3}=\dfrac{6\sqrt3}{3}=2\sqrt3$.
- If the bottom is $a+\sqrt b$: multiply top and bottom by $a-\sqrt b$. The bottom becomes $a^2-b$ by the difference of two squares, and the surd vanishes.
> **Worked example.** Rationalise $\dfrac{5}{3-\sqrt2}$.
> Multiply by $\dfrac{3+\sqrt2}{3+\sqrt2}$: bottom $=9-2=7$, top $=5(3+\sqrt2)=15+5\sqrt2$.
> Answer: $\dfrac{15+5\sqrt2}{7}$.
### Watch out
- Rewrite roots and fractions as powers before differentiating or integrating: $\dfrac{4}{\sqrt x}=4x^{-\frac12}$, $\dfrac{1}{3x^2}=\tfrac13x^{-2}$ (the 3 is not squared).
- $-3^2=-9$ but $(-3)^2=9$.
- Leave surds simplified and denominators rational unless told otherwise.`;

N.p1_2=String.raw`### What a quadratic is
A quadratic is an expression $ax^2+bx+c$ with $a\neq0$. Its graph $y=ax^2+bx+c$ is a **parabola**: a U shape if $a>0$, an upside-down U (∩) if $a<0$. Solving $ax^2+bx+c=0$ means finding where the graph crosses the $x$-axis. These solutions are called the **roots**.
### Three ways to solve
1. **Factorising** (fastest when it works). If $(x-2)(x+5)=0$ then one bracket must be zero, so $x=2$ or $x=-5$. Always rearrange to "$=0$" first.
2. **Completing the square** (below).
3. **The quadratic formula**, which always works:
$$x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}$$
Leave answers as exact surds unless a decimal is asked for. Never divide both sides by $x$ to "simplify": you would lose the root $x=0$.
### Completing the square
The idea: $(x+p)^2=x^2+2px+p^2$. So $x^2+bx$ is "nearly" $\left(x+\tfrac b2\right)^2$, but too big by $\left(\tfrac b2\right)^2$:
$$x^2+bx=\left(x+\tfrac b2\right)^2-\left(\tfrac b2\right)^2$$
> **Worked example.** Write $x^2-6x+11$ in completed-square form.
> Half of $-6$ is $-3$: $x^2-6x=(x-3)^2-9$. So $x^2-6x+11=(x-3)^2+2$.
If $a\neq1$, take $a$ out of the $x^2$ and $x$ terms first: $2x^2+8x-3=2(x^2+4x)-3=2[(x+2)^2-4]-3=2(x+2)^2-11$.
**Why it is useful.** A square is never negative. In $(x-3)^2+2$, the smallest the square can be is $0$, when $x=3$. So the minimum value is $2$, and the graph's **vertex (turning point)** is $(3,2)$. In general $a(x+p)^2+q$ has vertex $(-p,\,q)$, and the line of symmetry is $x=-p$.
Completing the square on $ax^2+bx+c=0$ in general is how the quadratic formula is derived.
### Sketching a quadratic graph
Show: the shape (U or ∩), the **$y$-intercept** (put $x=0$: it is $c$), the **roots** ($x$-intercepts, solve $=0$), and the **vertex** (complete the square, or use symmetry: halfway between the roots).
### Functions
A **function** is a rule that gives exactly one output for each input. We write $f(x)=x^2-3x$, so $f(4)=16-12=4$ and $f(a+1)=(a+1)^2-3(a+1)$. The **roots** of a function are the values of $x$ for which $f(x)=0$. The **domain** is the set of allowed inputs; the **range** is the set of outputs (for $f(x)=(x-3)^2+2$ the range is $f(x)\ge2$).
### The discriminant
{{svg1}}
The part under the square root in the formula, $b^2-4ac$, is the **discriminant**. It tells you how many real roots there are without solving:
- $b^2-4ac>0$: two distinct real roots (the graph crosses the $x$-axis twice).
- $b^2-4ac=0$: one repeated root (the graph just touches the axis: the vertex is on it).
- $b^2-4ac<0$: no real roots (you cannot square-root a negative; the graph misses the axis).
> **Worked example.** Find the values of $k$ for which $x^2+kx+9=0$ has two distinct real roots.
> Need $b^2-4ac>0$: $k^2-36>0$, so $(k-6)(k+6)>0$.
> This quadratic in $k$ is positive outside its roots: $k<-6$ or $k>6$. (See chapter 3 for quadratic inequalities.)
### Modelling with quadratics
Quadratics model things that rise then fall (or fall then rise): the height of a thrown ball, profit against price, area against side length.
> **Worked example.** A ball's height is $h=1.5+12t-4.9t^2$ metres after $t$ seconds. Find the maximum height.
> Complete the square: $h=-4.9\left(t^2-\tfrac{12}{4.9}t\right)+1.5=-4.9(t-1.224)^2+7.35+1.5$.
> Maximum height $\approx8.85$ m, at $t\approx1.22$ s. It lands when $h=0$: the formula gives $t=2.57$ s (rejecting the negative root).
When evaluating a model, comment on whether answers are realistic (negative times or heights are rejected; the model ignores air resistance).
### Watch out
- Check the sign of $c$ when using the formula: for $x^2-3x-4=0$, $c=-4$.
- "Hidden quadratics": $x^4-5x^2+4=0$ is a quadratic in $x^2$. Let $u=x^2$: $u^2-5u+4=0$, $u=1$ or $4$, so $x=\pm1,\pm2$. The same trick works for $x-5\sqrt x+6=0$ (let $u=\sqrt x$).`;

N.p1_3=String.raw`### Linear simultaneous equations
Two equations, two unknowns: find the values that make **both** true. Graphically, it is where the two lines cross.
- **Elimination**: multiply the equations so one variable has the same coefficient in both, then add or subtract to remove it.
- **Substitution**: rearrange one equation for one variable and substitute it into the other.
> **Worked example.** Solve $3x+2y=8$ and $2x-5y=18$.
> Multiply the first by 5 and the second by 2: $15x+10y=40$ and $4x-10y=36$.
> Add: $19x=76$, so $x=4$. Then $12+2y=8$ gives $y=-2$.
### One linear and one quadratic
Always use **substitution**: rearrange the linear equation for $x$ or $y$ and substitute into the quadratic. You get a quadratic in one variable. Solve it, then find the matching values of the other variable using the **linear** equation (to avoid extra wrong answers).
> **Worked example.** Solve $y=x+1$ and $x^2+y^2=13$.
> Substitute: $x^2+(x+1)^2=13 \Rightarrow 2x^2+2x-12=0 \Rightarrow x^2+x-6=0 \Rightarrow (x+3)(x-2)=0$.
> $x=2,\ y=3$ or $x=-3,\ y=-2$. Give the answers as pairs.
### Simultaneous equations on graphs
The solutions are the coordinates of the **points of intersection**. After substituting, the number of solutions of the resulting quadratic tells you how the graphs meet, using the discriminant:
- $b^2-4ac>0$: the line crosses the curve at two points.
- $b^2-4ac=0$: one point: the line is a **tangent** to the curve.
- $b^2-4ac<0$: the line misses the curve.
This is how questions like "find $k$ such that $y=2x+k$ is a tangent to $y=x^2+3$" are done: substitute, rearrange to $x^2-2x+3-k=0$, set $b^2-4ac=0$: $4-4(3-k)=0$, so $k=2$.
### Linear inequalities
Solve like an equation, with one rule: **multiplying or dividing by a negative number reverses the inequality sign**. ($2>1$, but $-2<-1$.)
$$5-3x<11 \Rightarrow -3x<6 \Rightarrow x>-2$$
Use set notation where asked: $\{x: x>-2\}$. For two conditions, $\{x: x<1\}\cup\{x:x>4\}$ means "or" (union), and $\{x: x>-2\}\cap\{x:x<5\}$ means "and" (intersection), written $-2<x<5$.
### Quadratic inequalities
{{svg1}}
Never just "solve like an equation". The method:
1. Rearrange so one side is $0$: e.g. $x^2-x-6<0$.
2. Find the **critical values** by solving $x^2-x-6=0$: $(x-3)(x+2)=0$, so $x=-2,\ 3$.
3. **Sketch** $y=x^2-x-6$. It is a U shape crossing the axis at $-2$ and $3$.
4. "$<0$" means where the graph is **below** the axis: between the roots, $-2<x<3$. "$>0$" would be outside the roots: $x<-2$ or $x>3$.
Do not multiply both sides by an expression containing $x$ (like $x$ or $x-1$) unless you know its sign: if $x$ might be negative, the sign would flip. For $\dfrac{6}{x}<3$, multiply both sides by $x^2$ (always positive) instead: $6x<3x^2$, then solve $3x^2-6x>0$, giving $x<0$ or $x>2$.
### Inequalities on graphs and regions
- $f(x)>g(x)$ means the values of $x$ where the graph of $f$ is **above** the graph of $g$. Find where they intersect, then read off from a sketch.
- An inequality in $x$ and $y$ describes a **region** of the plane. $y>2x+1$ is everything above the line $y=2x+1$.
- Draw the boundary as a **dashed** line for $<$ or $>$ (not included) and a **solid** line for $\le$ or $\ge$ (included).
- To check which side, test a point not on the line, such as $(0,0)$.
- For several inequalities, the required region satisfies all of them. Edexcel usually asks you to label it $R$ (shading conventions vary, so follow the question).
### Watch out
- Give quadratic inequality answers as two separate inequalities when the region is outside the roots. "$-2>x>3$" is meaningless.
- In "line and curve" questions, find $y$ from the linear equation.`;

N.p1_4=String.raw`### Sketching polynomial graphs
A sketch should show the correct **shape**, where the graph **crosses or touches the axes** (with coordinates), and any **asymptotes**. It does not need to be to scale. To sketch from a factorised form:
1. Find the $y$-intercept (put $x=0$).
2. Find the $x$-intercepts (the roots: set each factor to zero).
3. Decide the shape from the highest power and the sign of its coefficient (what happens as $x$ gets very large).
4. At a **repeated root** (a squared factor), the graph **touches** the axis and turns back. At a **triple root** (cubed factor) it flattens and crosses (a point of inflection).
### Cubic graphs $y=ax^3+bx^2+cx+d$
- If $a>0$: the graph comes up from bottom-left and goes to top-right (as $x\to\infty$, $y\to\infty$).
- If $a<0$: it comes down from top-left to bottom-right.
- A cubic has up to three real roots and usually two turning points.
> **Worked example.** Sketch $y=(x-1)^2(x+3)$.
> $y$-intercept: $x=0$ gives $(1)(3)=3$, so $(0,3)$.
> Roots: $x=1$ (repeated, so the graph touches the axis there) and $x=-3$ (crosses).
> Leading term $x^3$ with positive coefficient: starts bottom-left, crosses at $-3$, rises through $(0,3)$, comes back down to touch $(1,0)$ and goes up again.
### Quartic graphs $y=ax^4+\dots$
- If $a>0$: W shape, both ends going up. If $a<0$: M shape, both ends going down.
- Up to four real roots. $y=(x+1)^2(x-2)^2$ touches the axis at both $-1$ and $2$ and never goes below it.
### Reciprocal graphs
- $y=\dfrac kx$: two separate curves in opposite quadrants (1st and 3rd if $k>0$; 2nd and 4th if $k<0$). Neither axis is ever reached: the axes are **asymptotes**, lines the curve gets closer and closer to but never meets.
- $y=\dfrac k{x^2}$: both branches are on the same side of the $x$-axis (above if $k>0$), because $x^2$ is always positive. Asymptotes are again the axes.
### Points of intersection
To find where two graphs meet, set the equations equal and solve. On a sketch, the number of intersections equals the number of real solutions to $f(x)=g(x)$, so a sketch can tell you how many solutions an equation has without solving it. For example, sketching $y=x^2(x-3)$ and $y=\dfrac2x$ shows they meet twice, so $x^3(x-3)=2$ has exactly two real solutions.
### Transformations of graphs
{{svg1}}
Starting from $y=f(x)$:
- $y=f(x)+a$: translation by $\begin{pmatrix}0\\a\end{pmatrix}$: **up** by $a$. Changes outside the function act on $y$, the way you would expect.
- $y=f(x+a)$: translation by $\begin{pmatrix}-a\\0\end{pmatrix}$: **left** by $a$. Changes inside act on $x$, the opposite way to what you might expect. Reason: the graph of $f(x+2)$ reaches any given height 2 units earlier than $f(x)$ did.
- $y=af(x)$: vertical stretch, scale factor $a$ (every $y$-coordinate multiplied by $a$).
- $y=f(ax)$: horizontal stretch, scale factor $\dfrac1a$ (every $x$-coordinate divided by $a$).
- $y=-f(x)$: reflection in the $x$-axis. $y=f(-x)$: reflection in the $y$-axis.
What stays put: points on the $x$-axis do not move under a vertical stretch; points on the $y$-axis do not move under a horizontal stretch. Asymptotes move with the graph.
> **Worked example.** The curve $y=f(x)$ has a maximum at $(2,5)$. Find the maximum of (a) $y=f(x-3)$ (b) $y=3f(x)$ (c) $y=f(2x)$.
> (a) Right 3: $(5,5)$. (b) $y$ trebled: $(2,15)$. (c) $x$ halved: $(1,5)$.
> **Worked example.** Describe $y=\dfrac{1}{x+2}+3$ in terms of $y=\dfrac1x$.
> Translation by $\begin{pmatrix}-2\\3\end{pmatrix}$. The asymptotes move to $x=-2$ and $y=3$.
### Watch out
- Label every intercept and asymptote with its value or equation.
- For combinations, apply one transformation at a time and track a few key points (intercepts, turning points).`;

N.p1_5=String.raw`### Gradient and the equation $y=mx+c$
The **gradient** of a line measures its steepness: how much $y$ increases for each 1 unit increase in $x$. Between two points $(x_1,y_1)$ and $(x_2,y_2)$:
$$m=\frac{y_2-y_1}{x_2-x_1}=\frac{\text{change in }y}{\text{change in }x}$$
Positive gradient: slopes upwards; negative: downwards; zero: horizontal ($y=k$). A vertical line $x=k$ has undefined gradient.
In $y=mx+c$, $m$ is the gradient and $c$ is the $y$-intercept (where the line crosses the $y$-axis, at $(0,c)$). The **general form** is $ax+by+c=0$, where $a,b,c$ are usually integers. To find the gradient from it, rearrange into $y=mx+c$ first.
### Finding the equation of a line
The quickest method uses one point $(x_1,y_1)$ and the gradient $m$:
$$y-y_1=m(x-x_1)$$
Where it comes from: any other point $(x,y)$ on the line must give the same gradient: $\dfrac{y-y_1}{x-x_1}=m$.
> **Worked example.** Find the equation of the line through $(2,-1)$ and $(6,7)$ in the form $ax+by+c=0$.
> $m=\dfrac{7-(-1)}{6-2}=2$. So $y+1=2(x-2)$, giving $y=2x-5$, or $2x-y-5=0$.
### Parallel and perpendicular lines
- **Parallel** lines have **equal** gradients.
- **Perpendicular** lines have gradients that multiply to $-1$: $m_1m_2=-1$, so $m_2=-\dfrac1{m_1}$ ("flip and change sign"). A line of gradient $\tfrac23$ is perpendicular to one of gradient $-\tfrac32$.
Why: rotating the step "1 across, $m$ up" through $90°$ gives the step "$m$ back, 1 up", whose gradient is $\dfrac{1}{-m}=-\dfrac1m$.
> **Worked example.** Find the line perpendicular to $3x+4y=12$ through $(1,2)$.
> $y=-\tfrac34x+3$, so $m=-\tfrac34$. Perpendicular gradient $\tfrac43$.
> $y-2=\tfrac43(x-1)$, i.e. $4x-3y+2=0$.
### Lengths, midpoints and areas
- **Distance** between two points, from Pythagoras: $d=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$.
- **Midpoint**: $\left(\dfrac{x_1+x_2}2,\dfrac{y_1+y_2}2\right)$.
- **Intersection** of two lines: solve their equations simultaneously.
- **Area of a triangle** formed by lines: find the vertices by solving pairs of equations, then use $\tfrac12\times$base$\times$height. Look for a horizontal or vertical side, or a right angle (perpendicular lines), to make base and height easy.
> **Worked example.** The lines $y=2x$ and $y=-\tfrac12x+5$ meet at $P$. They cross the $x$-axis at $O$ and $Q$. Find the area of triangle $OPQ$.
> $P$: $2x=-\tfrac12x+5\Rightarrow x=2,\ y=4$. $Q$: $0=-\tfrac12x+5\Rightarrow x=10$.
> Base $OQ=10$ along the $x$-axis, height $=4$ (the $y$-coordinate of $P$). Area $=\tfrac12\times10\times4=20$.
### Modelling with straight lines
Two quantities that change at a constant rate have a linear relationship. In context, the **gradient is the rate of change** (with units, e.g. £ per km) and the **intercept is the starting value** (when the input is 0).
> **Worked example.** A taxi charges £3.20 plus £1.50 per mile. Cost $C=1.5d+3.2$. The gradient 1.5 is the cost per mile; the intercept 3.2 is the fixed charge.
Linear models break down outside the range of the data (extrapolation): for example a model for a plant's height cannot keep growing forever.
### Watch out
- Keep fractions exact; give general form with integer coefficients.
- "Show that the lines are perpendicular": find both gradients and show their product is $-1$.`;

N.p1_6=String.raw`### Midpoints and perpendicular bisectors
The **perpendicular bisector** of a line segment $AB$ is the line that cuts $AB$ in half at right angles. Every point on it is the same distance from $A$ as from $B$. To find it:
1. Find the midpoint of $AB$.
2. Find the gradient of $AB$, then the perpendicular gradient $-\dfrac1m$.
3. Use $y-y_1=m(x-x_1)$ through the midpoint.
This matters for circles: the perpendicular bisector of any **chord** passes through the **centre**.
### The equation of a circle
{{svg1}}
A circle is the set of points a fixed distance $r$ (the radius) from a fixed point $(a,b)$ (the centre). Using the distance formula for a point $(x,y)$ on the circle:
$$(x-a)^2+(y-b)^2=r^2$$
A circle centred on the origin is $x^2+y^2=r^2$. Note the signs: $(x+3)^2+(y-1)^2=16$ has centre $(-3,1)$ and radius $4$.
### Finding the centre and radius from the expanded form
If the equation is given as $x^2+y^2+2fx+2gy+c=0$, **complete the square** in $x$ and in $y$.
> **Worked example.** Find the centre and radius of $x^2+y^2-6x+4y-12=0$.
> $(x-3)^2-9+(y+2)^2-4-12=0$, so $(x-3)^2+(y+2)^2=25$.
> Centre $(3,-2)$, radius $5$.
If completing the square gives $r^2\le0$, the equation is not a circle (that is how questions with an unknown $k$ give a range of values).
### Intersections of lines and circles
Substitute the line into the circle equation to get a quadratic. The discriminant tells you what happens:
- $b^2-4ac>0$: the line cuts the circle at two points (it contains a chord).
- $b^2-4ac=0$: the line is a **tangent** (touches at one point).
- $b^2-4ac<0$: the line misses the circle.
### Tangent and chord properties
Three circle theorems from GCSE are used constantly:
- **A tangent is perpendicular to the radius** at the point of contact. So the gradient of the tangent at $P$ is $-\dfrac1m$, where $m$ is the gradient of the radius from the centre to $P$.
- **The perpendicular from the centre to a chord bisects the chord.** Equivalently, the perpendicular bisector of a chord passes through the centre.
- **The angle in a semicircle is a right angle.** If $AB$ is a diameter and $C$ is on the circle, angle $ACB=90°$.
> **Worked example.** Find the equation of the tangent to $(x-1)^2+(y-2)^2=25$ at $P(4,6)$.
> Gradient of radius from $(1,2)$ to $(4,6)$ is $\tfrac43$. Tangent gradient $-\tfrac34$.
> $y-6=-\tfrac34(x-4)$, so $3x+4y-36=0$.
### Circles and triangles
- The **circumcircle** of a triangle passes through all three vertices. Its centre (the circumcentre) is where the **perpendicular bisectors of the sides meet**. To find it, find two perpendicular bisectors and solve them simultaneously; the radius is the distance from there to any vertex.
- If the triangle is right-angled, the hypotenuse is a **diameter** of the circumcircle (angle in a semicircle), so the centre is the midpoint of the hypotenuse.
> **Worked example.** Show that $A(0,0)$, $B(6,0)$, $C(0,8)$ lie on a circle and find its equation.
> $AB$ is along the $x$-axis and $AC$ along the $y$-axis, so angle $A=90°$ and $BC$ is a diameter.
> Centre = midpoint of $BC$ = $(3,4)$. Radius = $\tfrac12\times10=5$. Circle: $(x-3)^2+(y-4)^2=25$.
### Watch out
- Read the centre as $(a,b)$ from $(x-a)^2+(y-b)^2$: the signs flip.
- $r$ is the square root of the right-hand side: $(x-1)^2+y^2=20$ has $r=2\sqrt5$, not 20.
- To check whether a point lies inside, on or outside a circle, compare its distance from the centre with $r$.`;

N.p1_7=String.raw`### Algebraic fractions
Algebraic fractions work exactly like number fractions.
- **Simplify** by factorising top and bottom fully, then cancelling common **factors** (never cancel terms that are added): $\dfrac{x^2-9}{x^2+5x+6}=\dfrac{(x+3)(x-3)}{(x+3)(x+2)}=\dfrac{x-3}{x+2}$.
- **Multiply**: factorise, cancel, then multiply tops and bottoms. **Divide**: flip the second fraction and multiply.
- **Add or subtract**: use a common denominator. $\dfrac{2}{x}+\dfrac{3}{x+1}=\dfrac{2(x+1)+3x}{x(x+1)}=\dfrac{5x+2}{x(x+1)}$.
### Dividing polynomials
A **polynomial** is a sum of whole-number powers of $x$, like $2x^3-3x^2+4$. Dividing one by a linear factor $(x-a)$ uses **long division**, set out like numerical long division:
1. Divide the leading term of what is left by $x$ to get the next term of the answer.
2. Multiply $(x-a)$ by that term and subtract.
3. Bring down the next term and repeat.
If a power is missing, put in a $0$ placeholder: $x^3-7x+6$ is $x^3+0x^2-7x+6$.
> **Worked example.** Divide $2x^3+3x^2-8x+3$ by $(x-1)$.
> $2x^3\div x=2x^2$; $2x^2(x-1)=2x^3-2x^2$; subtract: $5x^2-8x$.
> $5x^2\div x=5x$; $5x(x-1)=5x^2-5x$; subtract: $-3x+3$.
> $-3x\div x=-3$; $-3(x-1)=-3x+3$; remainder $0$.
> So $2x^3+3x^2-8x+3=(x-1)(2x^2+5x-3)=(x-1)(2x-1)(x+3)$.
You can also find the quotient by **comparing coefficients**: write $(x-1)(ax^2+bx+c)$, expand, and match each power.
### The factor theorem
**If $f(a)=0$, then $(x-a)$ is a factor of $f(x)$.** And conversely, if $(x-a)$ is a factor then $f(a)=0$.
Why: dividing $f(x)$ by $(x-a)$ gives $f(x)=(x-a)q(x)+R$. Put $x=a$: $f(a)=R$. So the remainder is zero exactly when $f(a)=0$.
More generally, $(ax-b)$ is a factor if $f\!\left(\tfrac ba\right)=0$.
To **factorise a cubic**: try small values ($\pm1,\pm2,\pm3$, factors of the constant term) until $f(a)=0$. Then divide by $(x-a)$ to get a quadratic, and factorise that.
> **Worked example.** Given $(x+2)$ is a factor of $f(x)=x^3+px^2-x-6$, find $p$.
> $f(-2)=0$: $-8+4p+2-6=0$, so $p=3$.
> Then dividing $x^3+3x^2-x-6$ by $(x+2)$ gives $(x+2)(x^2+x-3)$.
### Mathematical proof
A **proof** is a logical argument that shows a statement is **always** true, not just in the cases you tried. Write it in clear steps, start from known facts, and finish with a concluding statement (e.g. "therefore $n^2+n$ is always even").
Useful facts to set up proofs about integers:
- An even number can be written $2n$, an odd number $2n+1$ (for an integer $n$).
- Consecutive integers: $n,\ n+1,\ n+2$. Consecutive odd numbers: $2n+1,\ 2n+3$.
- A multiple of 3: $3n$; a number that leaves remainder 1 on division by 3: $3n+1$.
### Methods of proof
- **Proof by deduction**: start from known facts and use algebra. *Prove that the sum of any three consecutive integers is a multiple of 3*: $n+(n+1)+(n+2)=3n+3=3(n+1)$, which is a multiple of 3.
- **Proof by exhaustion**: split into a finite number of cases and check each. *Prove that $n^2+n$ is even*: if $n$ is even, $n=2k$ and $n^2+n=2k(2k+1)$, even; if $n$ is odd, $n=2k+1$ and $n^2+n=(2k+1)(2k+2)=2(2k+1)(k+1)$, even. Both cases cover all integers.
- **Disproof by counter-example**: to show a statement is false, one example where it fails is enough. *"$n^2-n+41$ is always prime"*: $n=41$ gives $41^2$, not prime.
- **Completing the square** proves things are always positive: $x^2-6x+10=(x-3)^2+1\ge1>0$ for all $x$.
(Proof by contradiction is in Year 2, chapter 1.)
### Watch out
- Checking several examples is **not** a proof.
- In proofs, say what each letter is ("let $n$ be an integer") and end with a sentence linking back to the statement.`;

N.p1_8=String.raw`### Pascal's triangle
Expand $(a+b)^n$ for small $n$ and look at the coefficients:
- $(a+b)^1$: 1 1
- $(a+b)^2$: 1 2 1
- $(a+b)^3$: 1 3 3 1
- $(a+b)^4$: 1 4 6 4 1
Each row starts and ends with 1, and every other number is the **sum of the two above it**. Why: $(a+b)^{n+1}=(a+b)^n(a+b)$, and each term in the new row comes from two terms of the old row (one multiplied by $a$, one by $b$). Row $n$ gives the coefficients of $(a+b)^n$. In each term the powers of $a$ go down from $n$ to $0$ while the powers of $b$ go up from $0$ to $n$; in every term the powers add to $n$.
### Factorial notation and $^nC_r$
$n!=n\times(n-1)\times\dots\times2\times1$, with $0!=1$. For example $5!=120$.
The number of ways of choosing $r$ objects from $n$ is
$$^nC_r=\binom nr=\frac{n!}{r!(n-r)!}$$
These are exactly the numbers in Pascal's triangle: $\binom nr$ is entry $r$ (counting from 0) in row $n$. Why: in $(a+b)^n=(a+b)(a+b)\cdots(a+b)$, a term $a^{n-r}b^r$ comes from choosing $b$ from $r$ of the $n$ brackets, and there are $\binom nr$ ways to choose them.
Useful: $\binom n0=\binom nn=1$, $\binom n1=n$, $\binom n2=\dfrac{n(n-1)}2$, and $\binom nr=\binom n{n-r}$ (symmetry).
### The binomial expansion
For a positive whole number $n$:
$$(a+b)^n=a^n+\binom n1a^{n-1}b+\binom n2a^{n-2}b^2+\dots+\binom nra^{n-r}b^r+\dots+b^n$$
The **general term** is $\binom nra^{n-r}b^r$. A special case is
$$(1+x)^n=1+nx+\frac{n(n-1)}{2!}x^2+\frac{n(n-1)(n-2)}{3!}x^3+\dots$$
> **Worked example.** Find the first four terms of $(2-3x)^5$ in ascending powers of $x$.
> $a=2$, $b=-3x$. Keep the negative inside a bracket.
> $2^5+\binom51 2^4(-3x)+\binom52 2^3(-3x)^2+\binom53 2^2(-3x)^3$
> $=32+5(16)(-3x)+10(8)(9x^2)+10(4)(-27x^3)=32-240x+720x^2-1080x^3$.
### Solving binomial problems
**Finding one coefficient.** Use the general term rather than expanding everything.
> **Worked example.** Find the coefficient of $x^3$ in $(3+2x)^7$.
> The term with $x^3$ has $r=3$: $\binom73 3^4(2x)^3=35\times81\times8x^3=22680x^3$. Coefficient $22680$.
**Unknown constants.** If a coefficient is given, write it in terms of the unknown and solve.
> **Worked example.** In $(1+kx)^6$ the coefficient of $x^2$ is $60$. Find the possible values of $k$.
> $\binom62k^2=15k^2=60$, so $k^2=4$, $k=\pm2$.
**Products.** For $(1+2x)(1-x)^5$ up to $x^2$: expand $(1-x)^5=1-5x+10x^2-\dots$, then multiply by $(1+2x)$, keeping only terms up to $x^2$: $1-5x+10x^2+2x-10x^2=1-3x+0x^2$.
**Approximations.** Choose $x$ to match the number. To estimate $1.02^{8}$, use $(1+2x)^8$ with $x=0.01$: $1+16x+112x^2+\dots=1+0.16+0.0112\approx1.1712$. Because $x$ is small, the higher powers are tiny and can be ignored.
### Watch out
- Put the whole second term in a bracket and raise all of it to the power: $(-3x)^2=9x^2$.
- "Ascending powers of $x$" means starting with the constant term.
- This chapter's expansion (positive integer $n$) ends after $n+1$ terms. For negative or fractional $n$, see Year 2, chapter 4.`;

N.p1_9=String.raw`### Labelling and right-angled triangles
In any triangle, label the angles $A,B,C$ and the sides opposite them $a,b,c$ (side $a$ is opposite angle $A$).
{{svg1}}
In a right-angled triangle, SOH CAH TOA: $\sin\theta=\dfrac{\text{opp}}{\text{hyp}}$, $\cos\theta=\dfrac{\text{adj}}{\text{hyp}}$, $\tan\theta=\dfrac{\text{opp}}{\text{adj}}$. For triangles that are not right-angled, use the sine and cosine rules.
### The cosine rule
$$a^2=b^2+c^2-2bc\cos A \qquad \cos A=\frac{b^2+c^2-a^2}{2bc}$$
Use it when you know **three sides** (to find an angle) or **two sides and the angle between them** (to find the third side). When $A=90°$, $\cos A=0$ and it becomes Pythagoras: the $-2bc\cos A$ term is the correction for a non-right angle.
> **Worked example.** In triangle $ABC$, $b=7$ cm, $c=5$ cm, $A=40°$. Find $a$.
> $a^2=49+25-70\cos40°=74-53.62=20.38$, so $a=4.51$ cm.
### The sine rule
$$\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}$$
Use it when you know **a side and the angle opposite it**, plus one other side or angle. Use the form with the unknown on top: sides on top to find a side, $\dfrac{\sin A}{a}=\dfrac{\sin B}b$ to find an angle.
**Why it is true**: drop a perpendicular of height $h$ from $C$ to side $AB$. Then $h=b\sin A$ and also $h=a\sin B$. So $b\sin A=a\sin B$, which rearranges to $\dfrac a{\sin A}=\dfrac b{\sin B}$.
### The ambiguous case
When you use the sine rule to find an angle, there may be **two** possible answers, because $\sin\theta=\sin(180°-\theta)$. If $\sin B=0.8$, then $B=53.1°$ **or** $B=126.9°$. Both are valid if the angles in the triangle still add up to less than $180°$. This happens when you are given two sides and a **non-included** angle opposite the shorter side.
> **Worked example.** $a=6$, $b=8$, $A=40°$. Find $B$.
> $\sin B=\dfrac{8\sin40°}{6}=0.857$, so $B=59.0°$ or $B=180°-59.0°=121.0°$.
> Check: $40+121=161<180$, so both triangles exist.
### Area of a triangle
$$\text{Area}=\tfrac12ab\sin C$$
Two sides and the angle **between** them. (It is $\tfrac12\times$ base $\times$ height, with height $=a\sin C$.)
### Solving triangle problems
Draw a clear diagram, mark what you know, and decide which rule fits:
- Three sides, or two sides and the included angle: cosine rule.
- An angle and its opposite side known: sine rule.
- Bearings are measured clockwise from north; use alternate angles on parallel north lines to find angles inside the triangle.
Give angles to 1 decimal place and keep full calculator values between steps.
### Graphs of sine, cosine and tangent
- $y=\sin x$: starts at $0$, peaks at $1$ at $90°$, back to $0$ at $180°$, minimum $-1$ at $270°$, repeats every $360°$ (period $360°$).
- $y=\cos x$: same shape shifted: starts at $1$ at $0°$, $0$ at $90°$, $-1$ at $180°$. Period $360°$. $\cos x=\sin(x+90°)$.
- $y=\tan x$: passes through $0$ at $0°,180°,360°$; has vertical **asymptotes** at $x=90°,270°$ (where $\cos x=0$ and $\tan x=\frac{\sin x}{\cos x}$ is undefined). Period $180°$.
Both $\sin$ and $\cos$ lie between $-1$ and $1$; $\tan$ takes all values.
### Transforming trigonometric graphs
The transformations from chapter 4 apply:
- $y=3\sin x$: vertical stretch, amplitude 3 (values between $-3$ and $3$).
- $y=\sin2x$: horizontal stretch scale factor $\tfrac12$: period becomes $180°$.
- $y=\cos(x+60°)$: translated $60°$ to the **left**.
- $y=\sin x+1$: translated up 1.
For $y=\sin(ax)$ the period is $\dfrac{360°}{a}$.
### Watch out
- Have your calculator in **degrees** for this chapter.
- With the sine rule for an angle, always check whether the obtuse angle $180°-\theta$ is also possible.`;

N.p1_10=String.raw`### Angles in all four quadrants
Imagine a point $P$ moving round a circle of radius 1 centred at the origin, starting on the positive $x$-axis and turning anticlockwise through angle $\theta$. Then **$\cos\theta$ is the $x$-coordinate of $P$, $\sin\theta$ is its $y$-coordinate**, and $\tan\theta=\dfrac{\sin\theta}{\cos\theta}$ is the gradient of $OP$. This definition works for any angle, not just those in a right-angled triangle.
The signs follow from which quadrant $P$ is in. "**CAST**", starting in the 4th quadrant and going anticlockwise, says which are positive:
- $0°$ to $90°$: **A**ll positive.
- $90°$ to $180°$: only **S**in positive.
- $180°$ to $270°$: only **T**an positive.
- $270°$ to $360°$: only **C**os positive.
Every angle has a **related acute angle** to the $x$-axis, which gives the size; CAST gives the sign. For example $\sin210°=-\sin30°=-\tfrac12$.
Symmetries you can read from the graphs: $\sin(180°-\theta)=\sin\theta$, $\cos(-\theta)=\cos\theta$, $\cos(360°-\theta)=\cos\theta$, $\tan(180°+\theta)=\tan\theta$.
### Exact values
From an equilateral triangle of side 2 cut in half (sides $1,\sqrt3,2$) and an isosceles right triangle (sides $1,1,\sqrt2$):
- $\sin30°=\tfrac12$, $\cos30°=\tfrac{\sqrt3}2$, $\tan30°=\tfrac1{\sqrt3}$
- $\sin45°=\cos45°=\tfrac{1}{\sqrt2}=\tfrac{\sqrt2}2$, $\tan45°=1$
- $\sin60°=\tfrac{\sqrt3}2$, $\cos60°=\tfrac12$, $\tan60°=\sqrt3$
And $\sin0°=0$, $\cos0°=1$, $\sin90°=1$, $\cos90°=0$.
### Two key identities
For the point on the unit circle, Pythagoras gives $x^2+y^2=1$, so
$$\sin^2\theta+\cos^2\theta\equiv1 \qquad \tan\theta\equiv\frac{\sin\theta}{\cos\theta}$$
($\sin^2\theta$ means $(\sin\theta)^2$.) The $\equiv$ means "true for all values". Use them to:
- Find one ratio from another: if $\sin\theta=\tfrac35$ and $\theta$ is obtuse, then $\cos^2\theta=1-\tfrac9{25}=\tfrac{16}{25}$ and $\cos\theta=-\tfrac45$ (negative in the 2nd quadrant).
- **Prove identities**: start from one side (usually the more complicated one) and use the identities to turn it into the other side. Do not work on both sides at once.
> **Worked example.** Prove that $\dfrac{1-\cos^2\theta}{\tan\theta}\equiv\sin\theta\cos\theta$.
> LHS $=\dfrac{\sin^2\theta}{\sin\theta/\cos\theta}=\sin^2\theta\times\dfrac{\cos\theta}{\sin\theta}=\sin\theta\cos\theta=$ RHS.
### Solving simple trigonometric equations
The calculator gives only one solution (the **principal value**). Because the graphs repeat, there are usually more in the interval asked for.
{{svg1}}
1. Find the principal value with the inverse function.
2. Find the second solution in $0°\le x<360°$: for $\sin$, $180°-x$; for $\cos$, $360°-x$; for $\tan$, $x+180°$. (Or sketch the graph and use symmetry.)
3. Add or subtract $360°$ (or $180°$ for $\tan$) to get any others in the range.
> **Worked example.** Solve $\sin x=-0.4$ for $0°\le x<360°$.
> Calculator: $x=-23.6°$ (out of range). Related angle $23.6°$; $\sin$ is negative in quadrants 3 and 4.
> $x=180°+23.6°=203.6°$ and $x=360°-23.6°=336.4°$.
### Harder equations
**Multiple angles.** For $\cos2x=0.5$ in $0°\le x<360°$, let $u=2x$; then $0°\le u<720°$, so find **all** $u$ in that doubled range: $u=60°,300°,420°,660°$, giving $x=30°,150°,210°,330°$. Always adjust the interval first, then divide at the end.
**Shifted angles.** For $\sin(x+30°)=0.5$ in $0°\le x<360°$, first shift the interval: $30°\le x+30°<390°$. In that range $x+30°=30°$ or $150°$ ($390°$ is just outside), so $x=0°$ or $120°$.
**Quadratics in sin, cos or tan.** Treat $\sin x$ like a variable: $2\sin^2x-\sin x-1=0$ factorises as $(2\sin x+1)(\sin x-1)=0$, so $\sin x=-\tfrac12$ or $\sin x=1$. Then solve each.
### Equations and identities together
Use the identities to get an equation in **one** trigonometric function:
- Replace $\cos^2x$ with $1-\sin^2x$ (or the reverse).
- Replace $\dfrac{\sin x}{\cos x}$ with $\tan x$: $\sin x=2\cos x$ becomes $\tan x=2$.
> **Worked example.** Solve $3\cos^2x=1+\sin x$ for $0°\le x<360°$.
> $3(1-\sin^2x)=1+\sin x\Rightarrow3\sin^2x+\sin x-2=0\Rightarrow(3\sin x-2)(\sin x+1)=0$.
> $\sin x=\tfrac23$: $x=41.8°,138.2°$. $\sin x=-1$: $x=270°$.
### Watch out
- Never divide both sides by $\sin x$ or $\cos x$: you lose the solutions where it equals zero. Factorise instead: $\sin x\cos x=\sin x$ becomes $\sin x(\cos x-1)=0$.
- Values outside $-1\le\sin x\le1$ give no solutions; say so.`;

N.p1_11=String.raw`### What a vector is
A **vector** has both **magnitude** (size) and **direction**, such as a displacement "3 m east" or a velocity. A **scalar** has only magnitude (a distance, a speed, a mass).
{{svg1}}
- A vector from $A$ to $B$ is written $\overrightarrow{AB}$, or in print as a bold letter $\mathbf a$ (handwritten $\underline a$).
- Two vectors are **equal** if they have the same magnitude and direction, wherever they are.
- $-\mathbf a$ has the same magnitude as $\mathbf a$ but the opposite direction: $\overrightarrow{BA}=-\overrightarrow{AB}$.
- $k\mathbf a$ is parallel to $\mathbf a$ and $k$ times as long. Two vectors are **parallel** if one is a scalar multiple of the other.
### Adding vectors
Vectors add **tip to tail** (the triangle law): $\overrightarrow{AB}+\overrightarrow{BC}=\overrightarrow{AC}$. The result is called the **resultant**. Subtraction: $\mathbf a-\mathbf b=\mathbf a+(-\mathbf b)$.
### Representing vectors
In 2D, $\mathbf i$ and $\mathbf j$ are **unit vectors** (length 1) in the $x$ and $y$ directions. Any vector can be written as $\mathbf a=3\mathbf i-2\mathbf j=\begin{pmatrix}3\\-2\end{pmatrix}$ (a column vector). Add, subtract and multiply by scalars component by component:
$$\begin{pmatrix}3\\-2\end{pmatrix}+2\begin{pmatrix}1\\4\end{pmatrix}=\begin{pmatrix}5\\6\end{pmatrix}$$
### Magnitude and direction
By Pythagoras, the magnitude of $\mathbf a=x\mathbf i+y\mathbf j$ is
$$|\mathbf a|=\sqrt{x^2+y^2}$$
- A **unit vector** in the direction of $\mathbf a$ is $\hat{\mathbf a}=\dfrac{\mathbf a}{|\mathbf a|}$. For $\mathbf a=3\mathbf i+4\mathbf j$, $|\mathbf a|=5$ and $\hat{\mathbf a}=\tfrac35\mathbf i+\tfrac45\mathbf j$.
- The **direction** is usually given as an angle with $\mathbf i$ (or a bearing): $\tan\theta=\dfrac yx$, and a sketch shows which quadrant.
- From magnitude and direction to components: a vector of length $r$ at angle $\theta$ above the positive $x$-axis is $r\cos\theta\,\mathbf i+r\sin\theta\,\mathbf j$.
### Position vectors
The **position vector** of a point $A$ is $\overrightarrow{OA}$, the vector from the origin. If $A$ is $(2,5)$, then $\overrightarrow{OA}=2\mathbf i+5\mathbf j$.
The key result:
$$\overrightarrow{AB}=\overrightarrow{OB}-\overrightarrow{OA}=\mathbf b-\mathbf a$$
(Go from $A$ back to $O$, then out to $B$.) The distance $AB=|\mathbf b-\mathbf a|$.
### Solving geometric problems
Express every vector in terms of a few basic ones ($\mathbf a$ and $\mathbf b$, say), by finding a route through the diagram.
- **Ratios on a line**: if $P$ divides $AB$ in the ratio $2:3$, then $\overrightarrow{AP}=\tfrac25\overrightarrow{AB}$. The midpoint has position vector $\tfrac12(\mathbf a+\mathbf b)$.
- **To prove points are collinear** (on one straight line): show $\overrightarrow{AB}=k\overrightarrow{BC}$, so the vectors are parallel and share the point $B$.
- **Comparing coefficients**: if $\mathbf a$ and $\mathbf b$ are not parallel and $p\mathbf a+q\mathbf b=r\mathbf a+s\mathbf b$, then $p=r$ and $q=s$. This lets you find unknown ratios where two lines cross: write the crossing point two ways and equate.
> **Worked example.** $OAB$ is a triangle with $\overrightarrow{OA}=\mathbf a$, $\overrightarrow{OB}=\mathbf b$. $M$ is the midpoint of $AB$. Find $\overrightarrow{OM}$.
> $\overrightarrow{AB}=\mathbf b-\mathbf a$, so $\overrightarrow{OM}=\overrightarrow{OA}+\tfrac12\overrightarrow{AB}=\mathbf a+\tfrac12(\mathbf b-\mathbf a)=\tfrac12(\mathbf a+\mathbf b)$.
### Modelling with vectors
Vectors describe displacements, velocities, accelerations and forces.
- Speed is the magnitude of velocity: a velocity of $(6\mathbf i-8\mathbf j)$ m s$^{-1}$ has speed $10$ m s$^{-1}$.
- Displacement $=$ velocity $\times$ time (for constant velocity), and position after $t$ seconds $=$ starting position $+\ t\times$ velocity: $\mathbf r=\mathbf r_0+t\mathbf v$.
- Forces add as vectors; the **resultant force** is their sum.
> **Worked example.** A boat starts at $(2\mathbf i+\mathbf j)$ km and moves with velocity $(3\mathbf i-4\mathbf j)$ km h$^{-1}$. Find its position after 2 hours and its speed.
> $\mathbf r=(2\mathbf i+\mathbf j)+2(3\mathbf i-4\mathbf j)=8\mathbf i-7\mathbf j$ km. Speed $=\sqrt{9+16}=5$ km h$^{-1}$.
### Watch out
- $\overrightarrow{AB}=\mathbf b-\mathbf a$, not $\mathbf a-\mathbf b$.
- Magnitude is never negative; direction needs a diagram to choose the right angle.`;

N.p1_12=String.raw`### The gradient of a curve
A straight line has the same gradient everywhere. A curve does not: its steepness changes. The **gradient of a curve at a point** is the gradient of the **tangent** there (the straight line that just touches the curve at that point).
Differentiation is the method for finding this gradient exactly. The result is a new function, the **derivative** or **gradient function**, written $\dfrac{dy}{dx}$ or $f'(x)$: it gives the gradient of the curve at any $x$.
### Differentiation from first principles
{{svg1}}
Take a point $P$ at $x$ and a nearby point $Q$ at $x+h$ on $y=f(x)$. The gradient of the **chord** $PQ$ is
$$\frac{f(x+h)-f(x)}{h}$$
As $Q$ slides towards $P$ ($h\to0$), the chord becomes the tangent. So
$$f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}$$
> **Worked example.** Prove from first principles that the derivative of $x^2$ is $2x$.
> $\dfrac{(x+h)^2-x^2}{h}=\dfrac{x^2+2xh+h^2-x^2}{h}=\dfrac{2xh+h^2}{h}=2x+h$.
> As $h\to0$, this tends to $2x$. So $f'(x)=2x$.
For $x^3$ the same method gives $3x^2+3xh+h^2\to3x^2$. Exam questions on first principles must show the limit step clearly.
### Differentiating $x^n$
The pattern from first principles generalises to any power $n$:
$$\frac{d}{dx}\left(x^n\right)=nx^{n-1}$$
"Multiply by the power, then reduce the power by one." Also $\dfrac{d}{dx}(ax^n)=anx^{n-1}$, and a constant differentiates to $0$ (a horizontal line has zero gradient).
You can differentiate a sum term by term: $\dfrac d{dx}(3x^4-5x+7)=12x^3-5$.
**Rewrite first**, so every term is $ax^n$:
- $\sqrt x=x^{\frac12}$, $\dfrac{1}{x^2}=x^{-2}$, $\dfrac{3}{\sqrt x}=3x^{-\frac12}$.
- Expand brackets: $(x+2)(x-3)=x^2-x-6$.
- Split fractions: $\dfrac{x^3+4}{x}=x^2+4x^{-1}$.
> **Worked example.** Differentiate $y=\dfrac{4x^3-\sqrt x}{2x}$.
> $y=2x^2-\tfrac12x^{-\frac12}$, so $\dfrac{dy}{dx}=4x+\tfrac14x^{-\frac32}$.
### Tangents and normals
- The **tangent** at $x=a$ has gradient $m=f'(a)$ and passes through $(a,f(a))$.
- The **normal** is the line perpendicular to the tangent at that point: gradient $-\dfrac1{f'(a)}$.
> **Worked example.** Find the equation of the normal to $y=x^3-2x$ at $x=1$.
> $y=1-2=-1$. $\dfrac{dy}{dx}=3x^2-2=1$ at $x=1$. Normal gradient $-1$.
> $y+1=-(x-1)$, so $y=-x$.
### Increasing and decreasing functions
- $f$ is **increasing** on an interval if $f'(x)\ge0$ there (going uphill left to right).
- **Decreasing** if $f'(x)\le0$.
To find where $f(x)=x^3-6x^2+9x$ is decreasing: $f'(x)=3x^2-12x+9=3(x-1)(x-3)\le0$, so $1\le x\le3$.
### Second derivatives
Differentiating again gives the **second derivative** $\dfrac{d^2y}{dx^2}$ or $f''(x)$: the rate of change of the gradient. If $y=x^4$, $\dfrac{dy}{dx}=4x^3$ and $\dfrac{d^2y}{dx^2}=12x^2$.
### Stationary points
At a **stationary point** the gradient is zero: $\dfrac{dy}{dx}=0$. The tangent is horizontal. Types:
- **Local maximum**: gradient goes $+,0,-$. Here $\dfrac{d^2y}{dx^2}<0$ (gradient decreasing).
- **Local minimum**: gradient goes $-,0,+$. Here $\dfrac{d^2y}{dx^2}>0$.
- If $\dfrac{d^2y}{dx^2}=0$, the test fails: check the gradient just either side (it might be a point of inflection, where the gradient has the same sign on both sides).
> **Worked example.** Find and classify the stationary points of $y=x^3-3x^2-9x+5$.
> $\dfrac{dy}{dx}=3x^2-6x-9=3(x-3)(x+1)=0$, so $x=3$ or $x=-1$.
> $\dfrac{d^2y}{dx^2}=6x-6$. At $x=-1$: $-12<0$, maximum at $(-1,10)$. At $x=3$: $12>0$, minimum at $(3,-22)$.
### Sketching gradient functions
To sketch $y=f'(x)$ from the graph of $y=f(x)$:
- Stationary points of $f$ become **$x$-intercepts** of $f'$.
- Where $f$ is increasing, $f'$ is above the axis; where $f$ is decreasing, $f'$ is below.
- Vertical asymptotes stay in place; a horizontal asymptote of $f$ becomes $y=0$ for $f'$.
### Modelling with differentiation
$\dfrac{dy}{dx}$ is the **rate of change** of $y$ with respect to $x$. If $V$ is volume and $t$ is time, $\dfrac{dV}{dt}$ is the rate the volume changes. **Optimisation** problems ask for a maximum or minimum: write the quantity in terms of **one** variable (use the constraint to eliminate the other), differentiate, set equal to zero, solve, and check it is a max or min.
> **Worked example.** A rectangular pen uses 40 m of fence along three sides; the fourth side is a wall. Maximise the area.
> Sides $x,x$ (perpendicular to the wall) and $40-2x$. Area $A=x(40-2x)=40x-2x^2$.
> $\dfrac{dA}{dx}=40-4x=0\Rightarrow x=10$. $\dfrac{d^2A}{dx^2}=-4<0$, a maximum. Max area $=10\times20=200$ m$^2$.
### Watch out
- Rewrite roots and fractions as powers **before** differentiating.
- State the conclusion: "so the minimum is at ...", including the $y$-coordinate if asked.`;

N.p1_13=String.raw`### Integration reverses differentiation
If you know the gradient function $\dfrac{dy}{dx}$, integration recovers $y$. Since $\dfrac{d}{dx}(x^{n+1})=(n+1)x^n$, going backwards:
$$\int x^n\,dx=\frac{x^{n+1}}{n+1}+c\qquad(n\neq-1)$$
"Add one to the power, then divide by the new power." The $\int\dots dx$ means "integrate with respect to $x$".
### The constant of integration
$x^2+5$, $x^2-1$ and $x^2$ all differentiate to $2x$: constants vanish when you differentiate. So when integrating we must add an unknown constant $+c$. This is an **indefinite integral**: a whole family of curves, all the same shape, shifted up and down.
$$\int(6x^2-4x+3)\,dx=2x^3-2x^2+3x+c$$
As with differentiation, rewrite first: $\int\dfrac{2}{x^3}\,dx=\int2x^{-3}\,dx=\dfrac{2x^{-2}}{-2}+c=-\dfrac1{x^2}+c$.
### Finding a function from its gradient
If you know the curve passes through a particular point, you can find $c$.
> **Worked example.** A curve has $\dfrac{dy}{dx}=3\sqrt x-2$ and passes through $(4,10)$. Find its equation.
> $y=\int(3x^{\frac12}-2)\,dx=2x^{\frac32}-2x+c$.
> At $(4,10)$: $10=2(8)-8+c$, so $c=2$. Hence $y=2x^{\frac32}-2x+2$.
### Definite integrals
A **definite integral** has limits:
$$\int_a^bf(x)\,dx=\Big[F(x)\Big]_a^b=F(b)-F(a)$$
where $F$ is any integral of $f$. The constant $c$ cancels, so leave it out.
> **Worked example.** $\displaystyle\int_1^3(x^2+1)\,dx=\left[\tfrac{x^3}3+x\right]_1^3=(9+3)-\left(\tfrac13+1\right)=10\tfrac23$.
### Areas under curves
{{svg1}}
The definite integral $\displaystyle\int_a^b y\,dx$ gives the **area between the curve, the $x$-axis and the lines $x=a$ and $x=b$**, when the curve is above the axis.
**Why**: split the area into thin vertical strips of width $\delta x$. Each has area about $y\,\delta x$. Adding them and letting $\delta x\to0$ gives the exact area. Also, if $A(x)$ is the area up to $x$, increasing $x$ by $\delta x$ adds a strip of area $\approx y\,\delta x$, so $\dfrac{dA}{dx}=y$: the area function is an integral of $y$. (Year 2 chapter 11 makes this precise.)
### Areas under the $x$-axis
When the curve is **below** the $x$-axis, the integral is **negative**. Its size is still the area.
- If a region is partly above and partly below, the parts cancel in a single integral. Find the roots, integrate each part **separately**, and add the sizes.
> **Worked example.** Find the area enclosed between $y=x(x-2)$ and the $x$-axis.
> Roots $0$ and $2$; the curve is below the axis between them. $\displaystyle\int_0^2(x^2-2x)\,dx=\left[\tfrac{x^3}3-x^2\right]_0^2=\tfrac83-4=-\tfrac43$.
> The area is $\tfrac43$.
### Areas between curves and lines
The area between an upper curve $y_1$ and a lower curve $y_2$ from $x=a$ to $x=b$ is
$$\int_a^b(y_1-y_2)\,dx$$
This works whatever side of the axis they are on. Find $a$ and $b$ from where the graphs intersect. Alternatively, find the area under the curve and add or subtract simple shapes (triangles, trapezia) for the straight-line parts.
> **Worked example.** Find the area between $y=4x-x^2$ and $y=x$.
> Intersect: $4x-x^2=x\Rightarrow x(3-x)=0$, so $x=0,3$. The parabola is on top.
> $\displaystyle\int_0^3(3x-x^2)\,dx=\left[\tfrac32x^2-\tfrac13x^3\right]_0^3=\tfrac{27}2-9=4.5$.
### Watch out
- Indefinite integrals need $+c$; definite ones do not.
- You cannot integrate a product or quotient term by term: expand or divide first.
- Sketch the curve before finding an area, to see whether any part is below the axis.`;

N.p1_14=String.raw`### Exponential functions
An **exponential function** has the variable in the power: $y=a^x$ with $a>0$. For $a>1$ it grows ever faster; for $0<a<1$ it decays. Key features of $y=a^x$:
- It passes through $(0,1)$, since $a^0=1$.
- It is always positive. The $x$-axis is an **asymptote**.
- $y=a^{-x}=\left(\tfrac1a\right)^x$ is its reflection in the $y$-axis.
### The number $e$ and $y=e^x$
{{svg1}}
For every exponential $y=a^x$, the gradient is proportional to the value of $y$. There is exactly one base for which the gradient **equals** $y$ at every point. That base is $e=2.71828\dots$:
$$\frac{d}{dx}\left(e^x\right)=e^x\qquad \frac d{dx}\left(e^{kx}\right)=ke^{kx}$$
This is what makes $e$ natural: it is the base for which the rate of growth is the amount present. $y=e^{kx}$ grows if $k>0$, decays if $k<0$.
### Exponential modelling
Exponentials model anything whose **rate of change is proportional to its size**: populations, compound interest, radioactive decay, cooling, drug concentration.
> **Worked example.** A car's value is $V=20000e^{-0.15t}$ pounds after $t$ years.
> Initial value: $t=0$ gives £20 000. After 4 years: $20000e^{-0.6}=£10\,976$.
> Rate of change at $t=4$: $\dfrac{dV}{dt}=-3000e^{-0.15t}=-£1646$ per year.
Comment on limitations: the model predicts the value never reaches zero, and may not suit very old or rare cars.
### Logarithms
A **logarithm** answers "what power?":
$$\log_ab=x\iff a^x=b$$
So $\log_28=3$ because $2^3=8$, and $\log_{10}0.01=-2$. Logs and exponentials are **inverse functions**: $\log_a(a^x)=x$ and $a^{\log_ax}=x$. Note $\log_a1=0$ and $\log_aa=1$, and you cannot take the log of zero or a negative number.
### Laws of logarithms
These come from the index laws (logs are powers):
- $\log_a(xy)=\log_ax+\log_ay$ (multiplying adds powers)
- $\log_a\left(\dfrac xy\right)=\log_ax-\log_ay$
- $\log_a(x^k)=k\log_ax$
- $\log_a\left(\dfrac1x\right)=-\log_ax$
There is **no** law for $\log(x+y)$.
> **Worked example.** Write $2\log_35+\log_34-\log_310$ as a single logarithm.
> $\log_325+\log_34-\log_310=\log_3\dfrac{25\times4}{10}=\log_310$.
### Solving equations with logarithms
- **Unknown in a power**: take logs of both sides. $3^x=20\Rightarrow x\log3=\log20\Rightarrow x=\dfrac{\log20}{\log3}=2.73$.
- **Hidden quadratic**: $4^x-5(2^x)+4=0$. Let $y=2^x$, so $4^x=y^2$: $y^2-5y+4=0$, $y=1$ or $4$, so $x=0$ or $2$.
- **Equations in logs**: combine into a single log, then undo it. $\log_2x+\log_2(x-2)=3\Rightarrow x(x-2)=8\Rightarrow x=4$ (reject $x=-2$: you cannot log a negative).
### Natural logarithms
The log to base $e$ is the **natural log**, $\ln x=\log_ex$. It is the inverse of $e^x$:
$$\ln(e^x)=x\qquad e^{\ln x}=x$$
Its graph $y=\ln x$ is the reflection of $y=e^x$ in $y=x$: it passes through $(1,0)$ and has the $y$-axis as an asymptote.
> **Worked example.** Solve $3e^{2x}-1=11$.
> $e^{2x}=4$, so $2x=\ln4$ and $x=\tfrac12\ln4=\ln2$.
> **Worked example.** In the car model, when is the value £5000?
> $20000e^{-0.15t}=5000\Rightarrow e^{-0.15t}=0.25\Rightarrow t=\dfrac{\ln0.25}{-0.15}=9.24$ years.
### Logarithms and non-linear data
Taking logs turns exponential and power relationships into straight lines, so data can be checked and constants found from a graph.
- If $y=ax^n$: $\log y=n\log x+\log a$. Plot $\log y$ against $\log x$: gradient $n$, intercept $\log a$.
- If $y=ab^x$: $\log y=x\log b+\log a$. Plot $\log y$ against $x$: gradient $\log b$, intercept $\log a$.
To recover a constant from an intercept $c$, undo the log: $a=10^c$ (or $e^c$ for $\ln$).
> **Worked example.** A graph of $\log_{10}P$ against $t$ is a line with gradient $0.05$ and intercept $2.3$. Find $P$ in the form $ab^t$.
> $\log b=0.05\Rightarrow b=10^{0.05}=1.12$. $\log a=2.3\Rightarrow a=10^{2.3}=200$. So $P=200(1.12)^t$.
### Watch out
- $\ln(a+b)\neq\ln a+\ln b$, and $\log x^2=2\log x$ only for $x>0$.
- Check solutions of log equations in the original: the argument of every log must be positive.`;

N.p2_1=String.raw`### Proof by contradiction
To prove a statement, **assume it is false** and show this leads to something impossible (a contradiction). Then the assumption must be wrong, so the statement is true.
1. Write "Assume, for contradiction, that ..." (the opposite of the statement).
2. Reason logically until you reach something that cannot be true.
3. Conclude: "This is a contradiction, so the original statement is true."
> **Worked example.** Prove that $\sqrt2$ is irrational.
> Assume $\sqrt2$ is rational: $\sqrt2=\dfrac ab$ where $a,b$ are integers with no common factors.
> Squaring: $2=\dfrac{a^2}{b^2}$, so $a^2=2b^2$. So $a^2$ is even, hence $a$ is even (an odd number squared is odd). Write $a=2k$.
> Then $4k^2=2b^2$, so $b^2=2k^2$: $b^2$ is even, so $b$ is even.
> Both $a$ and $b$ are even, contradicting "no common factors". So $\sqrt2$ is irrational.
> **Worked example.** Prove there are infinitely many primes.
> Assume there are finitely many, $p_1,p_2,\dots,p_n$. Let $N=p_1p_2\cdots p_n+1$.
> $N$ leaves remainder 1 when divided by every $p_i$, so none of them divides $N$. So either $N$ is prime or it has a prime factor not on the list. Either way there is a prime not on the list: contradiction.
Other classic examples: "if $n^2$ is even then $n$ is even" (assume $n$ odd, $n=2k+1$, then $n^2=4k^2+4k+1$ is odd); "there is no greatest even number".
**Rational** numbers can be written $\dfrac ab$ with $a,b$ integers, $b\neq0$; **irrational** ones cannot.
### Algebraic fractions (revisited)
Simplify by factorising and cancelling common factors; multiply and divide as with numbers; add using a common denominator. For example
$$\frac{x+1}{x^2-4}-\frac{1}{x+2}=\frac{x+1-(x-2)}{(x+2)(x-2)}=\frac{3}{(x+2)(x-2)}$$
### Partial fractions
Partial fractions reverse that process: split a fraction with a factorised denominator into simpler fractions. It is needed for integration (chapter 11) and binomial expansion (chapter 4).
For distinct linear factors:
$$\frac{5x+1}{(x-1)(x+2)}\equiv\frac{A}{x-1}+\frac{B}{x+2}$$
Multiply through by the denominator: $5x+1\equiv A(x+2)+B(x-1)$. This is an **identity**, true for every $x$, so choose convenient values:
- $x=1$: $6=3A$, $A=2$.
- $x=-2$: $-9=-3B$, $B=3$.
So $\dfrac{5x+1}{(x-1)(x+2)}\equiv\dfrac2{x-1}+\dfrac3{x+2}$. (You can also equate coefficients.)
### Repeated factors
If the denominator has a squared factor $(x-a)^2$, you need a fraction for **each** power:
$$\frac{2x^2+1}{x(x+1)^2}\equiv\frac Ax+\frac B{x+1}+\frac C{(x+1)^2}$$
Then $2x^2+1\equiv A(x+1)^2+Bx(x+1)+Cx$.
- $x=0$: $1=A$.
- $x=-1$: $3=-C$, so $C=-3$.
- Compare $x^2$ coefficients: $2=A+B$, so $B=1$.
### Algebraic division and improper fractions
A fraction is **improper** if the degree (highest power) of the top is greater than or equal to that of the bottom. Divide first, to write it as a polynomial plus a proper fraction:
$$\frac{F(x)}{\text{divisor}}=\text{quotient}+\frac{\text{remainder}}{\text{divisor}}$$
> **Worked example.** Write $\dfrac{x^2+3x+5}{x+1}$ in the form $Ax+B+\dfrac{C}{x+1}$.
> $x^2+3x+5\equiv(Ax+B)(x+1)+C$. Compare: $x^2$: $A=1$. $x$: $A+B=3$, $B=2$. Constant: $B+C=5$, $C=3$.
> So it is $x+2+\dfrac3{x+1}$.
For improper fractions with factorised denominators (e.g. $\dfrac{3x^2-x}{(x-1)(x+1)}$), write $A+\dfrac B{x-1}+\dfrac C{x+1}$ and find all three constants.
### Watch out
- Always check whether a fraction is improper before choosing a partial-fraction form.
- In proof by contradiction, state the assumption clearly and say explicitly where the contradiction is.`;

N.p2_2=String.raw`### The modulus function
The **modulus** $|x|$ is the size of $x$, ignoring its sign: $|5|=5$, $|-5|=5$. Formally $|x|=x$ if $x\ge0$ and $|x|=-x$ if $x<0$.
To sketch $y=|f(x)|$: sketch $y=f(x)$, then **reflect the parts below the $x$-axis upwards**. The graph is never below the axis.
{{svg1}}
For a straight line $y=|ax+b|$ this makes a V shape with its vertex on the $x$-axis at $x=-\tfrac ba$.
### Functions and mappings
A **mapping** takes each input (from the **domain**) to an output (the **range**). A mapping is a **function** if every input has **exactly one** output. It can be one-to-one ($f(x)=2x+1$) or many-to-one ($f(x)=x^2$, where $2$ and $-2$ both map to $4$), but not one-to-many ($y=\pm\sqrt x$ is not a function).
Domain notation: $f(x)=\sqrt{x-3},\ x\ge3$; or $x\in\mathbb R$ (all real numbers). The range is found from a sketch: for $f(x)=x^2+1,\ x\in\mathbb R$, the range is $f(x)\ge1$.
Functions can be **piecewise** (defined differently on different parts of the domain).
### Composite functions
$fg(x)$ means "do $g$ first, then $f$": $fg(x)=f(g(x))$. Work from the inside out.
> **Worked example.** $f(x)=x^2$, $g(x)=3x-1$. Find $fg(x)$ and $gf(x)$.
> $fg(x)=f(3x-1)=(3x-1)^2$. $gf(x)=g(x^2)=3x^2-1$. In general $fg\neq gf$.
For $fg(x)$ to exist, the range of $g$ must fit inside the domain of $f$.
### Inverse functions
The **inverse** $f^{-1}$ undoes $f$: if $f(a)=b$ then $f^{-1}(b)=a$, so $ff^{-1}(x)=x$. Only **one-to-one** functions have inverses (otherwise an output would have to map back to two inputs); restrict the domain of a many-to-one function to make it one-to-one.
To find $f^{-1}$: write $y=f(x)$, rearrange to make $x$ the subject, then swap $x$ and $y$.
> **Worked example.** $f(x)=\dfrac{2x+1}{x-3},\ x>3$. Find $f^{-1}(x)$.
> $y(x-3)=2x+1\Rightarrow xy-2x=3y+1\Rightarrow x=\dfrac{3y+1}{y-2}$. So $f^{-1}(x)=\dfrac{3x+1}{x-2}$.
Key facts:
- The graph of $y=f^{-1}(x)$ is the **reflection of $y=f(x)$ in the line $y=x$**.
- The **domain of $f^{-1}$ is the range of $f$**, and the range of $f^{-1}$ is the domain of $f$.
- Solving $f(x)=f^{-1}(x)$: for increasing functions the graphs meet on $y=x$, so solve $f(x)=x$ instead.
### $y=|f(x)|$ and $y=f(|x|)$
- $y=|f(x)|$: reflect the negative parts of the graph up (outputs made positive).
- $y=f(|x|)$: the part of $y=f(x)$ for $x\ge0$ is kept, and **reflected in the $y$-axis** to replace the left side (inputs made positive). The graph is symmetrical about the $y$-axis.
### Combining transformations
For $y=af(bx+c)+d$, apply transformations one at a time, tracking key points. A safe order: inside the bracket first (horizontal translation, then horizontal stretch), then outside (vertical stretch, then vertical translation).
> **Worked example.** $y=f(x)$ has a maximum at $(4,6)$. Find the maximum of $y=2f(x-1)+3$.
> Right 1: $(5,6)$. Stretch $\times2$: $(5,12)$. Up 3: $(5,15)$.
### Solving modulus problems
- $|f(x)|=g(x)$: solve **both** $f(x)=g(x)$ and $-f(x)=g(x)$, then **check** each answer (some are invalid because the modulus cannot be negative). A sketch shows how many solutions to expect.
- $|f(x)|=|g(x)|$: solve $f(x)=g(x)$ and $f(x)=-g(x)$, or square both sides.
- $|x-a|<b$ means $a-b<x<a+b$ (within $b$ of $a$).
> **Worked example.** Solve $|2x-3|=x+1$.
> $2x-3=x+1\Rightarrow x=4$. $-(2x-3)=x+1\Rightarrow x=\tfrac23$.
> Check: both give $x+1>0$, so both are valid.
### Watch out
- In $fg(x)$, $g$ is applied first.
- When sketching an inverse, show the line $y=x$ and the intercepts swapped.`;

N.p2_3=String.raw`### Sequences and series
A **sequence** is an ordered list of numbers (terms) $u_1,u_2,u_3,\dots$. A **series** is the sum of terms of a sequence. Sequences can be:
- **increasing** ($u_{n+1}>u_n$ for all $n$), **decreasing** ($u_{n+1}<u_n$), or neither;
- **periodic**: the terms repeat in a cycle, e.g. $u_n=(-1)^n$ has period 2.
### Arithmetic sequences
Each term is found by **adding a fixed common difference** $d$: $a,\ a+d,\ a+2d,\dots$
$$u_n=a+(n-1)d$$
($n-1$, because the first term has no $d$ added.)
> **Worked example.** The 4th term is 11 and the 10th is 29. $a+3d=11$, $a+9d=29$, so $6d=18$, $d=3$, $a=2$.
### Arithmetic series
$$S_n=\frac n2\left[2a+(n-1)d\right]=\frac n2(a+l)$$
where $l$ is the last term. **Proof** (Gauss's method; you may be asked for it): write the sum forwards and backwards:
- $S_n=a+(a+d)+\dots+(l-d)+l$
- $S_n=l+(l-d)+\dots+(a+d)+a$
Add: each pair sums to $a+l$, and there are $n$ pairs, so $2S_n=n(a+l)$.
The sum of the first $n$ natural numbers is $1+2+\dots+n=\tfrac12n(n+1)$.
### Geometric sequences
Each term is found by **multiplying by a fixed common ratio** $r$: $a,\ ar,\ ar^2,\dots$
$$u_n=ar^{n-1}$$
If $r<0$ the terms alternate in sign. To find $n$ from a term, use logs: if $3\times2^{n-1}>1000$, then $n-1>\dfrac{\log333.3}{\log2}=8.38$, so $n=10$.
### Geometric series
$$S_n=\frac{a(1-r^n)}{1-r}=\frac{a(r^n-1)}{r-1}$$
**Proof**: $S_n=a+ar+\dots+ar^{n-1}$. Multiply by $r$: $rS_n=ar+ar^2+\dots+ar^n$. Subtract: $S_n-rS_n=a-ar^n$, so $S_n(1-r)=a(1-r^n)$.
### Sum to infinity
If $|r|<1$, then $r^n\to0$ as $n\to\infty$, so the series **converges** to
$$S_\infty=\frac a{1-r}$$
If $|r|\ge1$ the terms do not shrink and the series **diverges** (no sum to infinity).
> **Worked example.** A geometric series has $S_\infty=12$ and first term 4. $\dfrac4{1-r}=12$, so $r=\tfrac23$.
### Sigma notation
$\displaystyle\sum_{r=1}^{n}f(r)$ means "add $f(r)$ for $r=1,2,\dots,n$". For example $\displaystyle\sum_{r=1}^{5}(2r+1)=3+5+7+9+11=35$.
Identify the type of series by writing out the first few terms, then use the formula. Number of terms from $r=a$ to $r=b$ is $b-a+1$. Also $\displaystyle\sum_{r=1}^n1=n$.
For sums that do not start at 1: $\displaystyle\sum_{r=5}^{20}=\sum_{r=1}^{20}-\sum_{r=1}^{4}$.
### Recurrence relations
A **recurrence relation** defines each term from the previous one: $u_{n+1}=f(u_n)$, with a first term given. For example $u_{n+1}=3u_n-2$, $u_1=2$ gives $2,4,10,28,\dots$
Questions often give an unknown constant: if $u_{n+1}=ku_n+3$, $u_1=2$, and $u_3=17$, then $u_2=2k+3$, $u_3=k(2k+3)+3=17$, so $2k^2+3k-14=0$, $k=2$ or $-\tfrac72$.
### Modelling with series
- Arithmetic: something that increases by the same **amount** each time (savings of an extra £10 each month).
- Geometric: something that increases by the same **percentage** (compound interest: multiply by $1.04$ for 4%; depreciation of 15%: multiply by $0.85$).
> **Worked example.** A salary starts at £24 000 and rises by 3% each year. Total earned over 10 years: $S_{10}=\dfrac{24000(1.03^{10}-1)}{0.03}=£275\,133$.
### Watch out
- $u_n$ is a single term; $S_n$ is a sum. Read which is asked for.
- For $n$ in an inequality, $n$ must be a whole number: round up or down sensibly and check.`;

N.p2_4=String.raw`### Beyond positive whole powers
In Year 1 the binomial expansion $(1+x)^n$ had $n$ as a positive integer, giving a finite expansion. The same formula works for **any rational $n$** (negative or fractional), but then the series is **infinite**:
$$(1+x)^n=1+nx+\frac{n(n-1)}{2!}x^2+\frac{n(n-1)(n-2)}{3!}x^3+\dots$$
It is only **valid when $|x|<1$**: the terms shrink and the series converges to the true value. For larger $x$ the terms grow and the series is meaningless.
> **Worked example.** Expand $(1+x)^{-2}$ up to $x^3$.
> $1+(-2)x+\dfrac{(-2)(-3)}{2}x^2+\dfrac{(-2)(-3)(-4)}{6}x^3=1-2x+3x^2-4x^3$, valid for $|x|<1$.
> **Worked example.** Expand $\sqrt{1-4x}$ up to $x^2$, and state when it is valid.
> $(1+(-4x))^{\frac12}=1+\tfrac12(-4x)+\dfrac{\tfrac12(-\tfrac12)}{2}(-4x)^2=1-2x-2x^2$.
> Valid when $|-4x|<1$, i.e. $|x|<\tfrac14$.
In general, replacing $x$ by $kx$ makes the expansion valid for $|kx|<1$, i.e. $|x|<\dfrac1{|k|}$.
### Expanding $(a+bx)^n$
The formula needs a **1** in front. Take out $a^n$ first:
$$(a+bx)^n=a^n\left(1+\frac bax\right)^n$$
then expand, valid for $\left|\dfrac{bx}a\right|<1$, i.e. $|x|<\left|\dfrac ab\right|$.
> **Worked example.** Expand $\dfrac1{(2+x)^3}$ up to $x^2$.
> $(2+x)^{-3}=2^{-3}\left(1+\tfrac x2\right)^{-3}=\tfrac18\left[1+(-3)\tfrac x2+\dfrac{(-3)(-4)}2\left(\tfrac x2\right)^2\right]$
> $=\tfrac18\left[1-\tfrac32x+\tfrac32x^2\right]=\tfrac18-\tfrac3{16}x+\tfrac3{16}x^2$, valid for $|x|<2$.
### Using expansions for approximations
Choose $x$ so that the bracket matches the number, with $x$ small. For $\sqrt{1.04}$, use $(1+x)^{\frac12}=1+\tfrac12x-\tfrac18x^2$ with $x=0.04$: $1+0.02-0.0002=1.0198$ (calculator: $1.019804$).
A common exam task: show that substituting a value gives an approximation to a surd. If $\sqrt{1-4x}\approx1-2x-2x^2$, then $x=0.01$ gives $\sqrt{0.96}\approx0.9798$; since $\sqrt{0.96}=\dfrac{\sqrt{96}}{10}=\dfrac{4\sqrt6}{10}$, this gives $\sqrt6\approx2.4495$.
The value used must be inside the range of validity, and smaller $x$ gives a better approximation.
### Using partial fractions
To expand something like $\dfrac{4-5x}{(1+x)(2-x)}$, first split into partial fractions, then expand each part and add.
> **Worked example.** $\dfrac{4-5x}{(1+x)(2-x)}\equiv\dfrac{3}{1+x}-\dfrac{2}{2-x}$ (by the cover-up method: $x=-1$ gives $A=\tfrac93=3$; $x=2$ gives $B=\tfrac{-6}{3}=-2$).
> $3(1+x)^{-1}=3-3x+3x^2-\dots$ (valid $|x|<1$)
> $2(2-x)^{-1}=\left(1-\tfrac x2\right)^{-1}=1+\tfrac x2+\tfrac{x^2}4+\dots$ (valid $|x|<2$)
> Subtract: $2-\tfrac72x+\tfrac{11}4x^2+\dots$
> The whole expansion is valid where **both** are: $|x|<1$.
### Watch out
- Take out $a^n$ (not $a$) when factorising $(a+bx)^n$.
- Always state the range of validity when asked; for combined expansions it is the narrower one.
- Keep brackets on terms like $\left(-\tfrac x2\right)^2$.`;

N.p2_5=String.raw`### Radian measure
Degrees are an arbitrary choice (360 in a circle). **Radians** measure an angle by arc length: **one radian is the angle at the centre of a circle subtended by an arc equal in length to the radius**.
A full circle has circumference $2\pi r$, which is $2\pi$ radii, so
$$2\pi\text{ rad}=360°\qquad\pi\text{ rad}=180°$$
To convert degrees to radians multiply by $\dfrac{\pi}{180}$; radians to degrees multiply by $\dfrac{180}{\pi}$. Learn: $30°=\tfrac\pi6$, $45°=\tfrac\pi4$, $60°=\tfrac\pi3$, $90°=\tfrac\pi2$, $180°=\pi$, $270°=\tfrac{3\pi}2$.
All the exact values and graphs carry over: $\sin\tfrac\pi6=\tfrac12$, and $y=\sin x$ has period $2\pi$. In calculus (differentiating and integrating trig functions) you **must** use radians.
### Arc length
{{svg1}}
An arc with angle $\theta$ radians is the fraction $\dfrac\theta{2\pi}$ of the circumference:
$$s=\frac{\theta}{2\pi}\times2\pi r=r\theta$$
### Areas of sectors and segments
A sector is the fraction $\dfrac\theta{2\pi}$ of the whole circle's area:
$$A=\frac\theta{2\pi}\times\pi r^2=\tfrac12r^2\theta$$
A **segment** is the region between a chord and its arc: sector minus triangle.
$$\text{segment area}=\tfrac12r^2\theta-\tfrac12r^2\sin\theta=\tfrac12r^2(\theta-\sin\theta)$$
> **Worked example.** A sector has radius 6 cm and angle 1.2 rad. Find its perimeter and the area of the segment.
> Arc $=6\times1.2=7.2$ cm, so perimeter $=7.2+6+6=19.2$ cm.
> Segment $=\tfrac12(36)(1.2-\sin1.2)=18(1.2-0.9320)=4.82$ cm$^2$.
Put the calculator in **radian mode** for $\sin1.2$.
### Solving trigonometric equations in radians
Exactly as in degrees, but the intervals are in radians: second solutions are $\pi-x$ for $\sin$, $2\pi-x$ for $\cos$, and $x+\pi$ for $\tan$. Give exact answers as multiples of $\pi$ when you can.
> **Worked example.** Solve $2\cos\left(x-\tfrac\pi4\right)=1$ for $0\le x<2\pi$.
> $\cos\left(x-\tfrac\pi4\right)=\tfrac12$, with $-\tfrac\pi4\le x-\tfrac\pi4<\tfrac{7\pi}4$.
> $x-\tfrac\pi4=-\tfrac\pi3,\ \tfrac\pi3$ (and $\tfrac{5\pi}3$ is also in range). So $x=-\tfrac\pi{12}$ (out of range), $\tfrac{7\pi}{12}$, $\tfrac{23\pi}{12}$.
> Answer: $x=\tfrac{7\pi}{12},\ \tfrac{23\pi}{12}$.
### Small angle approximations
When $\theta$ is small and **in radians**:
$$\sin\theta\approx\theta\qquad\tan\theta\approx\theta\qquad\cos\theta\approx1-\frac{\theta^2}2$$
**Why**: for a small angle, the arc of a unit circle (length $\theta$), the opposite side ($\sin\theta$) and the tangent length ($\tan\theta$) are all almost the same. For cosine, use $\cos\theta=1-2\sin^2\tfrac\theta2\approx1-2\left(\tfrac\theta2\right)^2$.
They are accurate to about 1% up to around $0.2$ rad ($11°$) for sine and tangent.
> **Worked example.** For small $\theta$, find an approximation to $\dfrac{1-\cos2\theta}{\theta\tan\theta}$.
> $1-\cos2\theta\approx1-\left(1-\dfrac{(2\theta)^2}2\right)=2\theta^2$ and $\theta\tan\theta\approx\theta^2$. So it is approximately $2$.
### Watch out
- Radians and degrees must not be mixed in one calculation.
- Use $\tfrac12r^2\theta$ and $r\theta$ only with $\theta$ in radians.
- In small-angle questions, replace $\cos2\theta$ by $1-\tfrac{(2\theta)^2}2$, not $1-\tfrac{2\theta^2}2$.`;

N.p2_6=String.raw`### Secant, cosecant and cotangent
The three **reciprocal** trigonometric functions:
$$\sec x=\frac1{\cos x}\qquad\operatorname{cosec}x=\frac1{\sin x}\qquad\cot x=\frac1{\tan x}=\frac{\cos x}{\sin x}$$
Memory aid: look at the **third** letter: s**e**c goes with **c**os, co**s**ec goes with **s**in, co**t** with **t**an.
Each is undefined where the function it divides by is zero: $\sec x$ when $\cos x=0$ ($x=90°,270°,\dots$); $\operatorname{cosec}x$ and $\cot x$ when $\sin x=0$ ($x=0°,180°,\dots$).
Exact values follow from the usual ones: $\sec60°=2$, $\operatorname{cosec}45°=\sqrt2$, $\cot30°=\sqrt3$.
### Graphs of $\sec x$, $\operatorname{cosec}x$ and $\cot x$
- $y=\sec x$: wherever $\cos x=\pm1$, $\sec x=\pm1$; as $\cos x\to0$, $\sec x\to\pm\infty$, giving vertical asymptotes at $x=90°,270°$. The graph is a series of U and ∩ shapes, never between $-1$ and $1$. Period $360°$; symmetrical about the $y$-axis.
- $y=\operatorname{cosec}x$: the same shape, shifted: asymptotes at $x=0°,180°,360°$; minimum $1$ at $90°$, maximum $-1$ at $270°$.
- $y=\cot x$: decreasing branches with asymptotes at $x=0°,180°,360°$, crossing the axis at $90°,270°$. Period $180°$.
Range of $\sec$ and $\operatorname{cosec}$: $y\le-1$ or $y\ge1$.
### Using $\sec x$, $\operatorname{cosec}x$ and $\cot x$
Rewrite in terms of $\sin$ and $\cos$ to simplify or solve.
> **Worked example.** Solve $\sec x=-2$ for $0\le x<2\pi$.
> $\cos x=-\tfrac12$, so $x=\tfrac{2\pi}3,\ \tfrac{4\pi}3$.
> **Worked example.** Simplify $\sin x\cot x\sec x$.
> $\sin x\cdot\dfrac{\cos x}{\sin x}\cdot\dfrac1{\cos x}=1$.
### Two more Pythagorean identities
Divide $\sin^2x+\cos^2x\equiv1$ through by $\cos^2x$, and then by $\sin^2x$:
$$1+\tan^2x\equiv\sec^2x\qquad1+\cot^2x\equiv\operatorname{cosec}^2x$$
Use them to turn an equation into a quadratic in one function.
> **Worked example.** Solve $2\tan^2x+\sec x=1$ for $0°\le x<360°$.
> $2(\sec^2x-1)+\sec x-1=0\Rightarrow2\sec^2x+\sec x-3=0\Rightarrow(2\sec x+3)(\sec x-1)=0$.
> $\sec x=1$: $\cos x=1$, $x=0°$. $\sec x=-\tfrac32$: $\cos x=-\tfrac23$, $x=131.8°,228.2°$.
> **Worked example.** Prove $\dfrac{\sec^2\theta-1}{\sec^2\theta}\equiv\sin^2\theta$.
> LHS $=\dfrac{\tan^2\theta}{\sec^2\theta}=\dfrac{\sin^2\theta}{\cos^2\theta}\times\cos^2\theta=\sin^2\theta$.
### Inverse trigonometric functions
$\sin$, $\cos$ and $\tan$ are many-to-one, so to have inverses their domains must be restricted:
- $y=\arcsin x$: domain $-1\le x\le1$, range $-\tfrac\pi2\le y\le\tfrac\pi2$.
- $y=\arccos x$: domain $-1\le x\le1$, range $0\le y\le\pi$.
- $y=\arctan x$: domain all real $x$, range $-\tfrac\pi2<y<\tfrac\pi2$ (horizontal asymptotes at $y=\pm\tfrac\pi2$).
Each graph is the reflection of the restricted trig graph in $y=x$. $\arcsin x$ is also written $\sin^{-1}x$; it does **not** mean $\dfrac{1}{\sin x}$.
> **Worked example.** Find the exact value of $\arccos\left(-\tfrac{\sqrt3}2\right)$.
> The angle in $[0,\pi]$ with cosine $-\tfrac{\sqrt3}2$ is $\tfrac{5\pi}6$.
> **Worked example.** Show that $\sin(\arccos x)=\sqrt{1-x^2}$ for $-1\le x\le1$.
> Let $\theta=\arccos x$, so $\cos\theta=x$ with $0\le\theta\le\pi$, where $\sin\theta\ge0$. So $\sin\theta=\sqrt{1-\cos^2\theta}=\sqrt{1-x^2}$.
### Watch out
- $\sec^2x$ means $(\sec x)^2$.
- When proving identities with $\sec$ and $\operatorname{cosec}$, converting everything to $\sin$ and $\cos$ is often the safest route.`;

N.p2_7=String.raw`### Addition formulae
$$\sin(A\pm B)\equiv\sin A\cos B\pm\cos A\sin B$$
$$\cos(A\pm B)\equiv\cos A\cos B\mp\sin A\sin B$$
$$\tan(A\pm B)\equiv\frac{\tan A\pm\tan B}{1\mp\tan A\tan B}$$
Note the sign **flips** in the cosine formula. $\sin(A+B)$ is **not** $\sin A+\sin B$: try $A=B=45°$.
**Where they come from** (you may be asked to prove $\sin(A+B)$ geometrically): stack two right-angled triangles with angles $A$ and $B$, with the hypotenuse of the top one equal to 1. Splitting the height of the outer shape into two parts gives $\sin(A+B)=\sin A\cos B+\cos A\sin B$. The others follow by replacing $B$ with $-B$, and by using $\tan=\dfrac{\sin}{\cos}$.
### Using the addition formulae
- **Exact values**: $\sin75°=\sin(45°+30°)=\tfrac{\sqrt2}2\cdot\tfrac{\sqrt3}2+\tfrac{\sqrt2}2\cdot\tfrac12=\dfrac{\sqrt6+\sqrt2}4$.
- **Given ratios**: if $\sin A=\tfrac35$ ($A$ acute) and $\cos B=-\tfrac5{13}$ ($B$ obtuse), then $\cos A=\tfrac45$, $\sin B=\tfrac{12}{13}$, so $\sin(A+B)=\tfrac35\left(-\tfrac5{13}\right)+\tfrac45\cdot\tfrac{12}{13}=\tfrac{33}{65}$. Draw right-angled triangles and use CAST for signs.
- **Equations**: $\sin(x+30°)=2\cos x$ expands to an equation you can turn into $\tan x=\dots$
### Double-angle formulae
Put $B=A$ in the addition formulae:
$$\sin2A\equiv2\sin A\cos A$$
$$\cos2A\equiv\cos^2A-\sin^2A\equiv2\cos^2A-1\equiv1-2\sin^2A$$
$$\tan2A\equiv\frac{2\tan A}{1-\tan^2A}$$
The three forms of $\cos2A$ come from substituting $\sin^2A=1-\cos^2A$ or vice versa. Rearranged, they give
$$\cos^2A\equiv\tfrac12(1+\cos2A)\qquad\sin^2A\equiv\tfrac12(1-\cos2A)$$
which are essential for integrating $\sin^2x$ and $\cos^2x$ (chapter 11).
### Solving trigonometric equations
Use double-angle formulae so that every term has the **same angle**, then get a single function.
> **Worked example.** Solve $\cos2x=\sin x$ for $0\le x<2\pi$.
> $1-2\sin^2x=\sin x\Rightarrow2\sin^2x+\sin x-1=0\Rightarrow(2\sin x-1)(\sin x+1)=0$.
> $\sin x=\tfrac12$: $x=\tfrac\pi6,\tfrac{5\pi}6$. $\sin x=-1$: $x=\tfrac{3\pi}2$.
Choose the form of $\cos2x$ that matches the rest of the equation (here, $\sin$).
### Simplifying $a\cos x\pm b\sin x$
{{svg1}}
Any combination $a\sin x+b\cos x$ is a single sine wave, shifted. Write it as $R\sin(x+\alpha)$ (or $R\cos(x-\alpha)$, etc.), with $R>0$:
1. Expand: $R\sin(x+\alpha)=R\sin x\cos\alpha+R\cos x\sin\alpha$.
2. Compare coefficients: $R\cos\alpha=a$, $R\sin\alpha=b$.
3. Square and add: $R=\sqrt{a^2+b^2}$. Divide: $\tan\alpha=\dfrac ba$.
> **Worked example.** Write $3\sin x+4\cos x$ as $R\sin(x+\alpha)$, $0<\alpha<\tfrac\pi2$. Hence find its maximum and solve $3\sin x+4\cos x=2$ for $0\le x<2\pi$.
> $R=5$, $\tan\alpha=\tfrac43$, $\alpha=0.927$. So $5\sin(x+0.927)$.
> Maximum value $5$, when $x+0.927=\tfrac\pi2$, $x=0.644$.
> $\sin(x+0.927)=0.4$, with $0.927\le x+0.927<7.210$: $x+0.927=2.730$ or $6.695$, so $x=1.80$ or $5.77$.
The max of $R\sin(x+\alpha)$ is $R$ and the min is $-R$. To find the max of $\dfrac{1}{8+3\sin x+4\cos x}$, minimise the denominator: $\dfrac1{8-5}=\dfrac13$.
### Proving trigonometric identities
Start from the more complicated side and work towards the other. Useful moves: write everything in $\sin$ and $\cos$; use double-angle formulae to get single angles; combine fractions; factorise.
> **Worked example.** Prove $\dfrac{\sin2\theta}{1+\cos2\theta}\equiv\tan\theta$.
> LHS $=\dfrac{2\sin\theta\cos\theta}{1+2\cos^2\theta-1}=\dfrac{2\sin\theta\cos\theta}{2\cos^2\theta}=\dfrac{\sin\theta}{\cos\theta}=\tan\theta$.
### Modelling with trigonometric functions
Periodic situations (tides, daylight hours, a Ferris wheel, temperature over a day) are modelled with $y=A+R\sin(\omega t+\alpha)$:
- $A$ is the mean level, $R$ the amplitude: max $A+R$, min $A-R$.
- The period is $\dfrac{2\pi}{\omega}$ (or $\dfrac{360°}\omega$).
> **Worked example.** The depth of water is $D=6+2\sin(30t)°$ metres, $t$ hours after midnight. Max depth $8$ m when $30t=90$, $t=3$ (3 am). Min $4$ m. Period $\dfrac{360}{30}=12$ hours.
### Watch out
- In $R\sin(x+\alpha)$, find $\alpha$ from $\tan\alpha=\dfrac ba$ and check its quadrant from the signs of $\sin\alpha$ and $\cos\alpha$.
- Adjust the interval when solving for $x+\alpha$.`;

N.p2_8=String.raw`### Parametric equations
Instead of linking $x$ and $y$ directly, both can be given in terms of a third variable, the **parameter** (often $t$ or $\theta$):
$$x=p(t),\qquad y=q(t)$$
Each value of $t$ gives one point $(x,y)$, and as $t$ varies the point traces out a curve. Think of $t$ as time and the curve as the path of a moving object.
The **domain** of the parameter determines which part of the curve you get. The range of $x$ (the domain of the Cartesian form) comes from the range of $p(t)$.
### Converting to Cartesian form
Eliminate the parameter:
- If one equation is easy to rearrange for $t$, do so and substitute. $x=t+2$, $y=t^2$: $t=x-2$, so $y=(x-2)^2$.
- For $x=\dfrac1{t}$, $y=t^2+1$: $t=\dfrac1x$, so $y=\dfrac1{x^2}+1$.
### Using trigonometric identities
When the parametric equations involve trig functions, use an identity to eliminate $\theta$:
> **Worked example.** $x=3\cos\theta$, $y=3\sin\theta$. Then $\cos\theta=\tfrac x3$, $\sin\theta=\tfrac y3$, and $\cos^2\theta+\sin^2\theta=1$ gives $x^2+y^2=9$: a circle.
> **Worked example.** $x=\sin t$, $y=\cos2t$. Use $\cos2t=1-2\sin^2t$: $y=1-2x^2$, for $-1\le x\le1$.
Other useful identities: $1+\tan^2\theta=\sec^2\theta$ (for $x=\tan\theta$, $y=\sec\theta$), and the addition formulae. A circle with centre $(a,b)$ and radius $r$ is $x=a+r\cos\theta$, $y=b+r\sin\theta$.
### Curve sketching
Make a table of values of $t$, $x$ and $y$, plot the points in order of increasing $t$, and join them. Mark key points: where $x=0$ or $y=0$ (solve for $t$ first), and any turning points. Using the Cartesian form, if easy, is a good check.
### Points of intersection
- With the axes: $y=0$ gives an equation in $t$; solve, then find $x$. Similarly $x=0$.
- With a line or curve given in Cartesian form: **substitute** the parametric expressions for $x$ and $y$, solve for $t$, then find the points.
> **Worked example.** Find where $x=t^2$, $y=2t$ meets the line $y=x-3$.
> $2t=t^2-3\Rightarrow t^2-2t-3=0\Rightarrow t=3$ or $t=-1$. Points $(9,6)$ and $(1,-2)$.
### Modelling with parametric equations
Parametric equations describe motion: $x$ and $y$ are positions at time $t$. For a projectile launched at $20$ m s$^{-1}$ at $30°$ (mechanics, chapter 6):
$$x=20\cos30°\,t,\qquad y=20\sin30°\,t-4.9t^2$$
Questions ask, for example, when it lands ($y=0$), how far it travels (the $x$ value then) and the greatest height. Always check the domain: here $t\ge0$ and $y\ge0$.
### Watch out
- State any restriction on $x$ or $y$ in the Cartesian form that comes from the domain of $t$.
- Area under a parametric curve and $\dfrac{dy}{dx}$ for parametric curves are in chapters 11 and 9.`;

N.p2_9=String.raw`### Differentiating $\sin x$ and $\cos x$ (in radians)
$$\frac{d}{dx}(\sin x)=\cos x\qquad\frac d{dx}(\cos x)=-\sin x$$
**From first principles**: $\dfrac{\sin(x+h)-\sin x}{h}=\dfrac{\sin x\cos h+\cos x\sin h-\sin x}{h}=\sin x\dfrac{\cos h-1}{h}+\cos x\dfrac{\sin h}{h}$. As $h\to0$ (radians), $\dfrac{\sin h}h\to1$ and $\dfrac{\cos h-1}h\to0$ (small-angle approximations), giving $\cos x$. These results are only true in radians.
With a multiple: $\dfrac d{dx}\sin kx=k\cos kx$, $\dfrac d{dx}\cos kx=-k\sin kx$.
### Differentiating exponentials and logarithms
$$\frac d{dx}(e^{kx})=ke^{kx}\qquad\frac d{dx}(\ln x)=\frac1x\qquad\frac d{dx}(a^x)=a^x\ln a$$
Why $\ln x$ gives $\tfrac1x$: if $y=\ln x$ then $x=e^y$, so $\dfrac{dx}{dy}=e^y=x$ and $\dfrac{dy}{dx}=\dfrac1x$. And $a^x=e^{x\ln a}$, so its derivative is $\ln a\cdot e^{x\ln a}$. Note $\dfrac d{dx}\ln(kx)=\dfrac1x$ too, because $\ln kx=\ln k+\ln x$.
### The chain rule
For a function of a function, $y=f(g(x))$: let $u=g(x)$ so $y=f(u)$. Then
$$\frac{dy}{dx}=\frac{dy}{du}\times\frac{du}{dx}$$
"Differentiate the outside (leaving the inside alone), times the derivative of the inside."
> **Worked example.** $y=(3x^2-1)^5$. $\dfrac{dy}{dx}=5(3x^2-1)^4\times6x=30x(3x^2-1)^4$.
> **Worked example.** $y=e^{\sin x}$: $\dfrac{dy}{dx}=\cos x\,e^{\sin x}$. $y=\ln(x^2+1)$: $\dfrac{dy}{dx}=\dfrac{2x}{x^2+1}$.
Also $\dfrac{dy}{dx}=\dfrac1{dx/dy}$, useful when $x$ is given in terms of $y$.
### The product rule
For $y=uv$, where $u$ and $v$ are functions of $x$:
$$\frac{dy}{dx}=u\frac{dv}{dx}+v\frac{du}{dx}$$
> **Worked example.** $y=x^2e^{3x}$: $u=x^2$, $v=e^{3x}$. $\dfrac{dy}{dx}=x^2\cdot3e^{3x}+e^{3x}\cdot2x=xe^{3x}(3x+2)$.
### The quotient rule
For $y=\dfrac uv$:
$$\frac{dy}{dx}=\frac{v\dfrac{du}{dx}-u\dfrac{dv}{dx}}{v^2}$$
> **Worked example.** $y=\dfrac{x}{\sin x}$: $\dfrac{dy}{dx}=\dfrac{\sin x-x\cos x}{\sin^2x}$.
### Differentiating trigonometric functions
Using the quotient and chain rules:
- $\dfrac d{dx}\tan kx=k\sec^2kx$
- $\dfrac d{dx}\sec kx=k\sec kx\tan kx$
- $\dfrac d{dx}\operatorname{cosec}kx=-k\operatorname{cosec}kx\cot kx$
- $\dfrac d{dx}\cot kx=-k\operatorname{cosec}^2kx$
- $\dfrac d{dx}\arcsin x=\dfrac1{\sqrt{1-x^2}}$, $\dfrac d{dx}\arccos x=-\dfrac1{\sqrt{1-x^2}}$, $\dfrac d{dx}\arctan x=\dfrac1{1+x^2}$ (from $x=\sin y$ and $\dfrac{dy}{dx}=\dfrac1{dx/dy}$).
For $y=\sin^3x$, use the chain rule: $3\sin^2x\cos x$.
### Parametric differentiation
If $x$ and $y$ are both functions of $t$:
$$\frac{dy}{dx}=\frac{dy/dt}{dx/dt}$$
> **Worked example.** $x=t^2$, $y=t^3-3t$. Find the tangent at $t=2$.
> $\dfrac{dy}{dx}=\dfrac{3t^2-3}{2t}=\dfrac94$ at $t=2$, where the point is $(4,2)$.
> Tangent: $y-2=\tfrac94(x-4)$.
### Implicit differentiation
When $x$ and $y$ are mixed together (e.g. $x^2+y^3=2xy$), differentiate every term with respect to $x$, treating $y$ as a function of $x$:
- $\dfrac d{dx}(y^n)=ny^{n-1}\dfrac{dy}{dx}$ (chain rule).
- $\dfrac d{dx}(xy)=x\dfrac{dy}{dx}+y$ (product rule).
Then collect the $\dfrac{dy}{dx}$ terms and factorise.
> **Worked example.** $x^2+y^2-4xy=2$. Differentiate: $2x+2y\dfrac{dy}{dx}-4\left(x\dfrac{dy}{dx}+y\right)=0$.
> $\dfrac{dy}{dx}(2y-4x)=4y-2x$, so $\dfrac{dy}{dx}=\dfrac{2y-x}{y-2x}$.
Also $\dfrac{d}{dx}(a^y)=a^y\ln a\dfrac{dy}{dx}$, which gives the derivative of $a^x$ by implicit differentiation.
### Using second derivatives: concavity and inflection
- A curve is **concave** where $f''(x)\le0$ (bending down, like ∩): its gradient is decreasing.
- **Convex** where $f''(x)\ge0$ (bending up, like ∪).
- A **point of inflection** is where the curve changes from concave to convex or vice versa: $f''(x)=0$ **and** $f''$ changes sign. (It need not be a stationary point.)
> **Worked example.** $f(x)=x^3-6x^2+5$: $f''(x)=6x-12$, zero at $x=2$, and negative for $x<2$, positive for $x>2$. So $(2,-11)$ is a point of inflection; $f$ is concave for $x<2$ and convex for $x>2$.
### Rates of change and connected rates
Use the chain rule to link rates: $\dfrac{dV}{dt}=\dfrac{dV}{dr}\times\dfrac{dr}{dt}$.
> **Worked example.** A sphere's radius grows at $0.2$ cm s$^{-1}$. How fast is the volume increasing when $r=5$ cm?
> $V=\tfrac43\pi r^3$, $\dfrac{dV}{dr}=4\pi r^2=100\pi$. $\dfrac{dV}{dt}=100\pi\times0.2=20\pi\approx62.8$ cm$^3$ s$^{-1}$.
Setting up rates of change also forms differential equations: "the rate of decrease of $N$ is proportional to $N$" is $\dfrac{dN}{dt}=-kN$ (solved in chapter 11).
### Watch out
- Simplify answers by factorising common factors such as $e^{3x}$.
- In implicit differentiation, constants differentiate to $0$ and every $y$ term picks up a $\dfrac{dy}{dx}$.`;

N.p2_10=String.raw`### Why numerical methods
Many equations, like $x^3-3x+1=0$ or $e^x=3-x$, cannot be solved exactly with algebra. Numerical methods find roots **approximately**, to any accuracy you want.
### Locating roots: change of sign
If $f(x)$ is **continuous** on $[a,b]$ (no gaps or asymptotes) and $f(a)$ and $f(b)$ have **opposite signs**, then there is at least one root between $a$ and $b$: the graph must cross the axis.
> **Worked example.** Show that $f(x)=x^3-3x+1$ has a root between 1.5 and 1.6.
> $f(1.5)=-0.125<0$ and $f(1.6)=0.296>0$. There is a sign change and $f$ is continuous, so there is a root in $(1.5,1.6)$.
To show a root is $1.53$ to 2 decimal places, check the sign change over the interval $[1.525,1.535]$ (the bounds that round to 1.53).
When it fails:
- An asymptote: $f(x)=\dfrac1{x-2}$ changes sign between 1 and 3 but has no root (discontinuity).
- Two roots close together (or a repeated root that touches the axis): there may be no sign change, so roots can be missed if your interval is too wide.
### Iteration: $x_{n+1}=g(x_n)$
Rearrange $f(x)=0$ into the form $x=g(x)$. Then pick a starting value $x_0$ and repeat
$$x_{n+1}=g(x_n)$$
If the values settle down (**converge**), they approach a root. On a graph, the root is where $y=x$ meets $y=g(x)$.
> **Worked example.** $x^3-3x+1=0$ rearranges to $x=\dfrac{x^3+1}3$. With $x_0=0.5$: $x_1=0.375$, $x_2=0.3509$, $x_3=0.3477$, $x_4=0.3473$... converging to $0.347$.
**Staircase and cobweb diagrams**: draw $y=x$ and $y=g(x)$; from $x_0$ go vertically to the curve, then horizontally to $y=x$, and repeat. A **staircase** approaches the root from one side; a **cobweb** spirals around it.
Convergence depends on the gradient of $g$ near the root: it converges if $|g'(x)|<1$ there and diverges if $|g'(x)|>1$. A different rearrangement of the same equation can converge to a different root, or not at all.
### The Newton–Raphson method
{{svg1}}
Start at $x_0$ near a root. Draw the tangent to $y=f(x)$ at $x_0$; where it crosses the $x$-axis is usually much closer to the root. The tangent has gradient $f'(x_0)$, so it meets the axis at
$$x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}$$
> **Worked example.** Use Newton–Raphson with $x_0=1.5$ to find a root of $f(x)=x^3-3x+1$.
> $f'(x)=3x^2-3$. $x_1=1.5-\dfrac{-0.125}{3.75}=1.5333$. $x_2=1.5333-\dfrac{0.0049}{4.0533}=1.5321$. Root $\approx1.532$.
It converges very fast when it works. It **fails** if $f'(x_n)=0$ (the tangent is horizontal and never meets the axis: you cannot divide by zero), and can jump to a different root or diverge if $x_0$ is near a stationary point (where $f'$ is small).
### Applications to modelling
Numerical methods find answers in models where algebra fails: for example when a population model $P=200e^{0.1t}$ meets a resource model $R=1000+50t$, solve $200e^{0.1t}-1000-50t=0$ numerically. Always interpret the answer in context and check it is sensible.
### Watch out
- State the conclusion of a sign-change argument fully: "sign change and $f$ continuous, so a root lies in ...".
- Write iterates to the accuracy asked and keep full values in your calculator (use the ANS key).`;

N.p2_11=String.raw`### Integrating standard functions
Each comes from reversing a derivative from chapter 9:
- $\int x^n\,dx=\dfrac{x^{n+1}}{n+1}+c$ ($n\neq-1$)
- $\int\dfrac1x\,dx=\ln|x|+c$ (the modulus because $\ln$ needs a positive input; the result also holds for negative $x$)
- $\int e^x\,dx=e^x+c$
- $\int\cos x\,dx=\sin x+c$, $\int\sin x\,dx=-\cos x+c$
- $\int\sec^2x\,dx=\tan x+c$
- $\int\sec x\tan x\,dx=\sec x+c$, $\int\operatorname{cosec}x\cot x\,dx=-\operatorname{cosec}x+c$, $\int\operatorname{cosec}^2x\,dx=-\cot x+c$
### Integrating $f(ax+b)$
Reverse the chain rule: divide by the coefficient $a$.
$$\int f'(ax+b)\,dx=\frac1af(ax+b)+c$$
So $\int e^{3x-1}dx=\tfrac13e^{3x-1}+c$, $\int\cos2x\,dx=\tfrac12\sin2x+c$, $\int\dfrac1{2x+5}dx=\tfrac12\ln|2x+5|+c$, $\int(4x-1)^5dx=\dfrac{(4x-1)^6}{24}+c$.
### Using trigonometric identities
Rewrite powers and products of trig functions as things you can integrate:
- $\int\sin^2x\,dx=\int\tfrac12(1-\cos2x)\,dx=\tfrac12x-\tfrac14\sin2x+c$
- $\int\cos^2x\,dx=\tfrac12x+\tfrac14\sin2x+c$
- $\int\tan^2x\,dx=\int(\sec^2x-1)\,dx=\tan x-x+c$
- $\int\sin x\cos x\,dx=\int\tfrac12\sin2x\,dx=-\tfrac14\cos2x+c$
### Reverse chain rule (recognition)
Look for a function multiplied by (a multiple of) its own derivative:
$$\int\frac{f'(x)}{f(x)}\,dx=\ln|f(x)|+c\qquad\int f'(x)[f(x)]^n\,dx=\frac{[f(x)]^{n+1}}{n+1}+c$$
> **Worked example.** $\int\dfrac{x}{x^2+3}dx=\tfrac12\ln(x^2+3)+c$ (top is half the derivative of the bottom).
> $\int\tan x\,dx=\int\dfrac{\sin x}{\cos x}dx=-\ln|\cos x|+c=\ln|\sec x|+c$.
> $\int x(x^2-1)^4dx=\tfrac1{10}(x^2-1)^5+c$. Check by differentiating.
### Integration by substitution
Replace an awkward part with $u$:
1. Choose $u$ (usually the inside of a bracket or root), find $\dfrac{du}{dx}$ and write $dx$ in terms of $du$.
2. Rewrite the whole integral in $u$ (no $x$ left).
3. Integrate, then substitute back. For definite integrals, **change the limits** to $u$-values instead.
> **Worked example.** $\displaystyle\int_1^2x\sqrt{x-1}\,dx$ with $u=x-1$.
> $dx=du$, $x=u+1$; limits $x=1\to u=0$, $x=2\to u=1$.
> $\displaystyle\int_0^1(u+1)u^{\frac12}du=\left[\tfrac25u^{\frac52}+\tfrac23u^{\frac32}\right]_0^1=\tfrac25+\tfrac23=\tfrac{16}{15}$.
### Integration by parts
Reverse the product rule: since $\dfrac d{dx}(uv)=u\dfrac{dv}{dx}+v\dfrac{du}{dx}$,
$$\int u\frac{dv}{dx}\,dx=uv-\int v\frac{du}{dx}\,dx$$
Choose $u$ as the part that gets **simpler when differentiated** (usually a power of $x$), except: if there is a $\ln x$, let $u=\ln x$.
> **Worked example.** $\int xe^{2x}dx$: $u=x$, $\dfrac{dv}{dx}=e^{2x}$, so $\dfrac{du}{dx}=1$, $v=\tfrac12e^{2x}$.
> $=\tfrac12xe^{2x}-\int\tfrac12e^{2x}dx=\tfrac12xe^{2x}-\tfrac14e^{2x}+c$.
> **Worked example.** $\int\ln x\,dx=\int\ln x\cdot1\,dx$: $u=\ln x$, $v=x$. $=x\ln x-\int x\cdot\tfrac1x\,dx=x\ln x-x+c$.
For $\int x^2\sin x\,dx$, apply parts twice.
### Partial fractions
Split the fraction, then each part integrates to a log:
$$\int\frac{5x+1}{(x-1)(x+2)}dx=\int\left(\frac2{x-1}+\frac3{x+2}\right)dx=2\ln|x-1|+3\ln|x+2|+c$$
Combine logs into one using the log laws if a single answer is asked for. A repeated factor gives a power: $\int\dfrac{3}{(x+1)^2}dx=-\dfrac{3}{x+1}+c$.
### Finding areas
- Area under a curve: $\int_a^by\,dx$ (negative if below the axis).
- Area between two curves: $\int_a^b(y_{\text{top}}-y_{\text{bottom}})\,dx$.
- **Parametric curves**: area $=\displaystyle\int y\,dx=\int y\frac{dx}{dt}\,dt$, with the limits changed to $t$-values.
### The trapezium rule
To estimate $\int_a^by\,dx$ when you cannot integrate exactly: split $[a,b]$ into $n$ strips of width $h=\dfrac{b-a}n$, and use trapezia:
$$\int_a^by\,dx\approx\frac h2\left[y_0+2(y_1+y_2+\dots+y_{n-1})+y_n\right]$$
More strips give a better estimate. It **overestimates** if the curve is convex (bends up: the trapezia sit above the curve) and **underestimates** if it is concave.
### Solving differential equations
A **differential equation** links a function and its derivatives. First-order **separable** equations have the form $\dfrac{dy}{dx}=f(x)g(y)$. Separate the variables and integrate both sides:
$$\int\frac1{g(y)}\,dy=\int f(x)\,dx$$
> **Worked example.** Solve $\dfrac{dy}{dx}=xy$ given $y=2$ when $x=0$.
> $\int\dfrac1y\,dy=\int x\,dx\Rightarrow\ln|y|=\tfrac12x^2+c$.
> $y=Ae^{\frac12x^2}$ (where $A=e^c$). $y=2$ at $x=0$ gives $A=2$: $y=2e^{\frac12x^2}$.
The **general solution** has a constant; a **particular solution** uses given values to find it.
### Modelling with differential equations
"The rate of change of $P$ is proportional to $P$": $\dfrac{dP}{dt}=kP$, solution $P=P_0e^{kt}$ (exponential growth or decay).
"Newton's law of cooling": $\dfrac{d\theta}{dt}=-k(\theta-\theta_{\text{room}})$.
> **Worked example.** A tank leaks so that $\dfrac{dh}{dt}=-0.2\sqrt h$, with $h=16$ m at $t=0$. When is it empty?
> $\int h^{-\frac12}dh=\int-0.2\,dt\Rightarrow2\sqrt h=-0.2t+c$. At $t=0$: $c=8$. Empty when $h=0$: $t=40$.
Interpret constants in context, and comment on the long-term behaviour and limitations of the model.
### Integration as the limit of a sum
The area under $y=f(x)$ from $a$ to $b$ can be approximated by thin rectangles of width $\delta x$: $\sum f(x)\delta x$. As $\delta x\to0$ the sum becomes exact:
$$\lim_{\delta x\to0}\sum_{x=a}^{b}f(x)\,\delta x=\int_a^bf(x)\,dx$$
This is why the integral sign is a stretched S (for "sum").
### Watch out
- Include $+c$ for indefinite integrals, and the modulus in $\ln|x|$.
- With substitution in a definite integral, either change the limits or substitute back: never mix.
- Exact answers often involve $\ln$: simplify with log laws.`;

N.p2_12=String.raw`### 3D coordinates
In three dimensions a point has three coordinates $(x,y,z)$, using three perpendicular axes. The distance between two points extends Pythagoras:
$$d=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}$$
> **Worked example.** Distance from $(1,-2,3)$ to $(4,2,15)$: $\sqrt{9+16+144}=\sqrt{169}=13$.
### Vectors in 3D
The unit vectors $\mathbf i$, $\mathbf j$, $\mathbf k$ point along the $x$, $y$ and $z$ axes. A 3D vector is $\mathbf a=a_1\mathbf i+a_2\mathbf j+a_3\mathbf k=\begin{pmatrix}a_1\\a_2\\a_3\end{pmatrix}$.
Everything from 2D carries over:
- Add, subtract and multiply by scalars component by component.
- Magnitude: $|\mathbf a|=\sqrt{a_1^2+a_2^2+a_3^2}$; unit vector $\hat{\mathbf a}=\dfrac{\mathbf a}{|\mathbf a|}$.
- Position vectors: $\overrightarrow{AB}=\mathbf b-\mathbf a$.
- Parallel vectors are scalar multiples of each other.
### Angles with the axes
The angle $\theta_x$ between $\mathbf a$ and the positive $x$-axis satisfies
$$\cos\theta_x=\frac{a_1}{|\mathbf a|}$$
(and similarly for $y$ and $z$ using $a_2$ and $a_3$). This comes from a right-angled triangle with hypotenuse $|\mathbf a|$ and adjacent side $a_1$.
> **Worked example.** $\mathbf a=2\mathbf i-\mathbf j+2\mathbf k$ has $|\mathbf a|=3$. Angle with the $x$-axis: $\cos\theta=\tfrac23$, $\theta=48.2°$. With the $y$-axis: $\cos\theta=-\tfrac13$, $\theta=109.5°$.
### Solving geometric problems
The techniques are the same as in 2D:
- To show three points are collinear, show $\overrightarrow{AB}=k\overrightarrow{BC}$.
- To find a missing vertex of a parallelogram $ABCD$, use $\overrightarrow{AD}=\overrightarrow{BC}$, so $\mathbf d=\mathbf a+\mathbf c-\mathbf b$.
- Comparing coefficients: if $\mathbf i$, $\mathbf j$, $\mathbf k$ components of two equal vectors are matched, you get three equations, which can find up to three unknowns.
- Areas of triangles: find the three side lengths, use the cosine rule for an angle, then $\tfrac12ab\sin C$.
> **Worked example.** $A(1,0,2)$, $B(3,4,0)$, $C(2,2,1)$. $\overrightarrow{AB}=(2,4,-2)$, $\overrightarrow{AC}=(1,2,-1)$. Since $\overrightarrow{AB}=2\overrightarrow{AC}$, the points are collinear and $C$ is the midpoint of $AB$.
### Application to mechanics
Forces, velocities and accelerations in 3D are vectors with $\mathbf i$, $\mathbf j$, $\mathbf k$ components.
- **Resultant force**: add the force vectors. Its magnitude is the size of the force.
- **Newton's second law**: $\mathbf F=m\mathbf a$, so $\mathbf a=\dfrac{\mathbf F}m$.
- A particle is in **equilibrium** when the resultant force is $\mathbf 0$: each component sums to zero.
> **Worked example.** Forces $(2\mathbf i+3\mathbf j-\mathbf k)$ N and $(\mathbf i-\mathbf j+5\mathbf k)$ N act on a 2 kg particle. Resultant $(3\mathbf i+2\mathbf j+4\mathbf k)$ N, magnitude $\sqrt{29}=5.39$ N. Acceleration $(1.5\mathbf i+\mathbf j+2\mathbf k)$ m s$^{-2}$.
### Watch out
- Use brackets and commas or column vectors clearly; do not mix coordinates and vectors.
- Angles with axes need the sign of the component: a negative component gives an obtuse angle.`;

window.NOTES2=window.NOTES2||{};
window.NOTES2.pure=N;
})();
