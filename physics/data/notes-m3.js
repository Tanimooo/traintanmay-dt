/* Full topic notes, Module 3: Forces and motion. Replaces the short notes in m3.js (loaded after it). */
(function(){
const N={};

N['3.1']=`
<h2>Describing motion</h2>
<p>Kinematics describes <em>how</em> things move, without asking why (that is forces, topic 3.2). You need five quantities:</p>
<ul>
<li><strong>Distance</strong> (scalar): how far something has travelled along its path, in m.</li>
<li><strong>Displacement</strong> s (vector): the straight-line distance from the start point to the end point, <em>in a stated direction</em>. Run once round a 400 m track and your distance is 400 m but your displacement is 0.</li>
<li><strong>Speed</strong> (scalar): rate of change of distance. <strong>Average speed</strong> = total distance ÷ total time. <strong>Instantaneous speed</strong> is the speed at one moment (what a speedometer shows).</li>
<li><strong>Velocity</strong> v (vector): rate of change of displacement, v = Δs/Δt. Speed in a given direction.</li>
<li><strong>Acceleration</strong> a (vector): rate of change of velocity, <strong>a = Δv/Δt</strong>, in m s<sup>−2</sup>. An acceleration of 3 m s<sup>−2</sup> means the velocity goes up by 3 m s<sup>−1</sup> every second.</li>
</ul>
<p>Because velocity has a direction, an object can accelerate without speeding up: a car going round a bend at a steady 20 m s<sup>−1</sup> is accelerating because its direction is changing (see circular motion, 5.2). A negative acceleration means acceleration in the negative direction. That might be slowing down, or it might be speeding up in the negative direction: it depends which way the object is moving.</p>

<h2>Motion graphs</h2>
<svg class="diagram" viewBox="0 0 560 210" role="img" aria-label="Displacement-time, velocity-time and acceleration-time graphs for uniform acceleration">
<g><line class="ax" x1="20" y1="170" x2="170" y2="170" marker-end="url(#ah)"/><line class="ax" x1="20" y1="170" x2="20" y2="30" marker-end="url(#ah)"/><path class="c1" d="M20 170 Q100 165 160 50"/><text x="30" y="30">s</text><text x="160" y="190">t</text><text x="30" y="205" class="small">gradient = v</text></g>
<g transform="translate(190 0)"><line class="ax" x1="20" y1="170" x2="170" y2="170" marker-end="url(#ah)"/><line class="ax" x1="20" y1="170" x2="20" y2="30" marker-end="url(#ah)"/><path class="fillsoft" d="M20 170 L160 60 L160 170 Z"/><line class="c1" x1="20" y1="170" x2="160" y2="60"/><text x="30" y="30">v</text><text x="160" y="190">t</text><text x="30" y="205" class="small">gradient = a, area = s</text></g>
<g transform="translate(380 0)"><line class="ax" x1="20" y1="170" x2="170" y2="170" marker-end="url(#ah)"/><line class="ax" x1="20" y1="170" x2="20" y2="30" marker-end="url(#ah)"/><line class="c1" x1="20" y1="100" x2="160" y2="100"/><text x="30" y="30">a</text><text x="160" y="190">t</text><text x="30" y="205" class="small">area = Δv</text></g>
</svg>
<p>The three graphs above all show the same motion: an object speeding up at a constant rate from rest.</p>
<h3>Displacement–time (s–t) graphs</h3>
<ul>
<li><strong>Gradient = velocity</strong>, because gradient = Δs/Δt.</li>
<li>Straight line: constant velocity. Horizontal line: stationary. Curving upwards (getting steeper): accelerating. Getting flatter: decelerating.</li>
<li>For a curve, the <strong>instantaneous velocity</strong> is the gradient of the <strong>tangent</strong> at that point. Draw the tangent with a ruler so it just touches the curve, then use a large triangle.</li>
<li>A distance–time graph is the same idea for speed; distance can never decrease, so it never slopes down.</li>
</ul>
<h3>Velocity–time (v–t) graphs</h3>
<ul>
<li><strong>Gradient = acceleration</strong> (Δv/Δt). A straight line means constant acceleration.</li>
<li><strong>Area under the graph = displacement</strong>. Why: for a short time Δt the displacement is v × Δt, which is a thin strip of area. Adding all the strips gives the total area.</li>
<li>Area below the time axis (negative velocity) counts as negative displacement: the object is moving backwards.</li>
<li>For a curved v–t graph, estimate the area by counting squares or splitting it into trapezia.</li>
</ul>
<h3>Acceleration–time (a–t) graphs</h3>
<p>Area under the graph = <strong>change in velocity</strong> Δv. A horizontal line means constant (uniform) acceleration.</p>
<div class="wex"><p><strong>Worked example.</strong> A car accelerates uniformly from rest to 12 m s<sup>−1</sup> in 4.0 s, travels at this speed for 6.0 s, then brakes uniformly to rest in 3.0 s. Find the total distance.</p>
<p>Area = triangle + rectangle + triangle = (½ × 4.0 × 12) + (6.0 × 12) + (½ × 3.0 × 12) = 24 + 72 + 18 = <strong>114 m</strong>.</p>
<p>The acceleration in the first stage is the gradient: 12/4.0 = 3.0 m s<sup>−2</sup>; while braking it is −12/3.0 = −4.0 m s<sup>−2</sup>.</p></div>

<h2>The suvat equations</h2>
<p>When the acceleration is <strong>constant</strong>, motion in a straight line obeys four equations linking five quantities: s displacement, u initial velocity, v final velocity, a acceleration and t time.</p>
<div class="eqgrid"><div>v = u + at</div><div>s = ½(u + v)t</div><div>s = ut + ½at²</div><div>v² = u² + 2as</div></div>
<h3>Where they come from</h3>
<p>Picture the v–t graph: a straight line from v = u at t = 0 to v at time t.</p>
<ol>
<li>The gradient is the acceleration: a = (v − u)/t. Rearranging gives <strong>v = u + at</strong>.</li>
<li>The area under the line is a trapezium with parallel sides u and v and width t, so <strong>s = ½(u + v)t</strong>. In words: displacement = average velocity × time, which only works because the acceleration is constant.</li>
<li>Substitute v = u + at into equation 2: s = ½(u + u + at)t = <strong>ut + ½at²</strong>. On the graph this is the rectangle ut plus the triangle ½ × t × at.</li>
<li>Rearrange equation 1 to t = (v − u)/a and substitute into equation 2: s = ½(u + v)(v − u)/a, so 2as = v² − u², giving <strong>v² = u² + 2as</strong>.</li>
</ol>
<h3>How to use them</h3>
<ol>
<li>Write down s, u, v, a, t, filling in the three you know and marking the one you want.</li>
<li>Choose a positive direction and stick to it. Anything pointing the other way is negative.</li>
<li>Pick the equation that contains your three knowns and the unknown, and leaves out the fifth quantity.</li>
</ol>
<p>Look for hidden information: "from rest" means u = 0; "comes to a stop" means v = 0; "dropped" means u = 0 and a = 9.81 m s<sup>−2</sup> downwards; at the top of a vertical throw v = 0.</p>
<div class="wex"><p><strong>Worked example.</strong> A ball is thrown vertically upwards at 15 m s<sup>−1</sup>. Find (a) its maximum height and (b) the time until it returns to the hand.</p>
<p>Take up as positive, so a = −9.81 m s<sup>−2</sup>.</p>
<p>(a) At the top v = 0. Using v² = u² + 2as: 0 = 15² + 2(−9.81)s, so s = 225/19.62 = <strong>11.5 m</strong>.</p>
<p>(b) Back at the hand s = 0. Using s = ut + ½at²: 0 = 15t − 4.905t², so t = 15/4.905 = <strong>3.06 s</strong>. (The other solution, t = 0, is the moment it was thrown.)</p></div>
<p>Never use suvat if the acceleration changes, for example a falling object with significant air resistance. Use the graph instead.</p>

<h2>Free fall and measuring g</h2>
<p>An object in <strong>free fall</strong> has only its weight acting on it. Near the Earth's surface every such object accelerates downwards at the same rate, <strong>g = 9.81 m s<sup>−2</sup></strong>, whatever its mass. (A heavier object has a bigger weight, but also more mass to accelerate; the two effects cancel. See 3.2.) In real life air resistance makes light, wide objects like feathers fall more slowly; in a vacuum a feather and a hammer fall together.</p>
<h3>Determining g in the lab (PAG 1)</h3>
<p>Method using an electromagnet and trapdoor: an electromagnet holds a steel ball at height h above a trapdoor. Switching off the magnet starts an electronic timer; the ball hitting the trapdoor stops it. Repeat for 6 or more heights, timing each several times.</p>
<p>Analysis: from rest, s = ½gt², so <strong>h = ½g t²</strong>. Plot h against t². It is a straight line through the origin with <strong>gradient = g/2</strong>, so g = 2 × gradient.</p>
<ul>
<li>A delay in the magnet releasing the ball (residual magnetism) adds a constant time to every reading: a systematic error. It shows up as a line that does not pass through the origin.</li>
<li>Measure h from the <em>bottom</em> of the ball to the trapdoor.</li>
<li>Alternatives: a light gate measuring the speed of a falling card or picket fence at different heights (v² = 2gh, so plot v² against h, gradient 2g); video analysis frame by frame; a ticker-timer.</li>
</ul>

<h2>Stopping distances</h2>
<p>When a driver sees a hazard, the car travels some distance before the brakes are even applied, and then more distance while braking.</p>
<div class="eqgrid"><div>stopping distance = thinking distance + braking distance</div></div>
<ul>
<li><strong>Thinking distance</strong> = speed × reaction time. The car is still moving at its original constant speed while the driver reacts, so thinking distance ∝ speed. Reaction time is typically 0.5–1.0 s and gets longer with tiredness, alcohol, drugs, age and distractions such as phones.</li>
<li><strong>Braking distance</strong> is the distance travelled while braking. The braking force F does work to remove the car's kinetic energy: Fd = ½mv², so <strong>d = mv²/2F</strong>. Braking distance is proportional to <strong>v²</strong>: double the speed and the braking distance quadruples. It increases with a larger mass, wet or icy roads, and worn tyres or brakes (all of which reduce the maximum braking force before skidding).</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> A car travels at 20 m s<sup>−1</sup>. The driver's reaction time is 0.70 s and the car decelerates at 6.5 m s<sup>−2</sup>. Find the stopping distance.</p>
<p>Thinking distance = 20 × 0.70 = 14 m.</p>
<p>Braking distance: v² = u² + 2as gives 0 = 20² + 2(−6.5)s, so s = 400/13 = 30.8 m.</p>
<p>Stopping distance = 14 + 30.8 = <strong>45 m</strong>.</p></div>

<h2>Projectile motion</h2>
<p>A <strong>projectile</strong> is anything moving through the air under gravity alone: a thrown ball, a long jumper, a stone kicked off a cliff. The key idea is that <strong>the horizontal and vertical motions are independent</strong>. Gravity acts only vertically, so it cannot change the horizontal velocity.</p>
<svg class="diagram" viewBox="0 0 540 220" role="img" aria-label="Projectile path with constant horizontal velocity and changing vertical velocity">
<line class="ax" x1="30" y1="190" x2="520" y2="190"/>
<path class="c1" d="M40 190 Q270 -50 500 190"/>
<g class="c2 thick"><line x1="40" y1="190" x2="100" y2="190" marker-end="url(#aha)"/><line x1="40" y1="190" x2="40" y2="120" marker-end="url(#aha)"/></g>
<g class="c2 thick"><line x1="270" y1="70" x2="330" y2="70" marker-end="url(#aha)"/></g>
<g class="c2 thick"><line x1="470" y1="150" x2="530" y2="150" marker-end="url(#aha)"/><line x1="470" y1="150" x2="470" y2="205" marker-end="url(#aha)"/></g>
<text x="60" y="110" class="small">u sin θ</text><text x="100" y="206" class="small">u cos θ</text><text x="235" y="60" class="small">v<tspan dy="3" font-size="9">y</tspan><tspan dy="-3"> = 0 at top</tspan></text></svg>
<p>Ignoring air resistance:</p>
<div class="tbl"><table><tr><th></th><th>Horizontal</th><th>Vertical</th></tr>
<tr><td>Acceleration</td><td>0</td><td>g = 9.81 m s<sup>−2</sup> downwards</td></tr>
<tr><td>Initial velocity</td><td>u<sub>x</sub> = u cos θ</td><td>u<sub>y</sub> = u sin θ</td></tr>
<tr><td>Equation to use</td><td>x = u<sub>x</sub> t (constant velocity)</td><td>suvat</td></tr></table></div>
<p>Time t is the same in both directions, so it is the link between them. A typical method: use the vertical motion to find the time of flight, then use that time in the horizontal motion to find the range.</p>
<div class="wex"><p><strong>Worked example: horizontal launch.</strong> A stone is kicked horizontally at 8.0 m s<sup>−1</sup> off a cliff 20 m high. Where does it land?</p>
<p>Vertical (down positive): u<sub>y</sub> = 0, a = 9.81, s = 20. s = ½at² gives t = √(2 × 20/9.81) = 2.02 s.</p>
<p>Horizontal: x = 8.0 × 2.02 = <strong>16 m</strong> from the foot of the cliff.</p>
<p>Speed on landing: v<sub>y</sub> = 9.81 × 2.02 = 19.8 m s<sup>−1</sup>, v<sub>x</sub> = 8.0 m s<sup>−1</sup> still. v = √(8.0² + 19.8²) = 21 m s<sup>−1</sup> at tan<sup>−1</sup>(19.8/8.0) = 68° below the horizontal.</p></div>
<div class="wex"><p><strong>Worked example: angled launch.</strong> A ball is kicked at 20 m s<sup>−1</sup> at 30° above level ground. Find the time of flight, the range and the maximum height.</p>
<p>u<sub>x</sub> = 20 cos 30° = 17.3 m s<sup>−1</sup>; u<sub>y</sub> = 20 sin 30° = 10.0 m s<sup>−1</sup>.</p>
<p>Time of flight (up positive, s = 0 on landing): 0 = 10t − 4.905t², so t = 2.04 s.</p>
<p>Range = 17.3 × 2.04 = <strong>35 m</strong>.</p>
<p>Maximum height (v<sub>y</sub> = 0): 0 = 10² − 2(9.81)h, so h = <strong>5.1 m</strong>.</p></div>
<ul>
<li>At the highest point the vertical velocity is zero, but the horizontal velocity is not, so the speed is u<sub>x</sub>, not zero.</li>
<li>A ball dropped and a ball thrown horizontally from the same height land at the same time: their vertical motions are identical.</li>
<li>On level ground (no air resistance) the range is greatest for a 45° launch, and the path is symmetrical.</li>
<li>With air resistance the range and maximum height are both smaller and the path is no longer symmetrical: the descent is steeper than the climb.</li>
</ul>
<blockquote class="tip"><p><strong>Exam tip:</strong> set out projectile answers in two labelled columns, "horizontal" and "vertical", and never mix the two velocities in one suvat equation.</p></blockquote>
`;

N['3.2']=`
<h2>Force, mass and Newton's second law</h2>
<p>A <strong>force</strong> is a push or a pull. Forces change an object's velocity (speed it up, slow it down or change its direction) or change its shape. Force is a vector measured in newtons (N).</p>
<p>If several forces act, what matters is the <strong>net (resultant) force</strong>, the vector sum of all of them. Newton's second law links it to the acceleration:</p>
<div class="eqgrid"><div>F<sub>net</sub> = ma</div></div>
<p>The acceleration is in the same direction as the net force. This equation also defines the newton: <strong>1 N is the net force that gives a mass of 1 kg an acceleration of 1 m s<sup>−2</sup></strong>. (Topic 3.5 shows the more general form, F = Δp/Δt.)</p>
<h3>Mass and weight</h3>
<ul>
<li><strong>Mass</strong> (kg) is a measure of how much matter an object has, and of its <strong>inertia</strong>: how hard it is to change its velocity. It is a scalar and is the same everywhere.</li>
<li><strong>Weight</strong> (N) is the gravitational force on the object: <strong>W = mg</strong>, where g is the gravitational field strength (9.81 N kg<sup>−1</sup> on Earth). It is a vector, acting towards the centre of the Earth, and it changes from place to place (it is about one-sixth as big on the Moon).</li>
</ul>
<p>Why all objects fall with the same acceleration: a = F/m = mg/m = g. The mass cancels.</p>

<h2>Free-body diagrams</h2>
<p>A free-body diagram shows <strong>one object</strong> and <strong>only the forces acting on it</strong>, each drawn as an arrow from the point where it acts, with length roughly showing its size. Forces you will commonly need:</p>
<ul>
<li><strong>Weight</strong> W = mg, acting down from the centre of gravity.</li>
<li><strong>Normal contact force</strong> (reaction) N, at right angles to the surface the object is touching.</li>
<li><strong>Friction</strong>, along the surface, opposing sliding (or the tendency to slide).</li>
<li><strong>Tension</strong> T, along a string or rope, pulling away from the object.</li>
<li><strong>Drag</strong> (air resistance), opposite to the velocity.</li>
<li><strong>Upthrust</strong>, upwards, from a fluid.</li>
</ul>
<svg class="diagram" viewBox="0 0 520 220" role="img" aria-label="Free-body diagram of a skydiver: weight down, drag up">
<rect x="230" y="90" width="50" height="40" rx="8" class="fill2 ax"/>
<line class="ax thick" x1="255" y1="130" x2="255" y2="205" marker-end="url(#ah)"/><text x="262" y="200">W = mg</text>
<line class="c1 thick" x1="255" y1="90" x2="255" y2="30" marker-end="url(#ahb)"/><text x="262" y="40" class="lbl1">drag D</text>
<text x="330" y="112">F<tspan font-size="9" dy="3">net</tspan><tspan dy="-3"> = mg − D</tspan></text></svg>
<p>To solve a problem: draw the diagram, choose a positive direction, write the net force as (forces in the positive direction) − (forces in the other direction), then set it equal to ma.</p>
<div class="wex"><p><strong>Worked example: a lift.</strong> A 600 kg lift is pulled up by a cable. Find the tension when the lift accelerates upwards at 1.5 m s<sup>−2</sup>.</p>
<p>Up positive: T − mg = ma, so T = m(g + a) = 600 × (9.81 + 1.5) = <strong>6800 N</strong>.</p>
<p>When moving at constant velocity, a = 0 and T = mg = 5900 N. When accelerating downwards at 1.5 m s<sup>−2</sup>, T = m(g − a) = 5000 N.</p></div>
<div class="wex"><p><strong>Worked example: connected objects.</strong> A 3.0 kg trolley on a smooth bench is pulled by a string over a pulley attached to a hanging 1.0 kg mass. Find the acceleration and the tension.</p>
<p>Treat both as one system: the only unbalanced force is the hanging weight, 1.0 × 9.81 = 9.81 N, accelerating a total of 4.0 kg. a = 9.81/4.0 = <strong>2.45 m s<sup>−2</sup></strong>.</p>
<p>For the trolley alone: T = ma = 3.0 × 2.45 = <strong>7.4 N</strong>. (Less than the hanging weight, otherwise the hanging mass would not accelerate.)</p></div>
<h3>Two-dimensional problems</h3>
<p>When the forces are not all along one line, resolve them (topic 2.3) and apply F = ma separately in two perpendicular directions. On a slope, resolve along and perpendicular to the slope.</p>
<div class="wex"><p><strong>Worked example.</strong> A 5.0 kg block slides down a 30° slope against a friction force of 12 N. Find its acceleration.</p>
<p>Along the slope (down positive): mg sin 30° − 12 = ma, so 24.5 − 12 = 5.0a and a = <strong>2.5 m s<sup>−2</sup></strong>.</p></div>

<h2>Drag and terminal velocity</h2>
<p><strong>Drag</strong> is the resistive force on an object moving through a fluid (a liquid or gas). It always acts opposite to the object's velocity. It is caused by the object having to push the fluid out of the way. Drag increases with:</p>
<ul>
<li>the <strong>speed</strong> of the object (for fast objects drag is roughly proportional to v²);</li>
<li>the <strong>cross-sectional area</strong> facing the flow;</li>
<li>a less streamlined <strong>shape</strong>;</li>
<li>the <strong>density</strong> and <strong>viscosity</strong> of the fluid (much bigger in water than air).</li>
</ul>
<h3>Falling with drag</h3>
<p>Consider a skydiver jumping from a plane:</p>
<ol>
<li>At the start v = 0, so drag = 0. The only force is weight, so a = g.</li>
<li>As the speed increases, drag increases. The net force (mg − D) gets smaller, so the acceleration decreases. The speed still increases, but more slowly.</li>
<li>Eventually drag equals weight. The net force is zero, so the acceleration is zero and the skydiver falls at a constant <strong>terminal velocity</strong>.</li>
<li>Opening the parachute greatly increases the area, so drag suddenly becomes much bigger than weight. The net force is upwards and the skydiver decelerates. As they slow down, drag falls until it equals weight again, at a new, lower terminal velocity.</li>
</ol>
<svg class="diagram" viewBox="0 0 520 200" role="img" aria-label="Velocity-time graph rising to terminal velocity, then a parachute drop to a lower terminal velocity">
<line class="ax" x1="40" y1="170" x2="500" y2="170" marker-end="url(#ah)"/><line class="ax" x1="40" y1="170" x2="40" y2="20" marker-end="url(#ah)"/>
<path class="c1" d="M40 170 C110 60 150 45 250 42 L260 42 C270 140 280 128 330 132 L490 132"/>
<line class="dash ax" x1="40" y1="42" x2="250" y2="42"/><text x="46" y="36" class="small">terminal velocity 1</text><text x="330" y="124" class="small">parachute open → lower terminal velocity</text><text x="22" y="30">v</text><text x="485" y="190">t</text></svg>
<p>On this v–t graph the gradient starts at g and decreases to zero. The same ideas apply to a car: its top speed is reached when the driving force equals the total resistive force.</p>
<p>Practical (PAG 1.2): drop ball bearings into a tall tube of glycerol or oil, with rubber bands at equal distances down the tube. Time the ball between bands. When the times between bands become equal, the ball has reached terminal velocity.</p>

<h2>Moments</h2>
<p>A force can make an object turn as well as move. The turning effect is the <strong>moment</strong>:</p>
<div class="eqgrid"><div>moment = F × d</div></div>
<p>where d is the <strong>perpendicular distance</strong> from the pivot to the <strong>line of action</strong> of the force. Unit: N m. A force whose line of action passes through the pivot has no moment. If the force acts at angle θ to the bar, the moment is F × d sin θ (only the perpendicular component turns it).</p>
<h3>The principle of moments</h3>
<p><strong>For an object in equilibrium, the sum of the clockwise moments about any point equals the sum of the anticlockwise moments about that point.</strong></p>
<p>Taking moments about the point where an unknown force acts is a useful trick: that force has no moment about that point, so it drops out of the equation.</p>
<div class="wex"><p><strong>Worked example.</strong> A uniform 2.0 m plank of weight 120 N rests on supports at each end. A 500 N person stands 0.50 m from the left end. Find the force on each support.</p>
<p>The plank's weight acts at its centre (it is uniform), 1.0 m from each end.</p>
<p>Moments about the left support: clockwise = 500 × 0.50 + 120 × 1.0 = 370 N m. Anticlockwise = R<sub>right</sub> × 2.0. So R<sub>right</sub> = <strong>185 N</strong>.</p>
<p>Vertical forces balance: R<sub>left</sub> + 185 = 500 + 120, so R<sub>left</sub> = <strong>435 N</strong>. (More of the load is on the support nearer the person, as you would expect.)</p></div>
<h3>Couples and torque</h3>
<p>A <strong>couple</strong> is a pair of equal and opposite forces whose lines of action are parallel but do not coincide, for example your hands turning a steering wheel. The net force is zero, so there is no acceleration of the object as a whole, but there is a turning effect.</p>
<div class="eqgrid"><div>torque of a couple = F × d</div></div>
<p>Here F is <em>one</em> of the forces and d is the perpendicular distance <em>between</em> the two lines of action.</p>
<h3>Centre of mass and centre of gravity</h3>
<p>The <strong>centre of mass</strong> is the point where all the mass of an object can be taken to be concentrated. The <strong>centre of gravity</strong> is the point where its whole weight can be taken to act. In a uniform gravitational field they are the same point. For a uniform, symmetrical object it is at the geometric centre.</p>
<p>To find the centre of gravity of a flat irregular shape (a lamina): hang it from a pin through one point so it swings freely, hang a plumb line from the same pin and draw along it. Repeat from a second point. The centre of gravity is where the lines cross, because when an object hangs freely its centre of gravity always ends up directly below the pivot.</p>
<p>An object topples when its centre of gravity moves outside its base, because then its weight has a moment about the edge that turns it over. A low centre of gravity and a wide base make an object more stable.</p>

<h2>Equilibrium</h2>
<p>An object is in <strong>equilibrium</strong> when:</p>
<ol><li>the resultant force on it is zero (so it does not accelerate), and</li><li>the resultant moment about any point is zero (so it does not start rotating).</li></ol>
<p>For three forces in equilibrium, the forces drawn tip to tail form a <strong>closed triangle</strong>. If you know one force and the directions of the other two, you can draw the triangle to scale or use trigonometry (sine and cosine rules) to find the unknowns. The lines of action of three non-parallel forces in equilibrium must also all pass through one point.</p>
<div class="wex"><p><strong>Worked example.</strong> A 20 N picture hangs from two strings, each at 30° to the horizontal. Find the tension in each string.</p>
<p>By symmetry the tensions are equal. The vertical components must hold up the weight: 2T sin 30° = 20, so T = <strong>20 N</strong>.</p>
<p>The horizontal components (T cos 30°) cancel. Notice that if the strings were nearly horizontal, sin θ would be tiny and the tension huge, which is why a washing line can never be pulled perfectly straight.</p></div>

<h2>Density and pressure</h2>
<div class="eqgrid"><div>ρ = m / V</div><div>p = F / A</div><div>p = hρg</div></div>
<ul>
<li><strong>Density</strong> ρ is mass per unit volume, in kg m<sup>−3</sup>. Water is 1000 kg m<sup>−3</sup>. To measure it for a regular solid, find the mass on a balance and calculate the volume from measurements; for an irregular solid, use the volume of water it displaces.</li>
<li><strong>Pressure</strong> p is the normal force per unit area, in pascals (1 Pa = 1 N m<sup>−2</sup>).</li>
</ul>
<h3>Pressure in a fluid</h3>
<p>Imagine a column of liquid of height h and cross-sectional area A above a point. Its volume is Ah, its mass is ρAh and its weight is ρAhg. The pressure from it is weight ÷ area = ρAhg/A = <strong>hρg</strong>.</p>
<p>So the pressure in a fluid depends only on the depth and the density of the fluid (and g), not on the shape of the container. It acts equally in all directions. The total pressure at depth h in a lake also includes the atmospheric pressure on the surface: p = p<sub>atm</sub> + hρg.</p>
<h3>Upthrust and Archimedes' principle</h3>
<p>An object in a fluid feels an upward force, the <strong>upthrust</strong>. It exists because pressure increases with depth: the bottom of the object is deeper than its top, so the fluid pushes up on the bottom harder than it pushes down on the top.</p>
<p>For a block of area A and height h: upward push − downward push = (h<sub>bottom</sub> − h<sub>top</sub>)ρgA = ρghA = ρgV. And ρV × g is exactly the weight of the fluid that would fill the space the object takes up. This gives <strong>Archimedes' principle</strong>:</p>
<blockquote class="tip"><p><strong>The upthrust on an object in a fluid equals the weight of the fluid it displaces.</strong></p></blockquote>
<ul>
<li>If the upthrust when fully submerged is greater than the weight, the object rises and floats. A floating object sinks just far enough that upthrust = weight.</li>
<li>An object floats if its average density is less than the fluid's. A steel ship floats because its hollow shape displaces a lot of water.</li>
</ul>
<div class="wex"><p><strong>Worked example.</strong> A 0.50 m³ buoy of mass 200 kg is held fully under seawater (ρ = 1030 kg m<sup>−3</sup>) by a chain. Find the tension in the chain.</p>
<p>Upthrust = ρVg = 1030 × 0.50 × 9.81 = 5050 N. Weight = 200 × 9.81 = 1960 N.</p>
<p>In equilibrium: upthrust = weight + tension, so T = 5050 − 1960 = <strong>3100 N</strong>.</p></div>
`;

N['3.3']=`
<h2>Work done</h2>
<p>In physics, <strong>work is done when a force moves its point of application</strong> in the direction of the force. The work done equals the energy transferred.</p>
<div class="eqgrid"><div>W = Fx cos θ</div></div>
<p>Here x is the displacement and θ is the angle between the force and the direction of motion. Only the component of force along the motion, F cos θ, does work.</p>
<ul>
<li>θ = 0 (force along the motion): W = Fx.</li>
<li>θ = 90° (force at right angles to the motion): no work is done. Carrying a bag horizontally does no work on the bag against gravity; the Moon's gravity does no work on a circular orbit.</li>
<li>θ = 180° (force opposing the motion, like friction): the work done by that force is negative. It removes energy from the object.</li>
</ul>
<p><strong>The joule</strong>: 1 J is the work done when a force of 1 N moves its point of application through 1 m in the direction of the force. So 1 J = 1 N m = 1 kg m<sup>2</sup> s<sup>−2</sup>.</p>
<div class="wex"><p><strong>Worked example.</strong> A sledge is pulled 40 m across level snow by a rope at 25° to the horizontal with a tension of 60 N. Work done = 60 × 40 × cos 25° = <strong>2200 J</strong>.</p></div>
<p>If the force varies, the work done is the <strong>area under a force–displacement graph</strong>. (This is how we find the energy stored in a stretched spring in 3.4.)</p>

<h2>Energy and its conservation</h2>
<p><strong>Energy</strong> is the capacity to do work. Some stores and transfers you will meet: kinetic, gravitational potential, elastic potential, thermal (internal), chemical, nuclear, electrical, and energy carried by light and sound.</p>
<p><strong>Principle of conservation of energy: energy cannot be created or destroyed. It can only be transferred from one form to another, so the total energy of a closed system stays constant.</strong></p>
<p>Doing work is one way of transferring energy: <strong>work done = energy transferred</strong>. When friction or drag acts, the work done against it is transferred to thermal energy (heating the surfaces and surroundings). The energy is still there, but spread out and no longer useful.</p>

<h2>Kinetic energy</h2>
<p>Kinetic energy is the energy an object has because it is moving:</p>
<div class="eqgrid"><div>E<sub>k</sub> = ½mv²</div></div>
<p><strong>Derivation from first principles.</strong> Start with an object of mass m at rest. Apply a constant net force F over a distance s so it reaches speed v. The work done on it is W = Fs. From Newton's second law, F = ma. From suvat with u = 0, v² = 2as, so s = v²/2a. Therefore W = ma × v²/2a = ½mv². All this work has become kinetic energy, so E<sub>k</sub> = ½mv².</p>
<p>Because of the v², doubling the speed quadruples the kinetic energy. (This is why braking distance ∝ v², topic 3.1.)</p>

<h2>Gravitational potential energy</h2>
<p>Lifting an object of mass m at a steady speed needs a force equal to its weight, mg. Raising it through a height Δh does work mgΔh, which is stored as gravitational potential energy:</p>
<div class="eqgrid"><div>ΔE<sub>p</sub> = mgΔh</div></div>
<p>This is a <em>change</em> in energy. We only ever care about changes, so you can choose where h = 0 to be. The equation only works where g is constant, near the Earth's surface. (For large distances, see gravitational potential in 5.4.)</p>

<h2>Exchanges between kinetic and potential energy</h2>
<p>When an object falls freely, gravitational potential energy becomes kinetic energy. With no air resistance, energy lost = energy gained:</p>
<p>mgh = ½mv², so <strong>v = √(2gh)</strong>. The mass cancels, so all objects dropped from the same height land at the same speed (as 3.1 found from suvat).</p>
<div class="wex"><p><strong>Worked example: a roller coaster.</strong> A 500 kg car starts from rest at the top of a 30 m drop. (a) Find its speed at the bottom with no friction. (b) Its actual speed is 22 m s<sup>−1</sup>. Find the average resistive force if the track is 80 m long.</p>
<p>(a) v = √(2 × 9.81 × 30) = <strong>24.3 m s<sup>−1</sup></strong>.</p>
<p>(b) E<sub>p</sub> lost = 500 × 9.81 × 30 = 147 000 J. E<sub>k</sub> gained = ½ × 500 × 22² = 121 000 J. Energy transferred by friction = 26 000 J = F × 80, so F = <strong>330 N</strong>.</p></div>
<p>A pendulum keeps swapping between the two: maximum E<sub>p</sub> and zero E<sub>k</sub> at the ends of the swing, maximum E<sub>k</sub> at the bottom. Air resistance gradually transfers its energy to the surroundings, so the swings die away.</p>

<h2>Power</h2>
<p><strong>Power is the rate of doing work, or the rate of transferring energy.</strong></p>
<div class="eqgrid"><div>P = W / t</div><div>P = Fv</div></div>
<p>The unit is the watt: 1 W = 1 J s<sup>−1</sup>. A 2 kW kettle transfers 2000 J every second.</p>
<p><strong>Derivation of P = Fv.</strong> If a force F moves its point of application a distance Δx in time Δt, then P = W/Δt = FΔx/Δt. And Δx/Δt is the velocity, so P = Fv. This is useful for vehicles: at a constant top speed, the driving force equals the total resistive force, so the power needed is (resistive force) × v.</p>
<div class="wex"><p><strong>Worked example.</strong> A car's engine has a maximum useful output power of 60 kW. At top speed the total resistive force is 1500 N. Find the top speed.</p>
<p>At top speed, driving force = resistive force = 1500 N. v = P/F = 60 000/1500 = <strong>40 m s<sup>−1</sup></strong>.</p></div>

<h2>Efficiency</h2>
<p>No real machine transfers all its input energy usefully: some is always wasted, usually as heat because of friction or electrical resistance.</p>
<div class="eqgrid"><div>efficiency = useful output energy ÷ total input energy × 100%</div></div>
<p>The same works with power: useful output power ÷ total input power. Efficiency has no unit and is always less than 100% (or less than 1 as a decimal).</p>
<svg class="diagram" viewBox="0 0 520 160" role="img" aria-label="Sankey-style energy flow: input splits into useful and wasted">
<path class="fillsoft ax" d="M20 40 H300 C360 40 360 30 420 30 H500 V90 H420 C360 90 360 70 300 70 V120 C330 120 340 150 360 150 H330 C320 140 300 120 280 110 H20 Z"/>
<text x="40" y="70">Input 100 J</text><text x="425" y="65">Useful 70 J</text><text x="260" y="150" class="small">Wasted 30 J (heat, sound)</text></svg>
<div class="wex"><p><strong>Worked example.</strong> An electric motor lifts a 12 kg load through 3.0 m in 5.0 s. It draws 120 W from the supply. Find its efficiency.</p>
<p>Useful output power = mgh/t = 12 × 9.81 × 3.0/5.0 = 70.6 W. Efficiency = 70.6/120 × 100% = <strong>59%</strong>.</p></div>
<blockquote class="tip"><p><strong>Exam tip:</strong> energy questions are often quickest done with conservation of energy rather than suvat, especially when the path is curved (a slide, a pendulum, a ramp). Write "energy lost = energy gained" and fill in each term.</p></blockquote>
`;

N['3.4']=`
<h2>Deforming materials</h2>
<p>A pair of forces pulling an object apart (<strong>tensile</strong> forces) stretches it: it gets an <strong>extension</strong>. A pair of forces squashing it (<strong>compressive</strong> forces) shortens it: it gets a <strong>compression</strong>. A single force on its own would just accelerate the object, so deformation always needs a pair of opposite forces (for a hanging spring, the load pulls down and the support pulls up).</p>
<p>Extension x = new length − original length. Always measure from the original length, not from zero.</p>

<h2>Hooke's law</h2>
<p><strong>Hooke's law: the extension of an object is directly proportional to the force applied, provided the limit of proportionality is not exceeded.</strong></p>
<div class="eqgrid"><div>F = kx</div></div>
<p>k is the <strong>force constant</strong> (or stiffness), in N m<sup>−1</sup>. A large k means a stiff spring: it needs a big force for a small extension. On a force–extension graph k is the <strong>gradient</strong> of the straight-line part. (If you plot extension against force, k = 1/gradient.)</p>
<h3>Investigating force and extension (PAG 2.2)</h3>
<p>Hang a spring from a clamp, with a metre rule clamped vertically beside it and a pointer on the bottom of the spring. Record the original position. Add 100 g masses one at a time, recording the pointer position each time, then remove them one at a time and record again. Read the scale at eye level to avoid parallax. Plot force (weight of masses, mg) against extension. Safety: use a G-clamp to stop the stand toppling and put a box underneath in case the masses fall.</p>
<p>Unloading readings tell you whether the spring has been permanently stretched: if they do not return to zero, the elastic limit was exceeded.</p>
<h3>Springs in series and parallel</h3>
<ul>
<li><strong>Series</strong> (one below the other): each spring carries the full load, so each stretches by its own amount and the extensions add. The combination is less stiff: <strong>1/k<sub>total</sub> = 1/k<sub>1</sub> + 1/k<sub>2</sub></strong>. Two identical springs in series give k/2.</li>
<li><strong>Parallel</strong> (side by side, sharing the load): the extension is the same for both, and the forces add. The combination is stiffer: <strong>k<sub>total</sub> = k<sub>1</sub> + k<sub>2</sub></strong>. Two identical springs in parallel give 2k.</li>
</ul>
<p>(These are the opposite way round from resistors, a common trap.)</p>

<h2>Elastic and plastic deformation</h2>
<ul>
<li><strong>Elastic deformation</strong>: the object returns to its original shape and size when the force is removed. At an atomic level, the bonds between atoms are stretched but not broken.</li>
<li><strong>Plastic deformation</strong>: the object is permanently deformed; it does not return to its original shape. In metals, layers of atoms slip past each other (dislocations move).</li>
<li>The <strong>limit of proportionality</strong> is where the force–extension graph stops being a straight line. The <strong>elastic limit</strong> is the point beyond which deformation becomes plastic. They are often close together but are not the same point.</li>
</ul>

<h2>Elastic potential energy</h2>
<p>Stretching something takes work, and in an elastic deformation that work is stored as <strong>elastic potential energy</strong>. Because the force increases as the extension increases, you cannot just use W = Fx. Instead, <strong>work done = area under the force–extension graph</strong>.</p>
<p>In the Hooke's law region the graph is a straight line through the origin, so the area is a triangle:</p>
<div class="eqgrid"><div>E = ½Fx</div><div>E = ½kx²</div></div>
<p>(The second form uses F = kx.) Beyond the limit of proportionality, find the area by counting squares.</p>
<div class="wex"><p><strong>Worked example.</strong> A spring with k = 40 N m<sup>−1</sup> is stretched by 15 cm and used to fire a 20 g ball horizontally. Find the ball's launch speed, assuming all the energy is transferred.</p>
<p>E = ½ × 40 × 0.15² = 0.45 J. Then ½mv² = 0.45, so v = √(2 × 0.45/0.020) = <strong>6.7 m s<sup>−1</sup></strong>.</p></div>
<h3>Loading and unloading: hysteresis</h3>
<p>For a perfectly elastic spring, the unloading line follows the loading line, so all the stored energy is given back. For a <strong>rubber band</strong>, the unloading curve lies below the loading curve. The area between the curves (the <strong>hysteresis loop</strong>) is energy transferred to thermal energy in the rubber: it gets warm. For a metal stretched past its elastic limit, the unloading line is parallel to the loading line but does not return to zero: the remaining extension is the plastic deformation, and the area between the lines is the work done in permanently deforming it.</p>

<h2>Stress, strain and the Young modulus</h2>
<p>Force–extension graphs describe one particular object. A thicker wire of the same metal is stiffer; a longer one stretches more. To describe the <em>material</em>, we divide out the size of the sample:</p>
<div class="eqgrid"><div>stress σ = F / A</div><div>strain ε = x / L</div><div>E = σ / ε</div></div>
<ul>
<li><strong>Tensile stress</strong> σ: force per unit cross-sectional area, in Pa (N m<sup>−2</sup>). For a wire of diameter d, A = πd²/4.</li>
<li><strong>Tensile strain</strong> ε: extension divided by original length. It is a ratio of two lengths, so it has <strong>no unit</strong>. (Sometimes written as a percentage.)</li>
<li><strong>Young modulus</strong> E: stress ÷ strain, in Pa. It measures the <strong>stiffness of the material</strong>, and is the gradient of the straight part of a stress–strain graph. Steel is about 2 × 10<sup>11</sup> Pa; rubber about 10<sup>6</sup> Pa.</li>
<li><strong>Ultimate tensile strength</strong> (UTS): the maximum stress a material can withstand before it breaks. (The highest point on the stress–strain graph.)</li>
</ul>
<p>Combining them: E = (F/A)/(x/L) = <strong>FL/Ax</strong>.</p>
<div class="wex"><p><strong>Worked example.</strong> A steel wire 2.0 m long and 0.50 mm in diameter stretches 3.0 mm when a 60 N load is hung from it. Find the Young modulus.</p>
<p>A = π(0.50 × 10<sup>−3</sup>)²/4 = 1.96 × 10<sup>−7</sup> m². Stress = 60/1.96 × 10<sup>−7</sup> = 3.06 × 10<sup>8</sup> Pa.</p>
<p>Strain = 3.0 × 10<sup>−3</sup>/2.0 = 1.5 × 10<sup>−3</sup>.</p>
<p>E = 3.06 × 10<sup>8</sup>/1.5 × 10<sup>−3</sup> = <strong>2.0 × 10<sup>11</sup> Pa</strong>, typical of steel. (Watch the mm to m conversions, and remember to square the radius, not the diameter, if you use πr².)</p></div>

<h2>Stress–strain graphs for different materials</h2>
<svg class="diagram" viewBox="0 0 540 240" role="img" aria-label="Stress-strain graphs for ductile, brittle and polymeric materials">
<line class="ax" x1="40" y1="210" x2="520" y2="210" marker-end="url(#ah)"/><line class="ax" x1="40" y1="210" x2="40" y2="20" marker-end="url(#ah)"/>
<text x="20" y="30">σ</text><text x="505" y="230">ε</text>
<path class="c1" d="M40 210 L95 80 C110 70 120 72 140 70 C220 55 300 50 380 62 L392 85"/><text x="300" y="44" class="lbl1">ductile (copper)</text><circle cx="392" cy="85" r="3" class="dotb"/>
<path class="c2" d="M40 210 L110 40"/><circle cx="110" cy="40" r="3" class="dota"/><text x="118" y="36" class="lbl2">brittle (glass, cast iron)</text>
<path class="c3" d="M40 210 C120 195 200 185 260 175 C330 160 400 120 470 105"/><text x="400" y="140" class="lbl3">polymer (rubber)</text>
<text x="96" y="100" class="small">P</text><text x="140" y="88" class="small">Y</text></svg>
<ul>
<li><strong>Ductile</strong> materials (copper, mild steel): a straight elastic region up to the limit of proportionality P, then the <strong>yield point</strong> Y, where the material suddenly stretches a lot for little extra stress. A long plastic region follows. They can be drawn into wires. Near the end the wire "necks" (thins at one point) and breaks.</li>
<li><strong>Brittle</strong> materials (glass, cast iron, ceramics): a straight line right up to fracture, with little or no plastic deformation. They snap suddenly. They are often strong in compression but weak in tension, because tiny surface cracks grow under tension.</li>
<li><strong>Polymeric</strong> materials: rubber has a curved graph with a large elastic strain (it can stretch to several times its length and still return). Polythene behaves plastically: it stretches permanently ("cold drawing") as its long chains straighten out.</li>
</ul>

<h2>Measuring the Young modulus of a metal (PAG 2.1)</h2>
<ol>
<li>Clamp a long, thin wire (about 2 m) at one end of a bench and pass the other end over a pulley, with a mass hanger attached. A long, thin wire gives a larger extension and a larger strain for a given load, which reduces the percentage uncertainty.</li>
<li>Put a marker (a strip of tape or a pointer) on the wire near the pulley, next to a millimetre scale fixed to the bench.</li>
<li>Measure the original length L from the clamp to the marker with a metre rule or tape.</li>
<li>Measure the diameter with a <strong>micrometer</strong> at several points along the wire and in different directions, and take the mean (the wire may not be perfectly round). Diameter is the biggest source of uncertainty because it is small and gets squared.</li>
<li>Add masses in equal steps, recording the marker position each time. Then remove them and check the readings return (so you stayed in the elastic region).</li>
<li>Calculate stress and strain for each load and plot stress against strain. <strong>Young modulus = gradient</strong> of the straight-line section.</li>
</ol>
<p>Safety: wear goggles in case the wire snaps, and place a sand tray or box under the masses. Searle's apparatus is an alternative: it uses a second, unloaded reference wire and a vernier scale to measure tiny extensions precisely, and cancels out changes in temperature.</p>
<blockquote class="tip"><p><strong>Exam tip:</strong> stiffness (k) is a property of an object; the Young modulus (E) is a property of a material. Strength (UTS) is different again: glass is stiff and strong in compression but brittle.</p></blockquote>
`;

N['3.5']=`
<h2>Newton's three laws</h2>
<h3>First law</h3>
<p><strong>An object remains at rest, or keeps moving with constant velocity, unless it is acted on by a resultant force.</strong></p>
<p>Nothing needs a force to keep it moving: it needs a force to <em>change</em> its motion. Things on Earth seem to slow down by themselves only because friction and drag act on them. A puck on ice or a spacecraft in deep space keeps going. This tendency of an object to keep its motion is called <strong>inertia</strong>, and its measure is mass.</p>
<h3>Second law</h3>
<p><strong>The resultant force on an object is directly proportional to the rate of change of its momentum, and acts in the direction of the change in momentum.</strong></p>
<div class="eqgrid"><div>F = Δp / Δt</div></div>
<p>With the newton defined suitably, the constant of proportionality is 1. If the mass is constant, Δp = mΔv, so F = mΔv/Δt = <strong>ma</strong>. The momentum form is more general: it also works when the mass changes, for example a rocket burning fuel, or sand pouring onto a conveyor belt.</p>
<h3>Third law</h3>
<p><strong>When body A exerts a force on body B, body B exerts a force on body A that is equal in size and opposite in direction.</strong></p>
<p>The two forces in a Newton's third law pair:</p>
<ul>
<li>act on <strong>different</strong> objects (so they never cancel each other out);</li>
<li>are the <strong>same type</strong> of force (both gravitational, both contact, both electrostatic...);</li>
<li>are equal in size, opposite in direction and act along the same line.</li>
</ul>
<blockquote class="tip"><p>A book resting on a table: its weight (Earth pulls book down) and the normal contact force (table pushes book up) are equal and opposite, but they are <strong>not</strong> a third-law pair. They act on the same object and are different types; they are equal only because the book is in equilibrium (first law). The real pairs are: Earth pulls book down / book pulls Earth up (gravitational), and table pushes book up / book pushes table down (contact).</p></blockquote>

<h2>Momentum</h2>
<div class="eqgrid"><div>p = mv</div></div>
<p><strong>Linear momentum</strong> is mass × velocity, in kg m s<sup>−1</sup>. It is a <strong>vector</strong>, with the direction of the velocity, so you must choose a positive direction and give momenta signs.</p>
<div class="wex"><p><strong>Worked example.</strong> A 0.15 kg ball moving at 20 m s<sup>−1</sup> hits a wall and rebounds at 15 m s<sup>−1</sup>. Contact lasts 0.010 s. Find the change in momentum and the average force.</p>
<p>Take the original direction as positive. p before = 0.15 × 20 = +3.0 kg m s<sup>−1</sup>. p after = 0.15 × (−15) = −2.25 kg m s<sup>−1</sup>.</p>
<p>Δp = −2.25 − 3.0 = <strong>−5.25 kg m s<sup>−1</sup></strong> (not −0.75: the direction reversed).</p>
<p>F = Δp/Δt = −5.25/0.010 = <strong>−525 N</strong>: 525 N away from the wall.</p></div>

<h2>Impulse</h2>
<p>Rearranging the second law: FΔt = Δp. The product of force and the time it acts for is called the <strong>impulse</strong>.</p>
<div class="eqgrid"><div>impulse = FΔt = Δp</div></div>
<p>Its unit is the N s, which is the same as kg m s<sup>−1</sup>. When the force varies (as it always does in a real impact), <strong>impulse = area under the force–time graph</strong>, and that area equals the change in momentum.</p>
<svg class="diagram" viewBox="0 0 520 190" role="img" aria-label="Force-time graph; area equals impulse; longer contact time gives smaller peak force">
<line class="ax" x1="40" y1="160" x2="500" y2="160" marker-end="url(#ah)"/><line class="ax" x1="40" y1="160" x2="40" y2="20" marker-end="url(#ah)"/>
<path class="fillsoft c1" d="M60 160 C90 160 100 40 130 40 C160 40 170 160 200 160 Z"/>
<path class="c2" d="M240 160 C300 160 320 110 370 110 C420 110 440 160 480 160"/>
<text x="20" y="30">F</text><text x="490" y="180">t</text><text x="90" y="125" class="small">area = impulse</text><text x="300" y="100" class="lbl2 small">same Δp, longer Δt (crumple zone)</text></svg>
<h3>Safety features</h3>
<p>In a crash, a passenger's momentum has to go from mv to zero whatever happens, so the impulse is fixed. Since F = Δp/Δt, making the collision last <strong>longer</strong> makes the force <strong>smaller</strong>. That is how crumple zones, airbags, seat belts (which stretch slightly), helmets, crash mats and bending your knees when you land all work. On the graph above, both curves have the same area, but the longer one has a much lower peak force.</p>
<p>The same idea works in reverse: following through when hitting a ball keeps the force on it for longer, giving it a bigger impulse and so a bigger velocity.</p>

<h2>Conservation of momentum</h2>
<p><strong>For a closed system (one with no external forces acting), the total momentum before an interaction equals the total momentum after it.</strong></p>
<p><strong>Why it is true.</strong> When two objects A and B collide, by Newton's third law the force of A on B is equal and opposite to the force of B on A at every instant, and they act for exactly the same time. So the impulses are equal and opposite: whatever momentum A gains, B loses. The total does not change.</p>
<div class="wex"><p><strong>Worked example: a collision.</strong> A 2.0 kg trolley moving at 3.0 m s<sup>−1</sup> hits a stationary 1.0 kg trolley. They stick together. Find their speed afterwards.</p>
<p>Before: 2.0 × 3.0 + 1.0 × 0 = 6.0 kg m s<sup>−1</sup>. After: (2.0 + 1.0)v.</p>
<p>So v = 6.0/3.0 = <strong>2.0 m s<sup>−1</sup></strong>.</p>
<p>Kinetic energy before = ½ × 2.0 × 3.0² = 9.0 J. After = ½ × 3.0 × 2.0² = 6.0 J. 3.0 J was transferred to heat and sound, so the collision is inelastic.</p></div>
<div class="wex"><p><strong>Worked example: an explosion.</strong> A 4.0 kg rifle fires a 10 g bullet at 400 m s<sup>−1</sup>. Find the recoil velocity of the rifle.</p>
<p>Total momentum before = 0 (both at rest). After: 0.010 × 400 + 4.0 × v = 0, so v = −1.0 m s<sup>−1</sup>. The rifle recoils at <strong>1.0 m s<sup>−1</sup></strong> backwards.</p>
<p>Kinetic energy has increased from 0 (it came from the chemical energy of the propellant), but momentum is still conserved.</p></div>

<h2>Elastic and inelastic collisions</h2>
<p>Momentum is <strong>always</strong> conserved in a closed system. Kinetic energy may or may not be.</p>
<div class="tbl"><table><tr><th>Type</th><th>Momentum</th><th>Kinetic energy</th></tr>
<tr><td>Perfectly elastic</td><td>conserved</td><td>conserved. Also, relative speed of approach = relative speed of separation.</td></tr>
<tr><td>Inelastic</td><td>conserved</td><td>decreases (transferred to heat, sound, deformation). If the objects stick together it is "totally inelastic" and the most energy is lost.</td></tr>
<tr><td>Explosion / recoil</td><td>conserved (total stays zero if they started at rest)</td><td>increases, from a store of chemical or elastic energy</td></tr></table></div>
<p>To decide if a collision was elastic: calculate the total kinetic energy before and after and compare. Collisions between gas molecules, and between snooker balls to a good approximation, are elastic. Most everyday collisions are inelastic.</p>
<p>A useful shortcut: in a perfectly elastic head-on collision between equal masses, one of which is at rest, the moving one stops dead and the other moves off with its velocity (Newton's cradle).</p>

<h2>Collisions in two dimensions</h2>
<p>Momentum is a vector, so it is conserved <strong>separately in each of two perpendicular directions</strong>. The method:</p>
<ol>
<li>Choose x and y directions (usually x along the original motion).</li>
<li>Resolve every momentum into x and y components.</li>
<li>Total x-momentum before = total x-momentum after. Same for y.</li>
<li>Solve, then combine the components with Pythagoras and tan<sup>−1</sup> if you need a speed and direction.</li>
</ol>
<div class="wex"><p><strong>Worked example.</strong> A 0.17 kg snooker ball moving at 2.0 m s<sup>−1</sup> strikes an identical stationary ball. Afterwards the first moves at 1.0 m s<sup>−1</sup> at 60° to its original path. Find the velocity of the second ball.</p>
<p>The mass is the same for all terms, so cancel it and work with velocities.</p>
<p>x: 2.0 = 1.0 cos 60° + v<sub>x</sub>, so v<sub>x</sub> = 1.5 m s<sup>−1</sup>.</p>
<p>y: 0 = 1.0 sin 60° + v<sub>y</sub>, so v<sub>y</sub> = −0.866 m s<sup>−1</sup> (on the opposite side of the original line).</p>
<p>v = √(1.5² + 0.866²) = <strong>1.7 m s<sup>−1</sup></strong> at tan<sup>−1</sup>(0.866/1.5) = <strong>30°</strong> to the original path, on the other side.</p>
<p>Check: E<sub>k</sub> before ∝ 2.0² = 4.0; after ∝ 1.0² + 1.73² = 4.0. Elastic. (For equal masses in an elastic glancing collision, the balls always move off at 90° to each other.)</p></div>
<blockquote class="tip"><p><strong>Exam tip:</strong> in every momentum question, state your positive direction first and write the sign on every velocity. Most errors come from forgetting that a rebound is negative.</p></blockquote>
`;

window.SPEC.topics.forEach(t=>{ if(N[t.id]) t.notes=N[t.id]; });
})();
