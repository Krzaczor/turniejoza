export const shuffle = <T>(list: T[]) => {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  return list
}

export const toShuffled = <T>(list: T[]) => {
  const arrayCopy = [...list]
  shuffle(arrayCopy)

  return arrayCopy
}
