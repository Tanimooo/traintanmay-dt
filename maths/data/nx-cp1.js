/* Full topic notes for Core Pure 1 (Edexcel 9FM0). Overrides the short notes in notes.js. */
(function(){
const N={};

N.complex=String.raw`### Why complex numbers
The equation $x^2=-1$ has no real solution, because no real number squares to a negative. We invent a new number $i$ with
$$i^2=-1$$
Then every negative number has square roots: $\sqrt{-9}=\sqrt9\sqrt{-1}=3i$. Numbers like $3i$ are **imaginary**. A **complex number** has a real part and an imaginary part:
$$z=a+bi,\qquad\text{Re}(z)=a,\ \text{Im}(z)=b$$
(Note $\text{Im}(z)$ is the real number $b$, not $bi$.) The set of complex numbers is $\mathbb C$. Two complex numbers are equal only if their real parts are equal **and** their imaginary parts are equal: comparing them gives two equations.
### Arithmetic
Treat $i$ like a letter, then replace $i^2$ by $-1$.
- Add/subtract: combine real and imaginary parts. $(3+2i)+(1-5i)=4-3i$.
- Multiply: expand. $(3+2i)(1-5i)=3-15i+2i-10i^2=3-13i+10=13-13i$.
- Powers of $i$ cycle: $i,\ -1,\ -i,\ 1,\ i,\dots$ (period 4).
### The complex conjugate and division
The **conjugate** of $z=a+bi$ is $z^*=a-bi$. Then
$$zz^*=(a+bi)(a-bi)=a^2+b^2$$
which is **real**. So to divide, multiply top and bottom by the conjugate of the denominator (like rationalising a surd):
> **Worked example.** $\dfrac{5+i}{2-3i}=\dfrac{(5+i)(2+3i)}{(2-3i)(2+3i)}=\dfrac{10+15i+2i-3}{4+9}=\dfrac{7+17i}{13}=\dfrac7{13}+\dfrac{17}{13}i$.
Also $z+z^*=2\text{Re}(z)$ and $z-z^*=2i\,\text{Im}(z)$.
### Solving quadratics
With complex numbers, **every** quadratic has two roots. If $b^2-4ac<0$ the formula gives a complex conjugate pair:
> **Worked example.** $z^2-4z+13=0$: $z=\dfrac{4\pm\sqrt{16-52}}2=\dfrac{4\pm6i}2=2\pm3i$.
For real-coefficient polynomials, complex roots **always come in conjugate pairs**: if $a+bi$ is a root, so is $a-bi$.
### Solving cubics and quartics
If you are given (or can find) one complex root of a real polynomial:
1. Its conjugate is also a root.
2. Multiply the two factors: $(z-(a+bi))(z-(a-bi))=z^2-2az+(a^2+b^2)$, a real quadratic.
3. Divide the polynomial by this quadratic (or compare coefficients) to find the remaining factor(s).
> **Worked example.** $2+i$ is a root of $z^3-5z^2+9z-5=0$. Then $2-i$ is too. Their quadratic: $z^2-4z+5$. Dividing: $z^3-5z^2+9z-5=(z^2-4z+5)(z-1)$. Roots $2\pm i$ and $1$.
A cubic with real coefficients has either 3 real roots or 1 real root and a conjugate pair. A quartic has 4, 2 or 0 real roots.
### Square roots of a complex number
To find $\sqrt{z}$, set $(a+bi)^2=z$ and compare real and imaginary parts, giving simultaneous equations.
> **Worked example.** Find the square roots of $5-12i$. $(a+bi)^2=a^2-b^2+2abi$, so $a^2-b^2=5$ and $2ab=-12$.
> Substituting $b=-\tfrac6a$: $a^4-5a^2-36=0$, $a^2=9$, $a=\pm3$, $b=\mp2$. Roots $\pm(3-2i)$.
### Watch out
- $\sqrt{-4}\sqrt{-9}\neq\sqrt{36}$: write each as $2i\times3i=-6$.
- When comparing parts, collect everything into $(\ldots)+(\ldots)i$ form first.`;

N.argand=String.raw`### The Argand diagram
A complex number $z=x+iy$ can be plotted as the point $(x,y)$: real part across, imaginary part up. This plane is the **Argand diagram**. It can also be pictured as the vector from the origin to that point, so adding complex numbers works like adding vectors, and $z_2-z_1$ is the vector from $z_1$ to $z_2$.
### Modulus and argument
- The **modulus** $|z|=r=\sqrt{x^2+y^2}$ is the distance from the origin.
- The **argument** $\arg z=\theta$ is the angle from the positive real axis, measured **anticlockwise** (negative if clockwise). The **principal argument** is in $-\pi<\theta\le\pi$.
To find $\arg z$: sketch the point, find the acute angle $\tan^{-1}\left|\dfrac yx\right|$, then adjust for the quadrant. For $z=-1+\sqrt3i$ (2nd quadrant): acute angle $\tfrac\pi3$, so $\arg z=\pi-\tfrac\pi3=\tfrac{2\pi}3$.
### Modulus–argument form
Since $x=r\cos\theta$ and $y=r\sin\theta$:
$$z=r(\cos\theta+i\sin\theta)$$
Multiplying and dividing are easy in this form:
$$|z_1z_2|=|z_1||z_2|\qquad\arg(z_1z_2)=\arg z_1+\arg z_2$$
$$\left|\frac{z_1}{z_2}\right|=\frac{|z_1|}{|z_2|}\qquad\arg\frac{z_1}{z_2}=\arg z_1-\arg z_2$$
(Proof: expand $(\cos\alpha+i\sin\alpha)(\cos\beta+i\sin\beta)$ and use the addition formulae.) So multiplying by $z$ **scales** by $|z|$ and **rotates** by $\arg z$. Multiplying by $i$ rotates by $90°$.
Adjust the argument back into $(-\pi,\pi]$ by adding or subtracting $2\pi$ if needed.
### Loci in the Argand diagram
{{svg1}}
Remember $|z-z_1|$ is the **distance** from $z$ to the point $z_1$, and $\arg(z-z_1)$ is the **direction** of $z$ from $z_1$.
- $|z-z_1|=r$: a **circle**, centre $z_1$, radius $r$. Careful with signs: $|z+2-i|=3$ is $|z-(-2+i)|=3$, centre $(-2,1)$.
- $|z-z_1|=|z-z_2|$: points equidistant from $z_1$ and $z_2$, the **perpendicular bisector** of the line joining them.
- $\arg(z-z_1)=\theta$: a **half-line** starting at $z_1$ (not including $z_1$), at angle $\theta$ to the horizontal.
> **Worked example.** Find the Cartesian equation of $|z-3|=|z+i|$. With $z=x+iy$: $(x-3)^2+y^2=x^2+(y+1)^2$, so $-6x+9=2y+1$, giving $y=4-3x$.
### Regions
Inequalities give regions: $|z-z_1|\le r$ is the inside of the circle (with the boundary); $|z-z_1|<|z-z_2|$ is the side of the bisector closer to $z_1$; $\alpha\le\arg(z-z_1)\le\beta$ is a "wedge" between two half-lines from $z_1$. Shade the region satisfying all conditions.
### Maximum and minimum modulus
For $z$ on a circle with centre $c$ and radius $r$, the largest $|z|$ is $|c|+r$ and the smallest is $\big||c|-r\big|$: draw the line from the origin through the centre.
### Watch out
- Arguments are in radians, principal range $-\pi<\theta\le\pi$.
- Half-lines start at the point but do not include it; mark it with an open circle.`;

N.series=String.raw`### Sigma notation and the standard sums
$\displaystyle\sum_{r=1}^nf(r)$ means $f(1)+f(2)+\dots+f(n)$. You need three standard results:
$$\sum_{r=1}^nr=\frac12n(n+1)\qquad\sum_{r=1}^nr^2=\frac16n(n+1)(2n+1)\qquad\sum_{r=1}^nr^3=\frac14n^2(n+1)^2$$
Notice $\displaystyle\sum r^3=\left(\sum r\right)^2$. Also $\displaystyle\sum_{r=1}^n1=n$ (adding 1, $n$ times), and $\displaystyle\sum_{r=1}^nk=kn$.
The first is proved by pairing terms (Gauss); the others can be proved by induction (see Proof by induction).
### Rules for combining
Sums split and constants factor out:
$$\sum(af(r)+bg(r))=a\sum f(r)+b\sum g(r)$$
But $\sum f(r)g(r)\neq\sum f(r)\sum g(r)$: expand products first.
> **Worked example.** Show that $\displaystyle\sum_{r=1}^nr(r+2)=\tfrac16n(n+1)(2n+7)$.
> $\sum(r^2+2r)=\tfrac16n(n+1)(2n+1)+2\cdot\tfrac12n(n+1)$
> $=\tfrac16n(n+1)\left[(2n+1)+6\right]=\tfrac16n(n+1)(2n+7)$.
**Always factorise** by taking out common factors such as $\tfrac16n(n+1)$ before expanding: it saves a lot of algebra.
### Sums that do not start at 1
$$\sum_{r=k}^nf(r)=\sum_{r=1}^nf(r)-\sum_{r=1}^{k-1}f(r)$$
Note the upper limit of the subtracted sum is $k-1$, not $k$.
> **Worked example.** $\displaystyle\sum_{r=11}^{20}r^2=\sum_{1}^{20}-\sum_{1}^{10}=2870-385=2485$.
For sums like $\displaystyle\sum_{r=n+1}^{2n}r$, substitute $2n$ and $n$ into the formula and subtract.
### Watch out
- Check your general formula with $n=1$ or $n=2$.
- In "show that" questions, show the factorising steps clearly.`;

N.roots=String.raw`### Roots and coefficients
If a polynomial has roots $\alpha,\beta,\dots$, it factorises as $a(z-\alpha)(z-\beta)\cdots$. Expanding and comparing with the original gives relationships between the **roots** and the **coefficients**, without solving.
**Quadratic** $az^2+bz+c=0$, roots $\alpha,\beta$:
$$\alpha+\beta=-\frac ba\qquad\alpha\beta=\frac ca$$
**Cubic** $az^3+bz^2+cz+d=0$, roots $\alpha,\beta,\gamma$:
$$\sum\alpha=-\frac ba\qquad\sum\alpha\beta=\frac ca\qquad\alpha\beta\gamma=-\frac da$$
where $\sum\alpha\beta=\alpha\beta+\beta\gamma+\gamma\alpha$ (all pairs).
**Quartic** $az^4+bz^3+cz^2+dz+e=0$:
$$\sum\alpha=-\frac ba\quad\sum\alpha\beta=\frac ca\quad\sum\alpha\beta\gamma=-\frac da\quad\alpha\beta\gamma\delta=\frac ea$$
The signs alternate: $-,+,-,+$.
### Expressions in the roots
Rewrite symmetric expressions using the sums above.
- $\alpha^2+\beta^2=(\alpha+\beta)^2-2\alpha\beta$; for a cubic, $\sum\alpha^2=\left(\sum\alpha\right)^2-2\sum\alpha\beta$.
- $\dfrac1\alpha+\dfrac1\beta+\dfrac1\gamma=\dfrac{\sum\alpha\beta}{\alpha\beta\gamma}$.
- $\alpha^3+\beta^3=(\alpha+\beta)^3-3\alpha\beta(\alpha+\beta)$.
- $(\alpha+1)(\beta+1)(\gamma+1)=\alpha\beta\gamma+\sum\alpha\beta+\sum\alpha+1$.
> **Worked example.** $2z^3-3z^2+4z-5=0$ has roots $\alpha,\beta,\gamma$. Find $\sum\alpha^2$.
> $\sum\alpha=\tfrac32$, $\sum\alpha\beta=2$. $\sum\alpha^2=\tfrac94-4=-\tfrac74$.
> (A negative sum of squares shows some roots are complex.)
### Linear transformations of roots
To find an equation whose roots are related to the original ones (e.g. $2\alpha$, $\alpha+3$, $\alpha^2$):
**Method 1 (substitution)**: if the new root is $w=2\alpha$, then $\alpha=\tfrac w2$. Substitute $z=\tfrac w2$ into the original equation and tidy up.
> **Worked example.** $z^3-4z^2+z+6=0$ has roots $\alpha,\beta,\gamma$. Find an equation with roots $\alpha-1,\beta-1,\gamma-1$.
> $w=z-1$, so $z=w+1$: $(w+1)^3-4(w+1)^2+(w+1)+6=0$.
> Expanding: $w^3-w^2-4w+4=0$.
**Method 2**: calculate the new $\sum$, $\sum$ pairs and product from the old ones, and build the equation $w^3-(\text{sum})w^2+(\text{pairs})w-(\text{product})=0$.
Substitution is usually faster for linear transformations.
### Watch out
- Divide by the leading coefficient $a$ in every relation.
- Give the new equation with integer coefficients if asked.`;

N.volrev=String.raw`### Volume of revolution about the $x$-axis
{{svg1}}
When the region under $y=f(x)$ from $x=a$ to $x=b$ is rotated through $2\pi$ about the $x$-axis, it sweeps out a solid. Each thin vertical strip of width $\delta x$ becomes a thin disc of radius $y$ and volume $\pi y^2\delta x$. Adding the discs and letting $\delta x\to0$:
$$V=\pi\int_a^by^2\,dx$$
> **Worked example.** The region under $y=\sqrt x$ from $x=0$ to $x=4$ is rotated about the $x$-axis.
> $V=\pi\int_0^4x\,dx=\pi\left[\tfrac12x^2\right]_0^4=8\pi$.
### About the $y$-axis
Rotating the region between the curve and the $y$-axis, from $y=c$ to $y=d$, gives horizontal discs of radius $x$:
$$V=\pi\int_c^dx^2\,dy$$
Rearrange the curve to get $x^2$ in terms of $y$ first, and use $y$-limits.
> **Worked example.** The region between $y=x^2$, the $y$-axis and $y=4$ is rotated about the $y$-axis. $x^2=y$, so $V=\pi\int_0^4y\,dy=8\pi$.
### Regions between two curves
If a region between an outer curve $y_1$ and an inner curve $y_2$ is rotated about the $x$-axis, the solid has a hole: each slice is a washer.
$$V=\pi\int_a^b\left(y_1^2-y_2^2\right)dx$$
This is $\pi\int y_1^2-\pi\int y_2^2$, **not** $\pi\int(y_1-y_2)^2$. Equivalently: volume of the outer solid minus volume of the inner solid. Find the limits from the points of intersection. Simple shapes such as cones ($\tfrac13\pi r^2h$) and cylinders can be added or subtracted.
### Modelling with volumes of revolution
Real objects (vases, bowls, bottles) can be modelled by rotating a curve. Questions ask for the volume or capacity, and to comment on the model (e.g. it ignores the thickness of the material, or the real shape is not exactly that curve). Watch the units and scale: if 1 unit represents 2 cm, volumes scale by $2^3=8$.
### Watch out
- The $\pi$ is outside the integral and the function is squared.
- Rotating about the $y$-axis needs $x^2$ in terms of $y$ and $y$-limits.`;

N.matrices=String.raw`### What a matrix is
A **matrix** is a rectangular array of numbers. An $m\times n$ matrix has $m$ rows and $n$ columns. Square matrices have the same number of rows and columns.
- The **zero matrix** $\mathbf 0$ has every entry 0.
- The **identity matrix** $\mathbf I$ has 1s on the leading diagonal and 0s elsewhere: $\mathbf I=\begin{pmatrix}1&0\\0&1\end{pmatrix}$. It acts like the number 1: $\mathbf{AI}=\mathbf{IA}=\mathbf A$.
### Adding and scalar multiplication
Matrices of the **same size** add entry by entry. Multiplying by a number $k$ multiplies every entry by $k$.
### Matrix multiplication
To find the entry in row $i$, column $j$ of $\mathbf{AB}$: take row $i$ of $\mathbf A$ and column $j$ of $\mathbf B$, multiply corresponding entries and add.
$$\begin{pmatrix}1&2\\3&4\end{pmatrix}\begin{pmatrix}5&6\\7&8\end{pmatrix}=\begin{pmatrix}1\cdot5+2\cdot7&1\cdot6+2\cdot8\\3\cdot5+4\cdot7&3\cdot6+4\cdot8\end{pmatrix}=\begin{pmatrix}19&22\\43&50\end{pmatrix}$$
- $\mathbf{AB}$ exists only if the number of **columns of $\mathbf A$** equals the number of **rows of $\mathbf B$**. An $m\times n$ times an $n\times p$ gives an $m\times p$.
- In general **$\mathbf{AB}\neq\mathbf{BA}$** (matrix multiplication is not commutative). It is associative: $(\mathbf{AB})\mathbf C=\mathbf A(\mathbf{BC})$.
### Determinants
For a $2\times2$ matrix $\mathbf M=\begin{pmatrix}a&b\\c&d\end{pmatrix}$, the **determinant** is
$$\det\mathbf M=|\mathbf M|=ad-bc$$
For a $3\times3$ matrix, expand along the top row using $2\times2$ **minors** with signs $+,-,+$:
$$\begin{vmatrix}a&b&c\\d&e&f\\g&h&i\end{vmatrix}=a\begin{vmatrix}e&f\\h&i\end{vmatrix}-b\begin{vmatrix}d&f\\g&i\end{vmatrix}+c\begin{vmatrix}d&e\\g&h\end{vmatrix}$$
A matrix with determinant 0 is **singular** (it has no inverse); otherwise **non-singular**. Also $\det(\mathbf{AB})=\det\mathbf A\det\mathbf B$.
### Inverses
The **inverse** $\mathbf M^{-1}$ satisfies $\mathbf{MM}^{-1}=\mathbf M^{-1}\mathbf M=\mathbf I$. For a $2\times2$ matrix:
$$\mathbf M^{-1}=\frac1{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}$$
(swap the leading diagonal, change the signs of the other two, divide by the determinant). For $3\times3$ matrices, use your calculator (or the matrix of cofactors, transposed, divided by the determinant).
Note $(\mathbf{AB})^{-1}=\mathbf B^{-1}\mathbf A^{-1}$: the order reverses (like putting on socks then shoes, and taking them off in reverse).
### Solving systems of equations
A system of linear equations can be written $\mathbf{Mx}=\mathbf c$. If $\mathbf M$ is non-singular, there is a unique solution $\mathbf x=\mathbf M^{-1}\mathbf c$.
> **Worked example.** Solve $2x+y=5$, $3x-y=5$. $\mathbf M=\begin{pmatrix}2&1\\3&-1\end{pmatrix}$, $\det=-5$. $\mathbf M^{-1}=-\tfrac15\begin{pmatrix}-1&-1\\-3&2\end{pmatrix}$, so $\begin{pmatrix}x\\y\end{pmatrix}=-\tfrac15\begin{pmatrix}-10\\-5\end{pmatrix}=\begin{pmatrix}2\\1\end{pmatrix}$.
For three equations in three unknowns, each equation is a **plane**. If $\det\mathbf M\neq0$, the planes meet at a single point. If $\det\mathbf M=0$, there is either no solution (**inconsistent**) or infinitely many (**consistent**), with geometric pictures:
- three planes meeting in a **line** (a sheaf): infinitely many solutions;
- a **prism** (each pair meets in a line, the lines parallel): no solution;
- two or three **parallel** planes: no solution.
To decide, eliminate a variable and see whether the resulting equations are consistent.
### Watch out
- Write the inverse before multiplying, and multiply in the right order ($\mathbf M^{-1}\mathbf c$, not $\mathbf c\mathbf M^{-1}$).
- Check $\det\neq0$ before claiming an inverse exists.`;

N.transf=String.raw`### Matrices as transformations
A $2\times2$ matrix maps a point $(x,y)$ (written as a column vector) to a new point:
$$\begin{pmatrix}a&b\\c&d\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix}=\begin{pmatrix}ax+by\\cx+dy\end{pmatrix}$$
These are **linear** transformations: the origin stays fixed, and straight lines map to straight lines.
**Key trick**: the columns of the matrix are the images of the unit vectors. $\begin{pmatrix}1\\0\end{pmatrix}$ maps to the first column, $\begin{pmatrix}0\\1\end{pmatrix}$ to the second. So to find the matrix of a transformation, see where $(1,0)$ and $(0,1)$ go.
### Standard 2D transformations
- Reflection in the $x$-axis: $\begin{pmatrix}1&0\\0&-1\end{pmatrix}$; in the $y$-axis: $\begin{pmatrix}-1&0\\0&1\end{pmatrix}$; in $y=x$: $\begin{pmatrix}0&1\\1&0\end{pmatrix}$; in $y=-x$: $\begin{pmatrix}0&-1\\-1&0\end{pmatrix}$.
- Rotation by $\theta$ anticlockwise about the origin: $\begin{pmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{pmatrix}$.
- Enlargement scale factor $k$, centre origin: $\begin{pmatrix}k&0\\0&k\end{pmatrix}$.
- Stretch parallel to the $x$-axis, scale factor $k$: $\begin{pmatrix}k&0\\0&1\end{pmatrix}$; parallel to the $y$-axis: $\begin{pmatrix}1&0\\0&k\end{pmatrix}$.
### Successive transformations
"$\mathbf P$ followed by $\mathbf Q$" is represented by $\mathbf{QP}$: the matrix applied first goes on the **right**, nearest the vector, since $\mathbf{QP}\mathbf x=\mathbf Q(\mathbf P\mathbf x)$.
### Determinant and area
{{svg1}}
The determinant is the **area scale factor**: a shape of area $A$ maps to one of area $|\det\mathbf M|\times A$. A negative determinant means the orientation is reversed (as in a reflection). A singular matrix (det 0) squashes the plane onto a line or point, so it has no inverse.
### Invariant points and lines
- An **invariant point** maps to itself: $\mathbf M\mathbf x=\mathbf x$. (The origin always is.) For a reflection, every point on the mirror line is invariant.
- An **invariant line** maps to itself (points can move along it): if $(x,mx+c)$ maps to a point on $y=mx+c$ for all $x$.
- A **line of invariant points** is a line where every point stays fixed.
> **Worked example.** Find the invariant lines through the origin of $\mathbf M=\begin{pmatrix}3&1\\2&2\end{pmatrix}$.
> $(x,mx)$ maps to $(3x+mx,\ 2x+2mx)$. For this to lie on $y=mx$: $2+2m=m(3+m)$, so $m^2+m-2=0$, $m=1$ or $m=-2$. Invariant lines $y=x$ and $y=-2x$.
### 3D transformations
In 3D, $3\times3$ matrices act on $(x,y,z)$. You need reflections in the planes $x=0$, $y=0$, $z=0$ and rotations about the coordinate axes (e.g. about the $z$-axis: $\begin{pmatrix}\cos\theta&-\sin\theta&0\\\sin\theta&\cos\theta&0\\0&0&1\end{pmatrix}$). The determinant is the **volume** scale factor.
### Inverse transformations
$\mathbf M^{-1}$ undoes $\mathbf M$. To find the original point from an image, apply $\mathbf M^{-1}$. The inverse of "$\mathbf P$ then $\mathbf Q$" is "$\mathbf Q^{-1}$ then $\mathbf P^{-1}$": $(\mathbf{QP})^{-1}=\mathbf P^{-1}\mathbf Q^{-1}$.
### Watch out
- Anticlockwise rotations are positive; a clockwise $90°$ rotation uses $\theta=-90°$.
- Order matters: the first transformation is on the right.`;

N.induction=String.raw`### The idea
Proof by induction proves a statement is true for **every** positive integer $n$. Think of dominoes: if the first falls, and each one knocks over the next, they all fall.
1. **Basis**: show the statement is true for $n=1$ (or the first value).
2. **Assumption**: assume it is true for $n=k$.
3. **Inductive step**: use the assumption to show it is true for $n=k+1$.
4. **Conclusion**: "If true for $n=k$ then it is true for $n=k+1$; it is true for $n=1$; so by mathematical induction it is true for all $n\in\mathbb Z^+$."
The conclusion is worth marks: write it in full.
### Summation of series
> **Worked example.** Prove $\displaystyle\sum_{r=1}^nr^2=\tfrac16n(n+1)(2n+1)$.
> $n=1$: LHS $=1$, RHS $=\tfrac16(1)(2)(3)=1$. True.
> Assume true for $n=k$: $\displaystyle\sum_{r=1}^kr^2=\tfrac16k(k+1)(2k+1)$.
> Then $\displaystyle\sum_{r=1}^{k+1}r^2=\tfrac16k(k+1)(2k+1)+(k+1)^2=\tfrac16(k+1)\left[k(2k+1)+6(k+1)\right]$
> $=\tfrac16(k+1)(2k^2+7k+6)=\tfrac16(k+1)(k+2)(2k+3)$, which is the formula with $n=k+1$.
> Conclusion as above.
Aim the algebra at the target: write down what the formula gives for $n=k+1$ first, then factorise towards it.
### Divisibility
To prove $f(n)$ is divisible by $m$: show $f(1)$ is divisible by $m$; assume $f(k)=mA$ for some integer $A$; then show $f(k+1)$ is a multiple of $m$, usually by writing $f(k+1)$ in terms of $f(k)$.
> **Worked example.** Prove $3^{2n}-1$ is divisible by 8.
> $n=1$: $9-1=8$. True.
> Assume $3^{2k}-1=8A$. Then $3^{2(k+1)}-1=9\cdot3^{2k}-1=9(8A+1)-1=72A+8=8(9A+1)$, divisible by 8.
> Conclusion.
A useful move: $f(k+1)-f(k)$ (or $f(k+1)-c\,f(k)$) is often a simple multiple of $m$.
### Matrices
> **Worked example.** Prove $\begin{pmatrix}1&1\\0&1\end{pmatrix}^n=\begin{pmatrix}1&n\\0&1\end{pmatrix}$.
> $n=1$: true. Assume true for $n=k$. Then
> $\begin{pmatrix}1&1\\0&1\end{pmatrix}^{k+1}=\begin{pmatrix}1&k\\0&1\end{pmatrix}\begin{pmatrix}1&1\\0&1\end{pmatrix}=\begin{pmatrix}1&k+1\\0&1\end{pmatrix}$.
> Conclusion.
### Watch out
- Do not assume what you are trying to prove for $n=k+1$; start from the $n=k$ assumption.
- Show the basis case with both sides calculated.`;

N.vectors=String.raw`### Equation of a line in 3D
A line through the point with position vector $\mathbf a$ in the direction $\mathbf b$:
$$\mathbf r=\mathbf a+\lambda\mathbf b$$
Each value of the parameter $\lambda$ gives a point on the line. Through two points $A$ and $B$: $\mathbf r=\mathbf a+\lambda(\mathbf b-\mathbf a)$.
In **Cartesian** form, from $\mathbf r=\begin{pmatrix}a_1\\a_2\\a_3\end{pmatrix}+\lambda\begin{pmatrix}b_1\\b_2\\b_3\end{pmatrix}$:
$$\frac{x-a_1}{b_1}=\frac{y-a_2}{b_2}=\frac{z-a_3}{b_3}\ (=\lambda)$$
### The scalar (dot) product
$$\mathbf a\cdot\mathbf b=a_1b_1+a_2b_2+a_3b_3=|\mathbf a||\mathbf b|\cos\theta$$
where $\theta$ is the angle between the vectors. So $\cos\theta=\dfrac{\mathbf a\cdot\mathbf b}{|\mathbf a||\mathbf b|}$, and **$\mathbf a\cdot\mathbf b=0$ means the vectors are perpendicular**.
### Equation of a plane
A plane is fixed by a point $\mathbf a$ on it and a **normal** vector $\mathbf n$ (perpendicular to the plane). For any point $\mathbf r$ on the plane, $\mathbf r-\mathbf a$ lies in the plane, so is perpendicular to $\mathbf n$:
$$\mathbf r\cdot\mathbf n=\mathbf a\cdot\mathbf n\qquad\text{Cartesian: }n_1x+n_2y+n_3z=d$$
The coefficients of $x,y,z$ in the Cartesian form are the normal vector. Vector form: $\mathbf r=\mathbf a+\lambda\mathbf b+\mu\mathbf c$, using two directions in the plane.
### Intersections
- **Two lines**: set the position vectors equal, giving three equations in $\lambda$ and $\mu$. Solve two of them; if the solution satisfies the third, the lines meet. If they are not parallel and do not meet, they are **skew**.
- **Line and plane**: substitute the line's $\mathbf r$ (in terms of $\lambda$) into the plane equation, solve for $\lambda$.
> **Worked example.** Find where $\mathbf r=\begin{pmatrix}1\\2\\0\end{pmatrix}+\lambda\begin{pmatrix}2\\-1\\3\end{pmatrix}$ meets $x+y+z=9$.
> $(1+2\lambda)+(2-\lambda)+3\lambda=9$, so $4\lambda=6$, $\lambda=1.5$. Point $(4,0.5,4.5)$.
### Angles
- Between two lines: the angle between their **direction** vectors.
- Between a line and a plane: find the angle $\alpha$ between the line's direction and the **normal**; the required angle is $90°-\alpha$.
- Between two planes: the angle between their normals (or its supplement for the acute angle).
### Distances (perpendicular)
- **Point to plane**: the distance from $(\alpha,\beta,\gamma)$ to $n_1x+n_2y+n_3z=d$ is
$$\frac{|n_1\alpha+n_2\beta+n_3\gamma-d|}{\sqrt{n_1^2+n_2^2+n_3^2}}$$
- **Point to line**: let $P$ be a general point on the line (in terms of $\lambda$); the vector from the given point to $P$ is perpendicular to the direction when its dot product with the direction is 0. Solve for $\lambda$, then find the length.
- **Between two skew lines** and **reflections** in planes use the same idea: find a perpendicular vector, using the dot product.
### Watch out
- Use the direction vector (not the position vector) when finding angles.
- In the line–plane angle, remember to subtract from $90°$.`;

window.NOTES2=window.NOTES2||{};
window.NOTES2.cp1=N;
})();
