# SailFish Prediction With V3 Price Oracle

## Description

SailFish Prediction with V3 Oracle

## Documentation

### EDU/USDC

- Mainnet: 0x0
- Testnet: 0x0

## Deployment

Verify that `config.js` has the correct information
Uncomment private key usage lines in `hardhat.config.js`

```
export PK=PRIVATE_KEY
yarn migrate:[network]
```

### Operation

When a round is started, the round's `lockBlock` and `closeBlock` would be set.

`lockBlock` = current block + `intervalBlocks`

`closeBlock` = current block + (`intervalBlocks` * 2)

## Kick-start Rounds

The rounds are always kick-started with:

```
startGenesisRound()
(wait for x blocks)
lockGenesisRound()
(wait for x blocks)
executeRound()
```

## Continue Running Rounds

```
executeRound()
(wait for x blocks)
executeRound()
(wait for x blocks)
```

## Resuming Rounds

After errors like missing `executeRound()` etc.

```
pause()
(Users can't bet, but still is able to withdraw)
unpause()
startGenesisRound()
(wait for x blocks)
lockGenesisRound()
(wait for x blocks)
executeRound()
```

## Common Errors

Refer to `test/prediction.test.js`

## Architecture Illustration

### Normal Operation

![normal](images/normal-round.png)

### Missing Round Operation

![missing](images/missing-round.png)
