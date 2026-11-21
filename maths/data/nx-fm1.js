/* Full topic notes for Further Mechanics 1 (Edexcel 8FM0/9FM0). Overrides the short notes in notes.js. */
(function(){
const N={};

N.momentum=String.raw`### Momentum
The **momentum** of a particle of mass $m$ moving with velocity $\mathbf v$ is
$$\mathbf p=m\mathbf v$$
measured in N s (or kg m s$^{-1}$). It is a **vector**: in one dimension, choose a positive direction and give velocities signs.
### Impulse
When a force $\mathbf F$ acts for time $t$, its **impulse** is $\mathbf I=\mathbf Ft$ (for a constant force). Newton's second law gives $\mathbf F=m\mathbf a=m\dfrac{\mathbf v-\mathbf u}t$, so
$$\mathbf I=m\mathbf v-m\mathbf u$$
**Impulse equals change in momentum.** This is the impulse–momentum principle.
> **Worked example.** A 0.15 kg ball moving at 20 m s$^{-1}$ is hit straight back at 30 m s$^{-1}$. Taking the original direction as positive, $I=0.15(-30)-0.15(20)=-7.5$ N s: an impulse of 7.5 N s opposite to the original motion.
For a **variable** force, impulse $=\displaystyle\int F\,dt$ (the area under a force–time graph).
### Conservation of linear momentum
When two particles collide (or are joined, or separate in an "explosion"), the forces between them are equal and opposite (Newton's third law) and act for the same time. So the impulses are equal and opposite, and **total momentum is unchanged**:
$$m_1u_1+m_2u_2=m_1v_1+m_2v_2$$
This holds whenever no external impulse acts on the system.
> **Worked example.** A 2 kg particle at 5 m s$^{-1}$ hits a 3 kg particle at rest; they coalesce. $2(5)=5v$, $v=2$ m s$^{-1}$.
> **Worked example.** A 3 kg gun fires a 0.02 kg bullet at 450 m s$^{-1}$. $0=0.02(450)+3v$, $v=-3$ m s$^{-1}$: the gun recoils at 3 m s$^{-1}$.
Typical extras: find the **impulse** on one particle (its change in momentum), or the **loss of kinetic energy** in the collision.
### Momentum as a vector
In two dimensions, use $\mathbf i$ and $\mathbf j$ components: $\mathbf I=m\mathbf v-m\mathbf u$ works component by component, and the magnitude of an impulse is found with Pythagoras.
> **Worked example.** A 0.5 kg ball with velocity $(4\mathbf i+2\mathbf j)$ m s$^{-1}$ receives an impulse $(-3\mathbf i+\mathbf j)$ N s. New velocity: $\mathbf v=\mathbf u+\tfrac{\mathbf I}{m}=(4\mathbf i+2\mathbf j)+(-6\mathbf i+2\mathbf j)=(-2\mathbf i+4\mathbf j)$ m s$^{-1}$.
### Watch out
- Draw "before" and "after" diagrams with directions marked.
- An unknown velocity drawn the wrong way just comes out negative.`;

N.wep=String.raw`### Work done
A constant force $F$ moving its point of application a distance $s$ in the direction of the force does **work**
$$W=Fs$$
(joules). If the force acts at angle $\theta$ to the motion, only the component along the motion does work: $W=Fs\cos\theta$.
- Work done **against gravity** raising a mass $m$ through height $h$: $mgh$. On a slope, only the vertical height matters.
- Work done **against friction** (or resistance $R$) over distance $s$: $Rs$.
### Kinetic and potential energy
$$\text{KE}=\tfrac12mv^2\qquad\text{GPE}=mgh$$
GPE is measured relative to a chosen zero level.
### The work–energy principle
**The work done by the resultant force on a particle equals its change in kinetic energy.** Including gravity as potential energy, a practical form is:
$$\text{initial energy}+\text{work done by driving forces}=\text{final energy}+\text{work done against resistances}$$
where "energy" means KE + PE.
**Conservation of mechanical energy**: if the only force doing work is gravity (no friction or other forces), KE + PE stays constant.
> **Worked example.** A 2 kg particle slides from rest down a rough slope, 5 m long at $30°$, with friction 4 N. Find its speed at the bottom.
> PE lost $=2g\times5\sin30°=49$ J. Work against friction $=4\times5=20$ J.
> KE gained $=49-20=29$ J $=\tfrac12(2)v^2$, so $v=5.39$ m s$^{-1}$.
Energy methods are ideal when the path is curved or forces vary: you do not need the acceleration.
### Power
**Power** is the rate of doing work (watts, J s$^{-1}$). For a vehicle whose engine produces a driving force $F$ at speed $v$:
$$P=Fv$$
**Why**: in time $\delta t$ it moves $v\,\delta t$, doing work $Fv\,\delta t$; divide by $\delta t$.
Combine with $F=ma$: the driving force is $\dfrac Pv$.
> **Worked example.** A car of mass 900 kg with engine power 24 kW moves on a level road against resistance 600 N. Find its maximum speed, and its acceleration at 20 m s$^{-1}$.
> At maximum speed $a=0$, so driving force = resistance: $\dfrac{24000}v=600$, $v=40$ m s$^{-1}$.
> At 20 m s$^{-1}$: driving force $=1200$ N, so $1200-600=900a$, $a=0.667$ m s$^{-2}$.
On a slope, include the component of weight $mg\sin\alpha$ in the resultant force.
### Watch out
- Convert kW to W.
- In energy equations, list every term: KE, PE, work by driving force, work against resistance.`;

N.elastic=String.raw`### Hooke's law
For an **elastic string** or **spring**, the tension is proportional to the **extension** $x$ (the amount it is stretched beyond its natural length $l$):
$$T=\frac{\lambda x}{l}$$
$\lambda$ is the **modulus of elasticity** (newtons): the tension needed to double the length of the string. A spring can also be compressed, with thrust $\dfrac{\lambda x}l$; a string cannot (it goes slack when shorter than its natural length).
{{svg1}}
> **Worked example.** A string of natural length 1 m and modulus 49 N holds a 2 kg particle at rest. $2g=\dfrac{49x}{1}$, so $x=0.4$ m.
### Problems in equilibrium
Resolve forces as usual, using $T=\dfrac{\lambda x}l$ for each string or spring. With two strings attached to a particle between two fixed points, set up the extensions in terms of one unknown (the particle's position) and resolve.
### Elastic potential energy
Stretching a string takes work, since the tension grows with extension. The work done stretching it from natural length to extension $x$ is the area under the tension–extension graph (a triangle):
$$\text{EPE}=\frac{\lambda x^2}{2l}$$
**Derivation**: $\displaystyle\int_0^x\frac{\lambda s}l\,ds=\frac{\lambda x^2}{2l}$.
### Energy problems
Include EPE in the work–energy principle:
$$\text{KE}+\text{GPE}+\text{EPE}\text{ (initial)}=\text{KE}+\text{GPE}+\text{EPE}\text{ (final)}+\text{work against resistance}$$
> **Worked example.** A particle of mass 0.5 kg is attached to a string (natural length 0.8 m, $\lambda=20$ N) fixed at $O$ on a smooth horizontal table. It is pulled so the string is 1.2 m long and released. Find its speed when the string becomes slack.
> EPE at start $=\dfrac{20(0.4)^2}{2(0.8)}=2$ J. When slack, EPE $=0$, so $\tfrac12(0.5)v^2=2$, $v=2.83$ m s$^{-1}$.
For a particle falling on an elastic string (like a bungee jump), take care: the string only starts to stretch after the particle has fallen its natural length. Gravitational PE lost over the whole drop = EPE stored at the lowest point (where the speed is zero).
### Watch out
- Extension is measured from the **natural** length, not from the equilibrium position.
- EPE uses $x^2$; tension uses $x$.`;

N.coll1d=String.raw`### Newton's law of restitution
When two bodies collide, how much they bounce apart is described by the **coefficient of restitution** $e$, with $0\le e\le1$:
$$\frac{\text{speed of separation}}{\text{speed of approach}}=e$$
For a direct collision along a line, with velocities $u_1,u_2$ before and $v_1,v_2$ after (positive in the same direction):
$$v_2-v_1=e(u_1-u_2)$$
- $e=1$: **perfectly elastic** (no kinetic energy lost).
- $e=0$: **perfectly inelastic**: the bodies coalesce (move together).
### Solving collision problems
Use **two equations**:
1. Conservation of momentum: $m_1u_1+m_2u_2=m_1v_1+m_2v_2$.
2. Restitution: $v_2-v_1=e(u_1-u_2)$.
Solve simultaneously for $v_1$ and $v_2$.
> **Worked example.** Sphere $A$ (2 kg, 6 m s$^{-1}$) hits sphere $B$ (1 kg, at rest) directly; $e=0.5$.
> Momentum: $12=2v_A+v_B$. Restitution: $v_B-v_A=0.5(6)=3$.
> Subtract: $3v_A=9$, $v_A=3$ m s$^{-1}$, $v_B=6$ m s$^{-1}$.
> KE lost $=\tfrac12(2)(36)-\left[\tfrac12(2)(9)+\tfrac12(1)(36)\right]=36-27=9$ J.
### Collisions with a wall
A particle hitting a fixed smooth wall at right angles with speed $u$ rebounds with speed $eu$. The impulse from the wall is $m(eu)-m(-u)=mu(1+e)$.
### Successive collisions
In questions with three particles, or a particle bouncing between a wall and another particle, work through one collision at a time, using the "after" velocities of one collision as the "before" velocities of the next. To show there are **no further collisions**, show the particles are moving apart (or that the one behind is slower).
### Loss of kinetic energy
Calculate total KE before and after; the difference is the energy lost (to heat and sound). It is zero only if $e=1$.
### Watch out
- Restitution uses relative velocities: (later separation) = $e\times$(earlier approach).
- Keep track of signs: a velocity found as negative means the particle moved the other way.`;

N.coll2d=String.raw`### Oblique impact with a fixed smooth surface
When a particle hits a fixed **smooth** plane at an angle:
{{svg1}}
- The component of velocity **parallel** to the surface is **unchanged** (a smooth surface exerts no force along itself).
- The component **perpendicular** to the surface is reversed and multiplied by $e$.
If the particle approaches at speed $u$ at angle $\alpha$ to the surface and leaves at speed $v$ at angle $\beta$:
$$v\cos\beta=u\cos\alpha\qquad v\sin\beta=eu\sin\alpha$$
So $\tan\beta=e\tan\alpha$: the rebound is at a shallower angle (unless $e=1$).
> **Worked example.** A ball hits a smooth floor at 10 m s$^{-1}$ at $30°$ to the floor; $e=0.5$.
> Parallel: $10\cos30°=8.66$. Perpendicular: $0.5\times10\sin30°=2.5$.
> $v=\sqrt{8.66^2+2.5^2}=9.01$ m s$^{-1}$ at $\tan^{-1}\tfrac{2.5}{8.66}=16.1°$ to the floor.
The impulse on the particle is perpendicular to the surface, of size $m(1+e)u\sin\alpha$.
### Using vectors
If the velocity is $\mathbf u$ and the surface has unit normal $\mathbf n$, split $\mathbf u$ into the component along $\mathbf n$ (found with the dot product) and the rest. The normal part is reversed and scaled by $e$; the rest is unchanged. The KE lost is $\tfrac12m(1-e^2)(\text{normal component})^2$.
### Oblique collisions between spheres
Two smooth spheres collide; at impact the force between them acts along the **line of centres**.
- **Perpendicular** to the line of centres: each sphere's velocity component is **unchanged**.
- **Along** the line of centres: use conservation of momentum and Newton's law of restitution, exactly as in a 1D collision.
> **Method**: resolve each velocity along and perpendicular to the line of centres; solve the 1D problem along it; recombine.
A classic result: if a sphere hits an identical stationary sphere and the collision is perfectly elastic ($e=1$), they move off at **right angles** to each other.
### Watch out
- "Smooth" is what makes the parallel component unchanged.
- Identify the line of centres carefully; draw it on the diagram.`;

window.NOTES2=window.NOTES2||{};
window.NOTES2.fm1=N;
})();
