/* Full topic notes for Further Pure 2 (Edexcel 9FM0). Overrides the short notes in notes.js. */
(function(){
const N={};

N.numth=String.raw`### The division algorithm
For integers $a$ and $b>0$ there are unique integers $q$ (quotient) and $r$ (remainder) with
$$a=bq+r,\qquad0\le r<b$$
$b$ **divides** $a$, written $b\mid a$, if the remainder is 0.
### Highest common factor: Euclid's algorithm
To find $\text{hcf}(a,b)$, repeatedly apply the division algorithm, replacing $(a,b)$ by $(b,r)$, until the remainder is 0. The last non-zero remainder is the hcf. It works because any common factor of $a$ and $b$ also divides $r=a-bq$.
> **Worked example.** $\text{hcf}(1071,462)$: $1071=2\times462+147$; $462=3\times147+21$; $147=7\times21+0$. So hcf $=21$.
**Bézout's identity**: working backwards through Euclid's algorithm writes the hcf as $ax+by$ for integers $x,y$. From the example: $21=462-3\times147=462-3(1071-2\times462)=7\times462-3\times1071$.
Two numbers are **coprime** if their hcf is 1.
### Modular arithmetic
$a\equiv b\pmod n$ ("$a$ is congruent to $b$ modulo $n$") means $n\mid(a-b)$: $a$ and $b$ leave the same remainder on division by $n$. E.g. $17\equiv2\pmod5$.
Congruences can be added, subtracted, multiplied and raised to powers: if $a\equiv b$ and $c\equiv d$ then $a+c\equiv b+d$ and $ac\equiv bd\pmod n$. Division is only allowed by numbers **coprime** to $n$.
### Divisibility tests
Using $10\equiv1\pmod9$, any number is congruent to the sum of its digits mod 9 (and mod 3). Using $10\equiv-1\pmod{11}$, a number is divisible by 11 if the alternating sum of its digits is.
### Fermat's little theorem
If $p$ is prime and $p\nmid a$, then
$$a^{p-1}\equiv1\pmod p$$
(equivalently $a^p\equiv a\pmod p$ for all $a$). It makes huge powers easy.
> **Worked example.** Find $3^{100}\bmod7$. By Fermat, $3^6\equiv1$. $100=6\times16+4$, so $3^{100}\equiv3^4=81\equiv4\pmod7$.
### Solving linear congruences
$ax\equiv b\pmod n$ has a solution if and only if $\text{hcf}(a,n)\mid b$. If $\text{hcf}(a,n)=1$, find the inverse of $a$ mod $n$ (by trial, or Bézout), then multiply.
> **Worked example.** Solve $4x\equiv3\pmod{7}$. $4\times2=8\equiv1$, so $4^{-1}=2$. $x\equiv6\pmod7$.
### Combinatorics
- **Multiplication principle**: if there are $m$ ways to do one thing and $n$ ways to do another, there are $mn$ ways to do both.
- **Permutations** (order matters) of $r$ from $n$: $^nP_r=\dfrac{n!}{(n-r)!}$. Arranging $n$ objects with repeats: $\dfrac{n!}{p!q!\cdots}$.
- **Combinations** (order does not matter): $^nC_r=\dfrac{n!}{r!(n-r)!}$.
- Arrangements around a circle: $(n-1)!$.
- **Pigeonhole principle**: if more than $n$ objects go into $n$ boxes, some box holds at least two.
- Complementary counting: count what you do not want and subtract.
### Watch out
- In modular arithmetic, reduce at every step to keep numbers small.
- Decide whether order matters before choosing permutations or combinations.`;

N.groups=String.raw`### Binary operations
A **binary operation** $*$ on a set $S$ combines two elements to give another: $a*b$. It is **closed** on $S$ if $a*b\in S$ for all $a,b\in S$. A **Cayley table** lists all the results for a finite set.
### The group axioms
A set $G$ with a binary operation $*$ is a **group** if it satisfies:
1. **Closure**: $a*b\in G$ for all $a,b\in G$.
2. **Associativity**: $(a*b)*c=a*(b*c)$ for all $a,b,c$.
3. **Identity**: there is an element $e$ with $a*e=e*a=a$ for all $a$.
4. **Inverses**: each $a$ has an inverse $a^{-1}$ with $a*a^{-1}=a^{-1}*a=e$.
A group is **abelian** if it is also **commutative**: $a*b=b*a$ (its Cayley table is symmetric about the leading diagonal).
Examples: integers under addition (identity 0, inverse $-a$); non-zero rationals under multiplication; $\{1,2,3,4\}$ under multiplication mod 5; symmetries of a shape under composition; invertible $2\times2$ matrices under multiplication (not abelian).
Non-example: integers under multiplication (no inverse of 2).
In a group Cayley table, each element appears **exactly once in every row and every column** (a Latin square).
### Order
- The **order of a group** is the number of elements, $|G|$.
- The **order of an element** $a$ is the smallest positive $n$ with $a^n=e$ (applying $*$ $n$ times).
- A group is **cyclic** if one element (a **generator**) produces every element as its powers. Cyclic groups are abelian.
> **Worked example.** In $\{1,2,3,4\}$ under $\times_5$: $2^1=2$, $2^2=4$, $2^3=3$, $2^4=1$. So 2 has order 4 and generates the group: it is cyclic.
### Subgroups and Lagrange's theorem
A **subgroup** $H$ of $G$ is a subset that is itself a group under the same operation. To check, you need closure, identity and inverses (associativity is inherited).
**Lagrange's theorem**: the order of any subgroup divides the order of the group. Consequences:
- The order of every element divides $|G|$.
- A group of prime order is cyclic and has no proper non-trivial subgroups.
The **trivial subgroup** is $\{e\}$; proper subgroups are those other than $G$ itself.
### Isomorphism
Two groups are **isomorphic** if there is a one-to-one mapping between them that preserves the operation: their Cayley tables have the same structure after relabelling. To show two groups are **not** isomorphic, find a structural difference: different orders of elements (count elements of each order), one cyclic and the other not, one abelian and the other not.
Groups of order 4 are either cyclic ($C_4$) or the Klein four-group (every non-identity element has order 2).
### Watch out
- Show associativity by reference to a known associative operation (addition, multiplication, matrix multiplication, composition of functions) rather than checking every case.
- Find the identity before looking for inverses.`;

N.complex=String.raw`### Loci revisited
The loci from Core Pure 1 (circles $|z-a|=r$, perpendicular bisectors $|z-a|=|z-b|$, half-lines $\arg(z-a)=\theta$) are extended.
### Circles of Apollonius
$$|z-a|=k|z-b|\quad(k\neq1)$$
is a **circle**: the set of points whose distance from $a$ is $k$ times its distance from $b$. Find its centre and radius by substituting $z=x+iy$, squaring and completing the square.
{{svg1}}
> **Worked example.** $|z|=2|z-3|$. $x^2+y^2=4\left[(x-3)^2+y^2\right]\Rightarrow3x^2+3y^2-24x+36=0\Rightarrow x^2+y^2-8x+12=0$.
> $(x-4)^2+y^2=4$: centre $(4,0)$, radius 2.
### Arcs: $\arg\dfrac{z-a}{z-b}=\theta$
$\arg\dfrac{z-a}{z-b}=\arg(z-a)-\arg(z-b)$ is the angle at $z$ between the lines to $a$ and $b$. The locus is an **arc of a circle** ending at $a$ and $b$ (by the "angles in the same segment" theorem), not including $a$ and $b$. If $\theta=\tfrac\pi2$, the arc is a semicircle on $ab$ as diameter.
### Transformations of the complex plane
A function $w=f(z)$ maps points in the $z$-plane to the $w$-plane. To find the image of a locus:
1. Rearrange to make $z$ the subject: $z=g(w)$.
2. Substitute into the equation of the locus in $z$.
3. Simplify to get the locus in $w$ (write $w=u+iv$ if needed).
> **Worked example.** Find the image of the circle $|z|=2$ under $w=\dfrac{1}{z-1}$.
> $z=1+\dfrac1w=\dfrac{w+1}w$. Then $\left|\dfrac{w+1}w\right|=2\Rightarrow|w+1|=2|w|$: a circle of Apollonius in the $w$-plane, with centre $\left(\tfrac13,0\right)$ and radius $\tfrac23$.
Simple maps: $w=z+a$ translates; $w=kz$ (real $k$) enlarges; $w=e^{i\theta}z$ rotates; $w=\dfrac1z$ inverts (circles and lines map to circles and lines).
### Regions
Inequalities in $z$ map to regions in $w$ in the same way; test a point to decide which side.
### Watch out
- For arcs, mark the endpoints with open circles.
- When mapping lines with $w=\tfrac1z$, set $w=u+iv$ and use the real or imaginary part of $z$ as appropriate.`;

N.recur=String.raw`### Recurrence relations
A **recurrence relation** defines each term of a sequence from earlier terms, e.g. $u_{n+1}=3u_n-2$. A **first-order** relation uses one previous term; **second-order** uses two. To solve one means to find a **closed form**: $u_n$ as a function of $n$.
### First-order linear: $u_{n+1}=au_n+g(n)$
Solution = **complementary function** + **particular solution** (just like differential equations):
1. **Complementary function**: solve $u_{n+1}=au_n$: $u_n=Aa^n$.
2. **Particular solution**: try a form like $g(n)$ (see the list below), substitute and compare coefficients.
3. Add them, then use the initial term to find $A$.
Trial forms for the particular solution:
- $g(n)=k$ (constant): try $u_n=\lambda$.
- $g(n)$ linear: try $\lambda n+\mu$.
- $g(n)=kp^n$: try $\lambda p^n$ (or $\lambda np^n$ if $p=a$).
> **Worked example.** $u_{n+1}=3u_n-2$, $u_1=4$.
> CF: $A\cdot3^n$. PS: $\lambda=3\lambda-2\Rightarrow\lambda=1$. So $u_n=A\cdot3^n+1$.
> $u_1=3A+1=4\Rightarrow A=1$. $u_n=3^n+1$.
### Second-order linear: $u_{n+2}+au_{n+1}+bu_n=g(n)$
**Auxiliary equation**: $r^2+ar+b=0$.
- Distinct roots $\alpha,\beta$: CF $=A\alpha^n+B\beta^n$.
- Repeated root $\alpha$: CF $=(A+Bn)\alpha^n$.
Then add a particular solution as above, and use **two** initial terms to find $A$ and $B$.
> **Worked example: Fibonacci.** $F_{n+2}=F_{n+1}+F_n$, $F_1=F_2=1$. $r^2-r-1=0$, $r=\dfrac{1\pm\sqrt5}2$.
> $F_n=\dfrac1{\sqrt5}\left[\left(\dfrac{1+\sqrt5}2\right)^n-\left(\dfrac{1-\sqrt5}2\right)^n\right]$.
### Proving closed forms by induction
Check the formula for the first term(s); assume it for $n=k$ (and $k-1$ for second order); show it then holds for $k+1$ using the recurrence.
### Modelling
Recurrence relations model populations with harvesting ($P_{n+1}=1.1P_n-50$), loans with interest and repayments, and counting problems (e.g. number of ways to tile a $2\times n$ strip). Interpret the long-term behaviour from the closed form.
### Watch out
- If the trial particular solution matches part of the CF, multiply by $n$.
- Use the given starting index ($u_0$ or $u_1$) correctly.`;

N.matrix=String.raw`### Eigenvalues and eigenvectors
An **eigenvector** of a square matrix $\mathbf M$ is a non-zero vector $\mathbf x$ whose direction is unchanged by $\mathbf M$: it is just scaled.
$$\mathbf{Mx}=\lambda\mathbf x$$
The scale factor $\lambda$ is the corresponding **eigenvalue**. Geometrically, the eigenvectors give **invariant lines** through the origin.
### Finding them
Rearrange: $(\mathbf M-\lambda\mathbf I)\mathbf x=\mathbf 0$. For a non-zero solution, $\mathbf M-\lambda\mathbf I$ must be singular:
$$\det(\mathbf M-\lambda\mathbf I)=0$$
This is the **characteristic equation**. Solve it for $\lambda$, then for each $\lambda$ solve $(\mathbf M-\lambda\mathbf I)\mathbf x=\mathbf 0$ for $\mathbf x$ (any non-zero multiple works).
> **Worked example.** $\mathbf M=\begin{pmatrix}4&1\\2&3\end{pmatrix}$. $\det\begin{pmatrix}4-\lambda&1\\2&3-\lambda\end{pmatrix}=\lambda^2-7\lambda+10=0$, so $\lambda=2,5$.
> $\lambda=5$: $\begin{pmatrix}-1&1\\2&-2\end{pmatrix}\mathbf x=\mathbf 0\Rightarrow\mathbf x=\begin{pmatrix}1\\1\end{pmatrix}$.
> $\lambda=2$: $\begin{pmatrix}2&1\\2&1\end{pmatrix}\mathbf x=\mathbf 0\Rightarrow\mathbf x=\begin{pmatrix}1\\-2\end{pmatrix}$.
For a $3\times3$ matrix the characteristic equation is a cubic; often one eigenvalue is given or easy to spot.
### Diagonalisation
If $\mathbf M$ has a full set of independent eigenvectors, put them as the columns of $\mathbf P$, and the eigenvalues (in the same order) on the diagonal of $\mathbf D$:
$$\mathbf M=\mathbf{PDP}^{-1}\qquad\mathbf D=\mathbf P^{-1}\mathbf{MP}$$
This makes **powers** easy: $\mathbf M^n=\mathbf{PD}^n\mathbf P^{-1}$, and $\mathbf D^n$ just raises each diagonal entry to the power $n$.
**Symmetric** matrices ($\mathbf M^T=\mathbf M$) have perpendicular eigenvectors. Using unit eigenvectors makes $\mathbf P$ **orthogonal** ($\mathbf P^{-1}=\mathbf P^T$), so $\mathbf M=\mathbf{PDP}^T$.
### The Cayley–Hamilton theorem
**Every square matrix satisfies its own characteristic equation.** For the example above, $\lambda^2-7\lambda+10=0$, so
$$\mathbf M^2-7\mathbf M+10\mathbf I=\mathbf 0$$
Uses: finding higher powers ($\mathbf M^2=7\mathbf M-10\mathbf I$, then multiply by $\mathbf M$ for $\mathbf M^3$), and finding the **inverse** (multiply by $\mathbf M^{-1}$: $\mathbf M-7\mathbf I+10\mathbf M^{-1}=\mathbf 0$, so $\mathbf M^{-1}=\tfrac1{10}(7\mathbf I-\mathbf M)$).
### Watch out
- Keep the eigenvalues in $\mathbf D$ in the same order as their eigenvectors in $\mathbf P$.
- An eigenvector is never the zero vector.`;

N.integ=String.raw`### Reduction formulae
A **reduction formula** expresses an integral $I_n$ (depending on a whole number $n$) in terms of $I_{n-1}$ or $I_{n-2}$. Repeated use reduces $n$ until you reach an integral you can do directly. They are usually derived by **integration by parts**.
> **Worked example.** $I_n=\displaystyle\int_0^1x^ne^x\,dx$. Show $I_n=e-nI_{n-1}$, and find $I_3$.
> Parts with $u=x^n$, $v=e^x$: $I_n=\left[x^ne^x\right]_0^1-n\int_0^1x^{n-1}e^xdx=e-nI_{n-1}$.
> $I_0=e-1$. $I_1=e-(e-1)=1$. $I_2=e-2$. $I_3=e-3(e-2)=6-2e$.
> **Worked example.** $I_n=\displaystyle\int_0^{\pi/2}\sin^nx\,dx$. Writing $\sin^nx=\sin^{n-1}x\sin x$ and integrating by parts (then using $\cos^2x=1-\sin^2x$) gives
> $I_n=\dfrac{n-1}{n}I_{n-2}$. With $I_0=\tfrac\pi2$ and $I_1=1$: $I_4=\tfrac34\cdot\tfrac12\cdot\tfrac\pi2=\tfrac{3\pi}{16}$.
Tip for $\sin^n$, $\cos^n$, $\tan^n$, $\sec^n$: split off one or two factors whose integral or derivative is known, then use a Pythagorean identity to bring back $I_n$ or $I_{n-2}$.
### Arc length
The length of a curve from $x=a$ to $x=b$: a small piece has length $\delta s\approx\sqrt{(\delta x)^2+(\delta y)^2}$, so
$$s=\int_a^b\sqrt{1+\left(\frac{dy}{dx}\right)^2}dx\qquad s=\int_{t_1}^{t_2}\sqrt{\left(\frac{dx}{dt}\right)^2+\left(\frac{dy}{dt}\right)^2}dt$$
> **Worked example.** Length of $y=\cosh x$ from $0$ to $\ln2$. $1+\sinh^2x=\cosh^2x$, so $s=\int_0^{\ln2}\cosh x\,dx=\sinh(\ln2)=\tfrac12\left(2-\tfrac12\right)=\tfrac34$.
### Area of a surface of revolution
Rotating the arc about the $x$-axis through $2\pi$, each small piece $\delta s$ sweeps a band of area $2\pi y\,\delta s$:
$$S=2\pi\int_a^by\sqrt{1+\left(\frac{dy}{dx}\right)^2}dx\qquad S=2\pi\int y\sqrt{\left(\frac{dx}{dt}\right)^2+\left(\frac{dy}{dt}\right)^2}dt$$
About the $y$-axis, replace $y$ by $x$.
> **Worked example.** A sphere: rotate $x=r\cos t$, $y=r\sin t$, $0\le t\le\pi$. $\sqrt{\dot x^2+\dot y^2}=r$, so $S=2\pi\int_0^\pi r\sin t\cdot r\,dt=2\pi r^2[-\cos t]_0^\pi=4\pi r^2$.
### Watch out
- Simplify the square root (often a perfect square appears via an identity) before integrating.
- Evaluate reduction formulae carefully from the base case upwards.`;

window.NOTES2=window.NOTES2||{};
window.NOTES2.fp2=N;
})();
