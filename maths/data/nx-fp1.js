/* Full topic notes for Further Pure 1 (Edexcel 8FM0/9FM0). Overrides the short notes in notes.js. */
(function(){
const N={};

N.vectors=String.raw`### The vector (cross) product
For $\mathbf a=\begin{pmatrix}a_1\\a_2\\a_3\end{pmatrix}$ and $\mathbf b=\begin{pmatrix}b_1\\b_2\\b_3\end{pmatrix}$:
$$\mathbf a\times\mathbf b=\begin{pmatrix}a_2b_3-a_3b_2\\a_3b_1-a_1b_3\\a_1b_2-a_2b_1\end{pmatrix}=\begin{vmatrix}\mathbf i&\mathbf j&\mathbf k\\a_1&a_2&a_3\\b_1&b_2&b_3\end{vmatrix}$$
Properties:
- $\mathbf a\times\mathbf b$ is **perpendicular to both** $\mathbf a$ and $\mathbf b$ (check with dot products: both are 0).
- $|\mathbf a\times\mathbf b|=|\mathbf a||\mathbf b|\sin\theta$.
- $\mathbf b\times\mathbf a=-\mathbf a\times\mathbf b$ (not commutative); $\mathbf a\times\mathbf a=\mathbf 0$; parallel vectors have cross product $\mathbf 0$.
- Direction by the right-hand rule: $\mathbf i\times\mathbf j=\mathbf k$, $\mathbf j\times\mathbf k=\mathbf i$, $\mathbf k\times\mathbf i=\mathbf j$.
> **Worked example.** $\begin{pmatrix}1\\2\\3\end{pmatrix}\times\begin{pmatrix}4\\0\\-1\end{pmatrix}=\begin{pmatrix}2(-1)-3(0)\\3(4)-1(-1)\\1(0)-2(4)\end{pmatrix}=\begin{pmatrix}-2\\13\\-8\end{pmatrix}$.
### Areas
- Area of a **parallelogram** with sides $\mathbf a$ and $\mathbf b$: $|\mathbf a\times\mathbf b|$.
- Area of a **triangle** $ABC$: $\tfrac12|\overrightarrow{AB}\times\overrightarrow{AC}|$.
### Normals to planes
A plane containing directions $\mathbf b$ and $\mathbf c$ has normal $\mathbf n=\mathbf b\times\mathbf c$. Then the Cartesian equation is $\mathbf r\cdot\mathbf n=\mathbf a\cdot\mathbf n$. For a plane through three points $A,B,C$, use $\mathbf n=\overrightarrow{AB}\times\overrightarrow{AC}$.
### The scalar triple product and volumes
$$\mathbf a\cdot(\mathbf b\times\mathbf c)=\begin{vmatrix}a_1&a_2&a_3\\b_1&b_2&b_3\\c_1&c_2&c_3\end{vmatrix}$$
- Volume of a **parallelepiped** with edges $\mathbf a,\mathbf b,\mathbf c$: $|\mathbf a\cdot(\mathbf b\times\mathbf c)|$ (base area $|\mathbf b\times\mathbf c|$ times perpendicular height).
- Volume of a **tetrahedron**: $\tfrac16|\mathbf a\cdot(\mathbf b\times\mathbf c)|$.
- If the triple product is 0, the three vectors are **coplanar**.
### Equation of a line using the cross product
A line through $\mathbf a$ with direction $\mathbf b$ can be written $(\mathbf r-\mathbf a)\times\mathbf b=\mathbf 0$ (since $\mathbf r-\mathbf a$ is parallel to $\mathbf b$), or $\mathbf r\times\mathbf b=\mathbf a\times\mathbf b$.
### Applications
- **Shortest distance between skew lines** $\mathbf r=\mathbf a+\lambda\mathbf b$ and $\mathbf r=\mathbf c+\mu\mathbf d$: the common perpendicular has direction $\mathbf n=\mathbf b\times\mathbf d$, so the distance is $\dfrac{|(\mathbf c-\mathbf a)\cdot\mathbf n|}{|\mathbf n|}$.
- **Line of intersection of two planes**: its direction is $\mathbf n_1\times\mathbf n_2$ (perpendicular to both normals). Find one point on it by setting, say, $z=0$ and solving.
### Watch out
- Get the middle component's sign right (it is $a_3b_1-a_1b_3$, or $-(a_1b_3-a_3b_1)$ from the determinant).
- Areas and volumes need the modulus.`;

N.conic1=String.raw`### Parabolas
{{svg1}}
A **parabola** is the set of points equidistant from a fixed point, the **focus** $S$, and a fixed line, the **directrix**. The standard parabola has
$$y^2=4ax\qquad\text{focus }S(a,0),\ \text{directrix }x=-a$$
**Derivation**: for $P(x,y)$, distance to focus $\sqrt{(x-a)^2+y^2}$ equals distance to directrix $x+a$. Squaring: $x^2-2ax+a^2+y^2=x^2+2ax+a^2$, so $y^2=4ax$.
Parametric form: $x=at^2$, $y=2at$. (Check: $y^2=4a^2t^2=4a(at^2)$.)
### Rectangular hyperbolas
The rectangular hyperbola $xy=c^2$ has the axes as asymptotes. Parametric form: $x=ct$, $y=\dfrac ct$.
### Tangents and normals
Differentiate (implicitly or parametrically), then use $y-y_1=m(x-x_1)$.
- Parabola $y^2=4ax$ at $(at^2,2at)$: $\dfrac{dy}{dx}=\dfrac{dy/dt}{dx/dt}=\dfrac{2a}{2at}=\dfrac1t$. Tangent: $ty=x+at^2$. Normal: $y+tx=2at+at^3$.
- Rectangular hyperbola $xy=c^2$ at $\left(ct,\tfrac ct\right)$: $\dfrac{dy}{dx}=-\dfrac1{t^2}$. Tangent: $x+t^2y=2ct$. Normal: $t^3x-ty=c(t^4-1)$.
Learn how to derive these: questions give a general point and ask for the tangent or normal, then where it meets the curve again or the axes.
### Loci problems
Typical question: points $P(ap^2,2ap)$ and $Q(aq^2,2aq)$ on a parabola; the tangents at $P$ and $Q$ meet at $R$. Find the coordinates of $R$ (solve the two tangent equations: $R=(apq,\ a(p+q))$), then find the locus of $R$ given a condition like $pq=-1$ (which gives $x=-a$: the tangents meet on the directrix).
**Method for loci**: write the point's $x$ and $y$ in terms of the parameter(s), use the condition to eliminate the parameter(s), and get an equation in $x$ and $y$ only.
### The focus–directrix property in use
For a point $P$ on a parabola, $SP$ equals the perpendicular distance to the directrix: $SP=x+a=at^2+a$. This gives quick lengths, and the reflective property (rays parallel to the axis reflect through the focus, used in satellite dishes).
### Watch out
- Use $a$, $c$ and the parameters consistently; do not mix up $t$ for different points.
- Show the derivation of tangent/normal equations when asked to "show that".`;

N.conic2=String.raw`### Ellipses
{{svg1}}
An **ellipse** centred at the origin:
$$\frac{x^2}{a^2}+\frac{y^2}{b^2}=1$$
It crosses the axes at $(\pm a,0)$ and $(0,\pm b)$. Parametric form: $x=a\cos\theta$, $y=b\sin\theta$. If $a=b$ it is a circle.
### Hyperbolas
$$\frac{x^2}{a^2}-\frac{y^2}{b^2}=1$$
It crosses the $x$-axis at $(\pm a,0)$, does not meet the $y$-axis, and has asymptotes $y=\pm\dfrac bax$. Parametric form: $x=a\cosh t$, $y=b\sinh t$ (right branch), or $x=a\sec\theta$, $y=b\tan\theta$.
### Eccentricity, foci and directrices
Every conic is the set of points $P$ with $\dfrac{SP}{PM}=e$, where $S$ is a focus, $PM$ the distance to a directrix, and $e$ the **eccentricity**:
- $e=1$: parabola; $0<e<1$: ellipse; $e>1$: hyperbola.
**Ellipse** ($a>b$): $b^2=a^2(1-e^2)$; foci $(\pm ae,0)$; directrices $x=\pm\dfrac ae$.
**Hyperbola**: $b^2=a^2(e^2-1)$; foci $(\pm ae,0)$; directrices $x=\pm\dfrac ae$.
> **Worked example.** For $\dfrac{x^2}{25}+\dfrac{y^2}9=1$: $9=25(1-e^2)$, $e=\tfrac45$. Foci $(\pm4,0)$, directrices $x=\pm\tfrac{25}4$.
A property of the ellipse: for any point $P$ on it, $SP+S'P=2a$ (the sum of distances to the two foci is constant: the "pins and string" construction). For a hyperbola, $|SP-S'P|=2a$.
### Tangents and normals
Differentiate implicitly or parametrically.
- Ellipse at $(a\cos\theta,b\sin\theta)$: $\dfrac{dy}{dx}=-\dfrac{b\cos\theta}{a\sin\theta}$. Tangent: $\dfrac{x\cos\theta}{a}+\dfrac{y\sin\theta}{b}=1$.
- Hyperbola at $(a\cosh t,b\sinh t)$ or $(a\sec\theta,b\tan\theta)$: similarly; tangent $\dfrac{x\sec\theta}a-\dfrac{y\tan\theta}b=1$.
A line $y=mx+c$ is a **tangent** to an ellipse or hyperbola when substituting gives a quadratic with a **repeated root** (discriminant 0). For the ellipse this gives the condition $c^2=a^2m^2+b^2$.
### Loci
As with parabolas: find the coordinates of a point in terms of parameters, then eliminate. Midpoints of chords, intersections of tangents and feet of perpendiculars from foci are common.
### Watch out
- Use $b^2=a^2(1-e^2)$ for ellipses and $b^2=a^2(e^2-1)$ for hyperbolas: the sign differs.
- Asymptotes are only for hyperbolas.`;

N.ineq=String.raw`### Algebraic inequalities with fractions
To solve something like $\dfrac{x}{x-1}<2$, you **cannot** simply multiply by $x-1$: its sign is unknown, and multiplying by a negative reverses the inequality. Two safe methods:
**Method 1: multiply by the square of the denominator** (always positive).
> **Worked example.** Solve $\dfrac{x}{x-1}<2$.
> Multiply by $(x-1)^2$: $x(x-1)<2(x-1)^2$, so $0<2(x-1)^2-x(x-1)=(x-1)(2x-2-x)=(x-1)(x-2)$.
> $(x-1)(x-2)>0$: $x<1$ or $x>2$.
> (Note $x\neq1$, where the original is undefined.)
**Method 2: bring everything to one side** and combine into one fraction, then use a sign diagram:
$\dfrac{x}{x-1}-2<0\Rightarrow\dfrac{2-x}{x-1}<0$. Critical values $x=1$ and $x=2$; test each region: negative for $x<1$ and $x>2$.
### Critical values and sketches
Critical values come from where the numerator is zero (the expression is 0) and where the denominator is zero (an asymptote: the expression changes sign without passing through 0). Never include values where the denominator is zero.
A **sketch** of both sides (e.g. $y=\dfrac{x}{x-1}$ and $y=2$) shows where one graph is below the other: very useful for checking.
### Inequalities with modulus
For $|f(x)|<g(x)$ or $|f(x)|>|g(x)|$:
- Sketch both graphs, find intersection points by solving $f(x)=g(x)$ and $-f(x)=g(x)$ (check which are valid), then read off.
- For $|f(x)|<|g(x)|$ with both sides non-negative, squaring both sides is safe: $f(x)^2<g(x)^2$.
> **Worked example.** Solve $|2x-1|>x+1$.
> $2x-1=x+1\Rightarrow x=2$. $-(2x-1)=x+1\Rightarrow x=0$.
> From a sketch, the V-shape is above the line outside these: $x<0$ or $x>2$.
### Watch out
- Exclude values that make a denominator zero.
- Give the answer in set notation if asked: $\{x:x<1\}\cup\{x:x>2\}$.`;

N.tform=String.raw`### The t-formulae
Let $t=\tan\dfrac x2$. Then
$$\sin x=\frac{2t}{1+t^2}\qquad\cos x=\frac{1-t^2}{1+t^2}\qquad\tan x=\frac{2t}{1-t^2}$$
**Derivation**: $\tan x=\tan\left(2\cdot\tfrac x2\right)=\dfrac{2t}{1-t^2}$ by the double angle formula. Draw a right-angled triangle with opposite side $2t$ and adjacent $1-t^2$: the hypotenuse is $\sqrt{(2t)^2+(1-t^2)^2}=1+t^2$, giving $\sin x$ and $\cos x$.
These turn any expression in $\sin x$ and $\cos x$ into a rational expression in $t$.
### Proving identities
> **Worked example.** Show that $\dfrac{1-\cos x}{\sin x}=\tan\dfrac x2$.
> $\dfrac{1-\frac{1-t^2}{1+t^2}}{\frac{2t}{1+t^2}}=\dfrac{(1+t^2)-(1-t^2)}{2t}=\dfrac{2t^2}{2t}=t$.
### Solving equations
Substitute, multiply by $1+t^2$, solve for $t$, then $x=2\arctan t$ (adjust for the interval; note $\tfrac x2$ has half the range of $x$).
> **Worked example.** Solve $3\sin x+4\cos x=2$ for $0\le x<2\pi$.
> $3\cdot\dfrac{2t}{1+t^2}+4\cdot\dfrac{1-t^2}{1+t^2}=2\Rightarrow6t+4-4t^2=2+2t^2\Rightarrow6t^2-6t-2=0\Rightarrow3t^2-3t-1=0$.
> $t=\dfrac{3\pm\sqrt{21}}6$: $t=1.264$ or $t=-0.264$.
> $\tfrac x2=0.9014$ or $\tfrac x2=\pi-0.2580$ (in $0\le\tfrac x2<\pi$), so $x=1.80$ or $x=5.77$.
**Check $x=\pi$ separately**: there $t=\tan\tfrac\pi2$ is undefined, so the substitution misses it. Test whether $x=\pi$ satisfies the original equation.
### Finding maxima, minima and ranges
Expressions such as $\dfrac{1}{5+3\cos x}$ become rational functions of $t$; their maxima and minima can be found by differentiating, or by considering the range of the denominator.
### Integration
The substitution $t=\tan\tfrac x2$ also gives $dx=\dfrac{2}{1+t^2}dt$, turning integrals like $\displaystyle\int\frac1{1+\sin x}dx$ into integrals of rational functions of $t$ (see Methods in calculus).
### Watch out
- Remember the half-angle: $x=2\arctan t$.
- Always check $x=\pi$ (or $x=180°$) separately.`;

N.taylor=String.raw`### Taylor series
A Maclaurin series expands a function about $x=0$. A **Taylor series** expands it about any point $x=a$, which is useful when the function (or its derivatives) is not defined at 0, or when you want accuracy near $a$:
$$f(x)=f(a)+f'(a)(x-a)+\frac{f''(a)}{2!}(x-a)^2+\dots+\frac{f^{(r)}(a)}{r!}(x-a)^r+\dots$$
An equivalent form, with $x$ replaced by $x+a$:
$$f(x+a)=f(a)+f'(a)x+\frac{f''(a)}{2!}x^2+\dots$$
> **Worked example.** Find the Taylor series of $\ln x$ about $x=1$ up to $(x-1)^3$.
> $f(1)=0$, $f'(x)=\dfrac1x$ so $f'(1)=1$, $f''(1)=-1$, $f'''(x)=\dfrac2{x^3}$ so $f'''(1)=2$.
> $\ln x=(x-1)-\dfrac{(x-1)^2}{2}+\dfrac{(x-1)^3}3-\dots$
### Approximations and limits
- Truncated Taylor series give **approximations** near $x=a$: e.g. estimate $\ln1.1\approx0.1-0.005+0.000333=0.0953$.
- **Limits**: replace functions by their series to evaluate limits of the form $\tfrac00$.
> **Worked example.** $\displaystyle\lim_{x\to0}\frac{x-\sin x}{x^3}$. Since $\sin x=x-\tfrac{x^3}6+\tfrac{x^5}{120}-\dots$, the numerator is $\tfrac{x^3}6-\tfrac{x^5}{120}+\dots$. Dividing by $x^3$: $\tfrac16-\tfrac{x^2}{120}+\dots\to\tfrac16$.
(L'Hôpital's rule gives the same: differentiate top and bottom until the limit is no longer $\tfrac00$.)
### Series solutions of differential equations
For a differential equation like $\dfrac{dy}{dx}=f(x,y)$ with $y=y_0$ at $x=x_0$:
1. Use the equation to get $y'(x_0)$.
2. Differentiate the equation (implicitly) to get $y''$, $y'''$, and evaluate them at $x_0$.
3. Substitute into the Taylor series about $x_0$.
> **Worked example.** $\dfrac{dy}{dx}=x+y^2$, $y=1$ at $x=0$.
> $y'(0)=0+1=1$. $y''=1+2yy'$, so $y''(0)=3$. $y'''=2(y')^2+2yy''$, so $y'''(0)=2+6=8$.
> $y\approx1+x+\tfrac32x^2+\tfrac43x^3$.
### Watch out
- Use $(x-a)$, not $x$, in a Taylor series about $a$ (unless using the $f(x+a)$ form).
- Divide by the factorials.`;

N.calc=String.raw`### Leibniz's theorem
For the $n$th derivative of a product $y=uv$:
$$\frac{d^ny}{dx^n}=\sum_{r=0}^n\binom nr u^{(n-r)}v^{(r)}=u^{(n)}v+\binom n1u^{(n-1)}v'+\binom n2u^{(n-2)}v''+\dots+uv^{(n)}$$
The pattern is the binomial expansion, with powers replaced by derivatives. Choose $v$ to be the factor whose derivatives quickly become zero (a polynomial), and $u$ the one with a simple pattern ($e^{kx}$, $\sin x$).
> **Worked example.** Find $\dfrac{d^5}{dx^5}(x^2e^{3x})$. Let $u=e^{3x}$, $v=x^2$. $v'=2x$, $v''=2$, $v'''=0$.
> $=3^5e^{3x}x^2+5\cdot3^4e^{3x}(2x)+10\cdot3^3e^{3x}(2)=e^{3x}(243x^2+810x+540)$.
### L'Hôpital's rule
If $f(a)=g(a)=0$ (or both are infinite), then
$$\lim_{x\to a}\frac{f(x)}{g(x)}=\lim_{x\to a}\frac{f'(x)}{g'(x)}$$
Repeat if the result is still $\tfrac00$.
> **Worked example.** $\displaystyle\lim_{x\to0}\frac{1-\cos x}{x^2}=\lim\frac{\sin x}{2x}=\lim\frac{\cos x}{2}=\frac12$.
Other indeterminate forms ($0\times\infty$, $1^\infty$) can be rearranged into $\tfrac00$ or $\tfrac\infty\infty$: for $x\ln x$ as $x\to0^+$, write it as $\dfrac{\ln x}{1/x}$.
### The Weierstrass substitution $t=\tan\frac x2$
For integrals of rational functions of $\sin x$ and $\cos x$:
$$\sin x=\frac{2t}{1+t^2},\quad\cos x=\frac{1-t^2}{1+t^2},\quad dx=\frac{2}{1+t^2}dt$$
(From $\dfrac{dt}{dx}=\tfrac12\sec^2\tfrac x2=\tfrac12(1+t^2)$.) Change the limits too: $x=0\to t=0$, $x=\tfrac\pi2\to t=1$.
> **Worked example.** $\displaystyle\int_0^{\pi/2}\frac1{1+\sin x}dx=\int_0^1\frac{1}{1+\frac{2t}{1+t^2}}\cdot\frac2{1+t^2}dt=\int_0^1\frac2{(1+t)^2}dt=\left[-\frac2{1+t}\right]_0^1=1$.
### Watch out
- In Leibniz's theorem, include the binomial coefficients.
- Only use L'Hôpital's rule when the limit is genuinely indeterminate.`;

N.num=String.raw`### Why numerical methods for differential equations
Many differential equations cannot be solved exactly. Step-by-step methods start from a known point and estimate the solution a small step $h$ at a time.
### Euler's method
For $\dfrac{dy}{dx}=f(x,y)$ with $y=y_0$ at $x=x_0$, use the gradient at the current point to step along a tangent:
$$y_{r+1}=y_r+hf(x_r,y_r),\qquad x_{r+1}=x_r+h$$
> **Worked example.** $\dfrac{dy}{dx}=x+y$, $y(0)=1$, $h=0.1$. Estimate $y(0.2)$.
> $y_1=1+0.1(0+1)=1.1$. $y_2=1.1+0.1(0.1+1.1)=1.22$.
> (The true value is $2e^{0.2}-1.2=1.2428$: the error comes from using the gradient at the start of each step.)
### Midpoint method
A more accurate formula uses the gradient at a midpoint, via the approximation $\left(\dfrac{dy}{dx}\right)_r\approx\dfrac{y_{r+1}-y_{r-1}}{2h}$:
$$y_{r+1}=y_{r-1}+2hf(x_r,y_r)$$
It needs **two** starting values: use Euler's method for the first step, then this formula.
### Second-order equations
For $\dfrac{d^2y}{dx^2}=f\left(x,y,\dfrac{dy}{dx}\right)$, use the approximations
$$\left(\frac{dy}{dx}\right)_r\approx\frac{y_{r+1}-y_{r-1}}{2h}\qquad\left(\frac{d^2y}{dx^2}\right)_r\approx\frac{y_{r+1}-2y_r+y_{r-1}}{h^2}$$
Substitute into the equation and rearrange for $y_{r+1}$. Start with $y_0$ and estimate $y_1$ from $y_1\approx y_0+h\left(\dfrac{dy}{dx}\right)_0$.
### Simpson's rule
To estimate $\displaystyle\int_a^by\,dx$ with an **even** number $n$ of strips of width $h=\dfrac{b-a}n$:
$$\int_a^by\,dx\approx\frac h3\left[y_0+4(y_1+y_3+\dots+y_{n-1})+2(y_2+y_4+\dots+y_{n-2})+y_n\right]$$
It fits parabolas through groups of three points, so it is much more accurate than the trapezium rule. Pattern of multipliers: $1,4,2,4,2,\dots,4,1$.
> **Worked example.** $\displaystyle\int_0^1e^{x^2}dx$ with 4 strips: $h=0.25$; $y=1,\ 1.0645,\ 1.2840,\ 1.7551,\ 2.7183$.
> $\tfrac{0.25}3[1+4(1.0645+1.7551)+2(1.2840)+2.7183]=\tfrac{0.25}3(17.565)=1.4637$ (true value $1.4627$).
### Improving accuracy
Smaller step sizes give better approximations (at the cost of more steps). Errors accumulate over many steps in Euler's method.
### Watch out
- Lay out results in a table: $x_r$, $y_r$, gradient, next $y$.
- Simpson's rule needs an even number of strips.`;

N.rde=String.raw`### Reducible differential equations
Some differential equations that look hard become standard ones (separable, integrating factor, or constant-coefficient second order) after a **substitution**. You are usually told which substitution to use; the skill is in carrying it out accurately.
### First-order: substituting for $y$
**Example: $y=vx$** (homogeneous equations like $\dfrac{dy}{dx}=\dfrac{x^2+y^2}{xy}$).
If $y=vx$, then by the product rule $\dfrac{dy}{dx}=v+x\dfrac{dv}{dx}$. Substitute both, and the equation becomes separable in $v$ and $x$.
> **Worked example.** Solve $\dfrac{dy}{dx}=\dfrac{x+y}{x}$ using $y=vx$.
> $v+x\dfrac{dv}{dx}=1+v\Rightarrow x\dfrac{dv}{dx}=1\Rightarrow v=\ln x+c$.
> So $y=x(\ln x+c)$.
**Example: $z=y^{-1}$** (Bernoulli-type equations like $\dfrac{dy}{dx}+Py=Qy^2$).
$z=\dfrac1y$ gives $\dfrac{dz}{dx}=-\dfrac1{y^2}\dfrac{dy}{dx}$. Dividing the equation by $y^2$ and substituting gives a **linear** equation in $z$, solved with an integrating factor.
### Second-order: substituting for $x$
Equations like $x^2\dfrac{d^2y}{dx^2}+ax\dfrac{dy}{dx}+by=f(x)$ (**Euler equations**) become constant-coefficient equations with $x=e^u$:
$$x\frac{dy}{dx}=\frac{dy}{du}\qquad x^2\frac{d^2y}{dx^2}=\frac{d^2y}{du^2}-\frac{dy}{du}$$
**Derivation**: $\dfrac{dy}{du}=\dfrac{dy}{dx}\cdot\dfrac{dx}{du}=x\dfrac{dy}{dx}$. Differentiating again with respect to $u$ gives the second result.
> **Worked example.** $x^2y''-2xy'+2y=0$. With $x=e^u$: $(\ddot y-\dot y)-2\dot y+2y=0$, so $\ddot y-3\dot y+2y=0$.
> $m=1,2$: $y=Ae^u+Be^{2u}=Ax+Bx^2$.
### Method summary
1. Write the given substitution and differentiate it (product or chain rule) to express the derivatives.
2. Substitute everything into the original equation; simplify until only the new variables remain.
3. Solve the new (standard) equation.
4. Substitute back to the original variables, and apply any boundary conditions.
### Watch out
- Differentiate the substitution carefully: $y=vx$ needs the product rule.
- Give the final answer in terms of the original variables.`;

window.NOTES2=window.NOTES2||{};
window.NOTES2.fp1=N;
})();
