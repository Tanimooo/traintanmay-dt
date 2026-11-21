/* Full topic notes for Decision Mathematics 1 (Edexcel 8FM0/9FM0). Overrides the short notes in notes.js. */
(function(){
const N={};

N.algo=String.raw`### What an algorithm is
An **algorithm** is a finite sequence of precise instructions for solving a problem. It must be unambiguous, work for any valid input, and stop. Algorithms can be given in words, as a **flow chart** (boxes for instructions, diamonds for decisions) or as pseudocode. Exam questions ask you to **trace** an algorithm: keep a table of every variable's value at each step, and state the output.
### Sorting: the bubble sort
Compare adjacent items in turn, swapping them if they are in the wrong order. One complete run through the list is a **pass**: after it, the largest item is at the end. Repeat on the rest. Stop when a pass makes **no swaps**.
> **Worked example.** Sort 5, 2, 8, 1 ascending. Pass 1: 2, 5, 1, 8. Pass 2: 2, 1, 5, 8. Pass 3: 1, 2, 5, 8. Pass 4: no swaps: sorted.
### The quick sort
1. Choose a **pivot**: the **middle** item of the list (for an even number, the item to the right of the middle).
2. Write the items smaller than the pivot to its left (in their original order) and larger ones to its right. The pivot is now fixed in place.
3. Repeat on each sub-list until every item is a pivot.
Quick sort is usually much faster than bubble sort for long lists.
### Bin packing
Items of given sizes must be packed into bins of fixed capacity, using as few bins as possible.
- **Lower bound**: $\dfrac{\text{total size}}{\text{bin capacity}}$, rounded **up**. You cannot do better than this (though it may not be achievable).
- **First-fit**: take items in the given order; put each in the first bin it fits. Quick, but often not optimal.
- **First-fit decreasing**: sort the items in decreasing order first, then first-fit. Usually better.
- **Full bins**: look for combinations that fill bins exactly, then first-fit the rest. Often optimal, but relies on spotting combinations.
If a packing uses the lower bound number of bins, it is optimal.
### Order of an algorithm
The **order** describes how the run time grows with the size $n$ of the problem. If an algorithm is of order $n^2$ (quadratic, like bubble sort in the worst case), doubling $n$ multiplies the time by about 4. Order $n^3$: doubling $n$ multiplies by 8. Linear order $n$: doubles.
> **Worked example.** An order-$n^2$ algorithm takes 3 seconds for $n=200$. For $n=600$: $3\times\left(\tfrac{600}{200}\right)^2=27$ seconds.
### Watch out
- In quick sort, show the pivot chosen at each stage.
- Bin packing answers: list the contents of each bin.`;

N.graphs=String.raw`### Graph terminology
A **graph** is a set of **vertices** (nodes) joined by **edges** (arcs). A **network** (or weighted graph) has a number (weight) on each edge, such as a distance or cost.
{{svg1}}
- The **degree** (valency) of a vertex is the number of edges meeting at it. A vertex is **odd** or **even** by its degree.
- **Handshaking lemma**: the sum of the degrees is twice the number of edges (each edge has two ends). So there is always an **even number of odd vertices**.
- A **walk** is a sequence of edges joined end to end. A **trail** uses no edge twice. A **path** uses no vertex twice. A **cycle** is a closed path. A **Hamiltonian cycle** visits every vertex exactly once and returns to the start.
- **Connected**: there is a path between every pair of vertices.
- A **loop** joins a vertex to itself. A **simple graph** has no loops and at most one edge between any two vertices.
- A **digraph** has directed edges.
- A **tree** is a connected graph with no cycles; with $n$ vertices it has $n-1$ edges. A **spanning tree** is a tree containing all the vertices of a graph.
- **Complete graph** $K_n$: every vertex joined to every other; it has $\tfrac12n(n-1)$ edges.
- **Isomorphic** graphs have the same structure (vertices can be relabelled to match).
- **Bipartite graph**: two sets of vertices, with edges only between the sets. $K_{m,n}$ is the complete bipartite graph.
- **Planar graph**: can be drawn with no edges crossing.
### Adjacency and distance matrices
An **adjacency matrix** records the number of edges between each pair of vertices; a **distance matrix** records the weights. For undirected graphs they are symmetric about the leading diagonal.
### Eulerian and semi-Eulerian graphs
A connected graph is **Eulerian** (has a closed trail using every edge exactly once) if and only if every vertex has **even** degree. It is **semi-Eulerian** (has an open trail using every edge, starting and finishing at different vertices) if it has exactly **two odd** vertices: the trail starts at one and ends at the other.
### Planarity: the planarity algorithm
To test whether a graph with a Hamiltonian cycle is planar: draw the Hamiltonian cycle as a polygon, list the remaining edges, and try to place each inside or outside so that no two cross; edges that would cross must go on opposite sides. If you can place all of them, it is planar. ($K_5$ and $K_{3,3}$ are not planar.) **Euler's formula** for connected planar graphs: $V+F-E=2$.
### Watch out
- Use the correct words: trail versus path matters.
- Check the handshaking lemma when counting edges.`;

N.algraph=String.raw`### Minimum spanning trees
A **minimum spanning tree** (MST) connects all the vertices of a network with the least total weight (for example, the cheapest set of cables connecting buildings).
{{svg1}}
### Kruskal's algorithm
1. List the edges in order of increasing weight.
2. Add the shortest edge that does **not form a cycle** with those already chosen. Reject it if it would.
3. Repeat until $n-1$ edges are chosen (all vertices connected).
State the order in which edges are considered, including the ones you reject and why.
### Prim's algorithm
1. Start at any vertex.
2. Add the shortest edge joining a vertex **in** the tree to a vertex **not yet** in the tree.
3. Repeat until all vertices are included.
Prim's never needs to check for cycles, and it can be done from a **distance matrix**: cross out the row of each vertex added, look down the columns of vertices in the tree for the smallest undeleted entry.
### Dijkstra's algorithm: shortest path
Finds the shortest route from a start vertex to every other vertex. Each vertex gets a box with its **order of labelling**, its **final label** (shortest distance) and its **working values**.
1. Give the start vertex final label 0, order 1.
2. For each vertex directly connected to the vertex just labelled, write a working value: (final label just given) + (edge weight). Only write it if it is smaller than any existing working value there.
3. Choose the vertex with the **smallest working value** not yet finalised; make it final, with the next order number.
4. Repeat until the destination has a final label.
**Route**: trace back from the end: an edge $XY$ is on the route if (label of $Y$) $-$ (label of $X$) equals the weight of $XY$.
### Floyd's algorithm: all-pairs shortest paths
Uses a **distance table** and a **route table**. For each vertex $k$ in turn: for every pair $(i,j)$, if going via $k$ is shorter ($d_{ik}+d_{kj}<d_{ij}$), replace $d_{ij}$ and change the route table entry to $k$'s route. After all vertices, the table holds every shortest distance, and routes are read from the route table.
### Watch out
- Show working values in Dijkstra's boxes in order; examiners check them.
- Kruskal: list rejected edges too.`;

N.route=String.raw`### The route inspection (Chinese postman) problem
Find the shortest closed route that traverses **every edge at least once** (e.g. a postman covering every street, a gritter, a road inspector).
### Why odd vertices matter
A route that returns to the start enters and leaves each vertex the same number of times, so it uses an even number of edge-ends at every vertex. If every vertex has even degree, the graph is **Eulerian** and each edge can be used exactly once: the shortest route is just the total weight.
If there are odd vertices, some edges must be **repeated**: the repeated edges must pair up the odd vertices, making every degree even.
### The algorithm
1. Find the **odd vertices** (there is always an even number of them).
2. List every way of **pairing** them up. (Two odd vertices: 1 pairing; four: 3 pairings; six: 15.)
3. For each pairing, find the shortest path between each pair (by inspection or Dijkstra's) and add.
4. Choose the pairing with the **smallest** total. Repeat those edges.
5. Length of the route $=$ total weight of all edges $+$ the repeated (extra) amount.
> **Worked example.** A network has total weight 120 and odd vertices $A,B,C,D$. Shortest paths: $AB=10$, $CD=8$; $AC=7$, $BD=12$; $AD=9$, $BC=6$.
> Pairings: $AB+CD=18$; $AC+BD=19$; $AD+BC=15$. Choose $AD+BC$.
> Shortest route $=120+15=135$.
### Different start and finish points
If the route may **start and finish at different vertices**, one pair of odd vertices can be left unpaired: the route starts at one and ends at the other. With four odd vertices, only **one** shortest path needs repeating. Choose the shortest of the six paths between pairs of odd vertices, repeat it, and start and finish at the other two odd vertices.
> Continuing the example: the smallest single connection is $BC=6$. Repeat $BC$ and start/finish at $A$ and $D$: route length $120+6=126$.
### Watch out
- List all the pairings and their totals: this is where the marks are.
- State which edges are repeated and give a valid route if asked (count the number of times you pass through each vertex).`;

N.tsp=String.raw`### The travelling salesman problem
Find the shortest route that visits **every vertex** (at least once) and returns to the start. (Compare route inspection, which covers every **edge**.)
- **Classical** problem: visit each vertex exactly once (a Hamiltonian cycle).
- **Practical** problem: each vertex at least once; you may pass through vertices more than once.
For the practical problem on an incomplete network, first form the **table of least distances** (shortest path between every pair), which turns it into a classical problem on a complete network obeying the triangle inequality.
No efficient algorithm guarantees the best answer for large networks, so we find **bounds**: the optimal length lies between a lower and an upper bound.
### Upper bound: nearest neighbour algorithm
1. Start at a vertex.
2. Go to the **nearest unvisited** vertex.
3. Repeat until all are visited, then return to the start.
The length of this tour is an **upper bound**. Try different starting vertices: the smallest result is the best upper bound.
Another upper bound: double the weight of a minimum spanning tree (then use shortcuts to reduce it).
### Lower bound: residual minimum spanning tree
1. **Delete** one vertex and all its edges.
2. Find the weight of a **minimum spanning tree** of the remaining network (residual MST).
3. Add the **two shortest edges** from the deleted vertex.
This is a **lower bound**. Repeat deleting different vertices: the **largest** result is the best lower bound.
> **Worked example.** Best upper bound 58, best lower bound 52: the optimal tour length $L$ satisfies $52\le L\le58$. If a tour of length 52 is found, it is optimal.
### Why these give bounds
- Any tour is a cycle through all vertices; removing one vertex from it leaves a spanning tree of the rest (at least the residual MST), plus two edges at the deleted vertex (at least the two shortest). So the optimal tour is at least the lower bound.
- Nearest neighbour produces an actual tour, so the optimum is at most its length.
### Watch out
- Upper bound: choose the **smallest**. Lower bound: choose the **largest**.
- If a lower bound gives a Hamiltonian cycle (the residual MST with the two edges forms a cycle), it is optimal.`;

N.cpa=String.raw`### Precedence and activity networks
A project is split into **activities**, some of which depend on others finishing first. A **precedence table** lists, for each activity, its duration and the activities that must be completed before it (**immediate predecessors**).
An **activity network** (activity on arc) shows each activity as an arc, with **events** (nodes) where activities start and finish. A **dummy** activity (dashed arc, zero duration) is used to show a dependency correctly when two activities share some but not all predecessors, or so that two activities do not have the same start and end events.
### Early and late event times
- **Forward pass**: the **early event time** at each node is the earliest the event can happen. Start at 0; at each node take the **largest** of (early time at the start + duration) over all arcs coming in.
- **Backward pass**: the **late event time** is the latest the event can happen without delaying the project. At the final node, late = early. Working backwards, take the **smallest** of (late time at the end − duration) over all arcs going out.
### Critical activities
An activity is **critical** if any delay to it delays the whole project. For a critical activity from node $i$ to node $j$:
- early time at $i$ = late time at $i$, early at $j$ = late at $j$, and
- late time at $j$ $-$ early time at $i$ $=$ duration.
The **critical path** is the longest path through the network; its length is the minimum project duration.
### Float
The **total float** of an activity $(i,j)$ with duration $d$:
$$\text{float}=\text{late time at }j-\text{early time at }i-d$$
It is how long the activity can be delayed without delaying the project. Critical activities have zero float.
### Gantt (cascade) charts and scheduling
A **Gantt chart** shows each activity as a bar starting at its earliest start time, with its float as a dotted extension. Use it to find which activities **must** be happening at a given time (critical ones, or those with no room to move).
**Resource histograms** show the number of workers needed over time. To find the **lower bound** for the number of workers:
$$\frac{\text{sum of all activity durations}}{\text{critical path length}}\ \text{(rounded up)}$$
**Scheduling**: allocate activities to workers so the project finishes on time: at each time, give a free worker the available activity with the smallest late start time.
### Watch out
- Forward pass: largest. Backward pass: smallest.
- Draw dummies with dashed lines and explain why they are needed.`;

N.lp=String.raw`### Formulating a linear programming problem
A **linear programming** (LP) problem: choose values of **decision variables** to maximise or minimise a linear **objective function**, subject to linear **constraints** (inequalities).
1. **Define the decision variables** clearly, with units: "let $x$ be the number of chairs made per day".
2. Write the **objective**: "maximise $P=30x+50y$".
3. Write the **constraints**, from each limited resource or condition, including **non-negativity** ($x,y\ge0$).
> **Worked example.** A firm makes $x$ tables and $y$ chairs a day. A table takes 3 hours of carpentry and a chair 2; there are 12 hours. A table uses 1 m of wood and a chair 3 m, with 6 m available. Profit is £30 per table and £40 per chair.
> Maximise $P=30x+40y$ subject to $3x+2y\le12$, $x+3y\le6$, $x,y\ge0$.
> Vertices: $(0,0)$, $(4,0)$, $(0,2)$, and where the lines cross: $x=6-3y$ gives $18-7y=12$, so $\left(\tfrac{24}7,\tfrac67\right)$.
> $P$: $0$, $120$, $80$, $\tfrac{960}7=137.1$. The optimum is at $\left(\tfrac{24}7,\tfrac67\right)$.
> Whole numbers needed: test nearby integer points inside the region: $(3,1)$ gives $P=130$ (feasible: $11\le12$, $6\le6$); $(4,0)$ gives $120$. Best: 3 tables and 1 chair, £130.
Watch for ratio constraints: "at least twice as many chairs as tables" is $y\ge2x$. "At least 40% of the total are chairs": $y\ge0.4(x+y)$.
### Graphical solution (two variables)
{{svg1}}
1. Draw each constraint's boundary line and identify the **feasible region**: the region satisfying all constraints (usually left unshaded, with the unwanted sides shaded).
2. **Objective line method**: draw a line $P=$ constant (e.g. $30x+50y=150$). Slide it parallel across the region: for a maximum, the last point it touches is optimal; for a minimum, the first.
3. **Vertex method**: the optimum is at a **vertex** of the feasible region. Find each vertex (solve the pairs of boundary equations simultaneously) and evaluate the objective at each.
### Integer solutions
If the variables must be whole numbers (you cannot make 2.4 chairs), check the integer points near the optimal vertex that are inside the feasible region, and choose the best. Rounding the vertex is not enough: the rounded point might be infeasible, or not the best.
### Watch out
- Define variables in words with units.
- Label lines and the feasible region; use a ruler and an accurate scale.`;

N.simplex=String.raw`### Why the simplex algorithm
The graphical method only works with two variables. The **simplex algorithm** solves LP problems with any number of variables, algebraically, by moving from vertex to vertex of the feasible region, improving the objective each time.
### Slack variables
Each $\le$ constraint becomes an equation by adding a **slack variable** (the unused amount of that resource):
$$3x+2y\le12\ \to\ 3x+2y+s_1=12,\quad s_1\ge0$$
Write the objective as $P-30x-50y=0$.
### The simplex tableau (maximising)
Put the equations in a tableau: one row per constraint and one for the objective. The starting **basic variables** are the slack variables (start at the origin).
1. **Pivot column**: the column with the **most negative** entry in the objective row (increasing that variable improves $P$ fastest).
2. **Pivot row**: for each row with a positive entry in the pivot column, calculate $\theta=\dfrac{\text{value}}{\text{pivot column entry}}$. Choose the **smallest** $\theta$ (it is the binding constraint).
3. Divide the pivot row by the pivot element so it becomes 1.
4. Use row operations to make every other entry in the pivot column 0.
5. Repeat until there are **no negative entries in the objective row**: the tableau is optimal. Read off: basic variables equal the values column; non-basic ones are 0.
Show the row operations used at each stage, e.g. "R2 − 3R1".
### Interpreting the final tableau
- The value of $P$ is in the objective row's value column.
- A slack variable with a positive value means that resource is not all used.
### Minimising and $\ge$ constraints
- To minimise $C$, maximise $P=-C$.
- A $\ge$ constraint needs a **surplus** variable (subtracted) and an **artificial** variable (added) so the origin is a valid starting point. Then use either:
- the **two-stage simplex**: first minimise the sum of the artificial variables (to reach a feasible vertex), then solve the original problem from there;
- the **big-M method**: add $M\times$(artificial variables) to the objective as a large penalty, so the algorithm drives them to zero.
### Watch out
- Use the **smallest positive** $\theta$; ignore rows with zero or negative entries in the pivot column.
- Keep exact fractions to avoid rounding errors.`;

window.NOTES2=window.NOTES2||{};
window.NOTES2.d1=N;
})();
