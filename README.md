ShieldGrid

AI-Powered Parametric Income Protection for India's Delivery Heroes


Inspiration
Every monsoon season in India, millions of delivery partners log off their apps and stare at a flooded street — not because they're scared, but because two-wheelers simply cannot move through knee-deep water. That lost shift isn't recoverable. There's no overtime to make up for it, no leave encashment, no safety net. It's just gone.
We started thinking about this problem from a very grounded place: gig workers are the infrastructure of India's food economy, yet they're the most financially exposed people in it. A single severe cloudburst can wipe out two to three days of earnings for a delivery partner in Mumbai or Chennai. When you're living paycheck to paycheck on weekly platform disbursements, that's not a bad week — it's a crisis.
Traditional insurance was never designed for this. Indemnity-based products demand receipts, claim forms, assessor visits, and weeks of processing — a process that costs more to run than the payout itself on a low-value gig claim. We didn't want to digitize that broken model. We wanted to throw it out entirely.
Parametric insurance — where a payout is triggered by a verifiable external event rather than a subjective damage assessment — felt like the missing piece. It's already used for agricultural crop failures and catastrophe bonds at an institutional level. We asked: why can't a delivery partner in Bengaluru have the same protection the moment IMD declares a red alert in their pincode?
That question became ShieldGrid.

What It Does
ShieldGrid is a parametric income protection platform built specifically for food delivery partners on platforms like Zomato and Swiggy. It removes every friction point that has historically made micro-insurance unviable for gig workers.
Here's the core loop:
A delivery partner registers on the mobile app, links their UPI ID, and grants background location access. Every Sunday, our AI risk engine looks at hyperlocal weather forecasts and historical disruption data for their usual operating pincodes and quotes a weekly micro-premium — starting at ₹15 for clear weeks, scaling up to ₹30 during peak monsoon risk windows. The worker opts in, the premium is deducted from their platform wallet, and coverage is live.
When a disruption event hits — say, rainfall exceeds 50mm/hour in their zone, or a Section 144 curfew grounds traffic — the system doesn't wait for anyone to file a claim. It checks whether the worker was actively logged into their delivery app and physically present in the affected geofence at the time of the trigger. If both conditions are met, the income replacement payout goes straight to their UPI account. Zero forms. Zero calls. Zero waiting.
What ShieldGrid covers:

Severe weather events: localized rainfall above 50mm/hr, heatwaves above 45°C
Civic disruptions: verified Section 144 impositions, traffic velocity drops above 80% caused by blockades

What it deliberately doesn't cover:

Health, life, or accident damages — those require different regulatory frameworks and underwriting logic, and including them would dilute the product's precision

The platform has two interfaces: a mobile app for delivery workers handling onboarding, policy status, and payout history; and a web dashboard for insurer admins showing live coverage maps, trigger logs, and loss-ratio analytics.

How We Built It
We treated this as an end-to-end product problem, not just a coding exercise. That shaped every technical decision we made.
Frontend: The worker-facing product is a React Native + Expo mobile app. Delivery partners don't carry laptops — their phone is their entire workstation. Background location tracking, which is essential for validating physical presence during a disruption event, only works reliably on native mobile. The admin dashboard is a React web app with real-time data visualization for insurer-side analytics.
Backend: We split the backend into two distinct services. A Node.js (NestJS) service handles user state, wallet ledgers, weekly policy issuance, and payout orchestration. A Python (FastAPI) microservice hosts the ML layer — running inference from our risk and fraud models without coupling it to the transactional backend. The two services communicate over internal REST.
The Trigger Oracle: This is the heartbeat of the system — a cron-driven Python service that continuously polls the OpenWeatherMap API and Mapbox Traffic API, evaluates active parametric conditions against all live policies, and fires trigger events when thresholds are crossed. When a trigger fires, it passes the event to the validation pipeline before any payout is initiated.
AI/ML Layer:

Risk Modeling: A Gradient Boosting Regressor (XGBoost) trained on historical IMD weather data and localized traffic disruption records. It predicts the probability of a disruption event in a specific 5km hexagonal grid for the upcoming week, which directly drives the weekly premium calculation.
Dynamic Pricing: An inference pipeline that takes the risk model's output and maps it to a weekly premium multiplier. The formula is: Weekly Premium = Base Premium × Risk Multiplier × Zone Density Factor.
Fraud Detection: Isolation Forests for spatial-temporal anomaly detection. The model flags cases where GPS pings show physically impossible traversal speeds (indicating spoofing), or where multiple claim triggers originate from a single device ID across geographically distant zones simultaneously.

Data & Infrastructure: PostgreSQL for relational data (user records, policy ledgers, payout history), Redis for high-speed location caching and rate limiting on the trigger oracle's API calls. The entire stack is containerized with Docker and deployed on AWS (EC2 + RDS). GitHub Actions handles CI/CD.
Integrations for the Prototype:

