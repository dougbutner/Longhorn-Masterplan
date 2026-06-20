---
id: consensus-tweaks
title: Consensus & Protocol Tweaks
parent: longhorn
status: not_started
progress: 0
order: 10
tags: [divergence, consensus]
---

## User Story

As a user, my transactions feel fast and final; as a builder, cross-chain claims verify cheaply.

## Problem Statement

Antelope's default finality is sub-second on Savanna but the UX surface (wallets, dapps) doesn't always wire it through. IBC modules require a lot of glue to deploy.

Micheal: 
Problems technical vs political 
Improving education for BPs to get the right hardware for speed + ram 
Pain Point: Bringing in new BPs + educating them on the difficulties, it's not just plug and play
Potential for break of rules with a collusion of BPs who implement small change 
Eosio.active has complete control of chain (or on WAX they have the control) 

Kevin: 
Finalizers and block producers can be separate, but hard to compensate finalizers
Problem: Cost is the same to run, needs to be compensated. 
Problem: History solutions need to be able to keep up + who is paying them? It's expensive and apps / frontends need to use it for common user experiences 

Chris barnes
Need better tokenomics that aren't gamable / turn into a voting cartel / pay-for-vote issues 
Governance layer can be manipulated in token-vote-only systems 

Piga
Education is key to know what it means to contribute to the system, including to democracy




## Solution Statement
Track AntelopeIO/spring's Savanna releases. Ship a default IBC light-client config so masterplan dapps can verify cross-chain claims out of the box. Tune dPoS curves for higher participation; jitter BP schedule for more uniform block times under load.


Finaliers have the ability to prevent BP hijacks, but they currently need to be running full node (Expensive, needs to be less expensive / lite option / reworked) 


Split funding/inflation from 100% BP and other buckets for things like marketing, education, etc



Micheal
Decoupling producers from finaliers
Technical people should have the God mode power, with separate governance / enforcement layer the technical people can enforce 
Technical people who are part of God Mode should be Vetted well 
Improve Mechanism to force BPs to fall in line, like Board of Directors (Telos) or community vote (XPR, others)


Chris Barnes 
Hybrid governance solution 
Stake based entities 
Human selected entities


Kevin
Current: Schedule of BP is chosen by system contract, and can be changed in any way easily

Who gets to propose blocks? BPs
Finalizers say "Yes" or "no" (could potentially freeze chain) 

Old config.ini can mean BPs produce valid blocks against a political decision (like allowing frozen funds to be moved) 




Piga: 
Block Producers may be needed to give checks / balances to different parts of ecosystem. 
BP's can't be expected to do everything





Kevin: 
Agree decoupling producers from finaliers 



## Reference Contracts

- [`AntelopeIO/spring`](https://github.com/AntelopeIO/spring) — node software.

## Implementation Steps

1. Pin Spring release tag; document upgrade cadence.
2. Bundle IBC light clients for EOS, Vaulta, Jungle 4 by default.
3. Vote-decay curve + BP-jitter as chain-config knobs (no hard fork to tune).
