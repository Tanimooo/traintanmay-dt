/* Full topic notes for Statistics (Edexcel 9MA0 Paper 3). Overrides the short notes in notes.js. */
(function(){
const N={};

N.s1_1=String.raw`### Populations and samples
- The **population** is the whole group you want to know about (all students in a school, every bulb made in a factory).
- A **census** measures or observes every member of the population. It is completely accurate but expensive, slow, and impossible if testing destroys the item (testing bulbs until they fail).
- A **sample** is a selection from the population. It is cheaper and quicker with less data to process, but it may not represent the population well (sampling error and bias).
- **Sampling units** are the individual members that can be sampled; a **sampling frame** is the list of all of them (e.g. a register).
Larger samples generally represent the population better, but cost more.
### Random sampling
Every member of the population has an **equal chance** of being selected.
- **Simple random sampling**: number every member of the sampling frame and pick numbers using a random number generator or lottery. Free of bias, but needs a full sampling frame and is impractical for large populations.
- **Systematic sampling**: take every $k$th member from an ordered list, where $k=\dfrac{\text{population size}}{\text{sample size}}$, starting from a random member among the first $k$. Simple and quick, but needs a sampling frame and can be biased if the list has a pattern.
- **Stratified sampling**: split the population into groups (strata, e.g. year groups) and sample from each **in proportion to its size**, then use simple random sampling within each stratum. The sample reflects the population's structure, but needs clear strata and a frame for each.
> **Worked example.** A school has 300 students in Year 12 and 200 in Year 13. A stratified sample of 40: Year 12 gets $\tfrac{300}{500}\times40=24$, Year 13 gets $16$.
### Non-random sampling
- **Quota sampling**: an interviewer selects people to fill quotas for each group (e.g. 20 men and 20 women). Quick, cheap, no sampling frame needed, and the sample represents the groups. But it is not random, so interviewer bias is possible, and non-responses are just replaced (which can bias it).
- **Opportunity (convenience) sampling**: take whoever is available at the time (the first 20 people out of a shop). Easy and cheap, but unlikely to be representative and highly dependent on where and when.
### Types of data
- **Quantitative** data are numbers (height, temperature). **Qualitative** data are descriptions (colour, wind direction words).
- **Continuous** data can take any value in a range (mass, time). **Discrete** data can only take particular values (number of goals, shoe sizes).
- Large continuous data sets are often grouped into **classes**: e.g. $10\le m<20$. The class boundaries are the edges ($10$ and $20$), the class width is $20-10=10$ and the midpoint is $15$. For data given to the nearest whole number, classes "10–19" really have boundaries $9.5$ and $19.5$.
### The large data set
Edexcel's **large data set** is Met Office weather data from **five UK stations** (Camborne, Heathrow, Hurn, Leeming, Leuchars) and **three overseas** (Beijing, Jacksonville, Perth), for **May to October** in **1987 and 2015**. Exam questions assume familiarity, so know:
- The variables: daily mean temperature (°C), total rainfall (mm), total sunshine (hours), mean windspeed (knots) and maximum gust, Beaufort conversion of windspeed, relative humidity (%), cloud cover (oktas), visibility (decametres), pressure (hPa), daily mean wind direction (UK only).
- **"tr"** means trace rainfall: less than 0.05 mm (treat as 0 in calculations). **"n/a"** means not available: the data are missing; remove them.
- Southern hemisphere Perth is in winter from May to October, so it is colder and wetter than you might expect.
- Leuchars and Leeming are further north, so they are generally cooler.
Questions may ask you to criticise a sampling method on the data set (e.g. why using only one station or one month is not representative), or to say whether a claim is supported.
### Watch out
- When asked to describe how to take a sample, give enough detail: number the items, how you generate random numbers, what you do with repeats.
- Quote advantages and disadvantages that fit the specific context.`;

N.s1_2=String.raw`### Measures of central tendency (averages)
- **Mean**: $\bar x=\dfrac{\sum x}{n}$, or for a frequency table $\bar x=\dfrac{\sum fx}{\sum f}$. It uses every value, but is affected by extreme values (outliers).
- **Median**: the middle value when the data are in order (position $\tfrac{n+1}2$ for a list). Not affected by outliers, so better for skewed data.
- **Mode**: the most common value (or **modal class** for grouped data). The only average for qualitative data; there may be more than one.
For **grouped** data, use the class midpoints as $x$ in $\dfrac{\sum fx}{\sum f}$: this gives an **estimate** of the mean (you do not know the exact values).
### Other measures of location: quartiles and percentiles
- **Lower quartile** $Q_1$: 25% of the data lie below it. **Upper quartile** $Q_3$: 75% lie below it. The median is $Q_2$.
- For a list of $n$ discrete values (Edexcel's method): $Q_1$ is at position $\tfrac n4$: if it is a whole number, average that value and the next; if not, round up. Similarly $Q_3$ at $\tfrac{3n}4$ and the median at $\tfrac n2$.
- **Percentiles** split the data into 100 parts; the 10th percentile has 10% of the data below it.
### Interpolation for grouped data
For grouped continuous data, assume the values are spread evenly across each class and use **linear interpolation**.
> **Worked example.** Find the median of 60 times grouped as: $0\le t<10$: 8, $10\le t<20$: 17, $20\le t<30$: 22, $30\le t<40$: 13.
> The median is the $30$th value ($\tfrac{60}2$). Cumulative frequencies: 8, 25, 47, 60. So it is in $20\le t<30$, the $5$th of $22$ values there.
> Median $=20+\dfrac{5}{22}\times10=22.3$.
### Measures of spread
- **Range** = largest $-$ smallest. Easy, but uses only two values, so affected by outliers.
- **Interquartile range (IQR)** $=Q_3-Q_1$: the spread of the middle 50%. Not affected by outliers. Use with the median.
- **Interpercentile range**, e.g. the 10th to 90th percentile.
### Variance and standard deviation
These measure the spread **about the mean**, using every value. Use them with the mean.
$$\sigma^2=\frac{\sum(x-\bar x)^2}{n}=\frac{\sum x^2}{n}-\bar x^2\qquad\sigma=\sqrt{\sigma^2}$$
The first form is "the mean of the squared distances from the mean". The second is easier to compute: "the mean of the squares minus the square of the mean". With frequencies, $\sigma^2=\dfrac{\sum fx^2}{\sum f}-\bar x^2$. The notation $S_{xx}=\sum(x-\bar x)^2=\sum x^2-\dfrac{(\sum x)^2}{n}$ is also used, so $\sigma^2=\dfrac{S_{xx}}n$.
> **Worked example.** For $n=10$, $\sum x=52$ and $\sum x^2=310$: $\bar x=5.2$, $\sigma^2=31-27.04=3.96$, $\sigma=1.99$.
The **standard deviation** has the same units as the data. Roughly, for many data sets, most values lie within 2 standard deviations of the mean.
### Coding
Coding transforms data to make calculations easier: $y=\dfrac{x-a}{b}$.
- The mean is coded the same way: $\bar y=\dfrac{\bar x-a}{b}$, so $\bar x=a+b\bar y$.
- Adding or subtracting $a$ does **not** change the spread; dividing by $b$ divides it: $\sigma_y=\dfrac{\sigma_x}{b}$, so $\sigma_x=b\sigma_y$.
> **Worked example.** Data are coded with $y=\dfrac{x-100}{5}$, giving $\bar y=2.4$ and $\sigma_y=1.5$. Then $\bar x=100+5(2.4)=112$ and $\sigma_x=5\times1.5=7.5$.
### Watch out
- With grouped data, all values (mean, median, s.d.) are **estimates**.
- Give the standard deviation, not the variance, when comparing spreads (the units match the data).`;

N.s1_3=String.raw`### Outliers
An **outlier** is a value that is very different from the rest of the data. It might be an error (and should be removed) or a genuine extreme value (keep it, but note it). Two common rules (the question will say which):
- Outside $Q_1-k(Q_3-Q_1)$ or $Q_3+k(Q_3-Q_1)$, usually $k=1.5$: more than $1.5\times$IQR beyond the quartiles.
- More than $2$ (or $3$) standard deviations from the mean: outside $\bar x\pm2\sigma$.
**Cleaning data** means removing errors, outliers that are mistakes, and missing values (n/a) before analysis.
> **Worked example.** $Q_1=12$, $Q_3=20$, IQR $=8$. Fences: $12-12=0$ and $20+12=32$. A value of 35 is an outlier.
### Box plots
{{svg1}}
A box plot shows: the lowest value that is not an outlier, $Q_1$, the median, $Q_3$, the highest value that is not an outlier, and any outliers marked as crosses. The whiskers stop at the most extreme values that are **not** outliers.
Two box plots on the same scale are a quick way to **compare** distributions: compare the medians (location) and the IQRs (spread).
### Cumulative frequency
A **cumulative frequency** graph plots the running total of the frequency against the **upper class boundary**. Join the points with a smooth curve (or straight lines). Read off:
- the median at $\tfrac n2$ on the cumulative frequency axis, quartiles at $\tfrac n4$ and $\tfrac{3n}4$;
- percentiles; how many values are above or below a given value.
### Histograms
Histograms show grouped **continuous** data. The **area** of each bar is proportional to the frequency, not the height, so unequal class widths are drawn fairly:
$$\text{frequency density}=\frac{\text{frequency}}{\text{class width}}$$
(More generally, area $=k\times$ frequency; if the question gives a scale, find $k$ from one bar first.)
> **Worked example.** A class $10\le x<15$ with frequency 30 has frequency density $\tfrac{30}{5}=6$.
> **Worked example.** On a histogram, a bar of width 2 cm and height 5 cm represents a frequency of 20. Area $=10$ cm$^2$ for 20 people, so $1$ cm$^2$ = 2 people. A bar of width 3 cm and height 4 cm then represents $24$ people.
To estimate how many values lie in part of a class, assume they are spread evenly: use the fraction of the bar's width (interpolation). A **frequency polygon** joins the midpoints of the tops of the bars.
### Comparing data
Compare **one measure of location and one measure of spread**, and **interpret in context**.
- Use the **median and IQR** if there are outliers or the data are skewed; use the **mean and standard deviation** otherwise.
- Example: "The median daily rainfall at Camborne (2.4 mm) was higher than at Heathrow (1.1 mm), so it was generally wetter. The IQR at Camborne was also larger, so rainfall was more variable."
### Skewness
- **Symmetrical**: mean $\approx$ median $\approx$ mode; box plot with median in the centre.
- **Positive skew** (tail to the right): mean > median > mode; $Q_3-Q_2>Q_2-Q_1$.
- **Negative skew** (tail to the left): mean < median < mode.
### Watch out
- Histogram axes are labelled "frequency density", not frequency.
- Always finish a comparison with a statement in context, not just numbers.`;

N.s1_4=String.raw`### Bivariate data and scatter diagrams
**Bivariate** data are pairs of values for two variables (e.g. temperature and ice cream sales on each day). Plot them on a **scatter diagram**. The **explanatory (independent) variable**, the one you think causes or predicts the other, goes on the $x$-axis; the **response (dependent) variable** goes on the $y$-axis.
### Correlation
**Correlation** describes how closely the points follow a straight line:
- **Positive** correlation: as one increases, the other tends to increase.
- **Negative** correlation: as one increases, the other tends to decrease.
- **No (zero)** correlation: no linear relationship.
Strength depends on how tightly the points cluster about a line.
**Correlation does not imply causation.** Ice cream sales and drownings are positively correlated, but neither causes the other: both increase in hot weather (a confounding variable). Only say one causes the other if it makes sense in context.
The **product moment correlation coefficient** $r$ (Year 2) measures strength: $r=1$ perfect positive, $r=-1$ perfect negative, $r=0$ no linear correlation.
### Linear regression
The **regression line of $y$ on $x$** is the line of best fit $y=a+bx$ that minimises the sum of the squares of the vertical distances from the points to the line (least squares). Your calculator finds $a$ and $b$.
- **$b$, the gradient**: the change in $y$ for each one-unit increase in $x$. Interpret in context: "for every extra 1 °C, sales increase by about 12 cones."
- **$a$, the intercept**: the value of $y$ when $x=0$. Only interpret it if $x=0$ makes sense.
### Using the regression line to predict
- Predict $y$ from a given $x$ by substituting into the equation.
- **Interpolation** (predicting within the range of the data) is reliable if the correlation is strong.
- **Extrapolation** (outside the range of the data) is **unreliable**: the relationship may not continue.
- Only use the regression line of $y$ on $x$ to predict $y$ from $x$, not the other way round.
> **Worked example.** The regression line of fuel used $f$ (litres) on distance $d$ (km) is $f=1.2+0.065d$, from data with $50\le d\le400$.
> $b=0.065$: each extra km uses about 0.065 litres. Predict for 200 km: $f=1.2+13=14.2$ litres (reliable: interpolation). For 900 km it would be extrapolation, so unreliable.
### Watch out
- Describe correlation in context: "positive correlation: days with higher temperatures tend to have more sunshine."
- Do not read the gradient as "$y$ increases by $b$" without units and context.`;

N.s1_5=String.raw`### Calculating probabilities
The **probability** of an event is a number from 0 (impossible) to 1 (certain). If all outcomes are equally likely,
$$P(A)=\frac{\text{number of outcomes in }A}{\text{total number of outcomes}}$$
The **sample space** is the set of all possible outcomes; listing it in a table (e.g. for two dice) helps. The **complement** $A'$ ("not $A$") has $P(A')=1-P(A)$.
Experimental probability (relative frequency) $=\dfrac{\text{number of times it happens}}{\text{number of trials}}$.
### Venn diagrams
A Venn diagram shows events as circles inside a rectangle (the whole sample space). The overlap is "$A$ and $B$" ($A\cap B$); everything in either circle is "$A$ or $B$" ($A\cup B$).
Fill a Venn diagram **from the middle outwards**: put the overlap in first, then the rest of each circle, then the outside. All the numbers or probabilities add to the total (or 1).
The **addition rule**: $P(A\cup B)=P(A)+P(B)-P(A\cap B)$ (the overlap would be counted twice).
> **Worked example.** In a class of 30, 18 study French, 12 study Spanish and 5 study both. Venn: both = 5, French only = 13, Spanish only = 7, neither = 5. $P(\text{French or Spanish})=\tfrac{25}{30}=\tfrac56$.
### Mutually exclusive and independent events
- **Mutually exclusive**: the events cannot happen together. $P(A\cap B)=0$, so $P(A\cup B)=P(A)+P(B)$. On a Venn diagram the circles do not overlap. (E.g. rolling a 2 and rolling a 5 on one die.)
- **Independent**: one happening does not affect the probability of the other. Then
$$P(A\cap B)=P(A)\times P(B)$$
To **test** for independence, check whether this equation holds.
> **Worked example.** $P(A)=0.4$, $P(B)=0.5$, $P(A\cap B)=0.2$. Since $0.4\times0.5=0.2$, $A$ and $B$ are independent.
Do not confuse them: mutually exclusive events (with non-zero probabilities) are never independent, because if one happens the other cannot.
### Tree diagrams
A tree diagram shows two or more events in sequence. Write the probability on each branch; the branches from each point add to 1.
- **Multiply along** the branches to get the probability of a combined outcome ("and").
- **Add** the results of different paths ("or").
For events that are not independent (e.g. picking without replacement), the probabilities on the second set of branches change depending on the first.
> **Worked example.** A bag has 5 red and 3 blue counters. Two are taken without replacement. $P(\text{same colour})=\tfrac58\times\tfrac47+\tfrac38\times\tfrac27=\tfrac{20}{56}+\tfrac6{56}=\tfrac{13}{28}$.
### Watch out
- "At least one" is usually quickest as $1-P(\text{none})$.
- Check probabilities in a Venn diagram add to 1.`;

N.s1_6=String.raw`### Random variables and probability distributions
A **random variable** $X$ is a quantity whose value depends on chance (written in capitals; particular values are lower case, $x$). A **discrete** random variable takes separate values (e.g. the number of heads).
A **probability distribution** lists every value with its probability. The probabilities must add to 1:
$$\sum P(X=x)=1$$
A distribution can be given as a table, a formula (probability function) or a diagram.
> **Worked example.** $P(X=x)=kx$ for $x=1,2,3,4$. Then $k(1+2+3+4)=1$, so $k=0.1$, and $P(X\ge3)=0.3+0.4=0.7$.
A **discrete uniform** distribution has every value equally likely (a fair die: $P(X=x)=\tfrac16$).
### The binomial distribution
$X\sim B(n,p)$ counts the number of **successes** in $n$ trials when:
1. there is a **fixed number** of trials, $n$;
2. each trial has **two outcomes** (success or failure);
3. the probability of success $p$ is the **same** each time;
4. the trials are **independent**.
Then
$$P(X=r)=\binom nrp^r(1-p)^{n-r},\qquad r=0,1,\dots,n$$
**Why**: one particular order of $r$ successes and $n-r$ failures has probability $p^r(1-p)^{n-r}$, and there are $\binom nr$ ways to choose which trials are the successes.
> **Worked example.** A biased coin has $P(\text{head})=0.3$. It is tossed 8 times. $X\sim B(8,0.3)$.
> $P(X=2)=\binom82(0.3)^2(0.7)^6=28\times0.09\times0.1176=0.296$.
In context, say what $n$ and $p$ represent, and explain whether the conditions are reasonable (e.g. "seeds germinate independently" may not be true if they are planted in the same tray).
### Cumulative probabilities
The **cumulative** probability $P(X\le x)$ adds all the probabilities up to and including $x$. Your calculator gives these directly (or use tables). Convert other forms into $P(X\le\dots)$:
- $P(X<5)=P(X\le4)$
- $P(X\ge5)=1-P(X\le4)$
- $P(X>5)=1-P(X\le5)$
- $P(3\le X\le7)=P(X\le7)-P(X\le2)$
> **Worked example.** $X\sim B(20,0.4)$. $P(X\ge10)=1-P(X\le9)=1-0.7553=0.2447$.
### Watch out
- Be careful with $<$ versus $\le$ when converting to cumulative form: write out a number line if unsure.
- The mean of $B(n,p)$ is $np$ (useful as a check and in Year 2 for the normal approximation).`;

N.s1_7=String.raw`### The idea of a hypothesis test
A hypothesis test checks whether sample evidence is strong enough to reject a claim about a population parameter (in Year 1, the probability $p$ in a binomial distribution).
- The **null hypothesis** $H_0$ is the claim we assume is true: $H_0:p=0.3$.
- The **alternative hypothesis** $H_1$ is what we suspect instead: $H_1:p>0.3$, $p<0.3$ (**one-tailed**) or $p\neq0.3$ (**two-tailed**).
- The **test statistic** is the result from the sample (e.g. $X=12$ successes out of 20).
- The **significance level** $\alpha$ (e.g. 5%) is how unlikely the result must be, assuming $H_0$, before we reject $H_0$. It is also the probability of wrongly rejecting a true $H_0$.
Hypotheses are always about the **population parameter** $p$, never about the sample.
### The method
1. Define the random variable and its distribution under $H_0$: "Let $X$ be the number of ... $X\sim B(20,0.3)$."
2. State $H_0$ and $H_1$.
3. Calculate the probability of getting the observed value **or more extreme**, assuming $H_0$ is true (the **p-value**). Compare with $\alpha$. (Or find the critical region and see if the observed value is in it.)
4. Conclude in context: "There is sufficient evidence to reject $H_0$ ... there is evidence that the coin is biased towards heads." or "Insufficient evidence to reject $H_0$."
Never say $H_0$ is "proved" or "accepted": we only find evidence against it, or not.
> **Worked example.** A seed company claims 30% of its seeds produce red flowers. A gardener thinks it is higher. Of 20 seeds, 10 give red flowers. Test at the 5% level.
> $X\sim B(20,0.3)$. $H_0:p=0.3$, $H_1:p>0.3$.
> $P(X\ge10)=1-P(X\le9)=1-0.9520=0.0480<0.05$.
> Reject $H_0$. There is evidence that more than 30% of the seeds produce red flowers.
### Critical values and critical regions
The **critical region** is the set of values of the test statistic that would lead to rejecting $H_0$. The **critical value** is the first value inside it. The **actual significance level** is the probability of being in the critical region (it is usually less than $\alpha$ because $X$ is discrete).
> **Worked example.** For $X\sim B(20,0.3)$, $H_1:p>0.3$, 5% level: $P(X\ge9)=1-0.8867=0.1133$, $P(X\ge10)=0.0480$. So the critical region is $X\ge10$, with actual significance level $4.80\%$.
### One-tailed tests
For $H_1:p>p_0$, look at the upper tail: $P(X\ge x)$. For $H_1:p<p_0$, look at the lower tail: $P(X\le x)$, and the critical region is at the bottom. Use $H_1:p>\dots$ only when the context suggests an increase ("thinks it is higher").
### Two-tailed tests
For $H_1:p\neq p_0$, extreme values at **either** end count as evidence. Split the significance level **in half**, one half in each tail: at 5%, compare each tail with **2.5%**. The critical region has two parts.
> **Worked example.** $X\sim B(25,0.4)$, two-tailed at 10%. Find each tail with probability as close as possible to (and not more than) 5%.
> Lower: $P(X\le5)=0.0294$, $P(X\le6)=0.0736$. So $X\le5$.
> Upper: $P(X\ge15)=1-0.9656=0.0344$, $P(X\ge14)=1-0.9264=0.0736$. So $X\ge15$.
> Critical region: $X\le5$ or $X\ge15$. Actual significance level $0.0294+0.0344=6.38\%$.
### Watch out
- Define $X$ in words and state its distribution under $H_0$: these earn marks.
- For a two-tailed test, halve the significance level (or double the p-value) before comparing.
- Use $P(X\ge x)$ including the observed value, not $P(X>x)$.`;

N.s2_1=String.raw`### Exponential models and logs
Some bivariate data follow a curve rather than a line. If the relationship is of the form
- $y=ab^x$ (exponential): take logs, $\log y=\log a+x\log b$. Plot $\log y$ against $x$: a straight line with gradient $\log b$ and intercept $\log a$.
- $y=ax^n$ (power law): $\log y=\log a+n\log x$. Plot $\log y$ against $\log x$: gradient $n$, intercept $\log a$.
If the **coded** data give a regression line, transform back.
> **Worked example.** A regression line of $\log_{10}y$ on $x$ is $\log y=0.3+0.12x$. So $y=10^{0.3}\times(10^{0.12})^x=2.0\times1.32^x$.
> **Worked example.** The regression line of $\log P$ on $\log t$ is $\log P=1.5-0.4\log t$. Then $P=10^{1.5}t^{-0.4}=31.6t^{-0.4}$.
### The product moment correlation coefficient (PMCC)
$r$ measures the strength of **linear** correlation between two variables. Your calculator finds it. (It is $r=\dfrac{S_{xy}}{\sqrt{S_{xx}S_{yy}}}$.)
- $r=1$: perfect positive linear correlation; $r=-1$: perfect negative; $r=0$: no linear correlation.
- $|r|$ close to 1 means strong; close to 0 means weak.
- $r$ is not affected by **coding** (linear transformations like $u=\dfrac{x-10}5$), apart from a possible change of sign if you multiply by a negative.
- A low $r$ does not mean there is no relationship: it might be non-linear. Look at the scatter diagram.
### Hypothesis testing for zero correlation
We use the sample PMCC $r$ to test whether there is correlation in the **population**, whose correlation coefficient is $\rho$ ("rho").
- One-tailed: $H_0:\rho=0$, $H_1:\rho>0$ (positive correlation) or $H_1:\rho<0$.
- Two-tailed: $H_0:\rho=0$, $H_1:\rho\neq0$.
Find the **critical value** from the table for the sample size $n$ and significance level. If $|r|$ is beyond the critical value (in the right direction), reject $H_0$.
> **Worked example.** For 10 days at Heathrow, the PMCC between daily mean temperature and daily total sunshine is $r=0.68$. Test at 5% for positive correlation.
> $H_0:\rho=0$, $H_1:\rho>0$. Critical value for $n=10$ at 5% (one-tailed) is $0.5494$.
> $0.68>0.5494$, so reject $H_0$: there is evidence of positive correlation between temperature and sunshine.
For a two-tailed test at 5%, use the 2.5% column of the table (each tail).
### Watch out
- Hypotheses use $\rho$, not $r$.
- Conclude in context ("evidence that hours of sunshine and temperature are positively correlated").`;

N.s2_2=String.raw`### Set notation
- $A\cap B$: "$A$ **and** $B$" (intersection: in both).
- $A\cup B$: "$A$ **or** $B$" (union: in either or both).
- $A'$: "not $A$" (complement).
- $P(A\mid B)$: "the probability of $A$ **given** $B$ has happened".
Combinations: $A\cap B'$ means in $A$ but not $B$; $(A\cup B)'$ means in neither. Shade Venn diagrams to see these.
### Conditional probability
If we know $B$ has happened, the sample space shrinks to just $B$. The probability of $A$ is then the part of $B$ that is also in $A$:
$$P(A\mid B)=\frac{P(A\cap B)}{P(B)}$$
From a two-way table: $P(A\mid B)$ = (number in both $A$ and $B$) ÷ (number in $B$).
> **Worked example.** In a sixth form of 120 students: 70 study Maths, 45 study Physics, 35 study both. Given a student studies Physics, the probability they study Maths is $\tfrac{35}{45}=\tfrac79$.
### Conditional probabilities in Venn diagrams
Read $P(A\mid B)$ as: the probability in the overlap, divided by the total probability of circle $B$. With three events, $P(A\mid B\cap C)$ is the part of $A$ inside the region $B\cap C$, divided by $P(B\cap C)$.
### Probability formulae
- Addition rule: $P(A\cup B)=P(A)+P(B)-P(A\cap B)$.
- Multiplication rule: $P(A\cap B)=P(A\mid B)P(B)=P(B\mid A)P(A)$.
- Independence: $A$ and $B$ are independent if $P(A\mid B)=P(A)$ (knowing $B$ makes no difference), which is equivalent to $P(A\cap B)=P(A)P(B)$.
> **Worked example.** $P(A)=0.5$, $P(B)=0.4$, $P(A\cup B)=0.7$. Find $P(A\mid B)$ and decide if $A$ and $B$ are independent.
> $P(A\cap B)=0.5+0.4-0.7=0.2$. $P(A\mid B)=\tfrac{0.2}{0.4}=0.5=P(A)$, so they are independent.
### Tree diagrams
The probabilities on the second set of branches **are conditional probabilities**: $P(B\mid A)$ on the branch after $A$. To "reverse" a condition (find $P(A\mid B)$ when the tree gives $P(B\mid A)$), use the formula with the tree:
> **Worked example.** 2% of people have a disease. A test is positive for 95% of people with it and 10% of people without it. Given a positive test, find the probability the person has the disease.
> $P(D\cap+)=0.02\times0.95=0.019$. $P(+)=0.019+0.98\times0.10=0.117$.
> $P(D\mid+)=\tfrac{0.019}{0.117}=0.162$. Only about 16%, because the disease is rare.
### Watch out
- $P(A\mid B)\neq P(B\mid A)$ in general.
- The denominator in a conditional probability is the probability of the **given** event.`;

N.s2_3=String.raw`### The normal distribution
Many continuous quantities (heights, measurement errors, masses of products) have a symmetrical, bell-shaped distribution: the **normal distribution**, $X\sim N(\mu,\sigma^2)$ with mean $\mu$ and variance $\sigma^2$ (standard deviation $\sigma$).
{{svg1}}
Properties:
- Symmetrical about the mean; mean = median = mode.
- It has **points of inflection** at $\mu\pm\sigma$.
- About **68%** of values lie within $1\sigma$ of the mean, **95%** within $2\sigma$, and **99.7%** within $3\sigma$.
- It is a **continuous** distribution: probabilities are **areas** under the curve, the total area is 1, and $P(X=a)=0$. So $P(X<a)=P(X\le a)$.
### Finding probabilities
Use the calculator's normal cumulative distribution function with lower bound, upper bound, $\sigma$ and $\mu$.
> **Worked example.** $X\sim N(50,16)$, so $\sigma=4$. $P(X>56)=0.0668$; $P(45<X<55)=0.7887$.
Note: the second parameter is the **variance**; take the square root for $\sigma$.
### The inverse normal distribution
Given a probability, find the value: use inverse normal. Calculators work with the **left-hand** tail ($P(X<a)$), so convert "greater than" first.
> **Worked example.** $X\sim N(50,16)$. Find $a$ with $P(X>a)=0.1$: $P(X<a)=0.9$, so $a=55.1$.
### The standard normal distribution
$Z\sim N(0,1^2)$ has mean 0 and standard deviation 1. Any normal variable can be **standardised**:
$$Z=\frac{X-\mu}{\sigma}$$
$Z$ counts how many standard deviations $X$ is from its mean. $P(Z<z)$ is written $\Phi(z)$. Tables give $\Phi(z)$ and percentage points.
### Finding $\mu$ and $\sigma$
If $\mu$ or $\sigma$ is unknown, use known probabilities to set up equations via $Z$.
> **Worked example.** $X\sim N(\mu,\sigma^2)$ with $P(X<20)=0.25$ and $P(X>35)=0.1$. Find $\mu$ and $\sigma$.
> $\dfrac{20-\mu}\sigma=-0.6745$ and $\dfrac{35-\mu}\sigma=1.2816$ (from inverse normal on $Z$).
> Subtract: $\dfrac{15}\sigma=1.9561$, so $\sigma=7.67$ and $\mu=20+0.6745\times7.67=25.2$.
### Approximating a binomial distribution
When $n$ is large and $p$ is close to $0.5$, the binomial distribution $B(n,p)$ is roughly bell-shaped and can be approximated by a normal distribution with the **same mean and variance**:
$$X\sim B(n,p)\approx Y\sim N\left(np,\ np(1-p)\right)$$
Because the binomial is **discrete** and the normal **continuous**, apply a **continuity correction**: each whole number $x$ is represented by the interval $x-0.5$ to $x+0.5$.
- $P(X\le10)\approx P(Y<10.5)$
- $P(X<10)=P(X\le9)\approx P(Y<9.5)$
- $P(X=10)\approx P(9.5<Y<10.5)$
- $P(X\ge10)\approx P(Y>9.5)$
> **Worked example.** $X\sim B(100,0.45)$. $Y\sim N(45,24.75)$. $P(X\ge50)\approx P(Y>49.5)=0.183$.
### Hypothesis testing with the normal distribution
To test a claim about a population **mean** $\mu$ when the population is normal with known $\sigma$: the sample mean $\bar X$ of a sample of size $n$ has distribution
$$\bar X\sim N\left(\mu,\frac{\sigma^2}{n}\right)$$
(The mean of a sample varies less than single values, more so for bigger samples.)
> **Worked example.** Bags are meant to weigh 500 g, with $\sigma=8$ g. A sample of 16 has mean 496 g. Test at 5% whether the mean is less than 500 g.
> $H_0:\mu=500$, $H_1:\mu<500$. Under $H_0$, $\bar X\sim N\left(500,\tfrac{64}{16}\right)=N(500,4)$.
> $P(\bar X\le496)=0.0228<0.05$. Reject $H_0$: there is evidence the mean weight is less than 500 g.
Alternatively find the critical region: $P(\bar X<c)=0.05$ gives $c=496.7$, and $496$ is in the critical region.
### Watch out
- $N(\mu,\sigma^2)$ uses the variance; calculators want $\sigma$.
- Never use a continuity correction for a variable that is already continuous.
- State $\bar X$'s distribution under $H_0$ in a normal hypothesis test.`;

window.NOTES2=window.NOTES2||{};
window.NOTES2.stats=N;
})();