Live: OpenWeatherMap free tier for real-time precipitation and temperature
Live: Mapbox Traffic API for road velocity monitoring
Simulated: Delivery platform APIs mocked via internal endpoints (representing worker login state and earnings history — these aren't publicly available)
Simulated: Razorpay Test Mode for the instant UPI payout flow


Challenges We Ran Into
The "last-mile validation" problem was harder than we expected. Triggering a payout based on weather data is straightforward. Confirming that a specific worker was actually in the affected zone at the moment of disruption — and not gaming the system from a different location — required us to think carefully about what "presence" actually means in a parametric context. We landed on a combination of background GPS polling cached in Redis and cross-referencing platform login state via mock API, but the edge cases kept coming: what if a worker's phone lost signal during a flood? What if the GPS poll interval missed the exact trigger window? We're still refining the validation logic.
Getting the premium model to be simultaneously affordable and actuarially solvent was non-trivial. At ₹15/week base, we needed to be very precise about loss probability estimates. Too aggressive with the risk multiplier and workers stop buying in. Too conservative and the payout pool drains. We iterated through several versions of the XGBoost model's feature set before the loss ratio projections stabilized at a sustainable level in our simulations.
Regulatory awareness without regulatory authority. Parametric insurance in India sits in an interesting regulatory space under IRDAI. We're not an insurer — we're building the technology layer. Positioning ShieldGrid as a white-labeled infrastructure product that an IRDAI-licensed insurer deploys was a deliberate product design choice, not an afterthought. But working through what that actually means for data ownership, KYC flow, and policy issuance required several rethinks of the architecture.
Simulating delivery platform APIs without real access. Zomato and Swiggy don't expose public APIs for partner login state or earnings. We built a comprehensive internal mock layer that represents this data realistically, but we're acutely aware that production integration would require platform partnerships. This is a real dependency that we've flagged explicitly in our roadmap.

Accomplishments That We're Proud Of
Honestly, the thing we're most proud of isn't any single feature — it's the fact that the core loop actually works end-to-end in the prototype. A delivery partner can onboard, receive a dynamic weekly premium quote, activate coverage, watch the trigger oracle detect a simulated rainfall threshold breach in their zone, see the validation pipeline confirm their presence, and receive a Razorpay test-mode UPI credit — all without touching a single claim form.
That end-to-end flow being functional, even on simulated data, validated the core hypothesis: parametric micro-insurance for gig workers is technically feasible, and the zero-touch claims experience is achievable.
We're also proud of the fraud detection layer being substantive rather than theatrical. Isolation Forests running on real spatial-temporal features — not just a checkbox. The model correctly flags GPS-spoofed test cases we deliberately injected during development.
And we're proud of how we scoped the product. Choosing not to cover health or accident claims wasn't a limitation — it was a product decision. Staying precise about what parametric insurance can actually guarantee, without overpromising, is something we feel strongly about.

What We Learned
We came in thinking this was primarily a machine learning problem. We were wrong — it's primarily a product design problem that happens to have ML inside it.
The hardest questions weren't about model accuracy. They were: What counts as a valid trigger event? Who bears the basis risk when a worker in an unaffected street loses income during a citywide curfew? How do you build trust with a user demographic that has historically been underserved and skeptical of financial products?
We learned that parametric insurance's greatest strength — its objectivity — is also its greatest UX challenge. Workers need to understand exactly what triggers their payout and what doesn't, with zero ambiguity. If the system rejects a claim because the worker's GPS wasn't polling during the trigger window, that rejection needs to feel fair, not arbitrary. Designing for that transparency was harder than building the model itself.
We also learned a lot about the actual operational realities of gig work in India — the weekly payout cycle, the reliance on platform wallets, the distrust of deductions that aren't immediately understandable. All of that shaped the premium model and the onboarding UX in ways we didn't anticipate at the start.

What's Next for ShieldGrid
The immediate next step is getting the ML models off synthetic training data and onto real IMD historical weather records at the pincode level, combined with actual Mapbox traffic disruption logs. The model's predictive accuracy is only as good as its training distribution, and right now that's simulated.
Beyond that, three things matter most:
Platform partnerships. The single biggest unlock for ShieldGrid is a data-sharing agreement with one delivery platform — even a limited pilot. Worker login state and earnings data would replace the mock API layer and make the validation pipeline production-grade.
IRDAI-aligned product structuring. We want to work with a licensed non-life insurer to structure ShieldGrid as a Group Parametric Policy administered by the platform for its delivery partners. This is the cleanest regulatory path and the fastest route to scale.
Expanding the trigger set. Severe weather and civic curfews are the obvious starting points, but the parametric model can extend to other verifiable disruptions — air quality index events, waterlogging scores from municipal sensors, or even platform-declared zone suspensions. Each new trigger type expands coverage relevance without increasing the claims processing burden.
The long-term vision is a white-labeled API that delivery aggregators can embed directly into their partner apps — so a Swiggy delivery partner in Hyderabad gets ShieldGrid coverage as a native feature of the platform, not a separate product they have to discover and install.
