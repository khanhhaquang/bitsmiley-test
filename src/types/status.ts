export enum AccountStatus {
  PartyNotStarted = 'PartyNotStarted',
  PartyStartedButNotConnectedWallet = 'PartyStartedButNotConnectedWallet'
}

export enum WhitelistUserStatus {
  GoldConnectedAndNotPayed = 'GoldConnectedAndNotPayed',
  WhitelistConnectedAndNotPayed = 'WhitelistConnectedAndNotPayed',
  PayingPayment = 'PayingPayment',
  WhitelistPayedButMintingNotStarted = 'WhitelistPayedButMintintNotStarted',
  WhitelistPayedMintStartedButNotInscribed = 'PayedMintStartedButNotInscribed',
  WhitelistInscribed = 'WhitelistInscribed'
}

export enum NormalUserStatus {
  NormalConnectedAndNotPayed = 'NormalConnectedAndNotPayed',
  PayingPayment = 'PayingPayment',
  NormalPayedButMintingNotStarted = 'PartyStartedButNotPayed',
  NormalPayedButLuckyDrawNotStarted = 'NormalPayedButLuckyDrawNotStarted',
  RollingDice = 'RollingDice',
  RolledDiceButNotOpened = 'RolledDiceButNotOpened',
  FirstRolledDiceOpenedAndWon = 'FirstRolledDiceOpenedAndWon',
  FirstRolledDiceOpenedAndFailed = 'FirstRolledDiceOpenedAndFailed',
  SecondRolledDiceOpenedAndWon = 'SecondRolledDiceOpenedAndWon',
  SecondRolledDiceOpenedAndFailed = 'SecondRolledDiceOpenedAndFailed',
  NormalInscribed = 'NormalInscribed'
}
