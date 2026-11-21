/* Full topic notes for Mechanics (Edexcel 9MA0 Paper 3). Overrides the short notes in notes.js. */
(function(){
const N={};

N.m1_8=String.raw`### Constructing a model
Mechanics uses **mathematical models**: simplified descriptions of real situations that can be solved with maths. The modelling cycle:
1. Make simplifying **assumptions** about the real-world problem.
2. Write the problem in mathematical terms (equations, diagrams).
3. Solve it.
4. Compare the answer with reality, and if it does not match well, **refine** the model (remove an assumption) and repeat.
A model's predictions are only as good as its assumptions. Exam questions often ask you to state an assumption, criticise one, or say how a model could be improved.
### Modelling assumptions and what they mean
- **Particle**: the object's size is negligible, so its mass acts at a single point. Rotation and air resistance can be ignored.
- **Rod**: all its mass is along a straight line; it is **rigid** (does not bend) and has no thickness.
- **Lamina**: a flat object with area but negligible thickness (a sheet of metal).
- **Uniform**: the mass is evenly spread, so the centre of mass is at the geometric centre.
- **Light**: the object has negligible mass. A light string has the **same tension** throughout.
- **Inextensible**: a string does not stretch, so objects joined by it move with the **same speed and acceleration**.
- **Smooth**: there is no friction. A smooth pulley means the tension is the same on both sides.
- **Rough**: friction is present.
- **Wire**: a rigid thin length of metal treated as one-dimensional.
- **Bead**: a particle threaded on a wire or string.
- **Peg**: a fixed support (smooth or rough) from which something can hang or rest.
- **Air resistance negligible**: ignore drag; often unrealistic for light, fast or large objects.
- **Gravity**: $g=9.8$ m s$^{-2}$, constant and acting vertically downwards (Edexcel uses 9.8 unless told otherwise).
### Quantities and units
Mechanics uses SI units:
- mass: kilogram (kg); length/displacement: metre (m); time: second (s)
- speed/velocity: m s$^{-1}$; acceleration: m s$^{-2}$
- force and weight: newton (N), where $1\text{ N}=1\text{ kg m s}^{-2}$
Weight is a force: **$W=mg$**. A 5 kg mass has weight $5g=49$ N. Convert units first: km h$^{-1}$ to m s$^{-1}$, divide by 3.6; grams to kilograms, divide by 1000.
### Working with vectors
**Scalars** have size only: distance, speed, time, mass. **Vectors** have size and direction: displacement, velocity, acceleration, force.
- Speed is the magnitude of velocity; distance is the magnitude of displacement (only for straight-line motion in one direction).
- In 2D, vectors are written with $\mathbf i$ and $\mathbf j$: a velocity $(3\mathbf i+4\mathbf j)$ m s$^{-1}$ has speed $5$ m s$^{-1}$.
- The direction is found with trigonometry, often as an angle with $\mathbf i$ or a bearing.
> **Worked example.** A boat travels with velocity $(5\mathbf i-12\mathbf j)$ km h$^{-1}$, where $\mathbf j$ is north. Speed $=\sqrt{25+144}=13$ km h$^{-1}$. It travels south of east: the angle below $\mathbf i$ is $\tan^{-1}\tfrac{12}5=67.4°$, so the bearing is $90°+67.4°=157.4°$.
### Watch out
- When asked to "state an assumption", relate it to the context: "the ball is modelled as a particle, so air resistance can be ignored".
- Use $g=9.8$ and give final answers to 2 or 3 significant figures (2 s.f. if $g=9.8$ was used and the question expects it).`;

N.m1_9=String.raw`### Displacement–time graphs
For motion in a straight line, plot displacement $s$ against time $t$.
- The **gradient** is the **velocity**.
- A straight line means constant velocity; a horizontal line means at rest; a negative gradient means moving back towards the start.
- Average velocity $=\dfrac{\text{total displacement}}{\text{total time}}$; average speed $=\dfrac{\text{total distance}}{\text{total time}}$.
### Velocity–time graphs
{{svg1}}
- The **gradient** is the **acceleration**.
- The **area** between the graph and the time axis is the **displacement** (area below the axis counts as negative displacement: the object moving backwards). Total **distance** is the total area, all counted as positive.
- A horizontal line means constant velocity (zero acceleration).
> **Worked example.** A train accelerates uniformly from rest to 20 m s$^{-1}$ in 40 s, travels at that speed for 2 minutes, then decelerates uniformly to rest in 30 s. Find the total distance.
> Area of the trapezium $=\tfrac12(120+190)\times20=3100$ m. (Parallel sides: time at constant speed $=120$ s, total time $=190$ s.)
### The constant acceleration formulae (suvat)
For motion in a straight line with **constant** acceleration, using $s$ displacement, $u$ initial velocity, $v$ final velocity, $a$ acceleration and $t$ time:
$$v=u+at\qquad s=\tfrac12(u+v)t$$
$$v^2=u^2+2as\qquad s=ut+\tfrac12at^2\qquad s=vt-\tfrac12at^2$$
**Derivation from the velocity–time graph**: a straight line from $u$ to $v$ over time $t$ has gradient $a=\dfrac{v-u}t$, giving $v=u+at$. The area under it is a trapezium: $s=\tfrac12(u+v)t$. Substituting one into the other gives the rest (e.g. eliminate $v$ to get $s=ut+\tfrac12at^2$; eliminate $t$ to get $v^2=u^2+2as$).
Each formula leaves out one of the five letters. List the three you know and the one you want, and pick the formula that does not involve the fifth.
### Using the formulae
1. Choose a **positive direction**, and give every vector quantity a sign accordingly.
2. Write down $s,u,v,a,t$, filling in what you know.
3. Choose the formula and solve.
> **Worked example.** A car moving at 25 m s$^{-1}$ brakes with deceleration 4 m s$^{-2}$. How far does it travel before stopping, and how long does it take?
> $u=25$, $v=0$, $a=-4$. $v^2=u^2+2as$: $0=625-8s$, $s=78.1$ m. $v=u+at$: $t=6.25$ s.
**Two objects**: write the displacement of each in terms of $t$ (with the same origin and direction), then set them equal to find when they meet. If one starts later, use $t-T$ for its time.
### Vertical motion under gravity
An object moving freely under gravity (no air resistance) has constant acceleration $g=9.8$ m s$^{-2}$ **downwards**.
- If you take up as positive, $a=-9.8$.
- At the **highest point**, $v=0$.
- An object thrown up and caught at the same height has the same speed (opposite direction) when it returns, and takes equal times going up and down.
> **Worked example.** A ball is projected vertically upwards at 14 m s$^{-1}$ from 2 m above the ground. Find (a) the greatest height above the ground, (b) the time to hit the ground.
> Up positive, $a=-9.8$.
> (a) $v=0$: $0=196-19.6s$, $s=10$ m. Greatest height $=12$ m.
> (b) Ground is $s=-2$: $-2=14t-4.9t^2\Rightarrow4.9t^2-14t-2=0\Rightarrow t=2.99$ s (reject the negative root).
"Time when the ball is above a certain height" means solving a quadratic for the two times and finding the difference.
### Watch out
- Suvat needs **constant** acceleration. If acceleration varies with time, use calculus (chapter 11).
- Speed is never negative, but velocity can be. Read whether the question wants distance or displacement.`;

N.m1_10=String.raw`### Force diagrams
Draw every force acting **on** the object, from the point where it acts:
- **Weight** $W=mg$, vertically down.
- **Normal reaction** $R$, perpendicular to the surface the object is on.
- **Friction** $F$, along the surface, opposing motion (or the tendency to move).
- **Tension** $T$ in a string, pulling away from the object along the string; **thrust** (compression) in a rod pushes.
- **Resistance** or **drag**, opposite to the motion.
- **Driving force**, from an engine, forwards.
### Forces as vectors
Forces combine as vectors. The **resultant** is the single force with the same effect: add the $\mathbf i$ and $\mathbf j$ components.
> **Worked example.** Forces $(3\mathbf i+2\mathbf j)$ N, $(-\mathbf i+4\mathbf j)$ N and $(5\mathbf i-3\mathbf j)$ N act on a particle. Resultant $=(7\mathbf i+3\mathbf j)$ N, magnitude $\sqrt{58}=7.6$ N.
If a particle is in **equilibrium**, the resultant is zero: the components in each direction add to zero.
### Newton's laws
1. **First law**: an object stays at rest or moves with constant velocity unless a resultant force acts on it.
2. **Second law**: $\mathbf F=m\mathbf a$. The resultant force equals mass times acceleration, in the direction of the acceleration.
3. **Third law**: if $A$ exerts a force on $B$, then $B$ exerts an equal and opposite force on $A$.
### Forces and acceleration
In one direction, write **resultant force = $ma$**: (forces in the direction of motion) $-$ (forces against it) $=ma$. Perpendicular to the motion, the forces balance.
> **Worked example.** A 1200 kg car has a driving force of 3000 N and resistance of 600 N. $3000-600=1200a$, so $a=2$ m s$^{-2}$.
> **Worked example: a lift.** A 70 kg person stands in a lift accelerating upwards at 0.5 m s$^{-2}$. The floor's reaction: $R-70g=70\times0.5$, so $R=721$ N. (In a lift accelerating downwards, $R$ would be less than $mg$.)
### Motion in two dimensions
With vectors, $\mathbf F=m\mathbf a$ works component by component. Find $\mathbf a=\dfrac{\mathbf F}m$, then use vector suvat: $\mathbf v=\mathbf u+\mathbf at$, $\mathbf r=\mathbf ut+\tfrac12\mathbf at^2$ (from the starting point).
> **Worked example.** A 2 kg particle starts from rest under a constant force $(6\mathbf i-8\mathbf j)$ N. $\mathbf a=(3\mathbf i-4\mathbf j)$ m s$^{-2}$, magnitude 5. After 2 s: $\mathbf v=(6\mathbf i-8\mathbf j)$ m s$^{-1}$, speed 10 m s$^{-1}$.
### Connected particles
{{svg1}}
Objects joined by a light inextensible string (or a tow bar) move with the **same acceleration**. Two methods:
- Treat the **whole system** as one object: internal forces (tension between them) cancel, giving the acceleration quickly.
- Write **$F=ma$ for each particle separately**: this finds the tension.
> **Worked example.** A car of mass 1000 kg tows a trailer of mass 400 kg. The driving force is 2400 N; resistances are 300 N on the car and 100 N on the trailer. Find the acceleration and the tension in the tow bar.
> Whole system: $2400-300-100=1400a$, $a=1.43$ m s$^{-2}$.
> Trailer: $T-100=400\times1.43$, $T=671$ N.
### Pulleys
A light inextensible string over a **smooth** pulley has the same tension on both sides, and the particles have accelerations of equal size.
> **Worked example.** Particles of 5 kg and 3 kg hang on either side of a smooth pulley. Released from rest, the 5 kg falls.
> 5 kg (down positive): $5g-T=5a$. 3 kg (up positive): $T-3g=3a$.
> Add: $2g=8a$, $a=2.45$ m s$^{-2}$. $T=3g+3a=36.75$ N $\approx36.8$ N.
For a particle on a table connected over a pulley at the edge to a hanging particle: the hanging weight drives both; friction (if any) on the table opposes.
After the string breaks or a particle hits the ground, each particle moves independently: the string goes slack and $T=0$. Use the speed at that moment as the new $u$.
### Watch out
- The force on the pulley from the string is the vector sum of the tensions on each side (e.g. $2T$ if both strands are vertical).
- Use $F=ma$ for one particle at a time to find a tension; the whole-system method cannot find it.`;

N.m1_11=String.raw`### Functions of time
When the acceleration is **not constant**, suvat cannot be used. Instead, displacement, velocity and acceleration are given as functions of time, and calculus links them:
$$v=\frac{ds}{dt}\qquad a=\frac{dv}{dt}=\frac{d^2s}{dt^2}$$
Going the other way, integrate:
$$v=\int a\,dt\qquad s=\int v\,dt$$
(Here $s$ is displacement from a fixed point $O$, in a straight line.)
### Using differentiation
> **Worked example.** A particle's displacement from $O$ is $s=t^3-6t^2+9t$ m. Find (a) when it is at rest, (b) its acceleration at $t=4$.
> (a) $v=\dfrac{ds}{dt}=3t^2-12t+9=3(t-1)(t-3)$. At rest when $v=0$: $t=1$ s and $t=3$ s.
> (b) $a=\dfrac{dv}{dt}=6t-12=12$ m s$^{-2}$ at $t=4$.
"At rest" means $v=0$. "Returns to $O$" means $s=0$. "Changes direction" means $v=0$ and $v$ changes sign.
### Maxima and minima problems
To find the **maximum velocity**, set $\dfrac{dv}{dt}=0$ (acceleration zero) and check it is a maximum. To find the **maximum displacement**, set $\dfrac{ds}{dt}=0$ (velocity zero).
> **Worked example.** $v=8t-2t^2$ for $0\le t\le4$. Maximum velocity: $a=8-4t=0$ at $t=2$, so $v_{\max}=8$ m s$^{-1}$.
### Using integration
Integrating gives a constant: find it from the **initial conditions** (e.g. "starts from rest at $O$" gives $v=0$ and $s=0$ at $t=0$).
> **Worked example.** A particle starts from rest at $O$ with acceleration $a=6t-4$. Find $s$ when $t=3$.
> $v=\int(6t-4)\,dt=3t^2-4t+c$; $v=0$ at $t=0$ so $c=0$.
> $s=\int(3t^2-4t)\,dt=t^3-2t^2+k$; $k=0$. At $t=3$: $s=27-18=9$ m.
### Distance travelled when the direction changes
Displacement and distance differ if the particle turns round. Find when $v=0$, then integrate (or use $s$) **separately** over each part, and add the sizes.
> **Worked example.** $v=t^2-4t+3=(t-1)(t-3)$. Distance travelled in the first 3 s.
> $s=\tfrac13t^3-2t^2+3t$. $s(1)=\tfrac43$, $s(3)=0$, $s(0)=0$.
> From 0 to 1 s it moves $\tfrac43$ m; from 1 to 3 s it moves back $\tfrac43$ m. Total distance $=\tfrac83$ m (although the displacement is 0).
### Deriving the constant acceleration formulae
With constant $a$: $v=\int a\,dt=at+c$; at $t=0$, $v=u$, so $v=u+at$. Then $s=\int(u+at)\,dt=ut+\tfrac12at^2$ (taking $s=0$ at $t=0$). The other formulae follow by eliminating $t$. This shows suvat is just a special case of the calculus method.
### Watch out
- Always find the constant of integration from the given conditions.
- Check the domain of $t$ given in the question (models often only apply for $0\le t\le T$).`;

N.m2_4=String.raw`### Moments
A force can make an object turn. Its turning effect about a point is its **moment**:
$$\text{moment}=F\times d$$
where $d$ is the **perpendicular** distance from the point to the **line of action** of the force. Units: N m. State the direction: clockwise or anticlockwise. A force whose line of action passes through the point has zero moment about it.
If the force is at an angle, either use the perpendicular distance, or resolve the force and use the component perpendicular to the rod: moment $=F\sin\theta\times$(distance along the rod).
### Resultant moments
Add the moments about the same point, counting one direction (say clockwise) as positive and the other as negative. The **resultant moment** tells you which way the object turns.
> **Worked example.** A light rod $AB$ of length 4 m has forces 10 N up at $A$, 15 N down at 1 m from $A$, and 8 N up at $B$. Resultant moment about $A$: clockwise $15\times1=15$; anticlockwise $8\times4=32$. Resultant $17$ N m anticlockwise.
### Equilibrium
{{svg1}}
A rigid body is in **equilibrium** when:
1. the resultant force is zero (forces up = forces down, forces left = forces right), **and**
2. the resultant moment about **any** point is zero (clockwise moments = anticlockwise moments).
Strategy: take moments about a point where an unknown force acts, so that force disappears from the equation. Then resolve vertically for the other unknown.
> **Worked example.** A uniform plank $AB$ of length 5 m and mass 20 kg rests horizontally on supports at $A$ and $C$, where $AC=3$ m. Find the reaction at each support.
> Weight $20g$ acts at the centre, 2.5 m from $A$.
> Moments about $A$: $R_C\times3=20g\times2.5$, $R_C=\tfrac{50g}3=163$ N.
> Resolve vertically: $R_A+R_C=20g$, $R_A=\tfrac{10g}3=32.7$ N.
**Non-uniform** rods have their centre of mass somewhere other than the middle: call its distance from one end $x$ and find it from the equilibrium equations.
### Centres of mass
The **centre of mass** is the point where the whole weight can be taken to act. For a uniform rod it is at the midpoint; for a uniform rectangular lamina, at the centre. For particles on a line, the total moment of the weights equals the moment of the total weight acting at the centre of mass:
$$\bar x=\frac{\sum m_ix_i}{\sum m_i}$$
### Tilting
When a rod is on the point of **tilting** (turning) about one support, the reaction at the **other** support becomes **zero**. Set that reaction to 0 and take moments about the support it is about to tilt round.
> **Worked example.** A uniform 4 m rod of weight 60 N rests on supports 1 m from each end. How heavy a load can be placed at one end before it tilts?
> About to tilt about the nearer support $C$: the other reaction is 0. Moments about $C$: $W\times1=60\times1$, so $W=60$ N.
### Watch out
- Moments need **perpendicular** distances.
- In "on the point of tilting" questions, say explicitly that the other reaction is zero.`;

N.m2_5=String.raw`### Resolving forces
Resolving means splitting a force into two perpendicular **components**. A force $F$ at angle $\theta$ to a direction has components $F\cos\theta$ along that direction and $F\sin\theta$ perpendicular to it.
Choose directions that make the problem easy: usually horizontal and vertical, or **parallel and perpendicular to a slope**.
> **Worked example.** A 50 N force pulls a box at $30°$ above the horizontal. Horizontal component $50\cos30°=43.3$ N; vertical component $50\sin30°=25$ N (which reduces the normal reaction).
### Inclined planes
{{svg1}}
For a particle on a slope inclined at $\alpha$ to the horizontal, resolve its weight $mg$:
- **Down the slope**: $mg\sin\alpha$.
- **Into the slope** (perpendicular): $mg\cos\alpha$.
The normal reaction is perpendicular to the slope, so (if nothing else acts perpendicular) $R=mg\cos\alpha$.
Check with extremes: on a flat surface ($\alpha=0$), there is no component down the slope; on a vertical drop ($\alpha=90°$), all of the weight acts along it.
Questions often give $\tan\alpha=\tfrac34$: then $\sin\alpha=\tfrac35$ and $\cos\alpha=\tfrac45$ (a 3-4-5 triangle). Use these exact values.
### Friction
Friction acts along the surface between two objects in contact, **opposing** motion or the tendency to move. Its size can vary, up to a maximum:
$$F\le\mu R$$
- $\mu$ is the **coefficient of friction** (depends on the two surfaces). $\mu=0$ for a smooth surface.
- If the object is **moving**, or is in **limiting equilibrium** (on the point of moving), friction is at its maximum: $F=\mu R$.
- If the object is at rest and not on the point of moving, $F<\mu R$: friction is only as big as needed.
> **Worked example.** A 4 kg box is pulled along rough horizontal ground ($\mu=0.3$) by a horizontal force of 20 N. $R=4g=39.2$ N, so $F=0.3\times39.2=11.76$ N. $20-11.76=4a$, $a=2.06$ m s$^{-2}$.
> **Worked example.** A 2 kg block slides down a rough plane at $30°$ with $\mu=0.2$.
> Perpendicular: $R=2g\cos30°=16.97$ N. Friction $=0.2R=3.39$ N up the slope.
> Along: $2g\sin30°-3.39=2a$, so $a=3.20$ m s$^{-2}$.
### Watch out
- When a force is applied at an angle, it changes $R$, and so changes the maximum friction. Always resolve perpendicular to find $R$ first.
- Friction acts **opposite to the direction of (intended) motion**: up the slope if the particle tends to slide down.`;

N.m2_6=String.raw`### Projectiles
A **projectile** is a particle moving freely under gravity (ignoring air resistance) after being launched. The key idea: the **horizontal and vertical motions are independent**.
- **Horizontally**: no force, so **constant velocity**. $x=(u\cos\alpha)t$.
- **Vertically**: constant acceleration $g$ **downwards**, so use suvat.
- **Time** $t$ is the same in both directions and links them.
### Horizontal projection
A particle projected horizontally at speed $u$ starts with zero vertical velocity.
> **Worked example.** A stone is thrown horizontally at 12 m s$^{-1}$ from a cliff 40 m high. Find how far from the base it lands.
> Vertical (down positive): $u=0$, $a=9.8$, $s=40$. $40=4.9t^2$, $t=2.857$ s.
> Horizontal: $x=12\times2.857=34.3$ m.
### Components of velocity
A particle projected at speed $U$ at angle $\alpha$ above the horizontal has initial components
$$u_x=U\cos\alpha\qquad u_y=U\sin\alpha$$
At any time, velocity components are $v_x=U\cos\alpha$ (unchanged) and $v_y=U\sin\alpha-gt$. The **speed** is $\sqrt{v_x^2+v_y^2}$ and the **direction** is $\tan^{-1}\left(\dfrac{v_y}{v_x}\right)$ to the horizontal. If the projection velocity is given as $(p\mathbf i+q\mathbf j)$, then $u_x=p$ and $u_y=q$ directly.
### Projection at any angle
{{svg1}}
> **Worked example.** A ball is kicked at 20 m s$^{-1}$ at $30°$ above horizontal ground. Find the time of flight, the range and the greatest height.
> $u_x=20\cos30°=17.32$, $u_y=20\sin30°=10$.
> Time of flight (up positive, $s_y=0$): $0=10t-4.9t^2$, $t=2.04$ s.
> Range: $17.32\times2.04=35.3$ m.
> Greatest height ($v_y=0$): $0=100-19.6h$, $h=5.10$ m.
Questions may ask for the times when the particle is above a certain height (solve the vertical quadratic for two times), or where it is when moving at a given angle (set $\dfrac{v_y}{v_x}=\tan\theta$).
### Projectile motion formulae
For projection from ground level onto level ground, the general results (which you may be asked to **derive**):
- Time of flight: $T=\dfrac{2U\sin\alpha}{g}$ (from $0=U\sin\alpha\,t-\tfrac12gt^2$).
- Time to greatest height: $\dfrac{U\sin\alpha}g$.
- Greatest height: $H=\dfrac{U^2\sin^2\alpha}{2g}$ (from $v_y^2=0$).
- Range: $R=\dfrac{U^2\sin2\alpha}{g}$ (horizontal speed $\times T$, using $2\sin\alpha\cos\alpha=\sin2\alpha$). The range is greatest when $\alpha=45°$.
- Trajectory: eliminating $t$ from $x=U\cos\alpha\,t$ and $y=U\sin\alpha\,t-\tfrac12gt^2$ gives
$$y=x\tan\alpha-\frac{gx^2}{2U^2}(1+\tan^2\alpha)$$
### Watch out
- Never put $g$ into the horizontal motion.
- If the landing point is below the launch point, use the vertical displacement (negative if up is positive), not 0.
- State limitations: air resistance and spin are ignored; the ball is modelled as a particle.`;

N.m2_7=String.raw`### Static particles
A particle at rest under several forces is in **equilibrium**: the resultant force is zero. Resolve in two perpendicular directions and set each total to zero. Alternatively, three forces in equilibrium form a **closed triangle**, and the sine rule (Lami-style) can be used.
> **Worked example.** A 5 kg particle hangs from two strings at $30°$ and $60°$ to the horizontal. Find the tensions.
> Horizontal: $T_1\cos30°=T_2\cos60°$. Vertical: $T_1\sin30°+T_2\sin60°=5g$.
> From the first, $T_2=\sqrt3T_1$. Then $\tfrac12T_1+\tfrac32T_1=49$, $T_1=24.5$ N, $T_2=42.4$ N.
### Modelling with statics
State the modelling assumptions used: strings are light and inextensible, the object is a particle, pulleys are smooth. Comment on how answers would change if they were not true.
### Friction and static particles
For a particle at rest on a rough surface, $F\le\mu R$. In **limiting equilibrium** (about to move), $F=\mu R$, and friction acts **opposite to the direction it is about to move**. Questions often ask for the range of a force $P$ that keeps a particle at rest: find $P$ when it is about to slide **down** (friction up the slope) and when about to slide **up** (friction down the slope).
> **Worked example.** A 3 kg box rests on a rough plane at $35°$ with $\mu=0.5$, held by a horizontal force $P$ pushing it towards the slope. Find the minimum $P$ to stop it sliding down.
> Perpendicular: $R=3g\cos35°+P\sin35°=24.08+0.574P$. About to slide down, so friction acts up the slope at its maximum, $0.5R$.
> Along the slope: $P\cos35°+0.5R=3g\sin35°$, so $0.819P+12.04+0.287P=16.86$.
> $1.106P=4.82$, so $P=4.36$ N.
A useful fact: with no other force, a particle on a rough slope stays at rest on its own if $\mu\ge\tan\alpha$. Here $\tan35°=0.70>0.5$, which is why a push was needed.
### Static rigid bodies
For a rigid body (a ladder, a rod) in equilibrium, both conditions apply: resultant force zero **and** resultant moment zero. Usually: resolve horizontally, resolve vertically, and take moments about a well-chosen point (one where unknown forces act).
{{svg1}}
**The ladder problem.** A ladder rests against a smooth wall on rough ground. Forces: weight at its centre, normal reaction $S$ from the wall (horizontal, as the wall is smooth), normal reaction $R$ from the ground (vertical) and friction $F$ at the ground (towards the wall).
> **Worked example.** A uniform ladder of length 6 m and mass 20 kg rests against a smooth wall at $60°$ to the ground. Find the least $\mu$ for it to stay in equilibrium.
> Vertically: $R=20g$. Horizontally: $F=S$.
> Moments about the foot: $S\times6\sin60°=20g\times3\cos60°$, so $S=\dfrac{20g\times1.5}{5.196}=56.6$ N.
> $F=56.6\le\mu\times196$, so $\mu\ge0.289$.
### Dynamics and inclined planes
For a particle **moving** on a slope: resolve perpendicular to find $R$, then use $F=\mu R$, then $F=ma$ along the slope. Note friction acts against the direction of **motion**, which may change if the particle is projected up the slope and then slides back.
> **Worked example.** A particle is projected up a rough plane at $25°$ ($\mu=0.3$) at 8 m s$^{-1}$. Find how far it travels up the slope.
> $R=mg\cos25°$; friction $0.3mg\cos25°$ down the slope (opposing motion up).
> $-mg\sin25°-0.3mg\cos25°=ma$, so $a=-9.8(0.4226+0.2719)=-6.81$ m s$^{-2}$.
> $0=64-2(6.81)s$, $s=4.70$ m.
### Connected particles
Combine the methods: particles on slopes or rough tables connected by strings over pulleys. Write $F=ma$ for each particle along its own direction of motion, with friction where surfaces are rough, and solve simultaneously. The tension is the same throughout a light string over a smooth pulley.
### Watch out
- Draw a large, clear force diagram for each object before writing equations.
- Friction can point either way along a slope: decide from the intended motion.`;

N.m2_8=String.raw`### Vectors in kinematics
In two dimensions, position, velocity and acceleration are vectors in $\mathbf i$ and $\mathbf j$. With **constant** acceleration the vector suvat formulae hold:
$$\mathbf v=\mathbf u+\mathbf at\qquad\mathbf r=\mathbf r_0+\mathbf ut+\tfrac12\mathbf at^2$$
where $\mathbf r_0$ is the starting position. Work in components if it is easier.
> **Worked example.** A particle starts at $(2\mathbf i+\mathbf j)$ m with velocity $(3\mathbf i-4\mathbf j)$ m s$^{-1}$ and constant acceleration $(\mathbf i+2\mathbf j)$ m s$^{-2}$.
> At $t=2$: $\mathbf r=(2\mathbf i+\mathbf j)+(6\mathbf i-8\mathbf j)+\tfrac12(4)(\mathbf i+2\mathbf j)=10\mathbf i-3\mathbf j$ m.
> It moves parallel to $\mathbf i$ when the $\mathbf j$-component of velocity is zero: $-4+2t=0$, $t=2$ s.
"Due north" or "parallel to $\mathbf j$" means the $\mathbf i$-component is zero; "north-east" means the components are equal and positive.
### Vector methods with projectiles
Write gravity as $\mathbf a=-g\mathbf j$ and the launch velocity as $(U\cos\alpha)\mathbf i+(U\sin\alpha)\mathbf j$. Then $\mathbf r=\mathbf ut+\tfrac12\mathbf at^2$ gives the horizontal and vertical positions together, which is exactly the method of chapter 6 in vector form.
### Variable acceleration in one dimension
As in Year 1 chapter 11: $v=\dfrac{ds}{dt}$, $a=\dfrac{dv}{dt}$, and integrate to go back, using initial conditions for the constants. Year 2 adds functions such as $e^{kt}$ and $\sin t$:
> **Worked example.** $v=4e^{-0.5t}$ m s$^{-1}$. Acceleration $a=-2e^{-0.5t}$. Displacement from $O$ (at $O$ when $t=0$): $s=-8e^{-0.5t}+8$. As $t\to\infty$, $s\to8$ m.
### Differentiating vectors
If $\mathbf r=x(t)\mathbf i+y(t)\mathbf j$, differentiate each component separately:
$$\mathbf v=\frac{d\mathbf r}{dt}=\dot x\mathbf i+\dot y\mathbf j\qquad\mathbf a=\frac{d\mathbf v}{dt}=\ddot x\mathbf i+\ddot y\mathbf j$$
(Dots mean derivatives with respect to time.)
> **Worked example.** $\mathbf r=(t^3-3t)\mathbf i+(4t^2)\mathbf j$. $\mathbf v=(3t^2-3)\mathbf i+8t\mathbf j$; $\mathbf a=6t\mathbf i+8\mathbf j$. At $t=1$ the velocity is $8\mathbf j$: moving parallel to $\mathbf j$, at 8 m s$^{-1}$.
Using $\mathbf F=m\mathbf a$ then gives the force at any time.
### Integrating vectors
Integrate each component, with a **constant vector** $\mathbf c$ found from initial conditions:
> **Worked example.** $\mathbf a=(6t\mathbf i-2\mathbf j)$ m s$^{-2}$; at $t=0$ the particle is at rest at $O$.
> $\mathbf v=3t^2\mathbf i-2t\mathbf j+\mathbf c$; $\mathbf v=\mathbf 0$ at $t=0$ so $\mathbf c=\mathbf 0$.
> $\mathbf r=t^3\mathbf i-t^2\mathbf j$ (no constant, since it starts at $O$). At $t=2$: $\mathbf r=8\mathbf i-4\mathbf j$, distance from $O$ $=\sqrt{80}=8.94$ m.
### Watch out
- The constant of integration is a vector: write $\mathbf c$, and find both components.
- Speed is the magnitude of $\mathbf v$; distance from $O$ is the magnitude of $\mathbf r$.`;

window.NOTES2=window.NOTES2||{};
window.NOTES2.mech=N;
})();
