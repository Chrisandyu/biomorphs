# Biomorphs

Bassed off of Richard Dawkins' biomorph simulation from *The Blind Watchmaker* (1986)

## How it works

Each creature is defined by a genome of 9 integers/genes  
A recursive tree is drawn from those genes that branches left and right  
You can artificially select which creature breeds the next

## The genes

The 9 genes map directly to the 8 compass directions for branches to grow  
where:
```
dx = [-g1,-g0, 0, g0, g1, g2, 0, -g2]
dy = [g5, g4, g3, g4, g5, g6, g7, g6]
```

| Gene | Effect |
|------|----------|
| `g0` | x-spread of NE/NW branches |
| `g1` | x-spread of E/W branches |
| `g2` | x-spread of SE/SW branches |
| `g3` | y-len of N segment |
| `g4` | y-len of NE/NW diagonal segments |
| `g5` | y-len of E/W flat segments |
| `g6` | y-len of SE/SW diagonal segments |
| `g7` | y-len of S segment |
| `g8` | Recursion depth (3-9) |


## Mutation

Child `i` mutates gene `i` by ±1 or ±2. Each child also has a 20% chance of gaining/losing one recursion level

## To run:
1. clone the repo
2.```sh
npm i
npm run dev
```
