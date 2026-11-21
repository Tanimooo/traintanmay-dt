/* Full topic notes for Core Pure 2 (Edexcel 9FM0). Overrides the short notes in notes.js. */
(function(){
const N={};

N.complex=String.raw`### Exponential form
Euler's relation links the exponential function to trigonometry:
$$e^{i\theta}=\cos\theta+i\sin\theta$$
**Why it is true**: substitute $x=i\theta$ into the series $e^x=1+x+\tfrac{x^2}{2!}+\tfrac{x^3}{3!}+\dots$ and use $i^2=-1$, $i^3=-i$, $i^4=1$. The real terms form the series for $\cos\theta$, and the imaginary terms form $i$ times the series for $\sin\theta$.
So any complex number can be written $z=re^{i\theta}$, with $r=|z|$ and $\theta=\arg z$. Multiplying and dividing follow the index laws: $r_1e^{i\theta_1}\times r_2e^{i\theta_2}=r_1r_2e^{i(\theta_1+\theta_2)}$. A famous special case: $e^{i\pi}+1=0$.
Also $e^{-i\theta}=\cos\theta-i\sin\theta$, which is the conjugate of $e^{i\theta}$.
### De Moivre's theorem
$$\left[r(\cos\theta+i\sin\theta)\right]^n=r^n(\cos n\theta+i\sin n\theta)$$
In exponential form it is obvious: $(re^{i\theta})^n=r^ne^{in\theta}$. It can be proved by induction for positive integers $n$, and holds for all integers.
> **Worked example.** $(1+i)^8$: $1+i=\sqrt2e^{i\pi/4}$, so $(1+i)^8=16e^{2\pi i}=16$.
### Trigonometric identities from de Moivre
**Multiple angles in terms of powers**: expand $(\cos\theta+i\sin\theta)^n$ by the binomial theorem and compare with $\cos n\theta+i\sin n\theta$.
> **Worked example.** Express $\cos3\theta$ in terms of $\cos\theta$. Let $c=\cos\theta$, $s=\sin\theta$.
> $(c+is)^3=c^3+3ic^2s-3cs^2-is^3$. Real part: $\cos3\theta=c^3-3cs^2=c^3-3c(1-c^2)=4c^3-3c$.
**Powers in terms of multiple angles**: if $z=e^{i\theta}$, then
$$z+\frac1z=2\cos\theta\qquad z-\frac1z=2i\sin\theta\qquad z^n+\frac1{z^n}=2\cos n\theta\qquad z^n-\frac1{z^n}=2i\sin n\theta$$
> **Worked example.** Express $\cos^4\theta$ in multiple angles. $(2\cos\theta)^4=\left(z+\tfrac1z\right)^4=z^4+4z^2+6+4z^{-2}+z^{-4}=2\cos4\theta+8\cos2\theta+6$.
> So $\cos^4\theta=\tfrac18(\cos4\theta+4\cos2\theta+3)$, which can then be integrated.
### Sums of series
Writing $\cos k\theta=\text{Re}(e^{ik\theta})$ turns trigonometric series into geometric series in $e^{i\theta}$. Sum with $S_n=\dfrac{a(1-r^n)}{1-r}$, then take the real or imaginary part. A useful trick: multiply top and bottom by $e^{-i\theta/2}$ to make the denominator $-2i\sin\tfrac\theta2$, which is easier to handle.
### $n$th roots of a complex number
To solve $z^n=w$, write $w=Re^{i\phi}$ and remember that adding multiples of $2\pi$ to the argument gives the same number:
$$z^n=Re^{i(\phi+2k\pi)}\Rightarrow z=R^{\frac1n}e^{i\frac{\phi+2k\pi}{n}},\quad k=0,1,\dots,n-1$$
There are exactly $n$ roots. On an Argand diagram they lie on a circle of radius $R^{1/n}$, equally spaced at angles of $\dfrac{2\pi}n$: the vertices of a regular $n$-gon.
{{svg1}}
The **$n$th roots of unity** solve $z^n=1$: $1,\omega,\omega^2,\dots,\omega^{n-1}$ where $\omega=e^{2\pi i/n}$. They **sum to zero**: $1+\omega+\dots+\omega^{n-1}=0$ (a geometric series with $\omega^n=1$).
### Geometric problems
Multiplying by $e^{i\alpha}$ rotates by $\alpha$ about the origin. If one vertex of a regular polygon centred at the origin is known, multiply by the appropriate root of unity to get the others. For a polygon centred elsewhere at $c$, rotate $z-c$ and add $c$ back.
### Watch out
- Use radians in exponential form and de Moivre's theorem.
- Give $n$ distinct roots, with principal arguments if asked.`;

N.series=String.raw`### The method of differences
Some sums can be found because consecutive terms cancel ("telescoping"). If the general term can be written as
$$u_r=f(r)-f(r+1)$$
then
$$\sum_{r=1}^nu_r=\left[f(1)-f(2)\right]+\left[f(2)-f(3)\right]+\dots+\left[f(n)-f(n+1)\right]=f(1)-f(n+1)$$
Everything in the middle cancels.
**Usual first step**: split the term using **partial fractions**.
> **Worked example.** Find $\displaystyle\sum_{r=1}^n\frac1{r(r+1)}$.
> $\dfrac1{r(r+1)}=\dfrac1r-\dfrac1{r+1}$.
> Write out terms: $\left(1-\tfrac12\right)+\left(\tfrac12-\tfrac13\right)+\dots+\left(\tfrac1n-\tfrac1{n+1}\right)$.
> Sum $=1-\dfrac1{n+1}=\dfrac n{n+1}$.
When the terms are like $\dfrac1r-\dfrac1{r+2}$, **two** terms survive at each end: write out the first three and last three rows to see which do not cancel.
> **Worked example.** $\displaystyle\sum_{r=1}^n\frac2{r(r+2)}=\sum\left(\frac1r-\frac1{r+2}\right)=1+\frac12-\frac1{n+1}-\frac1{n+2}$.
### Infinite sums
If the surviving end terms tend to 0 as $n\to\infty$, the series converges: $\displaystyle\sum_{r=1}^\infty\frac1{r(r+1)}=1$.
### Maclaurin series
A **Maclaurin series** writes a function as an infinite polynomial, matching its value and all its derivatives at $x=0$:
$$f(x)=f(0)+f'(0)x+\frac{f''(0)}{2!}x^2+\frac{f'''(0)}{3!}x^3+\dots+\frac{f^{(r)}(0)}{r!}x^r+\dots$$
Why: if $f(x)=a_0+a_1x+a_2x^2+\dots$, differentiating $r$ times and putting $x=0$ gives $f^{(r)}(0)=r!\,a_r$.
Standard series (in the formula book):
- $e^x=1+x+\dfrac{x^2}{2!}+\dfrac{x^3}{3!}+\dots$ (all $x$)
- $\ln(1+x)=x-\dfrac{x^2}2+\dfrac{x^3}3-\dots$ ($-1<x\le1$)
- $\sin x=x-\dfrac{x^3}{3!}+\dfrac{x^5}{5!}-\dots$ (all $x$)
- $\cos x=1-\dfrac{x^2}{2!}+\dfrac{x^4}{4!}-\dots$ (all $x$)
- $(1+x)^n=1+nx+\dfrac{n(n-1)}{2!}x^2+\dots$ ($|x|<1$)
The series is only valid where it converges: e.g. $\ln(1+x)$ needs $-1<x\le1$ (and $\ln x$ itself has no Maclaurin series, because $\ln0$ is undefined).
### Series expansions of compound functions
Substitute into the standard series rather than differentiating from scratch:
- $e^{2x}=1+2x+\dfrac{(2x)^2}{2!}+\dots=1+2x+2x^2+\dots$
- $\ln(1-3x)$: replace $x$ by $-3x$; valid for $-\tfrac13\le x<\tfrac13$.
- Products: $e^x\sin x=\left(1+x+\tfrac{x^2}2\right)\left(x-\tfrac{x^3}6\right)=x+x^2+\tfrac13x^3+\dots$ (multiply, keeping terms up to the required power).
### Watch out
- In the method of differences, show enough rows at the start and end to make the cancellation clear.
- State the range of validity of a series when asked.`;

N.calc=String.raw`### Improper integrals
An integral is **improper** if one limit is infinite, or the function is undefined somewhere in the interval. Handle it with a **limit**:
$$\int_a^\infty f(x)\,dx=\lim_{t\to\infty}\int_a^tf(x)\,dx$$
If the limit exists the integral **converges**; otherwise it **diverges**.
> **Worked example.** $\displaystyle\int_1^\infty\frac1{x^2}dx=\lim_{t\to\infty}\left[-\frac1x\right]_1^t=\lim_{t\to\infty}\left(1-\frac1t\right)=1$. Converges.
> But $\displaystyle\int_1^\infty\frac1x\,dx=\lim_{t\to\infty}\ln t$, which is infinite. Diverges.
For an integrand undefined at a limit, e.g. $\displaystyle\int_0^1\frac1{\sqrt x}dx=\lim_{t\to0^+}\left[2\sqrt x\right]_t^1=2$.
Useful limits: $x^ke^{-x}\to0$ as $x\to\infty$ (exponentials beat powers), and $x^k\ln x\to0$ as $x\to0^+$ for $k>0$.
### Mean value of a function
The **mean value** of $f(x)$ over $[a,b]$ is
$$\bar f=\frac1{b-a}\int_a^bf(x)\,dx$$
the height of a rectangle on $[a,b]$ with the same area as under the curve. Transformations: the mean of $f(x)+k$ is $\bar f+k$; the mean of $kf(x)$ is $k\bar f$.
### Differentiating inverse trigonometric functions
If $y=\arcsin x$ then $x=\sin y$, so $\dfrac{dx}{dy}=\cos y=\sqrt{1-x^2}$ and
$$\frac d{dx}\arcsin x=\frac1{\sqrt{1-x^2}}\qquad\frac d{dx}\arccos x=-\frac1{\sqrt{1-x^2}}\qquad\frac d{dx}\arctan x=\frac1{1+x^2}$$
### Integrating with inverse trigonometric functions
Reversing these:
$$\int\frac1{\sqrt{a^2-x^2}}dx=\arcsin\frac xa+c\qquad\int\frac1{a^2+x^2}dx=\frac1a\arctan\frac xa+c$$
These are valid for $|x|<a$ in the first.
> **Worked example.** $\displaystyle\int_0^3\frac1{9+x^2}dx=\left[\tfrac13\arctan\tfrac x3\right]_0^3=\tfrac13\cdot\tfrac\pi4=\tfrac\pi{12}$.
For $\dfrac1{x^2+4x+13}$, **complete the square**: $\dfrac1{(x+2)^2+9}$, then use the arctan result with $x+2$.
### Integrating using partial fractions (including quadratic factors)
For a denominator with an irreducible quadratic factor, use the form
$$\frac{px^2+qx+r}{(ax+b)(x^2+c)}\equiv\frac A{ax+b}+\frac{Bx+C}{x^2+c}$$
Then $\dfrac{Bx}{x^2+c}$ integrates to a log (reverse chain rule) and $\dfrac C{x^2+c}$ to an arctan.
> **Worked example.** $\displaystyle\int\frac{2x+3}{x^2+1}dx=\int\frac{2x}{x^2+1}dx+\int\frac3{x^2+1}dx=\ln(x^2+1)+3\arctan x+c$.
### Watch out
- In improper integrals, show the limit explicitly; just "substituting $\infty$" loses marks.
- $\displaystyle\int\frac1{a^2+x^2}dx$ has a $\tfrac1a$ in front; $\arcsin$ does not.`;

N.volrev=String.raw`### Volumes about the $x$- and $y$-axes (recap)
About the $x$-axis: $V=\pi\displaystyle\int_a^by^2\,dx$. About the $y$-axis: $V=\pi\displaystyle\int_c^dx^2\,dy$. (See Core Pure 1.) Core Pure 2 extends this to harder functions, parametric curves and modelling.
### Harder integrals
The integral of $y^2$ may need any technique from A level: trigonometric identities, substitution, parts, partial fractions.
> **Worked example.** The region under $y=\sin x$ from $0$ to $\pi$ is rotated about the $x$-axis.
> $V=\pi\int_0^\pi\sin^2x\,dx=\pi\int_0^\pi\tfrac12(1-\cos2x)\,dx=\pi\left[\tfrac12x-\tfrac14\sin2x\right]_0^\pi=\dfrac{\pi^2}2$.
> **Worked example.** $y=\dfrac{1}{\sqrt{1+x^2}}$ from $0$ to $1$ about the $x$-axis: $V=\pi\int_0^1\dfrac1{1+x^2}dx=\pi\left[\arctan x\right]_0^1=\dfrac{\pi^2}4$.
### Parametric curves
If $x=f(t)$ and $y=g(t)$, change the variable of integration:
$$V=\pi\int_{t_1}^{t_2}y^2\frac{dx}{dt}\,dt\qquad\text{(about the }x\text{-axis)}$$
$$V=\pi\int_{t_1}^{t_2}x^2\frac{dy}{dt}\,dt\qquad\text{(about the }y\text{-axis)}$$
with the limits changed to the values of $t$.
> **Worked example.** $x=t^2$, $y=2t$, for $0\le t\le2$, rotated about the $x$-axis.
> $\dfrac{dx}{dt}=2t$. $V=\pi\int_0^2(2t)^2(2t)\,dt=\pi\int_0^28t^3\,dt=\pi[2t^4]_0^2=32\pi$.
Check whether $\dfrac{dx}{dt}$ is negative over the interval (the curve traced right to left): then swap the limits or take the modulus.
### Modelling with volumes of revolution
Model real objects (a bowl, a lampshade, a wine glass) by rotating a curve, sometimes made of several sections. Add volumes of the pieces; subtract hollow parts. Comment on limitations: the shape is idealised, the thickness of the material may be ignored, the units and scale must be converted (volume scales by the cube of the length scale).
### Watch out
- Square the whole function before integrating.
- Keep exact answers in terms of $\pi$ unless told otherwise.`;

N.polar=String.raw`### Polar coordinates
A point can be described by its **distance** $r$ from the origin (the **pole**) and the **angle** $\theta$ from the positive $x$-axis (the **initial line**), measured anticlockwise: $(r,\theta)$. Converting:
$$x=r\cos\theta\qquad y=r\sin\theta\qquad r^2=x^2+y^2\qquad\tan\theta=\frac yx$$
Use the quadrant to choose $\theta$. In this course, $r\ge0$, and $\theta$ is usually in $0\le\theta<2\pi$ or $-\pi<\theta\le\pi$.
### Polar curves
A polar equation $r=f(\theta)$ gives the distance from the pole for each direction.
- $r=a$: a circle, centre the pole, radius $a$.
- $\theta=\alpha$: a half-line from the pole.
- $r=a\theta$: a spiral.
- $r=a(1+\cos\theta)$: a **cardioid** (heart shape).
- $r=a(p+q\cos\theta)$: egg-shaped (convex) if $p\ge2q$, with a dimple if $q\le p<2q$.
- $r=a\cos2\theta$, $r=a\sin3\theta$: "rose" curves with petals (only where $r\ge0$).
{{svg1}}
To sketch: find $r$ at key angles ($0,\tfrac\pi4,\tfrac\pi2,\dots$), find where $r=0$ or $r$ is maximal, and note any symmetry ($r(\theta)=r(-\theta)$ means symmetric about the initial line).
Convert to Cartesian by multiplying through by $r$ where helpful: $r=2\cos\theta\Rightarrow r^2=2r\cos\theta\Rightarrow x^2+y^2=2x$, a circle centre $(1,0)$, radius 1.
### Area enclosed by a polar curve
A thin sector with angle $\delta\theta$ and radius $r$ has area $\tfrac12r^2\delta\theta$. Adding them:
$$A=\frac12\int_\alpha^\beta r^2\,d\theta$$
> **Worked example.** Find the area inside the cardioid $r=1+\cos\theta$.
> $A=\tfrac12\int_0^{2\pi}(1+\cos\theta)^2d\theta=\tfrac12\int_0^{2\pi}\left(1+2\cos\theta+\tfrac12+\tfrac12\cos2\theta\right)d\theta=\tfrac12\cdot3\pi=\dfrac{3\pi}2$.
For areas between curves, find where they intersect (set the $r$'s equal), then add or subtract areas over the appropriate angle ranges. Use symmetry to halve the work.
### Tangents parallel and perpendicular to the initial line
Using $x=r\cos\theta$, $y=r\sin\theta$ with $r=f(\theta)$:
- Tangent **parallel** to the initial line (horizontal): $\dfrac{dy}{d\theta}=0$, i.e. $\dfrac d{d\theta}(r\sin\theta)=0$.
- Tangent **perpendicular** to the initial line (vertical): $\dfrac{dx}{d\theta}=0$, i.e. $\dfrac d{d\theta}(r\cos\theta)=0$.
> **Worked example.** For $r=1+\cos\theta$: $y=\sin\theta+\sin\theta\cos\theta$, $\dfrac{dy}{d\theta}=\cos\theta+\cos2\theta=2\cos^2\theta+\cos\theta-1=(2\cos\theta-1)(\cos\theta+1)=0$. So $\cos\theta=\tfrac12$, $\theta=\pm\tfrac\pi3$: horizontal tangents at $\left(\tfrac32,\pm\tfrac\pi3\right)$.
### Watch out
- Square $r$ in the area formula; expand and use $\cos^2\theta=\tfrac12(1+\cos2\theta)$.
- Only plot the parts where $r\ge0$.`;

N.hyper=String.raw`### Definitions
The **hyperbolic functions** are built from exponentials:
$$\sinh x=\frac{e^x-e^{-x}}2\qquad\cosh x=\frac{e^x+e^{-x}}2\qquad\tanh x=\frac{\sinh x}{\cosh x}=\frac{e^{2x}-1}{e^{2x}+1}$$
(Pronounced "shine", "cosh", "tanch".) Their names come from the fact that $(\cosh t,\sinh t)$ lies on the hyperbola $x^2-y^2=1$, just as $(\cos t,\sin t)$ lies on the circle $x^2+y^2=1$.
### Graphs
{{svg1}}
- $y=\cosh x$: U-shaped (a "catenary", the shape of a hanging chain), minimum $(0,1)$, even function. Range $y\ge1$.
- $y=\sinh x$: through the origin, increasing, odd function. Range all reals.
- $y=\tanh x$: through the origin, increasing, with horizontal asymptotes $y=\pm1$. Range $-1<y<1$.
### Inverse hyperbolic functions
- $\operatorname{arsinh}x=\ln\left(x+\sqrt{x^2+1}\right)$, all $x$.
- $\operatorname{arcosh}x=\ln\left(x+\sqrt{x^2-1}\right)$, $x\ge1$ (using the positive branch, since $\cosh$ is many-to-one).
- $\operatorname{artanh}x=\dfrac12\ln\left(\dfrac{1+x}{1-x}\right)$, $|x|<1$.
**Derivation of arsinh**: let $y=\operatorname{arsinh}x$, so $x=\sinh y=\dfrac{e^y-e^{-y}}2$. Multiply by $2e^y$: $e^{2y}-2xe^y-1=0$, a quadratic in $e^y$: $e^y=x\pm\sqrt{x^2+1}$. Since $e^y>0$, take $+$: $y=\ln(x+\sqrt{x^2+1})$.
### Identities
$$\cosh^2x-\sinh^2x\equiv1$$
(Prove by substituting the definitions.) Other identities mirror trigonometry, with **Osborn's rule**: change $\sin\to\sinh$, $\cos\to\cosh$, and change the sign of any term containing a **product of two sinh** terms (including $\tanh^2$). E.g. $\cos2x=1-2\sin^2x$ becomes $\cosh2x=1+2\sinh^2x$; $\sinh2x=2\sinh x\cosh x$; $1-\tanh^2x=\operatorname{sech}^2x$.
### Solving equations
Either use identities, or substitute the exponential definitions and solve a quadratic in $e^x$.
> **Worked example.** Solve $3\cosh x+\sinh x=5$.
> $\tfrac32(e^x+e^{-x})+\tfrac12(e^x-e^{-x})=5\Rightarrow2e^x+e^{-x}=5\Rightarrow2e^{2x}-5e^x+1=0$.
> $e^x=\dfrac{5\pm\sqrt{17}}4$, both positive, so $x=\ln\dfrac{5\pm\sqrt{17}}4$.
### Differentiating
$$\frac d{dx}\sinh x=\cosh x\qquad\frac d{dx}\cosh x=\sinh x\qquad\frac d{dx}\tanh x=\operatorname{sech}^2x$$
(no minus sign, unlike $\cos$.)
$$\frac d{dx}\operatorname{arsinh}x=\frac1{\sqrt{x^2+1}}\qquad\frac d{dx}\operatorname{arcosh}x=\frac1{\sqrt{x^2-1}}\qquad\frac d{dx}\operatorname{artanh}x=\frac1{1-x^2}$$
### Integrating
Reverse the above, and note:
$$\int\frac1{\sqrt{x^2+a^2}}dx=\operatorname{arsinh}\frac xa+c\qquad\int\frac1{\sqrt{x^2-a^2}}dx=\operatorname{arcosh}\frac xa+c\ (x>a)$$
Integrals like $\int\sinh^2x\,dx$ use $\sinh^2x=\tfrac12(\cosh2x-1)$. Substitutions $x=a\sinh u$ or $x=a\cosh u$ deal with $\sqrt{x^2\pm a^2}$; complete the square for $\sqrt{x^2+4x+13}$ etc.
### Watch out
- Logarithmic forms of inverse functions are in the formula book, but you must be able to derive them.
- Osborn's rule is for remembering identities; in proofs, use the exponential definitions.`;

N.de=String.raw`### First-order linear equations: the integrating factor
A first-order linear differential equation can be written
$$\frac{dy}{dx}+P(x)y=Q(x)$$
**Method**:
1. Divide through so the coefficient of $\dfrac{dy}{dx}$ is 1, and identify $P(x)$.
2. Find the **integrating factor** $I=e^{\int P(x)\,dx}$ (no constant needed).
3. Multiply the whole equation by $I$. The left side becomes $\dfrac d{dx}(Iy)$ (by the product rule; this is why the method works).
4. Integrate: $Iy=\int IQ\,dx$ (now include $+c$). Divide by $I$.
> **Worked example.** Solve $x\dfrac{dy}{dx}+2y=x^2$ for $x>0$.
> Divide by $x$: $\dfrac{dy}{dx}+\dfrac2xy=x$. $I=e^{\int\frac2x dx}=e^{2\ln x}=x^2$.
> $\dfrac d{dx}(x^2y)=x^3\Rightarrow x^2y=\tfrac14x^4+c\Rightarrow y=\tfrac14x^2+\dfrac c{x^2}$.
### Second-order homogeneous equations
$$a\frac{d^2y}{dx^2}+b\frac{dy}{dx}+cy=0$$
Try $y=e^{mx}$: this gives the **auxiliary equation** $am^2+bm+c=0$. The general solution depends on its roots:
- Two distinct real roots $m_1,m_2$: $y=Ae^{m_1x}+Be^{m_2x}$.
- A repeated root $m$: $y=(A+Bx)e^{mx}$.
- Complex roots $p\pm qi$: $y=e^{px}(A\cos qx+B\sin qx)$.
Two arbitrary constants are expected in a second-order equation.
> **Worked example.** $\ddot y+4\dot y+13y=0$: $m^2+4m+13=0$, $m=-2\pm3i$. $y=e^{-2x}(A\cos3x+B\sin3x)$.
### Non-homogeneous equations
$$a\frac{d^2y}{dx^2}+b\frac{dy}{dx}+cy=f(x)$$
General solution = **complementary function** (CF, the solution with $f(x)=0$) + **particular integral** (PI, any one solution of the full equation).
Choose the form of the PI to match $f(x)$:
- $f(x)=k$: try $y=\lambda$.
- $f(x)=$ linear: try $\lambda x+\mu$; quadratic: $\lambda x^2+\mu x+\nu$.
- $f(x)=ke^{px}$: try $\lambda e^{px}$.
- $f(x)=$ combination of $\cos px$ and $\sin px$: try $\lambda\cos px+\mu\sin px$.
**If the trial form already appears in the CF**, multiply it by $x$ (or $x^2$ for a repeated root).
Substitute the trial function into the equation and compare coefficients.
> **Worked example.** $\ddot y-3\dot y+2y=4x$. CF: $m^2-3m+2=0$, $m=1,2$: $Ae^x+Be^{2x}$.
> PI: $y=\lambda x+\mu$: $0-3\lambda+2(\lambda x+\mu)=4x$, so $\lambda=2$, $\mu=3$.
> $y=Ae^x+Be^{2x}+2x+3$.
### Boundary conditions
Use the given conditions (e.g. $y=0$ and $\dfrac{dy}{dx}=1$ when $x=0$) to find $A$ and $B$, giving a **particular solution**. Differentiate the general solution to use a condition on $\dfrac{dy}{dx}$.
### Watch out
- Find the CF **before** choosing the PI, so you can spot a clash.
- The integrating factor goes on both sides of the equation.`;

N.model=String.raw`### Modelling with first-order equations
A rate of change described in words becomes a differential equation.
- "Rate of change proportional to amount": $\dfrac{dx}{dt}=kx$.
- Newton's law of cooling: $\dfrac{d\theta}{dt}=-k(\theta-\theta_0)$.
- A tank with inflow and outflow: rate of change of amount = rate in $-$ rate out. If liquid of concentration $c$ flows in at $r$ litres per minute and the well-mixed solution flows out at $r$, the salt amount $x$ satisfies $\dfrac{dx}{dt}=cr-\dfrac{rx}{V}$.
Solve by separation of variables or an integrating factor, use the initial condition, and interpret: long-term value (let $t\to\infty$), when a value is reached, and whether the model is realistic.
### Simple harmonic motion
A particle moves with **simple harmonic motion** if its acceleration is proportional to its displacement from a fixed point and directed towards it:
$$\ddot x=-\omega^2x$$
Auxiliary equation $m^2+\omega^2=0$, $m=\pm i\omega$, so
$$x=A\cos\omega t+B\sin\omega t=R\sin(\omega t+\alpha)$$
The motion oscillates with **amplitude** $R$ and **period** $\dfrac{2\pi}\omega$.
### Damped and forced harmonic motion
Adding a resistance proportional to velocity gives **damped** motion:
$$\ddot x+k\dot x+\omega^2x=0$$
The auxiliary equation $m^2+km+\omega^2=0$ has discriminant $k^2-4\omega^2$:
{{svg1}}
- $k^2<4\omega^2$: complex roots: **light damping**. $x=e^{-kt/2}(A\cos qt+B\sin qt)$: oscillations whose amplitude decays exponentially.
- $k^2=4\omega^2$: repeated root: **critical damping**. $x=(A+Bt)e^{-kt/2}$: returns to equilibrium as fast as possible without oscillating.
- $k^2>4\omega^2$: two negative real roots: **heavy damping**. Returns slowly without oscillating.
If there is also an external driving force $f(t)$, the motion is **forced**: $\ddot x+k\dot x+\omega^2x=f(t)$. Solve with CF + PI. In the long term the CF decays and the motion follows the PI (the steady state).
### Coupled first-order systems
Two linked quantities (e.g. predator and prey populations, or two tanks) can be modelled by
$$\frac{dx}{dt}=ax+by+f(t)\qquad\frac{dy}{dt}=cx+dy+g(t)$$
**Method**: rearrange the first for $y$, differentiate it to get $\dfrac{dy}{dt}$, and substitute both into the second. This gives a **second-order** equation in $x$ only. Solve it, then find $y$ from the rearranged first equation.
> **Worked example.** Solve $\dot x=2x+y$, $\dot y=x+2y$.
> From the first, $y=\dot x-2x$, so $\dot y=\ddot x-2\dot x$. Substitute: $\ddot x-2\dot x=x+2(\dot x-2x)$, giving $\ddot x-4\dot x+3x=0$.
> $m=1,3$: $x=Ae^t+Be^{3t}$, and $y=\dot x-2x=-Ae^t+Be^{3t}$.
Interpret in context: e.g. which population dies out, when, and the limitations of the model (negative populations are impossible).
### Watch out
- Define the variables and directions clearly when setting up a model.
- Give the period and amplitude of SHM with units.`;

window.NOTES2=window.NOTES2||{};
window.NOTES2.cp2=N;
})();
