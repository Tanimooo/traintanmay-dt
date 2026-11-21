/* Full topic notes for Further Statistics 1 (Edexcel 8FM0/9FM0). Overrides the short notes in notes.js. */
(function(){
const N={};

N.drv=String.raw`### Discrete random variables (recap)
A discrete random variable $X$ has a probability distribution: a list of values $x$ and probabilities $P(X=x)$ that sum to 1.
### Expected value
The **expected value** (mean) is the long-run average value:
$$E(X)=\mu=\sum xP(X=x)$$
More generally, for any function $g$:
$$E(g(X))=\sum g(x)P(X=x)$$
so $E(X^2)=\sum x^2P(X=x)$. Note $E(X^2)\neq[E(X)]^2$ in general.
### Variance
The variance measures spread about the mean:
$$\text{Var}(X)=E\left[(X-\mu)^2\right]=E(X^2)-[E(X)]^2$$
The second form ("mean of the squares minus the square of the mean") is the one to use. The standard deviation is $\sqrt{\text{Var}(X)}$.
> **Worked example.** $X$ takes values 1, 2, 3 with probabilities 0.2, 0.5, 0.3.
> $E(X)=0.2+1+0.9=2.1$. $E(X^2)=0.2+2+2.7=4.9$. $\text{Var}(X)=4.9-4.41=0.49$.
### Functions of a random variable
For constants $a$ and $b$:
$$E(aX+b)=aE(X)+b\qquad\text{Var}(aX+b)=a^2\text{Var}(X)$$
Adding a constant shifts the mean but does not change the spread; multiplying by $a$ scales the variance by $a^2$ (the standard deviation by $|a|$).
> **Worked example.** Using $X$ above, $Y=5-2X$: $E(Y)=5-4.2=0.8$, $\text{Var}(Y)=4\times0.49=1.96$.
### Using these in context
Questions often model winnings in a game: find $E(\text{profit})$ to decide whether a game is fair (expected profit 0) or how much to charge to make a profit. They may also give a distribution with unknowns, using $\sum P=1$ and a given $E(X)$ to find them.
### Watch out
- $\text{Var}(aX+b)$ has $a^2$, and the $+b$ disappears.
- $\text{Var}(X)$ can never be negative: if it is, there is an arithmetic error.`;

N.poisson=String.raw`### The Poisson distribution
$X\sim\text{Po}(\lambda)$ models the **number of events in a fixed interval** (of time, space, area, volume) when events occur:
1. **singly** (no two at exactly the same time/place),
2. **independently** of each other,
3. at a **constant average rate** (uniformly in time or space).
Then
$$P(X=x)=\frac{e^{-\lambda}\lambda^x}{x!},\qquad x=0,1,2,\dots$$
where $\lambda$ is the mean number of events in the interval. There is no upper limit on $x$.
{{svg1}}
### Mean and variance
$$E(X)=\lambda\qquad\text{Var}(X)=\lambda$$
Mean equal to variance is a quick check that a Poisson model may suit some data.
### Changing the interval
If the rate is $\lambda$ per unit, then over $t$ units the number follows $\text{Po}(\lambda t)$. E.g. 3 calls per hour gives $\text{Po}(1.5)$ for 30 minutes.
### Calculating probabilities
Use the formula, the calculator's Poisson functions, or cumulative tables ($P(X\le x)$), converting as for the binomial:
- $P(X\ge3)=1-P(X\le2)$
- $P(2<X\le6)=P(X\le6)-P(X\le2)$
> **Worked example.** A website gets on average 4 enquiries per hour. Find the probability of (a) exactly 2 in an hour, (b) at least 10 in two hours.
> (a) $\text{Po}(4)$: $\dfrac{e^{-4}4^2}{2!}=0.1465$.
> (b) $\text{Po}(8)$: $1-P(X\le9)=1-0.7166=0.2834$.
### Sums of Poisson variables
If $X\sim\text{Po}(\lambda)$ and $Y\sim\text{Po}(\mu)$ are **independent**, then
$$X+Y\sim\text{Po}(\lambda+\mu)$$
E.g. cars ($\text{Po}(3)$ per minute) and vans ($\text{Po}(1)$) together: $\text{Po}(4)$.
### Poisson approximation to the binomial
If $X\sim B(n,p)$ with $n$ **large** and $p$ **small** (rare events), then
$$X\approx\text{Po}(np)$$
(Rule of thumb: $n>50$, $np<5$.) Both have mean $np$, and the binomial variance $np(1-p)\approx np$ when $p$ is small.
> **Worked example.** 1% of components are faulty; in a batch of 200, $X\sim B(200,0.01)\approx\text{Po}(2)$. $P(X\le1)\approx e^{-2}(1+2)=0.406$.
### Watch out
- Scale $\lambda$ to the interval in the question before calculating.
- When asked to "state assumptions", give the three conditions in context ("calls arrive independently...").`;

N.geomnb=String.raw`### The geometric distribution
Repeat independent trials, each with probability $p$ of success, **until the first success**. If $X$ is the number of trials needed, $X\sim\text{Geo}(p)$:
$$P(X=x)=(1-p)^{x-1}p,\qquad x=1,2,3,\dots$$
($x-1$ failures then a success.)
$$P(X>x)=(1-p)^x\qquad P(X\le x)=1-(1-p)^x$$
($X>x$ means the first $x$ trials all failed.)
$$E(X)=\frac1p\qquad\text{Var}(X)=\frac{1-p}{p^2}$$
The mean makes sense: if a success has probability $\tfrac16$, you expect to wait 6 trials.
> **Worked example.** Rolling a die until a six: $P(X=4)=\left(\tfrac56\right)^3\tfrac16=0.0965$; $P(X>10)=\left(\tfrac56\right)^{10}=0.1615$.
The geometric distribution is **memoryless**: having already failed $k$ times does not change the distribution of the further number of trials needed.
### The negative binomial distribution
Now count the number of trials $X$ until the **$r$th success**: $X\sim\text{NB}(r,p)$:
$$P(X=x)=\binom{x-1}{r-1}p^r(1-p)^{x-r},\qquad x=r,r+1,\dots$$
**Why**: the $x$th trial must be a success, and the first $x-1$ trials must contain exactly $r-1$ successes, in any of $\binom{x-1}{r-1}$ arrangements.
$$E(X)=\frac rp\qquad\text{Var}(X)=\frac{r(1-p)}{p^2}$$
(It is the sum of $r$ independent geometric variables, which explains these.) The geometric is the special case $r=1$.
> **Worked example.** A basketball player scores 70% of free throws. Find the probability her 3rd score is on her 5th throw.
> $\binom42(0.7)^3(0.3)^2=6\times0.343\times0.09=0.185$.
### Conditions
Both need: independent trials, two outcomes, constant probability $p$. The difference from the binomial: the binomial fixes the number of trials and counts successes; these fix the number of successes and count trials.
### Watch out
- Check whether $X$ counts trials (as here) or failures; Edexcel counts trials.
- For $P(X\ge x)$ in the geometric, use $(1-p)^{x-1}$.`;

N.hyp=String.raw`### Hypothesis tests for Poisson and geometric parameters
The method is the same as the binomial test in A level Maths:
1. Define $X$ and state its distribution under $H_0$.
2. Write $H_0$ and $H_1$ about the parameter ($\lambda$ for Poisson, $p$ for geometric).
3. Find the probability of the observed value or more extreme, or find the critical region.
4. Compare with the significance level and conclude in context.
### Poisson tests
> **Worked example.** A shop sells on average 5 umbrellas a day. After an advert, it sells 10 in one day. Test at 5% whether sales have increased.
> $X\sim\text{Po}(5)$. $H_0:\lambda=5$, $H_1:\lambda>5$.
> $P(X\ge10)=1-P(X\le9)=1-0.9682=0.0318<0.05$.
> Reject $H_0$: there is evidence the mean daily sales have increased.
Scale $\lambda$ to the period of observation: if the claim is 2 per hour and you observe for 4 hours, use $\text{Po}(8)$.
### Geometric tests
The test statistic is the number of trials until the first success. A **small** value suggests $p$ is **larger** than claimed; a **large** value suggests $p$ is smaller.
> **Worked example.** A machine is claimed to make a defective item with probability 0.1. The first defective is the 2nd item. Test at 5% whether $p>0.1$.
> $X\sim\text{Geo}(0.1)$, $H_0:p=0.1$, $H_1:p>0.1$. $P(X\le2)=1-0.9^2=0.19>0.05$. Do not reject $H_0$.
### Critical regions
Find the values at the extreme end whose total probability is as close as possible to (without exceeding) the significance level. For two-tailed tests, split the level between the tails. The **actual significance level** is the probability of the critical region.
### Watch out
- Hypotheses are about $\lambda$ or $p$, never about $X$.
- For a two-tailed test, compare each tail with half the significance level.`;

N.clt=String.raw`### The distribution of the sample mean
Take a random sample $X_1,X_2,\dots,X_n$ from a population with mean $\mu$ and variance $\sigma^2$. The **sample mean** $\bar X=\dfrac{X_1+\dots+X_n}n$ is itself a random variable (it varies from sample to sample), with
$$E(\bar X)=\mu\qquad\text{Var}(\bar X)=\frac{\sigma^2}n$$
Bigger samples give sample means that vary less. The standard deviation $\dfrac\sigma{\sqrt n}$ is called the **standard error**.
### The central limit theorem
**If $n$ is large, $\bar X$ is approximately normally distributed, whatever the distribution of the population:**
$$\bar X\approx N\left(\mu,\frac{\sigma^2}n\right)$$
(If the population is itself normal, this is exact for any $n$.) "Large" usually means $n\ge30$ or so. This is why the normal distribution appears so often: many quantities are averages or sums of many small effects.
Equivalently, the sum $\sum X_i\approx N(n\mu,n\sigma^2)$.
> **Worked example.** The number of emails a person receives per hour has mean 6 and variance 6 (Poisson). Over 40 hours, find the probability the mean per hour exceeds 6.5.
> $\bar X\approx N\left(6,\tfrac6{40}\right)=N(6,0.15)$. $P(\bar X>6.5)=P\left(Z>\tfrac{0.5}{0.387}\right)=P(Z>1.29)=0.098$.
### Applying the CLT to discrete distributions
For a Poisson, binomial or geometric population, use its mean and variance in the formula. (A continuity correction is not usually required for the mean unless stated.)
### Watch out
- Divide the **variance** by $n$, not the standard deviation.
- Say "approximately" normal, and mention that $n$ is large.`;

N.chi=String.raw`### The idea
A $\chi^2$ (chi-squared) test checks whether **observed** frequencies $O_i$ fit the frequencies $E_i$ **expected** under a hypothesis. The test statistic
$$X^2=\sum\frac{(O_i-E_i)^2}{E_i}$$
is small when the fit is good and large when it is poor. Under $H_0$ it approximately follows a $\chi^2_\nu$ distribution with $\nu$ **degrees of freedom**; reject $H_0$ if $X^2$ exceeds the critical value from tables.
Each expected frequency must be **at least 5**: if not, **combine** adjacent classes (which reduces the degrees of freedom).
### Goodness of fit
$H_0$: the data fit the given distribution (uniform, binomial, Poisson, geometric...). $H_1$: they do not.
Degrees of freedom $\nu=$ (number of classes after combining) $-1$ $-$ (number of parameters **estimated from the data**).
> **Worked example.** A die is rolled 120 times: 15, 25, 18, 22, 14, 26. Test at 5% whether it is fair.
> $E_i=20$. $X^2=\tfrac{25+25+4+4+36+36}{20}=6.5$.
> $\nu=6-1=5$; critical value $11.070$. $6.5<11.070$: do not reject $H_0$. No evidence the die is biased.
If you estimate $\lambda$ for a Poisson model from the sample mean, subtract one more degree of freedom.
### Contingency tables (independence)
To test whether two factors are **independent**, use an $r\times c$ table of observed frequencies.
- $H_0$: the two factors are independent. $H_1$: they are not.
- Expected frequency for each cell: $E=\dfrac{\text{row total}\times\text{column total}}{\text{grand total}}$.
- Degrees of freedom: $\nu=(r-1)(c-1)$.
> **Worked example.** In a $2\times3$ table with $X^2=7.2$: $\nu=2$, 5% critical value $5.991$. $7.2>5.991$: reject $H_0$; there is evidence of an association.
When concluding, look at which cells contribute most to $X^2$ and comment in context (e.g. "more younger people than expected preferred online shopping").
### Watch out
- Combine classes before counting degrees of freedom.
- Expected frequencies need not be whole numbers; do not round them.`;

N.pgf=String.raw`### Probability generating functions
For a discrete random variable $X$ taking values $0,1,2,\dots$, the **probability generating function** is
$$G_X(t)=E(t^X)=\sum P(X=x)t^x$$
The coefficient of $t^x$ is $P(X=x)$, so the pgf "stores" the whole distribution as a power series.
$$G_X(1)=\sum P(X=x)=1$$
### Standard pgfs
- Binomial $B(n,p)$: $G(t)=(1-p+pt)^n$.
- Poisson $\text{Po}(\lambda)$: $G(t)=e^{\lambda(t-1)}$.
- Geometric $\text{Geo}(p)$: $G(t)=\dfrac{pt}{1-(1-p)t}$.
- Negative binomial: $G(t)=\left(\dfrac{pt}{1-(1-p)t}\right)^r$.
> **Worked example: Poisson.** $G(t)=\sum\dfrac{e^{-\lambda}\lambda^x}{x!}t^x=e^{-\lambda}\sum\dfrac{(\lambda t)^x}{x!}=e^{-\lambda}e^{\lambda t}=e^{\lambda(t-1)}$.
### Mean and variance from the pgf
Differentiate: $G'(t)=\sum xP(X=x)t^{x-1}$ and $G''(t)=\sum x(x-1)P(X=x)t^{x-2}$. Put $t=1$:
$$E(X)=G'(1)\qquad\text{Var}(X)=G''(1)+G'(1)-[G'(1)]^2$$
> **Worked example.** Poisson: $G'(t)=\lambda e^{\lambda(t-1)}$, $G''(t)=\lambda^2e^{\lambda(t-1)}$. $E(X)=\lambda$, $\text{Var}(X)=\lambda^2+\lambda-\lambda^2=\lambda$.
### Sums of independent variables
If $X$ and $Y$ are independent, then
$$G_{X+Y}(t)=G_X(t)\times G_Y(t)$$
This proves, for example, that the sum of independent Poissons is Poisson: $e^{\lambda(t-1)}e^{\mu(t-1)}=e^{(\lambda+\mu)(t-1)}$.
### Functions of a variable
For $Y=aX+b$: $G_Y(t)=E(t^{aX+b})=t^bG_X(t^a)$.
### Watch out
- Simplify before differentiating; use the chain rule carefully.
- The variance formula has $+G'(1)$: do not forget it.`;

N.quality=String.raw`### Type I and Type II errors
A hypothesis test can go wrong in two ways:
- **Type I error**: rejecting $H_0$ when it is actually **true**. $P(\text{Type I})=$ the **actual significance level** (the probability of the critical region when $H_0$ is true).
- **Type II error**: **not** rejecting $H_0$ when it is actually **false**. Its probability depends on the true value of the parameter.
For a continuous distribution, $P(\text{Type I})$ equals the stated significance level; for a discrete one it is the actual significance level, usually smaller.
> **Worked example.** $X\sim B(20,p)$, $H_0:p=0.4$, $H_1:p>0.4$, critical region $X\ge13$.
> $P(\text{Type I})=P(X\ge13\mid p=0.4)=1-0.9790=0.0210$.
> If in fact $p=0.6$: $P(\text{Type II})=P(X\le12\mid p=0.6)=0.5841$.
### The power of a test
$$\text{Power}=1-P(\text{Type II error})=P(\text{reject }H_0\mid H_0\text{ false})$$
It is the probability the test correctly detects that $H_0$ is false. In the example, the power when $p=0.6$ is $0.4159$.
### Power functions
The power depends on the true parameter value. A **power function** gives the power for each possible value, e.g. $P(X\ge13)$ as a function of $p$. Plotting it shows: the power increases as the true value moves further from the $H_0$ value; at the $H_0$ value it equals the Type I probability.
### Comparing tests
A better test has a **higher power** for the same significance level. Ways to increase power:
- a **larger sample size**;
- a **higher significance level** (but this increases the chance of a Type I error: there is a trade-off).
When comparing two tests, consider both their Type I error probabilities and their powers, and any practical cost (e.g. a larger sample costs more).
### Watch out
- Type I is about $H_0$ being **true**; Type II about it being **false**.
- Use the **true** value of the parameter (not the $H_0$ value) to calculate a Type II probability.`;

window.NOTES2=window.NOTES2||{};
window.NOTES2.fs1=N;
})();
