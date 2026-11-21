/* Full topic notes for Decision Mathematics 2 (Edexcel 9FM0). Overrides the short notes in notes.js. */
(function(){
const N={};

N.transport=String.raw`### The transportation problem
Goods must be sent from **sources** (with given supplies) to **destinations** (with given demands), and each route has a cost per unit. Find how many units to send along each route to **minimise the total cost**.
- If total supply equals total demand, the problem is **balanced**. If supply exceeds demand, add a **dummy destination** with the excess demand and zero costs.
- A solution with $m$ sources and $n$ destinations needs $m+n-1$ occupied cells. If there are fewer, it is **degenerate**: put a zero in an empty cell (one that does not form a cycle) to make up the number.
### Initial solution: north-west corner method
Start in the top-left (north-west) cell. Allocate as much as possible there: the smaller of the remaining supply for that row and the remaining demand for that column. If that uses up the row's supply, move **down**; if it meets the column's demand, move **right**. Continue until you reach the bottom-right corner.
### Improving the solution: the stepping-stone method
1. **Shadow costs**: for each source $R_i$ and destination $K_j$, find values with $R_i+K_j=$ cost for every **occupied** cell. Start by setting the first $R_1=0$.
2. **Improvement indices** for every **empty** cell: $I_{ij}=\text{cost}_{ij}-R_i-K_j$.
3. If all improvement indices are $\ge0$, the solution is **optimal**.
4. Otherwise, choose the **most negative** index as the entering cell. Find a closed **stepping-stone route** (cycle) from it through occupied cells, alternating $+$ and $-$. Find the smallest value in the $-$ cells: that is how much to move. Adjust along the cycle; the cell that drops to zero leaves.
5. Repeat.
> Each improvement index is the change in total cost from sending one unit along that empty route: a negative index means the cost can be reduced.
### Formulating as a linear programming problem
Let $x_{ij}$ be the number of units sent from source $i$ to destination $j$.
- Minimise $C=\sum c_{ij}x_{ij}$.
- Supply constraints: for each source, $\sum_jx_{ij}\le$ supply (or $=$ if balanced).
- Demand constraints: for each destination, $\sum_ix_{ij}\ge$ demand.
- $x_{ij}\ge0$.
### Watch out
- Check the number of occupied cells is $m+n-1$ at each stage.
- State the final allocation and its total cost.`;

N.alloc=String.raw`### The allocation (assignment) problem
Assign $n$ workers to $n$ tasks, one each, to **minimise the total cost** (or time). With a cost matrix, there are $n!$ possible assignments, too many to check for large $n$, so we use the **Hungarian algorithm**.
### The Hungarian algorithm
1. If the matrix is not square, add a **dummy** row or column of zeros.
2. **Reduce rows**: subtract the smallest number in each row from every entry in that row.
3. **Reduce columns**: subtract the smallest number in each column from every entry in that column.
4. Cover all the zeros with the **minimum number of lines** (horizontal or vertical).
5. If the number of lines equals $n$, an optimal allocation exists among the zeros. Otherwise:
6. **Augment**: find the smallest uncovered entry $e$. Subtract $e$ from every uncovered entry and add $e$ to entries covered by **two** lines (entries covered once stay the same). Go back to step 4.
7. Choose $n$ zeros, one in each row and each column: that is the allocation. Calculate the total from the **original** matrix.
Why it works: subtracting a constant from a row or column changes every assignment's total by the same amount, so the optimal assignment is unchanged.
### Maximising
To maximise (e.g. profit or score), subtract every entry from the **largest** entry in the matrix, then minimise as usual.
### Incomplete matrices
If a worker cannot do a task, put a very large value in that cell (larger than any other) so it is never chosen.
### Formulating as a linear programming problem
Let $x_{ij}=1$ if worker $i$ does task $j$, 0 otherwise.
- Minimise $\sum c_{ij}x_{ij}$.
- Each worker does one task: $\sum_jx_{ij}=1$ for each $i$.
- Each task is done once: $\sum_ix_{ij}=1$ for each $j$.
- $x_{ij}\ge0$ (the solution will naturally be 0 or 1).
### Watch out
- Lines must cover **all** zeros using as few lines as possible.
- Use the original costs to give the final total.`;

N.flows=String.raw`### Flows in networks
A **network** with directed arcs carries a flow (water, traffic, data) from a **source** $S$ to a **sink** $T$. Each arc has a **capacity**: the maximum flow along it. A **feasible flow** satisfies:
- the flow along each arc does not exceed its capacity (and is not below any lower capacity);
- at every vertex other than $S$ and $T$, **flow in = flow out** (conservation).
An arc is **saturated** if the flow equals the capacity.
### Cuts
A **cut** separates $S$ from $T$, splitting the vertices into two sets. Its **capacity** is the sum of the capacities of arcs going **from the $S$ side to the $T$ side** (arcs going backwards count as 0, or their lower capacity if they have one).
{{svg1}}
**Maximum flow–minimum cut theorem**: the maximum flow through a network equals the capacity of the **minimum cut**. So to prove a flow is maximal, find a cut whose capacity equals the flow.
### The labelling procedure: finding the maximum flow
Label each arc with two arrows:
- the **forward** arrow shows the **excess capacity** (how much more flow can be sent);
- the **backward** arrow shows the **current flow** (how much flow could be pushed back).
Then:
1. Find a **flow-augmenting route** from $S$ to $T$ using arcs with spare forward capacity (or backward arrows, which reduce an existing flow).
2. The amount you can send is the smallest available value along the route.
3. Update the labels and repeat until no flow-augmenting route exists.
The flow is then maximal; confirm with a cut of equal capacity.
### Multiple sources and sinks
Add a **supersource** connected to every source (arc capacities equal to what each can supply, or large if unlimited) and a **supersink** connected from every sink. Then solve as normal.
### Vertex capacities
If a vertex can only pass a limited flow, replace it with two vertices joined by an arc of that capacity.
### Watch out
- In cuts, only arcs from the $S$ side to the $T$ side count.
- State each flow-augmenting route and the amount it adds.`;

N.dp=String.raw`### Dynamic programming
**Dynamic programming** solves multi-stage problems by working **backwards** from the end, using **Bellman's principle of optimality**: any part of an optimal route is itself optimal. So at each stage you only need to keep the best way of reaching the end from each state.
Vocabulary:
- **Stage**: a step in the process (often numbered from the end).
- **State**: where you are at a given stage (a vertex).
- **Action**: a choice that moves you to a state at the next stage.
- **Value**: the best total achievable from a state to the end.
### Setting out a solution
Use a table with columns: **Stage | State | Action | Destination | Value**. Work from the last stage back to the first. For each state, consider every action, compute the value (action cost + best value of the destination), and keep the best (mark it with *).
Then trace forward from the start, following the starred actions, to read off the optimal route.
### Types of problem
- **Shortest (or longest) path**: value = sum of weights; keep the minimum (or maximum).
- **Minimax**: minimise the **largest** single weight on the route (e.g. the highest point on a hiking route, the longest single day's travel). Value = $\max$(action weight, destination value); keep the smallest.
- **Maximin**: maximise the **smallest** single weight (e.g. the lowest bridge clearance, the weakest link). Value = $\min$(action weight, destination value); keep the largest.
- **Resource allocation and production planning**: states are the amount of stock or money left; actions are how much to use or make at each stage.
> **Worked example (minimax idea).** From $A$, routes to the end via $B$ have largest legs $\max(5,\text{best from }B)$ and via $C$ $\max(7,\text{best from }C)$. If the best from $B$ is 6 and from $C$ is 4, the values are 6 and 7: go via $B$, value 6.
### Watch out
- Fill in every row of the table, including rejected actions.
- For maximin and minimax, combine with max/min, not by adding.`;

N.game=String.raw`### Two-person zero-sum games
Two players, A and B, each choose a strategy. The **pay-off matrix** shows A's gains; B's gains are the negatives (what one wins the other loses: "zero-sum"). A chooses a **row**, B chooses a **column**.
### Play-safe strategies and stable solutions
- A's **play-safe** strategy: the row whose **minimum** is largest (**maximin**: A guarantees at least this).
- B's play-safe strategy: the column whose **maximum** is smallest (**minimax**: B loses at most this).
If row maximin = column minimax, the game has a **stable solution** (a **saddle point**): neither player gains by changing strategy alone, and that common number is the **value of the game**.
### Dominance
A row **dominates** another if every entry is at least as good for A (greater than or equal); the dominated row can be deleted, as A would never use it. For B, a column dominates another if every entry is **less than or equal** (smaller losses for B). Reduce the matrix as far as possible.
### Mixed strategies (no stable solution)
If there is no saddle point, each player should mix strategies randomly, with chosen probabilities.
**Graphical method for a $2\times n$ game** (A has two strategies):
1. Let A play row 1 with probability $p$ and row 2 with $1-p$.
2. For each of B's columns, A's expected pay-off is a linear expression in $p$. Draw these lines for $0\le p\le1$.
3. A wants to maximise the **lowest** line: the optimal $p$ is at the **highest point of the lower boundary**, usually where two lines cross.
4. Solve the two equations to find $p$ and the value of the game.
{{svg1}}
> **Worked example.** Pay-offs for A when B plays columns 1 and 2: $5p-1$ and $3-2p$. They cross where $5p-1=3-2p$: $p=\tfrac47$, value $\tfrac{13}7$.
For a game where B has two strategies, swap roles (or multiply by $-1$ and transpose to make it A's problem).
### Formulating as a linear programming problem
For larger games, make all entries positive (add a constant $k$), let $v$ be the value. A plays rows with probabilities $p_1,p_2,p_3$:
- Maximise $P=v$, subject to: for each column, $\sum p_ia_{ij}\ge v$; $p_1+p_2+p_3\le1$; all $\ge0$.
Solve with the simplex algorithm, then subtract $k$ from the value.
### Watch out
- Check for a stable solution (saddle point) first, then reduce by dominance.
- The value of the game is from A's point of view.`;

N.recur=String.raw`### Recurrence relations in Decision Mathematics
A **recurrence relation** gives each term from previous ones: $u_{n+1}=f(u_n)$ (first order) or $u_{n+2}=f(u_{n+1},u_n)$ (second order). They model things that change in steps: loan balances, population with harvesting, the number of moves in a puzzle, counting arrangements.
### Forming a recurrence from context
> **Worked example.** A loan of £5000 has 1% monthly interest and a repayment of £200 each month. Balance after $n$ months: $u_{n+1}=1.01u_n-200$, $u_0=5000$.
> **Worked example.** The number of ways $t_n$ to tile a $2\times n$ strip with $1\times2$ dominoes: the first tile is either vertical (leaving $2\times(n-1)$) or two horizontal tiles (leaving $2\times(n-2)$). So $t_n=t_{n-1}+t_{n-2}$, with $t_1=1$, $t_2=2$.
### Solving first-order linear recurrences
$u_{n+1}=au_n+b$ (with $a\neq1$) has solution
$$u_n=Aa^n+\frac{b}{1-a}$$
- $Aa^n$ is the **complementary function** (solution of $u_{n+1}=au_n$).
- $\dfrac b{1-a}$ is the **particular solution** (the constant term: put $u_n=\lambda$ into the relation).
Find $A$ from the first term.
> Loan example: $u_n=A(1.01)^n+\dfrac{-200}{-0.01}=A(1.01)^n+20000$. $u_0=5000$ gives $A=-15000$. So $u_n=20000-15000(1.01)^n$. The loan is repaid when $u_n\le0$: $1.01^n\ge\tfrac43$, $n\ge28.9$, so in the 29th month.
For other forms of $g(n)$, try a particular solution of the same form (linear: $\lambda n+\mu$; exponential $kp^n$: $\lambda p^n$).
### Second-order linear recurrences
$u_{n+2}+au_{n+1}+bu_n=0$: auxiliary equation $r^2+ar+b=0$.
- Distinct roots: $u_n=A\alpha^n+B\beta^n$.
- Repeated root: $u_n=(A+Bn)\alpha^n$.
Use two initial terms to find $A$ and $B$. Non-homogeneous versions add a particular solution, as for first order.
### Watch out
- Check the starting index ($u_0$ or $u_1$).
- Interpret answers in context (whole months, whole items).`;

N.decision=String.raw`### Decision trees
A **decision tree** models a sequence of choices and chance outcomes, to choose the strategy with the best **expected monetary value** (EMV).
- **Decision nodes** (squares): the decision-maker chooses a branch.
- **Chance nodes** (circles): each branch has a probability; the probabilities at a node add to 1.
- **End points** (triangles or the ends of branches): the final pay-offs.
### Rolling back
Work from the right (the end) to the left:
- At a **chance node**, the EMV is the weighted average: $\sum(\text{probability}\times\text{value})$.
- At a **decision node**, choose the branch with the **best** EMV (largest profit or smallest cost), and mark the rejected branches with a double stroke.
Subtract the cost of an action (e.g. paying for a survey) at the appropriate point.
> **Worked example.** A company can launch a product (cost £20k) or not. If launched, there is a 0.6 chance of high sales (income £60k) and 0.4 of low sales (£10k).
> Chance node EMV $=0.6(60)+0.4(10)=40$k. Launch: $40-20=20$k. Not launching: 0. Decision: launch, EMV £20k.
### The value of information
If a survey costing $c$ would tell you which outcome will happen (or improve the probabilities), compare the EMV with the survey against without. The survey is worth buying if it increases the EMV by more than its cost.
### Utility
EMV assumes the decision-maker cares only about the average. In reality, people may be **risk-averse** (avoiding large possible losses) or risk-seeking. A **utility function** converts money into "satisfaction"; maximising expected **utility** instead of EMV can change the decision. For example, a risk-averse company might reject an option with the highest EMV because it carries a chance of bankruptcy.
### Watch out
- Probabilities at each chance node must sum to 1.
- State the optimal strategy as a sequence of decisions, and its EMV.`;

window.NOTES2=window.NOTES2||{};
window.NOTES2.d2=N;
})();
