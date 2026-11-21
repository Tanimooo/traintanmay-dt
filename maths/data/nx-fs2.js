/* Full topic notes for Further Statistics 2 (Edexcel 9FM0). Overrides the short notes in notes.js. */
(function(){
const N={};

N.linreg=String.raw`### Least squares regression
The regression line of $y$ on $x$, $y=a+bx$, is chosen to minimise the sum of the squares of the **residuals** (the vertical distances from the points to the line). The formulae:
$$b=\frac{S_{xy}}{S_{xx}}\qquad a=\bar y-b\bar x$$
where
$$S_{xx}=\sum x^2-\frac{(\sum x)^2}n\qquad S_{xy}=\sum xy-\frac{\sum x\sum y}n$$
The line always passes through $(\bar x,\bar y)$.
> **Worked example.** $n=8$, $\sum x=48$, $\sum y=112$, $\sum x^2=330$, $\sum xy=720$.
> $S_{xx}=330-288=42$, $S_{xy}=720-672=48$. $b=\tfrac{48}{42}=1.143$, $a=14-1.143\times6=7.14$. So $y=7.14+1.14x$.
### Coding
If $x$ and $y$ are coded, find the regression line in the coded variables, then substitute the coding back to get the line in the original variables.
### Residuals
The **residual** for a point is $e_i=y_i-(a+bx_i)$: observed minus predicted. Use residuals to:
- spot **outliers** (an unusually large residual);
- check whether a linear model is suitable: residuals should be randomly scattered about 0 with no pattern. A curved pattern suggests a non-linear model.
The **residual sum of squares** (RSS) measures how well the line fits:
$$\text{RSS}=\sum e_i^2=S_{yy}-\frac{(S_{xy})^2}{S_{xx}}$$
A smaller RSS means a better fit (for the same data set).
### Interpreting and predicting
Interpret $b$ in context (the change in $y$ per unit change in $x$), and predict only within the range of the data (interpolation). Extrapolation is unreliable.
### Watch out
- Use $S_{xy}/S_{xx}$, not $S_{xy}/S_{yy}$, for $y$ on $x$.
- Keep plenty of figures in intermediate values; rounding $b$ early spoils $a$.`;

N.corr=String.raw`### The product moment correlation coefficient
$$r=\frac{S_{xy}}{\sqrt{S_{xx}S_{yy}}}$$
measures the strength of **linear** association, from $-1$ to $1$. It is unchanged by linear coding of $x$ or $y$ (apart from a sign change if multiplied by a negative).
### Testing for correlation (PMCC)
Hypotheses about the population correlation $\rho$:
- $H_0:\rho=0$; $H_1:\rho>0$, $\rho<0$ or $\rho\neq0$.
Compare $|r|$ with the critical value for sample size $n$ from the tables. This test assumes the data come from a **bivariate normal** distribution (the scatter diagram should look roughly elliptical).
### Spearman's rank correlation coefficient
When the data are not bivariate normal, or are given as ranks, or the relationship is non-linear but **monotonic** (always increasing or always decreasing), use Spearman's coefficient:
1. Rank each variable separately (1 = largest or smallest, consistently).
2. Find $d$, the difference in ranks for each item.
3. Calculate
$$r_s=1-\frac{6\sum d^2}{n(n^2-1)}$$
Tied values get the mean of the ranks they would occupy (then strictly use the PMCC of the ranks; the formula is approximate with ties).
> **Worked example.** Two judges rank 6 cakes; $\sum d^2=8$. $r_s=1-\dfrac{48}{6\times35}=1-0.229=0.771$.
### Testing with Spearman's
$H_0:\rho_s=0$ (no association), $H_1:\rho_s>0$ etc. Compare $r_s$ with the critical value from the **Spearman** table for $n$.
> With $n=6$ at 5% one-tailed, the critical value is $0.8286$; $0.771<0.8286$, so there is insufficient evidence of positive agreement between the judges.
### Which to use
- PMCC: data look bivariate normal; testing for a **linear** relationship.
- Spearman: ranked data, data clearly not normal, or a non-linear monotonic relationship.
### Watch out
- Check that $\sum d=0$ as a quick error check.
- Use the right table: PMCC and Spearman critical values differ.`;

N.cont=String.raw`### Continuous random variables
A continuous random variable $X$ can take any value in a range. Its distribution is described by a **probability density function** (pdf) $f(x)$:
- $f(x)\ge0$ for all $x$;
- the total area under the curve is 1: $\displaystyle\int_{-\infty}^\infty f(x)\,dx=1$;
- probabilities are areas: $P(a<X<b)=\displaystyle\int_a^bf(x)\,dx$. So $P(X=a)=0$ and $<$ and $\le$ give the same probability.
Pdfs are often defined piecewise, e.g. $f(x)=kx^2$ for $0\le x\le3$, $0$ otherwise. Find $k$ from total area 1: $9k=1$, $k=\tfrac19$.
### The cumulative distribution function
$$F(x)=P(X\le x)=\int_{-\infty}^xf(t)\,dt\qquad f(x)=F'(x)$$
$F$ rises from 0 to 1. For a piecewise pdf, integrate each piece, making sure $F$ is continuous (each new piece starts where the last finished).
### Mean, variance, median, mode
$$E(X)=\int xf(x)\,dx\qquad E(X^2)=\int x^2f(x)\,dx\qquad\text{Var}(X)=E(X^2)-[E(X)]^2$$
- **Median** $m$: $F(m)=0.5$. **Quartiles**: $F(q)=0.25$, $0.75$. Percentiles similarly.
- **Mode**: the value where $f(x)$ is greatest (differentiate, or read from a sketch: it may be at an end point).
{{svg1}}
> **Worked example.** $f(x)=\tfrac38x^2$, $0\le x\le2$.
> $E(X)=\int_0^2\tfrac38x^3dx=\tfrac38\cdot4=1.5$. $E(X^2)=\int_0^2\tfrac38x^4dx=\tfrac38\cdot\tfrac{32}5=2.4$. $\text{Var}=2.4-2.25=0.15$.
> $F(x)=\tfrac18x^3$; median: $\tfrac18m^3=\tfrac12$, $m=\sqrt[3]4=1.587$. Mode $=2$.
**Skewness**: compare mean, median and mode. Here mode > median > mean: negative skew.
### The continuous uniform (rectangular) distribution
$X\sim U[a,b]$ has constant density $f(x)=\dfrac1{b-a}$ on $[a,b]$.
$$E(X)=\frac{a+b}2\qquad\text{Var}(X)=\frac{(b-a)^2}{12}$$
Used for rounding errors, or arrival times known only to lie in an interval.
### Functions of $X$
$E(g(X))=\int g(x)f(x)\,dx$, and $E(aX+b)=aE(X)+b$, $\text{Var}(aX+b)=a^2\text{Var}(X)$ as for discrete variables.
### Watch out
- Integrate over the whole range where $f(x)\neq0$, splitting at the boundaries of each piece.
- A pdf's value can exceed 1; only the total area must be 1.`;

N.combo=String.raw`### Expectation and variance of combinations
For any random variables $X$ and $Y$:
$$E(aX\pm bY)=aE(X)\pm bE(Y)$$
If $X$ and $Y$ are **independent**:
$$\text{Var}(aX\pm bY)=a^2\text{Var}(X)+b^2\text{Var}(Y)$$
Note the **plus** sign for differences too: subtracting a random quantity adds uncertainty, it does not remove it.
### Sums of normal variables
If $X\sim N(\mu_1,\sigma_1^2)$ and $Y\sim N(\mu_2,\sigma_2^2)$ are independent, then any linear combination is also normal:
$$aX\pm bY\sim N\left(a\mu_1\pm b\mu_2,\ a^2\sigma_1^2+b^2\sigma_2^2\right)$$
### $2X$ versus $X_1+X_2$
Be careful to distinguish:
- $X_1+X_2$: the sum of **two independent observations** (e.g. the total mass of two different apples). Variance $=\sigma^2+\sigma^2=2\sigma^2$.
- $2X$: **twice one observation** (e.g. a recipe using double the mass of one apple). Variance $=4\sigma^2$.
In general, $\sum_{i=1}^nX_i\sim N(n\mu,n\sigma^2)$ but $nX\sim N(n\mu,n^2\sigma^2)$.
> **Worked example.** Apples have masses $A\sim N(150,100)$; pears $P\sim N(180,144)$. Find the probability that 3 apples weigh more than 2 pears.
> Let $D=A_1+A_2+A_3-(P_1+P_2)$. $E(D)=450-360=90$. $\text{Var}(D)=3(100)+2(144)=588$.
> $P(D>0)=P\left(Z>\dfrac{-90}{\sqrt{588}}\right)=P(Z>-3.71)\approx0.9999$.
> **Worked example.** Find $P(A>0.8P)$. $D=A-0.8P$: mean $150-144=6$, variance $100+0.64\times144=192.16$. $P(D>0)=P(Z>-0.433)=0.667$.
"Greater than" questions become "difference greater than 0".
### Watch out
- Variances add, standard deviations do not: square the s.d.s first.
- Multiply variances by the **square** of the coefficient.`;

N.estim=String.raw`### Estimators and bias
A **statistic** is any quantity calculated from a sample (like $\bar X$). When used to estimate a population parameter $\theta$, it is an **estimator** $\hat\theta$. It is **unbiased** if its expected value equals the parameter: $E(\hat\theta)=\theta$. The **bias** is $E(\hat\theta)-\theta$.
- The sample mean $\bar X$ is an unbiased estimator of $\mu$.
- An unbiased estimator of $\sigma^2$ is
$$S^2=\frac{1}{n-1}\sum(x_i-\bar x)^2=\frac{S_{xx}}{n-1}$$
Dividing by $n$ would underestimate $\sigma^2$ (the data are measured from their own mean, which is closer to them than $\mu$ is). Dividing by $n-1$ corrects this.
When comparing estimators, prefer one that is unbiased and has the **smaller variance** (more consistent).
### Standard error
The standard deviation of $\bar X$ is $\dfrac\sigma{\sqrt n}$, the **standard error** of the mean. It is estimated by $\dfrac{s}{\sqrt n}$.
### Confidence intervals for the mean (known $\sigma$)
A **confidence interval** is a range likely to contain the true parameter. For a normal population with known $\sigma$ (or large $n$ via the CLT):
$$\bar x\pm z\frac{\sigma}{\sqrt n}$$
where $z=1.96$ for 95%, $2.5758$ for 99%, $1.6449$ for 90%.
Interpretation: if many samples were taken and an interval found from each, 95% of the intervals would contain $\mu$. (It is **not** that $\mu$ has a 95% chance of being in this particular interval: $\mu$ is fixed.)
> **Worked example.** A sample of 25 has $\bar x=40.2$; $\sigma=3$. 95% CI: $40.2\pm1.96\times\tfrac35=40.2\pm1.176=(39.0,\ 41.4)$.
The width is $2z\dfrac{\sigma}{\sqrt n}$: to halve the width, quadruple $n$.
### Hypothesis tests for the mean (normal)
Under $H_0:\mu=\mu_0$, $Z=\dfrac{\bar X-\mu_0}{\sigma/\sqrt n}\sim N(0,1)$. Compare with the critical $z$-value. For large samples with unknown $\sigma$, use $s$ in place of $\sigma$ (CLT).
### Difference between two means
For independent samples from populations with known variances:
$$\bar X-\bar Y\sim N\left(\mu_x-\mu_y,\ \frac{\sigma_x^2}{n_x}+\frac{\sigma_y^2}{n_y}\right)$$
Test $H_0:\mu_x=\mu_y$ (or $\mu_x-\mu_y=k$) using $Z=\dfrac{(\bar x-\bar y)-k}{\sqrt{\frac{\sigma_x^2}{n_x}+\frac{\sigma_y^2}{n_y}}}$.
### Watch out
- Use $n-1$ for an unbiased variance estimate.
- State conclusions about $\mu$, in context.`;

N.furtherhyp=String.raw`### Tests and intervals for a variance: the $\chi^2$ distribution
If a sample of size $n$ comes from a **normal** population with variance $\sigma^2$, then
$$\frac{(n-1)S^2}{\sigma^2}\sim\chi^2_{n-1}$$
This is used to test claims about $\sigma^2$ and to build confidence intervals for it.
**Confidence interval for $\sigma^2$**: using the lower and upper percentage points of $\chi^2_{n-1}$:
$$\left(\frac{(n-1)s^2}{\chi^2_{\text{upper}}},\ \frac{(n-1)s^2}{\chi^2_{\text{lower}}}\right)$$
(Note the upper point gives the lower limit.)
> **Worked example.** $n=10$, $s^2=4.2$. 95% CI: $\chi^2_9$ points $2.700$ and $19.023$. Interval $\left(\tfrac{37.8}{19.023},\tfrac{37.8}{2.700}\right)=(1.99,\ 14.0)$.
**Test**: $H_0:\sigma^2=\sigma_0^2$. Compute $\dfrac{(n-1)s^2}{\sigma_0^2}$ and compare with $\chi^2_{n-1}$ critical values (lower tail for $H_1:\sigma^2<\sigma_0^2$, upper for $>$).
### Comparing two variances: the $F$-distribution
For independent samples from two **normal** populations:
$$F=\frac{S_1^2/\sigma_1^2}{S_2^2/\sigma_2^2}\sim F_{n_1-1,\ n_2-1}$$
Under $H_0:\sigma_1^2=\sigma_2^2$, the test statistic is $\dfrac{s_1^2}{s_2^2}$. Put the **larger** variance on top, so you only need upper critical values; degrees of freedom $(n_1-1,n_2-1)$ in that order. For a two-tailed test at 10%, use the 5% table.
Lower critical values, if needed: $F_{a,b}(\text{lower }p)=\dfrac1{F_{b,a}(\text{upper }p)}$.
> **Worked example.** $s_1^2=12.5$ ($n_1=8$), $s_2^2=4.1$ ($n_2=10$). Test $H_1:\sigma_1^2>\sigma_2^2$ at 5%.
> $F=\tfrac{12.5}{4.1}=3.05$. Critical $F_{7,9}(5\%)=3.293$. $3.05<3.293$: do not reject $H_0$.
### Assumptions
These tests need the populations to be **normal** (and samples independent and random). An $F$-test for equal variances is often done first to justify pooling in a two-sample $t$-test.
### Watch out
- Degrees of freedom are $n-1$, not $n$.
- Use the $\chi^2$ and $F$ tables carefully: check which tail and which order of degrees of freedom.`;

N.tdist=String.raw`### When to use the $t$-distribution
If the population is **normal** but its variance is **unknown** and the sample is **small**, replacing $\sigma$ by the sample estimate $s$ adds extra uncertainty. Then
$$T=\frac{\bar X-\mu}{S/\sqrt n}\sim t_{n-1}$$
The $t$-distribution is symmetrical and bell-shaped like $N(0,1)$, but with heavier tails; as $n$ grows it approaches the normal. Its critical values come from tables with $\nu=n-1$ degrees of freedom.
### Confidence interval for a mean
$$\bar x\pm t_{n-1}\frac{s}{\sqrt n}$$
> **Worked example.** A sample of 9 has $\bar x=24.6$ and $s=2.1$. 95% CI: $t_8(2.5\%)=2.306$. Interval $24.6\pm2.306\times\tfrac{2.1}3=24.6\pm1.61=(23.0,\ 26.2)$.
### Hypothesis test for a mean
$H_0:\mu=\mu_0$. Test statistic $t=\dfrac{\bar x-\mu_0}{s/\sqrt n}$, compared with $t_{n-1}$ critical values.
### Paired $t$-test
When two measurements are taken on the **same** subjects (before and after, left and right), use the **differences** $d$ as a single sample and test $H_0:\mu_d=0$:
$$t=\frac{\bar d}{s_d/\sqrt n}$$
Pairing removes variation between subjects, making the test more sensitive. Assumes the differences are normally distributed.
### Two-sample $t$-test
For two **independent** samples from normal populations with **equal** (unknown) variances, use the **pooled** estimate
$$s_p^2=\frac{(n_x-1)s_x^2+(n_y-1)s_y^2}{n_x+n_y-2}$$
and
$$t=\frac{(\bar x-\bar y)-(\mu_x-\mu_y)}{s_p\sqrt{\frac1{n_x}+\frac1{n_y}}}\sim t_{n_x+n_y-2}$$
Check the equal-variance assumption with an $F$-test first if asked. A confidence interval for $\mu_x-\mu_y$ is $(\bar x-\bar y)\pm t\,s_p\sqrt{\frac1{n_x}+\frac1{n_y}}$.
### Which test?
- Known $\sigma$, or large sample: $z$ (normal).
- Unknown $\sigma$, small sample, normal population: $t$.
- Same subjects measured twice: paired $t$.
- Two separate groups: two-sample $t$ (with pooled variance).
### Watch out
- Degrees of freedom: $n-1$ for one sample or paired; $n_x+n_y-2$ for two samples.
- State the normality (and equal variance) assumptions.`;

window.NOTES2=window.NOTES2||{};
window.NOTES2.fs2=N;
})();
